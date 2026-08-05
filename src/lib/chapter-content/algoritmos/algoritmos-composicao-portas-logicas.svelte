<script lang="ts">
  let entradaA = $state(false);
  let entradaB = $state(false);
  let naoA = $derived(!entradaA);
  let naoB = $derived(!entradaB);
  let andSuperior = $derived(naoA && entradaB);
  let andInferior = $derived(entradaA && naoB);
  let saidaXor = $derived(andSuperior || andInferior);
  let xorCanvas = $state<HTMLCanvasElement | undefined>(undefined);

  const colors = {
    board: "#122033", inactive: "rgba(100, 123, 153, .43)", text: "#edf4ff", muted: "#aab8cc",
    blue: "#38bdf8", green: "#34d399", purple: "#a78bfa", red: "#fb7185",
    teal: "#2dd4bf", yellow: "#fde047"
  };

  function context(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colors.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(148, 163, 184, .12)";
    for (let x = 20; x < canvas.width; x += 20) {
      for (let y = 20; y < canvas.height; y += 20) ctx.fillRect(x, y, 2, 2);
    }
    return ctx;
  }

  function text(ctx: CanvasRenderingContext2D, value: string | number, x: number, y: number, size = 14, color = colors.text, align: CanvasTextAlign = "center") {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x, y);
  }

  function wire(ctx: CanvasRenderingContext2D, points: number[], active: boolean, color: string) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let index = 2; index < points.length; index += 2) ctx.lineTo(points[index], points[index + 1]);
    ctx.strokeStyle = active ? color : colors.inactive;
    ctx.lineWidth = active ? 7 : 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (active) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function control(ctx: CanvasRenderingContext2D, x: number, y: number, label: string, active: boolean, color: string) {
    ctx.fillStyle = active ? color : "#1f2d43";
    ctx.strokeStyle = active ? "#f8fafc" : "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, 150, 54, 10);
    ctx.fill();
    ctx.stroke();
    text(ctx, label, x + 75, y + 19, 14);
    text(ctx, Number(active), x + 75, y + 39, 12, active ? "#fff" : colors.muted);
    return { x: x + 150, y: y + 27 };
  }

  function gate(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, label: string, active: boolean, subtitle: string, color = colors.teal) {
    ctx.fillStyle = active ? "#1d4f58" : "#203047";
    ctx.strokeStyle = active ? color : "#73839a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 13);
    ctx.fill();
    ctx.stroke();
    text(ctx, label, x + width / 2, y + height / 2 - 9, 15);
    text(ctx, subtitle, x + width / 2, y + height / 2 + 14, 11, colors.muted);
  }

  function lamp(ctx: CanvasRenderingContext2D, x: number, y: number, active: boolean) {
    ctx.fillStyle = active ? colors.yellow : "#334155";
    if (active) { ctx.shadowColor = colors.yellow; ctx.shadowBlur = 18; }
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    text(ctx, Number(active), x, y, 14, active ? "#713f12" : colors.muted);
    text(ctx, "Saída XOR", x, y + 43, 12, colors.muted);
  }

  function drawXorCircuit() {
    if (!xorCanvas) return;
    const ctx = context(xorCanvas); if (!ctx) return;
    text(ctx, "XOR feito com NOT, AND e OR", 500, 28, 20);
    text(ctx, "A saída é ligada apenas quando uma única entrada está ligada", 500, 51, 12, colors.muted);
    const a = control(ctx, 40, 105, "Entrada A", entradaA, colors.blue);
    const b = control(ctx, 40, 275, "Entrada B", entradaB, colors.green);
    gate(ctx, 285, 92, 105, 70, "NOT", naoA, `A = ${Number(naoA)}`, colors.red);
    gate(ctx, 285, 262, 105, 70, "NOT", naoB, `B = ${Number(naoB)}`, colors.red);
    gate(ctx, 500, 100, 140, 80, "AND", andSuperior, "¬A e B");
    gate(ctx, 500, 280, 140, 80, "AND", andInferior, "A e ¬B");
    gate(ctx, 730, 190, 120, 92, "OR", saidaXor, "saída XOR", colors.purple);

    // Caminho superior: ¬A combinado com B.
    wire(ctx, [a.x, a.y, 285, a.y], entradaA, colors.blue);
    wire(ctx, [390, 122, 500, 122], naoA, colors.blue);
    wire(ctx, [b.x, b.y, 225, b.y, 225, 170, 500, 170], entradaB, colors.green);
    // Caminho inferior: A combinado com ¬B.
    wire(ctx, [a.x, a.y, a.x+60, a.y, a.x+60, 340, 500, 340], entradaA, colors.blue);
    wire(ctx, [b.x, b.y, 285, b.y], entradaB, colors.green);
    wire(ctx, [390, 297, 500, 297], naoB, colors.green);
    // As duas saídas AND chegam ao OR por corredores independentes.
    wire(ctx, [640, 140, 685, 140, 685, 215, 730, 215], andSuperior, colors.purple);
    wire(ctx, [640, 320, 700, 320, 700, 257, 730, 257], andInferior, colors.purple);
    wire(ctx, [850, 236, 875, 236], saidaXor, colors.red);
    lamp(ctx, 915, 236, saidaXor);
  }

  $effect(() => {
    drawXorCircuit();
  });
</script>

<p>Até então, por motivos didáticos, vimos circuitos que utilizam apenas 1 porta lógica, e embora eles têm sim sua utilidade no dia a dia, mais comumente vamos ver circuitos que utilizam várias portas lógicas para efetuar de forma automática tarefas mais complexas, nossa primeira composição de portas lógicas vai ser algo simples, vamos criar a mais bolado que é uma nova porta lógica chamada XOR GATE, a pronúncia é eXclusive OR GATE, se você já é mais antenado na língua inglesa, talvez esteja se perguntando porque exclusivo? o que isso significa?</p>

<p>Se voltarmos para ver como funciona uma porta OR GATE, vamos ter a seguinte tabela verdade:</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>Saída</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table></div>

<p>Como o próprio nome da porta já entrega, OR GATE (porta “ou”), ela emite um sinal verdadeiro a entrada a OU b forem verdadeiras, porém veja no caso onde ambas as entradas são verdadeiras, ele também emite um sinal verdadeiro, já a porta XOR não, ela só emite um sinal verdadeiro se as entradas forem exclusivamente ou uma, ou a outra, se forem ambas ele retorna um sinal falso (0), em notação matemática usamos o símbolo ⊕ (um símbolo de mais dentro de uma bola, ou o símbolo mais bolado 🥁) e a equação se escreve A⊕B=Saída, veja a tabela verdade:</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>Saída</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
    </tr>
  </tbody>
</table></div>

<p>Caso você já esteja se revirando na cadeiras por que vamos ter que juntar transistores e fazer um novo circuito, se acalme, podemos criar circuitos novos usando os circuitos que já construímos anteriormente, esse é o caso do XOR GATE, e esse é seu circuito:</p>

<figure class="elemento">
  <div class="canvas-board" role="group" aria-label="Circuito XOR interativo">
    <canvas bind:this={xorCanvas} class="xor-canvas" width="1000" height="460" aria-hidden="true"></canvas>
    <button class="canvas-hit xor-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={entradaA} onclick={() => (entradaA = !entradaA)}></button>
    <button class="canvas-hit xor-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={entradaB} onclick={() => (entradaB = !entradaB)}></button>
  </div>
</figure>

<p>Pode parecer complexo de início, nesses casos uma boa abordagem é focar em um fluxo de cada vez e tentar entender, interaja com os interruptores e perceba como o uso do NOT GATE faz com que o primeiro AND GATE só aciona quando uma das entradas é falsa e a outra verdadeira, o mesmo com o segundo AND GATE, só que dessa vez a porta invertida é a outra, ou seja, o primeiro AND GATE só aciona se A for falso, e B verdadeiro, e a segunda só aciona quando B é falso e A é verdadeiro, se nenhuma das duas estiver ligada, somente metade das entradas dos AND GATEs vão estar ativas e por isso sua saída vai ser falsa, já que ambas precisam estar ativas para ele emitir uma saída positiva, porém, se acionamos ambas as entradas ao mesmo tempo, o NOT GATE de cada circuito impede que ambas as entradas permaneçam ativas na entrada do AND GATE e portanto sua saída é falsa, isso tudo quer dizer que, se os sinais são ambos falsos ou verdadeiros a saída de ambos os AND GATEs vai ser falsa, porém, se somente uma das entradas for verdadeira, ou o primerio ou o segundo vai estar ativo, e por isso ao fim do nosso circuito usamos um OR GATE que vai juntar os sinais de ambos os AND GATEs em um unico sinal final, que como vimos na tabela verdade, só está ativo se exclusivamente um dos sinais estiver ativo, mas não ambos.</p>

<p>E é dessa forma que podemos compor diferentes portas e circuitos lógicos usando somente as portas lógicas que já temos, inclusive, já pode adicionar o XOR GATE para o seu arsenal de portas lógicas que você pode usar em outros circuitos.</p>


<style>
  .elemento {
    margin: 1.75rem 0;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    overflow: hidden;
    background: var(--surface-soft);
  }

  .table-scroll {
    margin: 1.75rem 0;
    overflow-x: auto;
  }

  .tabela {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    background: var(--surface);
  }

  .tabela th,
  .tabela td {
    padding: 0.75rem 0.9rem;
    text-align: left;
    vertical-align: top;
    border-bottom: 1px solid var(--border);
  }

  .tabela th {
    background: var(--accent-soft);
    color: var(--text);
    font-weight: 700;
  }

  .tabela tbody tr:last-child td {
    border-bottom: 0;
  }

  .canvas-board {
    position: relative;
    background: #122033;
  }

  .xor-canvas {
    display: block;
    width: 100%;
    height: auto;
    background: #122033;
    pointer-events: none;
    user-select: none;
  }

  .canvas-hit {
    position: absolute;
    z-index: 1;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0.65rem;
    background: transparent;
    color: transparent;
    cursor: pointer;
    touch-action: manipulation;
  }

  .canvas-hit:hover { background: rgb(255 255 255 / 8%); }
  .canvas-hit:focus-visible { outline: 3px solid #f8fafc; outline-offset: -3px; background: rgb(255 255 255 / 12%); }

  .xor-a-hit { top: 21.74%; left: 3.5%; width: 16%; height: 15%; }
  .xor-b-hit { top: 58.7%; left: 3.5%; width: 16%; height: 15%; }
</style>
