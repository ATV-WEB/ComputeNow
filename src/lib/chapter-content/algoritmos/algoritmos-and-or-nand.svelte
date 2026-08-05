<script lang="ts">
  import { afterUpdate, onMount } from "svelte";

  let freio = false;
  let velocimetro = false;
  $: nand = !(freio && velocimetro);
  $: nor = !(freio || velocimetro);

  let placaVazia: HTMLCanvasElement;
  let pnpParalelo: HTMLCanvasElement;
  let estadoInicial: HTMLCanvasElement;
  let estadoAzul: HTMLCanvasElement;
  let estadoVerde: HTMLCanvasElement;
  let estadoInstavel: HTMLCanvasElement;
  let nandCompleto: HTMLCanvasElement;
  let nandSimbolo: HTMLCanvasElement;
  let norCircuito: HTMLCanvasElement;
  let norSimbolo: HTMLCanvasElement;

  const cores = {
    placa: "#122033",
    trilha: "#40516b",
    texto: "#e8eef9",
    sutil: "#aab7cb",
    azul: "#36a3ff",
    verde: "#36d399",
    vermelho: "#fb7185",
    laranja: "#fb923c",
    preto: "#111827",
    apagado: "#334155",
    amarelo: "#fde047"
  };

  function contexto(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = cores.placa;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(148, 163, 184, .14)";
    ctx.lineWidth = 1;
    for (let x = 24; x < canvas.width; x += 24) {
      for (let y = 24; y < canvas.height; y += 24) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    return ctx;
  }

  function texto(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size = 16, color = cores.texto, align: CanvasTextAlign = "center") {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(value, x, y);
  }

  function caminho(ctx: CanvasRenderingContext2D, pontos: number[], ativo: boolean, cor: string) {
    ctx.beginPath();
    ctx.moveTo(pontos[0], pontos[1]);
    for (let i = 2; i < pontos.length; i += 2) ctx.lineTo(pontos[i], pontos[i + 1]);
    ctx.strokeStyle = ativo ? cor : cores.trilha;
    ctx.lineWidth = ativo ? 7 : 5;
    ctx.lineCap = "round";
    if (ativo) {
      ctx.shadowColor = cor;
      ctx.shadowBlur = 12;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function botao(ctx: CanvasRenderingContext2D, x: number, y: number, nome: string, ligado: boolean, cor: string) {
    ctx.fillStyle = ligado ? cor : "#1e293b";
    ctx.strokeStyle = ligado ? "#f8fafc" : "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, 148, 52, 10);
    ctx.fill();
    ctx.stroke();
    texto(ctx, nome, x + 74, y + 20, 14);
    texto(ctx, ligado ? "1" : "0", x + 74, y + 38, 14, ligado ? "#fff" : cores.sutil);
    return { x: x + 148, y: y + 26 };
  }

  function transistor(ctx: CanvasRenderingContext2D, x: number, y: number, tipo: "PNP" | "NPN", bloqueado: boolean) {
    ctx.fillStyle = bloqueado ? "#1e293b" : "#24334a";
    ctx.strokeStyle = bloqueado ? "#64748b" : "#d6e2f1";
    ctx.lineWidth = 2;
    ctx.setLineDash(bloqueado ? [5, 4] : []);
    ctx.beginPath();
    ctx.roundRect(x, y, 96, 72, 12);
    ctx.fill();
    ctx.stroke();
    ctx.setLineDash([]);
    texto(ctx, tipo, x + 48, y + 30, 16);
    texto(ctx, bloqueado ? "fechado" : "aberto", x + 48, y + 52, 11, cores.sutil);
    return { source: [x + 48, y], sink: [x + 48, y + 72], gate: [x, y + 36] };
  }

  function terminal(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, cor: string, ativo = true) {
    ctx.fillStyle = ativo ? cor : cores.apagado;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();
    texto(ctx, label, x, y, 13, "#fff");
  }

  function lampada(ctx: CanvasRenderingContext2D, x: number, y: number, ligada: boolean, label: string) {
    ctx.fillStyle = ligada ? cores.amarelo : "#334155";
    ctx.shadowColor = ligada ? cores.amarelo : "transparent";
    ctx.shadowBlur = ligada ? 20 : 0;
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    texto(ctx, ligada ? "1" : "0", x, y, 16, ligada ? "#713f12" : cores.sutil);
    texto(ctx, label, x, y + 48, 12, cores.sutil);
  }

  function cabecalho(ctx: CanvasRenderingContext2D, titulo: string, subtitulo: string) {
    texto(ctx, titulo, 450, 35, 20);
    texto(ctx, subtitulo, 450, 58, 12, cores.sutil);
  }

  function desenharVazia() {
    if (!placaVazia) return;
    const ctx = contexto(placaVazia); if (!ctx) return;
    cabecalho(ctx, "Placa do modo Alta Performance", "Clique nos dois interruptores à esquerda");
    const a = botao(ctx, 54, 132, "Sinal Freio", freio, cores.azul);
    const b = botao(ctx, 54, 252, "Sinal Velocímetro", velocimetro, cores.verde);
    terminal(ctx, 450, 105, "+", cores.vermelho);
    terminal(ctx, 450, 335, "−", cores.preto);
    terminal(ctx, 794, 220, "AP", cores.laranja, nand);
    caminho(ctx, [a.x, a.y, 280, a.y, 280, 175, 405, 175], freio, cores.azul);
    caminho(ctx, [b.x, b.y, 300, b.y, 300, 265, 405, 265], velocimetro, cores.verde);
    ctx.strokeStyle = "#64748b"; ctx.lineWidth = 2; ctx.strokeRect(400, 135, 220, 160);
    texto(ctx, "Área do circuito", 510, 212, 18, cores.sutil);
    caminho(ctx, [620, 215, 770, 215], nand, cores.laranja);
  }

  function desenharPnpParalelo(canvas: HTMLCanvasElement, modo: "interativo" | "inicial" | "azul" | "verde" | "instavel") {
    const ctx = contexto(canvas); if (!ctx) return;
    const a = modo === "azul" || modo === "instavel" ? true : modo === "interativo" ? freio : false;
    const b = modo === "verde" || modo === "instavel" ? true : modo === "interativo" ? velocimetro : false;
    const saida = !(a && b);
    cabecalho(ctx, "PNP em paralelo", modo === "instavel" ? "Sem dreno: a saída está flutuante" : "Clique nos interruptores para testar os caminhos");
    const ba = botao(ctx, 44, 135, "Freio", a, cores.azul);
    const bb = botao(ctx, 44, 255, "Velocímetro", b, cores.verde);
    terminal(ctx, 405, 90, "+", cores.vermelho);
    const p1 = transistor(ctx, 410, 135, "PNP", a);
    const p2 = transistor(ctx, 410, 255, "PNP", b);
    terminal(ctx, 820, 220, "AP", cores.laranja, saida && modo !== "instavel");
    caminho(ctx, [405, 108, 458, 108, p1.source[0], p1.source[1]], true, cores.vermelho);
    caminho(ctx, [405, 108, 358, 108, 358, 237, p2.source[0], 237, p2.source[0], p2.source[1]], true, cores.vermelho);
    caminho(ctx, [ba.x, ba.y, 330, ba.y, 330, p1.gate[1], p1.gate[0], p1.gate[1]], a, cores.azul);
    caminho(ctx, [bb.x, bb.y, 350, bb.y, 350, p2.gate[1], p2.gate[0], p2.gate[1]], b, cores.verde);
    caminho(ctx, [p1.sink[0], p1.sink[1], 620, p1.sink[1], 620, 220, 790, 220], !a, cores.laranja);
    caminho(ctx, [p2.sink[0], p2.sink[1], 620, p2.sink[1], 620, 220, 790, 220], !b, cores.laranja);
    if (modo === "instavel") { ctx.setLineDash([7, 7]); caminho(ctx, [620, 220, 790, 220], true, cores.laranja); ctx.setLineDash([]); texto(ctx, "flutuando", 706, 252, 12, cores.laranja); }
  }

  function desenharNandCompleto() {
    if (!nandCompleto) return;
    const ctx = contexto(nandCompleto); if (!ctx) return;
    cabecalho(ctx, "NAND com dreno NPN", "O dreno só fecha o circuito quando os dois sinais estão ativos");
    const a = botao(ctx, 40, 130, "Freio", freio, cores.azul);
    const b = botao(ctx, 40, 260, "Velocímetro", velocimetro, cores.verde);
    terminal(ctx, 375, 75, "+", cores.vermelho);
    const p1 = transistor(ctx, 400, 120, "PNP", freio);
    const p2 = transistor(ctx, 400, 225, "PNP", velocimetro);
    const n1 = transistor(ctx, 610, 345, "NPN", !freio);
    const n2 = transistor(ctx, 610, 450, "NPN", !velocimetro);
    terminal(ctx, 835, 220, "AP", cores.laranja, nand);
    caminho(ctx, [375, 93, 448, 93, p1.source[0], p1.source[1]], true, cores.vermelho);
    caminho(ctx, [375, 93, 375, 207, 448, 207, p2.source[0], p2.source[1]], true, cores.vermelho);

    caminho(ctx, [a.x, a.y, 325, a.y, 325, p1.gate[1], p1.gate[0], p1.gate[1]], freio, cores.azul);
    caminho(ctx, [b.x, b.y, 350, b.y, 350, p2.gate[1], p2.gate[0], p2.gate[1]], velocimetro, cores.verde);

    caminho(ctx, [p1.sink[0], p1.sink[1], 555, p1.sink[1], 555, 220, 805, 220], !freio, cores.laranja);
    caminho(ctx, [p2.sink[0], p2.sink[1], 555, p2.sink[1], 555, 220, 805, 220], !velocimetro, cores.laranja);
    // caminho(ctx, [555, 220, n1.gate[0], n1.gate[1]], freio && velocimetro, cores.laranja);
    // fio laranja indo de AP para n1 por cima
    caminho(ctx, [805, 220, 658, 220, 658, n1.gate[1]-40], freio, cores.laranja);
    caminho(ctx, [n2.gate[0] + 50, n1.gate[1]+40, n2.gate[0] + 50, n2.gate[1] - 40], velocimetro, cores.laranja);

    caminho(ctx, [a.x, a.y, a.x + 50, a.y, a.x + 50, n1.gate[1], n1.gate[0], n1.gate[1]], freio, cores.azul);
    caminho(ctx, [b.x, b.y, b.x + 80, b.y, b.x + 80, n2.gate[1], n2.gate[0], n2.gate[1]], velocimetro, cores.verde);

    caminho(ctx, [n2.sink[0] + 20, n2.sink[1], n2.sink[0] + 20, n2.sink[1] + 10, n2.sink[0] + 120, n2.sink[1] + 10], freio && velocimetro, cores.preto);
    terminal(ctx, n2.sink[0] + 120, n2.sink[1] + 10, "−", cores.preto);
  }

  function desenharSimbolo(canvas: HTMLCanvasElement, tipo: "NAND" | "NOR") {
    const ctx = contexto(canvas); if (!ctx) return;
    const saida = tipo === "NAND" ? nand : nor;
    cabecalho(ctx, `${tipo} GATE`, "Clique nas entradas A e B");
    const a = botao(ctx, 70, 135, "Entrada A", freio, cores.azul);
    const b = botao(ctx, 70, 255, "Entrada B", velocimetro, cores.verde);
    const x = 460, y = 160;
    caminho(ctx, [a.x, a.y, 350, a.y, 350, 195, x, 195], freio, cores.azul);
    caminho(ctx, [b.x, b.y, 350, b.y, 350, 275, x, 275], velocimetro, cores.verde);
    ctx.fillStyle = "#24334a"; ctx.strokeStyle = cores.texto; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 110, y); ctx.quadraticCurveTo(x + 185, y + 60, x + 110, y + 120); ctx.lineTo(x, y + 120); ctx.closePath(); ctx.fill(); ctx.stroke();
    texto(ctx, tipo, x + 82, y + 60, 18);
    ctx.beginPath(); ctx.arc(x + 193, y + 60, 11, 0, Math.PI * 2); ctx.fillStyle = cores.placa; ctx.fill(); ctx.stroke();
    caminho(ctx, [x + 204, y + 60, 770, y + 60], saida, cores.laranja);
    lampada(ctx, 810, y + 60, saida, "Saída");
  }

  function desenharNorCircuito() {
    if (!norCircuito) return;
    const ctx = contexto(norCircuito); if (!ctx) return;
    cabecalho(ctx, "NOR com PNP em série e NPN em paralelo", "A saída fica ativa somente quando A e B estão desligados");
    const a = botao(ctx, 42, 118, "Entrada A", freio, cores.azul);
    const b = botao(ctx, 44, 260, "Entrada B", velocimetro, cores.verde);
    terminal(ctx, 418, 70, "+", cores.vermelho);
    terminal(ctx, 788, 392, "−", cores.preto);
    const p1 = transistor(ctx, 370, 96, "PNP", freio);
    const p2 = transistor(ctx, 370, 202, "PNP", velocimetro);
    const n1 = transistor(ctx, 570, 270, "NPN", !freio);
    const n2 = transistor(ctx, 710, 270, "NPN", !velocimetro);
    terminal(ctx, 846, 220, "S", cores.laranja, nor);

    // Alimentação e caminho PNP: os dois PNP precisam conduzir para alimentar a saída.
    caminho(ctx, [418, 88, 418, p1.source[1]], true, cores.vermelho);
    caminho(ctx, [p1.sink[0], p1.sink[1], p2.source[0], p2.source[1]], !freio, cores.laranja);
    caminho(ctx, [p2.sink[0], p2.sink[1], 525, p2.sink[1], 525, 220, 828, 220], nor, cores.laranja);

    // A e B chegam aos gates dos seus PNPs sem cruzar os componentes.
    caminho(ctx, [a.x, a.y, 300, a.y, 300, p1.gate[1], p1.gate[0], p1.gate[1]], freio, cores.azul);
    caminho(ctx, [b.x, b.y, 320, b.y, 320, p2.gate[1], p2.gate[0], p2.gate[1]], velocimetro, cores.verde);

    // Os mesmos sinais controlam os NPNs por rotas externas à área PNP.
    caminho(ctx, [a.x, a.y, 275, a.y, 275, 82, 535, 82, 535, n1.gate[1], n1.gate[0], n1.gate[1]], freio, cores.azul);
    caminho(ctx, [b.x, b.y, 295, b.y, 295, 370, 690, 370, 690, n2.gate[1], n2.gate[0], n2.gate[1]], velocimetro, cores.verde);

    // A saída se ramifica para os NPNs; os sinks seguem por uma barra de terra separada.
    caminho(ctx, [828, 220, 800, 220, 800, 250, n1.source[0], 250, n1.source[0], n1.source[1]], !nor, cores.laranja);
    caminho(ctx, [800, 250, n2.source[0], 250, n2.source[0], n2.source[1]], !nor, cores.laranja);
    caminho(ctx, [n1.sink[0], n1.sink[1], n1.sink[0], 395, 788, 395], freio, cores.preto);
    caminho(ctx, [n2.sink[0], n2.sink[1], n2.sink[0], 375, 788, 375], velocimetro, cores.preto);

    texto(ctx, "PNP em série", 418, 332, 12, cores.sutil);
    texto(ctx, "NPN em paralelo", 688, 248, 12, cores.sutil);
  }

  function redesenhar() {
    desenharVazia();
    if (pnpParalelo) desenharPnpParalelo(pnpParalelo, "interativo");
    if (estadoInicial) desenharPnpParalelo(estadoInicial, "inicial");
    if (estadoAzul) desenharPnpParalelo(estadoAzul, "azul");
    if (estadoVerde) desenharPnpParalelo(estadoVerde, "verde");
    if (estadoInstavel) desenharPnpParalelo(estadoInstavel, "instavel");
    desenharNandCompleto();
    if (nandSimbolo) desenharSimbolo(nandSimbolo, "NAND");
    desenharNorCircuito();
    if (norSimbolo) desenharSimbolo(norSimbolo, "NOR");
  }

  function alternarEntrada(event: MouseEvent, canvas: HTMLCanvasElement) {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (canvas.width / rect.width);
    const y = (event.clientY - rect.top) * (canvas.height / rect.height);
    if (x < 235 && y > 105 && y < 215) freio = !freio;
    if (x < 235 && y > 225 && y < 345) velocimetro = !velocimetro;
  }

  onMount(redesenhar);
  afterUpdate(redesenhar);
</script>

<p>Imagine que você é o engenheiro que está fazendo o design de um novo carro de luxo ultra confortavel e economico, e você percebeu que sempre que você para o carro no sinal vermelho, enquanto você segura o freio, o motor do carro ainda está rodando a todo vapor e drenando toda a gasolina do tanque, e devido à alta performance do motor, mais da metade do tanque é gasta enquanto o carro está parado em semáforos.</p>

<p>Você, como ótimo engenheiro que é, teve uma brilhante ideia, e se, o carro pudesse detectar quando está parado, e automaticamente desligar um modo de alta performance, o problema é, como detectar que o carro está parado? Bom depois de pensar um pouco você chegou à seguinte conclusão:</p>

<p>Se o carro está:</p>

<ol>
  <li>Com o freio apertado</li>
  <li>Com o velocímetro no zero</li>
</ol>

<p>Logo o carro só pode estar parado, você rapidamente puxou os fios necessários nos circuitos do carro e chegou na seguinte placa de circuito que precisa ser montada:</p>

<figure class="elemento">
  <canvas bind:this={placaVazia} class="placa-canvas" width="900" height="430" role="button" tabindex="0" aria-label="Placa inicial interativa" on:click={(event) => alternarEntrada(event, placaVazia)}></canvas>
</figure>

<p>Por sorte você já lembrou de cara que quando se trata de usar um sinal para controlar o fluxo de corrente como se fosse um interruptor não há componente melhor do que o transistor, só que, até então todos os circuitos que você já montou só tinham 1 entrada, e esse tem duas! O sinal do freio apertado, e o sinal de quando o velocímetro está em zero, bom, o primeiro passo sempre que um problema novo e complexo aparece é destrinchá-lo em etapas menores e mais simples a serem resolvidas, o primeiro objetivo é, parar de acionar o sistema de alta performance quando os dois sinais estão ativos.</p>

<p>Vamos começar tentando conectar 2 transistores PNP lado a lado no nosso circuito.</p>

<figure class="elemento">
  <canvas bind:this={pnpParalelo} class="placa-canvas" width="900" height="430" role="button" tabindex="0" aria-label="Circuito PNP em paralelo interativo" on:click={(event) => alternarEntrada(event, pnpParalelo)}></canvas>
</figure>

<p>Vamos analisar o que o nosso circuito faz atualmente:</p>

<figure class="elemento">
  <canvas bind:this={estadoInicial} class="placa-canvas" width="900" height="430" aria-hidden="true"></canvas>
</figure>

<p>Quando nenhum dos dois sinais estão ativos, os transistores permitem a passagem de corrente para o modo de alta performance, a corrente podendo passar livremente, mas quando acionamos um dos sinais, o que acontece com o circuito?</p>

<figure class="elemento">
  <canvas bind:this={estadoAzul} class="placa-canvas" width="900" height="430" aria-hidden="true"></canvas>
</figure>

<figure class="elemento">
  <canvas bind:this={estadoVerde} class="placa-canvas" width="900" height="430" aria-hidden="true"></canvas>
</figure>

<p>Quando ativamos somente 1 dos sinais, o resultado continua sendo o mesmo, pois mesmo bloqueando a passagem de corrente por um dos circuitos a corrente ainda pode passar pelo outro e chegar até o fio que aciona o modo de alta performance do motor.</p>

<p>E é isso que queremos, queremos que o modo de alta performance só desligue quando ambos os sinais estiverem desligados, então vamos ver o que acontece quando ambos os sinais estão ativos, será que o modo de alta performance vai desativar?</p>

<figure class="elemento">
  <canvas bind:this={estadoInstavel} class="placa-canvas" width="900" height="430" aria-hidden="true"></canvas>
</figure>

<p>Quando ambos os sinais estão ativos ambos os transistores cortam a passagem de corrente, porém sem nenhuma conexão para drenar o sinal que vai para o modo de alta performance do motor fica instável a mercê das interferências externas, por sorte você foi rápido e desligou o sistema antes do motor estourar nesse liga e desliga constante.</p>

<p>Metade do sistema já está funcionando, mas ainda falta implementar um dreno para impedir o fio laranja de ficar incerto, bom que nem fizemos no capítulo passado vamos analisar quando precisamos que o dreno esteja aberto e quando queremos que ele esteja fechado.</p>

<p>O dreno deve está aberto somente quando:</p>

<ol>
  <li>Ambos os sinais estão acionados</li>
</ol>

<p>É uma lista bem curta, de fato, mas se formos pensar nesse problema não é nada de outro mundo, afinal, se observamos o dreno que fizemos no NOT GATE no capítulo passado, ele usava um transistor NPN que usava a corrente que queremos drenar de entrada, o sinal que controla se devemos ou não drenar na porta de controle e a saída ia no fio preto (negativo) do circuito, se formos pensar no nosso problema atual, é somente isso só que com dois sinais, se imaginarmos o transistor do ralo do NOT GATE como um tubo de esgoto com uma válvula que abre e fecha, adaptar para o nosso problema atual é só uma questão de ter 2 válvulas, assim água (corrente) só desce no ralo quando as duas válvulas estiverem abertas (recebendo sinal), ou seja, para fazer o ralo para o circuito do nosso motor só precisamos ligar dois transistores NPN em série (em sequência) e usar os sinais para controlar a passagem de corrente entre cada um dos sinais, dessa forma a conexão entre o fio laranja e o negativo do circuito só vai acontecer quando ambas válvulas estiverem abertas, ou seja, ambos os sinais ativos.</p>

<figure class="elemento">
  <canvas bind:this={nandCompleto} class="placa-canvas" width="900" height="600" role="button" tabindex="0" aria-label="Circuito NAND completo interativo" on:click={(event) => alternarEntrada(event, nandCompleto)}></canvas>
</figure>

<p>Agora sim temos um circuito completo, e que faz o que queremos, quando nenhum dos sinais está ativo, o modo de alta performance está ativado, o mesmo se somente 1 dos sinais está ativado, já que o nosso ralo de corrente só abre quando ambos os sinais está presente, porém, só barramos a passagem de corrente quando ambos os sinais estão ativos ao mesmo tempo.</p>

<p>Depois de comemorar sua inteligência de ter criando um circuito tão incrível, seu amigo chega, olha para a placa de circuito e fala: “Caramba, um NAND GATE”, e é aí que você descobre que esse circuito lógico que você ficou tanto tempo criando, já existe e é bem utilizado, tão utilizado que tem até um símbolo que simplifica na hora de incorporar ele em outros circuitos, vamos ver:</p>

<figure class="elemento">
  <canvas bind:this={nandSimbolo} class="placa-canvas" width="900" height="430" role="button" tabindex="0" aria-label="Símbolo NAND interativo" on:click={(event) => alternarEntrada(event, nandSimbolo)}></canvas>
</figure>

<p>Perceba que ele recebe duas entradas lógicas, e tem uma saída de sinal, caso você esteja se perguntando para onde foram a entrada e saída da corrente positiva e o nosso ralo negativo, eles ainda estão lá, e em circuitos na vida real tem que ser conectados, porém para simplificar a visualização eles foram ocultados já que não importam na maioria das vezes.</p>

<p>Mas antes de seguirmos em frente, precisamos ver uma outra porta lógica, a NOR GATE, se na porta anterior o sinal estava sempre ativo exceto quando ambas as entradas estão ativas, no NOR GATE a porta vai estar ativa somente quando nenhum sinal estiver ativo,se qualquer um ou ambos os sinais estiverem ativos, a saída vai ser desligada, vamos ver como é a aparência desse circuito:</p>

<figure class="elemento">
  <canvas bind:this={norCircuito} class="placa-canvas" width="900" height="430" role="button" tabindex="0" aria-label="Circuito NOR com transistores interativo" on:click={(event) => alternarEntrada(event, norCircuito)}></canvas>
</figure>

<p>Podemos ver que é bem parecido com o NAND GATE, na verdade é o inverso dele, se antes tínhamos 2 transistores em paralelo controlando o fluxo entre o positivo e a saída e 2 transistores em série servindo como o nosso ralo, agora temos 2 transistores em sequência servindo como controle da corrente, e 2 transistores em paralelo servindo como o ralo do nosso circuito.</p>

<p>Caso não tenha ficado claro como que isso funciona, na nossa entrada a corrente chega, como os transistores estão em série, se o sinal que fecha o primeiro transistor estiver acionado, o sinal é cortado já na fonte, então todo o resto não recebe mais corrente, já se for o segundo sinal que é acionado, a corrente passa pelo primeiro transistor mas já para de cara antes de chegar no resto do circuito tendo o mesmo efeito de parar a corrente de continuar seu fluxo, já do lado do ralo, quando não temos corrente saindo (um ou ambos os transistores estão fechados), o mesmo sinal que fechou o transistor PNP vai abrir um transistor NPN conectando a saída ao negativo forçando ela a não ter corrente nenhuma evitando problemas no resto do circuito, como os transistores do ralo estão conectados em paralelo, isto é, independentes um do outro, qualquer um dos dois que abra vai ter o mesmo resultado, que é de conectar a saída lógica do nosso GATE diretamente ao negativo.</p>

<figure class="elemento">
  <canvas bind:this={norSimbolo} class="placa-canvas" width="900" height="430" role="button" tabindex="0" aria-label="Símbolo NOR interativo" on:click={(event) => alternarEntrada(event, norSimbolo)}></canvas>
</figure>

<p>E está é a representação gráfica de um NOR GATE, para fins de simplificação vamos usar essas representações gráficas, para não termos que lidar com um monte de transistores e fios para algo que já sabemos como funcionam suas entradas e saídas.</p>

<p>Por fim, antes de finalizarmos este capítulo vamos ver o AND GATE e o OR GATE, que nada mais são o contrário das portas lógicas que acabamos de ver, como assim ao contrário? bem, no NAND GATE, tínhamos um sinal de saída que estava sempre ligado exceto quando as duas entradas estavam acionadas ao mesmo tempo, já no AND GATE, vamos ter uma saída sempre desligada até que os dois sinais de entrada estejam ativos, somente nesse caso vamos ligar o sinal de saída. O mesmo vale para o OR GATE, no NOR GATE o sinal está ativo somente quando nenhum dos dois sinais está ativo, e desliga no momento que qualquer um dos dois sinais é acionado, no OR GATE, como você já deve ter imaginado, vamos ter uma saída padrão desligada, que no momento que acionamos qualquer um ou ambos dos sinais de entrada a saída liga.</p>

<p>E sim, como você já deve estar imaginando, o “N” em NAND e NOR vem de NOT, como é o caso do NOT gate, que mantem um sinal ativo o tempo todo exceto quando damos uma entrada positiva, ou em outras palavras, ele inverte o sinal, ligado para desligado e virse versa.</p>

<p>Caso você saiba inglês e queira se aprofundar um pouco mais nas tecnicalidades das portas lógica compostas por transistores, fica a recomendação do curso da universidade de Boston sobre o assunto: <a target="_blank" href="https://www.cs.bu.edu/~best/courses/modules/Transistors2Gates/">https://www.cs.bu.edu/~best/courses/modules/Transistors2Gates/</a></p>


<style>
  .elemento {
    margin: 1.75rem 0;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    overflow: hidden;
    background: var(--surface-soft);
  }

  .placa-canvas {
    display: block;
    width: 100%;
    height: auto;
    background: #122033;
    cursor: default;
  }

  .placa-canvas[role="button"] {
    cursor: pointer;
  }

  .placa-canvas:focus-visible {
    outline: 3px solid var(--accent);
    outline-offset: -3px;
  }
</style>
