<script lang="ts">
  import { onMount } from "svelte";

  let selectedLeg = "Gate";
  let amplifierInput = 0.02;
  let binaryGate = false;
  let waterLeft = 82;
  let waterRight = 18;
  let waterFlowing = true;
  let wireOn = true;
  let resistance = 54;
  let comparisonGate = false;
  let floatingGate = false;
  let floatingLight = 1;
  let drainGate = false;
  let notGateInput = false;

  const wavePath = (
    amplitude: number,
    startX: number,
    centerY: number,
    width: number,
  ) => {
    const points = Array.from({ length: 41 }, (_, index) => {
      const progress = index / 40;
      const x = startX + progress * width;
      const y = centerY + Math.sin(progress * Math.PI * 6) * amplitude;
      return (index === 0 ? "M " : "L ") + x.toFixed(1) + " " + y.toFixed(1);
    });

    return points.join(" ");
  };

  const resetWater = () => {
    waterLeft = 82;
    waterRight = 18;
    waterFlowing = true;
  };

  $: amplifierOutput = Math.min(amplifierInput * 4.35, 0.96);
  $: npnConducting = comparisonGate;
  $: pnpConducting = !comparisonGate;
  $: notGateLight = !notGateInput;

  onMount(() => {
    const timer = window.setInterval(() => {
      if (waterFlowing) {
        if (waterLeft > 50) {
          waterLeft = Math.max(50, waterLeft - 1);
          waterRight = Math.min(50, waterRight + 1);
        } else {
          waterFlowing = false;
        }
      }

      floatingLight = floatingGate ? 0.18 + Math.random() * 0.82 : 1;
    }, 180);

    return () => window.clearInterval(timer);
  });
</script>

<p>Agora que já sabemos como o binário funciona, e como ele ajuda na hora de projetar circuitos, podemos enfim ver o componente mais importante dos computadores, o transistor, é de milhões de transistores que todos os processadores modernos são feitos, mas por quê? O que o transistor tem de tão especial para ele ser usado assim? E o que é um transistor?</p>

<figure class="elemento transistor-anatomy">
  <div class="anatomy-stage">
    <div class="anatomy-copy">
      <span class="visual-kicker">Componente físico</span>
      <strong>Escolha uma das três pernas</strong>
      <p>O terminal selecionado é destacado no desenho.</p>
    </div>
    <svg viewBox="0 0 360 250" role="img" aria-label="Desenho de um transistor com três pernas">
      <defs>
        <linearGradient id="transistor-metal" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stop-color="#566274" />
          <stop offset="0.52" stop-color="#1d2634" />
          <stop offset="1" stop-color="#070d16" />
        </linearGradient>
        <filter id="transistor-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="#111827" flood-opacity=".28" />
        </filter>
      </defs>
      <ellipse cx="180" cy="211" rx="104" ry="13" fill="rgba(31,36,48,.14)" />
      <path d="M113 76 Q180 31 247 76 L239 145 Q180 169 121 145 Z" fill="url(#transistor-metal)" filter="url(#transistor-shadow)" />
      <path d="M128 81 Q180 49 231 81" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="5" stroke-linecap="round" />
      <path d="M145 148 L133 208" class:chosen={selectedLeg === "Gate"} class="lead gate-lead" />
      <path d="M180 158 L180 218" class:chosen={selectedLeg === "Source"} class="lead source-lead" />
      <path d="M215 148 L227 208" class:chosen={selectedLeg === "Sink"} class="lead sink-lead" />
      <circle cx="132" cy="213" r="6" class:chosen={selectedLeg === "Gate"} class="terminal gate-terminal" />
      <circle cx="180" cy="223" r="6" class:chosen={selectedLeg === "Source"} class="terminal source-terminal" />
      <circle cx="228" cy="213" r="6" class:chosen={selectedLeg === "Sink"} class="terminal sink-terminal" />
      <text x="89" y="235">Gate</text>
      <text x="160" y="244">Source</text>
      <text x="218" y="235">Sink</text>
    </svg>
    <div class="leg-controls" aria-label="Terminais do transistor">
      <button type="button" class:active={selectedLeg === "Gate"} onclick={() => (selectedLeg = "Gate")}>Gate</button>
      <button type="button" class:active={selectedLeg === "Source"} onclick={() => (selectedLeg = "Source")}>Source</button>
      <button type="button" class:active={selectedLeg === "Sink"} onclick={() => (selectedLeg = "Sink")}>Sink</button>
    </div>
  </div>
</figure>

<p>Esse simpático componente é a base para todos os sistemas digitais modernos, e sua utilidade pode parecer até boba no início, mas é o completo oposto disso. O transistor pode atuar em 2 funções, como um interruptor ou como um amplificador, e através de 2 contatos elétricos, o Source (fonte) e Gate (Portão) controlam o sinal que vai para o contato Sink (Saída), quando operando como amplificador, recebe em um de seus contatos (Source) uma fonte elétrica forte, e no sinal de controle (Gate) o sinal fraco que quer ser amplificado, o resultado é que na saída (Sink) vamos ter um sinal forte, que replica o comportamento do sinal fraco de entrada, esse é o princípio usado em vários dispositivos de áudio, como aparelhos auditivos, e amplificadores para caixas de som.</p>

<figure class="elemento amplifier-demo">
  <div class="amplifier-toolbar">
    <div>
      <span class="visual-kicker">Modo amplificador</span>
      <strong>Controle a intensidade do sinal fraco</strong>
    </div>
    <label>
      Gate
      <input aria-label="Intensidade do sinal fraco no gate" type="range" min="0.001" max="0.1" step="0.001" bind:value={amplifierInput} />
    </label>
  </div>
  <svg viewBox="0 0 620 255" role="img" aria-label="Transistor amplificando uma onda fraca no gate">
    <defs>
      <filter id="amp-glow" x="-20%" y="-30%" width="140%" height="160%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <rect x="14" y="16" width="592" height="222" rx="18" class="svg-board" />
    <text x="44" y="48" class="svg-label">fonte constante forte</text>
    <text x="230" y="218" class="svg-label">Gate: onda fraca</text>
    <text x="420" y="48" class="svg-label">Sink: mesma forma, forte</text>
    <path d="M66 184 V83 H199" class="source-rail-bright" />
    <path d="M66 183 V94" class="source-rail-bright" />
    <circle cx="66" cy="185" r="21" class="battery" />
    <text x="60" y="190" class="battery-text">+</text>
    <rect x="278" y="75" width="72" height="98" rx="16" class="amp-chip" />
    <text x="290" y="119" class="chip-text">NPN</text>
    <line x1="199" y1="83" x2="278" y2="83" class="source-rail-bright" />
    <line x1="350" y1="83" x2="525" y2="83" class="output-rail" />
    <line x1="278" y1="145" x2="205" y2="145" class="gate-rail" />
    <path d={wavePath(8 + amplifierInput * 34, 92, 145, 110)} class="weak-wave" />
    <path d={wavePath(15 + amplifierOutput * 52, 376, 83, 166)} class="strong-wave" />
    <line x1="525" y1="83" x2="558" y2="83" class="output-rail" />
    <circle cx="564" cy="83" r="13" class="output-node" />
  </svg>
</figure>

<p>Como podemos ver, temos uma fonte de energia fornecendo um sinal constante forte, e um sinal de dados que é fraco, pequeno, insignificante, xoxo, capenga, e o transistor amplifica o sinal fraco tornando-o um sinal forte.</p>

<p>O segundo uso do transistor é como interruptor, a lógica é a mesma, uma fonte de energia forte na entrada, mas agora ao invés de um sinal analógico, vamos passar um sinal digital, um sinal binário como entrada no gate.</p>

<figure class="elemento binary-transistor-demo">
  <div class="binary-demo-top">
    <div>
      <span class="visual-kicker">Modo interruptor</span>
      <strong>Um sinal fraco no Gate controla a fonte forte</strong>
    </div>
    <button type="button" class:on={binaryGate} aria-pressed={binaryGate} onclick={() => (binaryGate = !binaryGate)}>
      {binaryGate ? "Sinal binário: 1" : "Sinal binário: 0"}
    </button>
  </div>
  <div class="binary-circuit" class:active={binaryGate}>
    <div class="binary-input">
      <div class="binary-rail source">
        <span class="rail-dot">+</span>
        <span>Source<br /><b>energia forte</b></span>
      </div>
      <div class="binary-branch gate">
        <span class="signal-pulse">{binaryGate ? "1" : "0"}</span>
        <span>Gate<br /><b>sinal fraco</b></span>
      </div>
    </div>
    <div class="binary-device">
      <span>Transistor</span>
      <small>{binaryGate ? "passagem liberada" : "passagem bloqueada"}</small>
    </div>
    <div class="binary-rail sink">
      <span class="rail-dot">{binaryGate ? "1" : "0"}</span>
      <span>Sink<br /><b>sinal forte</b></span>
    </div>
  </div>
</figure>

<p>Perceba que o princípio é o mesmo, quando o sinal está desligado o transistor bloqueia a passagem de energia, e quando está ativo ele permite a passagem de energia da fonte até a saída, formando um sinal forte.</p>

<p>Mas afinal, estamos falando e falando sobre “Energia” , mas como exatamente ela funciona? da para puxar um fio direto da tomada para um transistor? Ou é que nem as pilhas?</p>

<h2>Energia</h2>

<p>Transistores são componentes eletrônicos que operam em corrente contínua, o mesmo tipo que é usado pelas pilhas e bateria, onde temos um polo positivo e um polo negativo.</p>

<p>O motivo de precisarmos de um positivo e um negativo, é que a energia por conta própria não anda sozinha, ela na verdade vai sempre procurar o caminho mais fácil para navegar do polo negativo para o polo positivo — e sim, pode parecer estranho, mas a nomenclatura é invertida, mas não se preocupe, para o nosso curso isso não vai ser um problema, apenas lembre-se que a energia quer sempre sair de um polo e ir para o outro — isso porque a eletricidade quer sempre se balancear, ou seja, se temos uma carga negativa, isso significa que ali possui mais elétrons que o normal, já se temos uma carga positiva, significa que temos menos elétrons que o normal, e a tendência é que os elétrons a mais da carga negativa, queiram ir para onde está faltando.</p>

<p>É só imaginar um cano d’água que conecta 2 caixas d’água, se apenas 1 das caixas d’água tem água, ela vai fluir e gerar uma corrente d’água no cano indo em direção a segunda caixa até que as duas fiquem com a mesma quantia de água, quando isso acontece, mesmo o cano tendo água, não tem mais corrente nenhuma, a água fica parada. é só pensar numa correnteza d'água, onde temos água indo de um lugar com mais água até um lugar com menos água para igualar as forças. É daí que vem o nome corrente elétrica, a diferença é que estamos trabalhando com elétrons invés de água.</p>

<figure class="elemento water-flow-demo">
  <div class="water-topline">
    <div>
      <span class="visual-kicker">Analogia da corrente</span>
      <strong>{waterFlowing ? "A água procura se equilibrar" : "Níveis equilibrados: o fluxo parou"}</strong>
    </div>
    <button type="button" onclick={resetWater}>Reiniciar fluxo</button>
  </div>
  <div class="water-system">
    <div class="tank left-tank">
      <span class="tank-title">Mais água</span>
      <div class="water-fill" style:height={waterLeft + "%"}><span>{waterLeft}%</span></div>
    </div>
    <div class="water-pipe" class:flowing={waterFlowing}>
      <span class="water-arrow arrow-one">➜</span>
      <span class="water-arrow arrow-two">➜</span>
      <span class="water-arrow arrow-three">➜</span>
      <small>{waterFlowing ? "corrente" : "sem corrente"}</small>
    </div>
    <div class="tank right-tank">
      <span class="tank-title">Menos água</span>
      <div class="water-fill" style:height={waterRight + "%"}><span>{waterRight}%</span></div>
    </div>
  </div>
</figure>

<p>Mas por que você precisa saber que a eletricidade se comporta como um fluxo que vai de um ponto à outro?</p>

<p>Bom, antes de podermos responder essa pergunta, temos que falar sobre resistência, esse é um termo que você já deve ter ouvido falar, mas se você já se perguntou por que a resistência do choveiro se chama resistência, bom imagine um fio elétrico com uma corrente passando.</p>

<figure class="elemento wire-flow-demo">
  <div class="wire-title">
    <div>
      <span class="visual-kicker">Fio sem obstáculo</span>
      <strong>Corrente em movimento contínuo</strong>
    </div>
    <button type="button" class:on={wireOn} aria-pressed={wireOn} onclick={() => (wireOn = !wireOn)}>
      {wireOn ? "Desligar corrente" : "Ligar corrente"}
    </button>
  </div>
  <div class="plain-wire" class:energized={wireOn} aria-label="Fio elétrico com corrente">
    <span class="wire-end negative">−</span>
    <span class="wire-core"></span>
    <span class="electron electron-one">•</span>
    <span class="electron electron-two">•</span>
    <span class="electron electron-three">•</span>
    <span class="electron electron-four">•</span>
    <span class="wire-end positive">+</span>
  </div>
</figure>

<p>Agora imagine que a gente coloca um obstáculo que dificulta a passagem da corrente, como uma barragem meio aberta.</p>

<figure class="elemento resistance-demo">
  <div class="resistance-head">
    <div>
      <span class="visual-kicker">Resistência</span>
      <strong>Feche ou abra a barragem</strong>
    </div>
    <label>
      Obstáculo: {resistance}%
      <input aria-label="Nível da barragem de resistência" type="range" min="10" max="90" bind:value={resistance} />
    </label>
  </div>
  <div class="dam-wire" style:--current={1 - resistance / 105} style:--heat={resistance / 100}>
    <div class="dam-terminal">−</div>
    <div class="dam-channel">
      <span class="dam-particle p-one">●</span>
      <span class="dam-particle p-two">●</span>
      <span class="dam-particle p-three">●</span>
      <span class="dam-particle p-four">●</span>
      <span class="dam-particle p-five">●</span>
      <div class="dam-wall" style:height={resistance + "%"}><span>resistência</span></div>
    </div>
    <div class="heat-cloud">calor</div>
    <div class="dam-terminal">+</div>
  </div>
  <div class="resistance-meter"><span>Corrente que passa</span><b>{Math.round((1 - resistance / 105) * 100)}%</b></div>
</figure>

<p>O resultado é menos corrente passando, porém a energia ainda quer ser transferida, o que acontece é que ela é perdida na forma de calor, existem diversos dispositivos que utilizam esse princípio, para gerar além de calor, luz, e som. É por isso que a resistência do chuveiro se chama resistência, pois ela dificulta a passagem da energia gerando calor no processo.</p>

<p>Então recapitulando, a energia é como um fluxo que vai do pólo negativo para o positivo, e a resistência é como um obstáculo no meio do fluxo, dificultando a passagem de corrente.</p>

<p>Mas o que isso tem a ver com transistores? tudo, pois o transistor quando recebe uma carga no gate permite a passagem de corrente como se fosse uma conexão direta, já quando tiramos a carga do gate, ele age como um resistor bloqueando totalmente a corrente de passar.</p>

<p>Agora com todo esse conhecimento, podemos ver um novo tipo de transistor, o transistor PNP, PNP vem do inglês e significa Complementary Metal Oxide Semiconductor, ou em português metal-óxido-semicondutor complementar, o nome é até que bem chique, mas na prática, ele nada mais é do que um transistor invertido. Como assim invertido? Bom, no transistor convencional ele recebe uma corrente na sua entrada, e um sinal fraco, e ele por padrão bloqueia a passagem de corrente até que um sinal chegue na Gate do transistor, já no transistor PNP ele por padrão permite que a corrente passe, e somente quando é dado um sinal na Gate ele bloqueia a passagem de corrente.</p>

<figure class="elemento transistor-comparison">
  <div class="comparison-header">
    <div>
      <span class="visual-kicker">Transistores opostos</span>
      <strong>O mesmo sinal no Gate produz comportamentos inversos</strong>
    </div>
    <button type="button" class:on={comparisonGate} aria-pressed={comparisonGate} onclick={() => (comparisonGate = !comparisonGate)}>
      Gate: {comparisonGate ? "ativo (1)" : "desativado (0)"}
    </button>
  </div>
  <div class="comparison-grid">
    <div class:conducting={npnConducting} class="transistor-card npn-card">
      <div class="card-heading"><b>NPN</b><span>{npnConducting ? "conduz" : "bloqueia"}</span></div>
      <div class="vertical-circuit">
        <span class="power-marker">+</span>
        <span class="vertical-track"></span>
        <span class="device-pill">NPN</span>
        <span class="vertical-output">Saída</span>
        <span class="gate-link">Gate {comparisonGate ? "1" : "0"}</span>
      </div>
      <p>Fecha quando o Gate recebe sinal.</p>
    </div>
    <div class:conducting={pnpConducting} class="transistor-card pnp-card">
      <div class="card-heading"><b>PNP</b><span>{pnpConducting ? "conduz" : "bloqueia"}</span></div>
      <div class="vertical-circuit">
        <span class="power-marker">+</span>
        <span class="vertical-track"></span>
        <span class="device-pill">PNP</span>
        <span class="vertical-output">Saída</span>
        <span class="gate-link">Gate {comparisonGate ? "1" : "0"}</span>
      </div>
      <p>Fecha quando o Gate não recebe sinal.</p>
    </div>
  </div>
</figure>

<p>Agora sabendo como correntes elétricas funcionam, e sobre os dois tipos de transistores, podemos criar nosso primeiro circuito lógico, o NOT Gate, o seu objetivo é bem simples, queremos manter um sinal ativo o tempo todo, exceto quando acionarmos ele, como se fosse um interruptor de luz só que ao contrário, a luz liga quando o interruptor é desligado, e apaga quando ligamos o interruptor, pode parecer uma tarefa simples, só colocar um transistor PNP afinal não é isso que ele faz? inverte o sinal?</p>

<p>Bom vamos ver o que acontece se fizermos dessa forma:</p>

<figure class="elemento floating-not-demo">
  <div class="logic-demo-head">
    <div>
      <span class="visual-kicker">Tentativa incompleta</span>
      <strong>PNP sem pull para ground</strong>
    </div>
    <button type="button" class:on={floatingGate} aria-pressed={floatingGate} onclick={() => (floatingGate = !floatingGate)}>
      Interruptor: {floatingGate ? "ligado" : "desligado"}
    </button>
  </div>
  <div class="floating-circuit">
    <div class="power-rail top">+ fonte</div>
    <div class:open={!floatingGate} class="pnp-switch"><b>PNP</b><span>{floatingGate ? "fechado" : "aberto"}</span></div>
    <div class:active={floatingGate} class="gate-switch"><span>Gate</span><i></i></div>
    <div class:floating={floatingGate} class="floating-output">
      <span class="output-wire"></span>
      <span class="floating-label">{floatingGate ? "saída flutuante" : "saída alimentada"}</span>
      <div class="lamp-shell" style:--lamp-level={floatingLight}>
        <span class="lamp-ray ray-a"></span><span class="lamp-ray ray-b"></span><span class="lamp-ray ray-c"></span>
        <span class="lamp-bulb"></span>
      </div>
    </div>
    <div class="no-ground">sem caminho para o negativo</div>
  </div>
</figure>

<p>Porque a luz fica oscilando ao invés de só apagar quando ativamos o interruptor? afinal se cortamos a passagem de corrente, não era para só desligar?</p>

<p>Voltando a nossa analogia com água, podemos imaginar os fios como canaletas, por onde a água passa, quando cortamos o fluxo de água que entra o cano continuou exposto ali, aberto para pegar chuva, mas chuva elétrica? Como isso se aplica no contexto elétrico? Talvez você já tenha ouvido o termo radiação eletromagnética, ela é o princípio por trás do wifi, do carregamento sem fio, rádio, entre outras coisas, e ela acaba provendo uma carga, mesmo que mínima, para nosso circuito, é como se esses itens fossem a chuva no nosso exemplo das canaletas, mas como podemos lidar com isso?</p>

<p>A resposta fica fácil se voltarmos para nosso exemplo das canaletas d’água, como faríamos para fazer com que qualquer água indesejada que ficou ali, fosse embora ao invés de avançar na tubulação? Se a sua resposta foi um ralo de esgoto, meus parabéns, você acertou em cheio, o ralo drena toda a água que cai ali, impedindo que qualquer água vá para o resto do nosso circuito.</p>

<figure class="elemento direct-drain-demo">
  <div class="logic-demo-head">
    <div>
      <span class="visual-kicker">Dreno sempre aberto</span>
      <strong>O ruído some, mas a energia útil também</strong>
    </div>
    <button type="button" class:on={drainGate} aria-pressed={drainGate} onclick={() => (drainGate = !drainGate)}>
      Interruptor: {drainGate ? "ligado" : "desligado"}
    </button>
  </div>
  <div class="direct-drain-circuit">
    <div class="direct-source">+ fonte</div>
    <div class:open={!drainGate} class="direct-pnp">PNP</div>
    <div class:active={drainGate} class="direct-input">Gate {drainGate ? "1" : "0"}</div>
    <div class="drain-node">
      <span class="dead-output">saída</span>
      <div class="dead-lamp"><span></span></div>
      <span class="short-wire"></span>
      <span class="ground-symbol">⏚ negativo</span>
    </div>
  </div>
</figure>

<p>Tá, tem algo de errado, colocar o ralo no nosso circuito fazendo toda a corrente ser drenada resolveu o problema da interferência no nosso circuito e garantiu que nenhuma corrente vá para a luz, só que, o ralo também está impedindo que qualquer corrente chegue a luz, mesmo que a gente queira que chegue, toda a corrente é drenada o tempo todo, e agora? Bom se existisse algum dispositivo eletrônico que agisse como um interruptor, para que a gente pudesse “desligar” o ralo, cortando aquela conexão quando o interruptor está desligado, permitindo a corrente chegar na luz. Se você pensou no transistor normal — que se chama transistor NPN — parabéns denovo, pois é exatamente isso que vamos fazer, colocar um transistor ali no nosso ralo, fazendo ele só abrir quando queremos que a luz esteja apagada, ou seja, quando o interruptor está ativo.</p>

<figure class="elemento complete-not-demo">
  <div class="logic-demo-head">
    <div>
      <span class="visual-kicker">NOT Gate completo</span>
      <strong>O PNP alimenta; o NPN drena apenas quando necessário</strong>
    </div>
    <button type="button" class:on={notGateInput} aria-pressed={notGateInput} onclick={() => (notGateInput = !notGateInput)}>
      Interruptor: {notGateInput ? "ligado (1)" : "desligado (0)"}
    </button>
  </div>
  <div class="complete-not-circuit" class:input-on={notGateInput}>
    <div class="not-power">+ fonte</div>
    <div class:conducting={!notGateInput} class="not-pnp"><b>PNP</b><span>{notGateInput ? "bloqueia" : "conduz"}</span></div>
    <div class="not-output-node">
      <span class="not-output-label">saída</span>
      <div class:on={notGateLight} class="not-lamp"><i></i><span>{notGateLight ? "acesa" : "apagada"}</span></div>
    </div>
    <div class:conducting={notGateInput} class="not-npn"><b>NPN</b><span>{notGateInput ? "drena" : "fecha"}</span></div>
    <div class="not-ground">⏚ negativo</div>
    <div class:active={notGateInput} class="not-input-wire">Gate {notGateInput ? "1" : "0"}</div>
  </div>
  <div class="not-result" aria-live="polite">
    Entrada {notGateInput ? "1" : "0"} → saída {notGateLight ? "1" : "0"}: a luz está {notGateLight ? "acesa" : "apagada"}.
  </div>
</figure>

<p>Agora sim, temos um circuito onde a luz acende quando o interruptor está desativado, e apaga quando o interruptor está ativo, e no processo entendemos como o transistor funciona, e de quebra criamos nosso primeiro circuito lógico, o NOT Gate, que inverte um sinal de entrada, o interruptor.</p>

<style>
  .elemento {
    margin: 1.75rem 0;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    overflow: hidden;
    background: var(--surface-soft);
  }

  .visual-kicker {
    display: block;
    color: var(--accent-3);
    font-size: 0.72rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 0.28rem;
  }

  button {
    font: inherit;
  }

  .anatomy-stage {
    display: grid;
    grid-template-columns: minmax(140px, 0.7fr) minmax(220px, 1.1fr);
    gap: 0.8rem 1.25rem;
    padding: 1.15rem;
    align-items: center;
    background: radial-gradient(circle at 50% 34%, rgba(139, 92, 246, 0.19), transparent 48%);
  }

  .anatomy-copy strong,
  .amplifier-toolbar strong,
  .binary-demo-top strong,
  .water-topline strong,
  .wire-title strong,
  .resistance-head strong,
  .comparison-header strong,
  .logic-demo-head strong {
    display: block;
    font-size: 1rem;
  }

  .anatomy-copy p {
    margin-top: 0.35rem;
    color: var(--muted);
    font-size: 0.87rem;
  }

  .anatomy-stage svg {
    width: 100%;
    max-height: 250px;
  }

  .anatomy-stage text {
    fill: var(--muted);
    font-size: 13px;
    font-weight: 700;
  }

  .lead {
    fill: none;
    stroke: #9ca3af;
    stroke-width: 10;
    stroke-linecap: round;
    transition: stroke 0.2s ease, filter 0.2s ease;
  }

  .lead.chosen {
    stroke: var(--accent-2);
    filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.75));
  }

  .terminal {
    fill: #9ca3af;
    transition: fill 0.2s ease;
  }

  .terminal.chosen {
    fill: var(--accent-2);
  }

  .leg-controls {
    display: flex;
    gap: 0.45rem;
    grid-column: 1 / -1;
    justify-content: center;
  }

  .leg-controls button,
  .binary-demo-top button,
  .water-topline button,
  .wire-title button,
  .comparison-header button,
  .logic-demo-head button {
    border: 1px solid var(--border);
    border-radius: 999px;
    background: var(--surface);
    color: var(--text);
    padding: 0.48rem 0.75rem;
    cursor: pointer;
    transition: transform 0.16s ease, background 0.16s ease, color 0.16s ease;
  }

  .leg-controls button:hover,
  .binary-demo-top button:hover,
  .water-topline button:hover,
  .wire-title button:hover,
  .comparison-header button:hover,
  .logic-demo-head button:hover {
    transform: translateY(-1px);
  }

  .leg-controls button.active,
  .binary-demo-top button.on,
  .wire-title button.on,
  .comparison-header button.on,
  .logic-demo-head button.on {
    background: var(--accent-3);
    color: white;
    border-color: var(--accent-3);
  }

  .amplifier-toolbar,
  .binary-demo-top,
  .water-topline,
  .wire-title,
  .resistance-head,
  .comparison-header,
  .logic-demo-head {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.1rem 0;
  }

  .amplifier-toolbar label,
  .resistance-head label {
    display: grid;
    gap: 0.25rem;
    min-width: min(220px, 45%);
    color: var(--muted);
    font-size: 0.81rem;
    font-weight: 700;
  }

  input[type="range"] {
    accent-color: var(--accent-3);
    width: 100%;
  }

  .amplifier-demo svg {
    display: block;
    width: 100%;
    padding: 0.25rem 0.85rem 0.85rem;
  }

  .svg-board {
    fill: var(--surface);
    stroke: var(--border);
    stroke-width: 2;
  }

  .svg-label {
    fill: var(--muted);
    font-size: 13px;
    font-weight: 700;
  }

  .source-rail-bright,
  .output-rail,
  .gate-rail {
    fill: none;
    stroke-linecap: round;
    stroke-width: 9;
  }

  .source-rail-bright { stroke: #ef4444; }
  .output-rail { stroke: var(--accent-3); }
  .gate-rail { stroke: var(--accent-2); opacity: .75; }
  .battery { fill: #ef4444; }
  .battery-text { fill: #fff; font-size: 22px; font-weight: 800; }
  .amp-chip { fill: #273244; stroke: #8a9bb5; stroke-width: 2; }
  .chip-text { fill: #fff; font-size: 15px; font-weight: 800; }
  .weak-wave { fill: none; stroke: var(--accent-2); stroke-width: 4; filter: url("#amp-glow"); }
  .strong-wave { fill: none; stroke: var(--accent-3); stroke-width: 5; filter: url("#amp-glow"); }
  .output-node { fill: var(--accent-3); filter: url("#amp-glow"); }

  .binary-circuit {
    display: grid;
    grid-template-columns: 1fr 1fr 1.1fr 1fr;
    gap: 0.4rem;
    align-items: center;
    min-height: 275px;
    padding: 1rem 1.1rem 1.2rem;
  }

  .binary-input {
    height: 150px;
    margin-top: -4.8rem;
  }

  .binary-rail,
  .binary-branch {
    position: relative;
    min-height: 108px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    color: var(--muted);
    font-size: 0.82rem;
  }

  .binary-rail b,
  .binary-branch b {
    color: var(--text);
  }

  .binary-rail::after,
  .binary-branch::after {
    content: "";
    position: absolute;
    height: 10px;
    border-radius: 999px;
    top: 50%;
    left: 0;
    right: -0.4rem;
    z-index: 0;
    background: #94a3b8;
  }

  .binary-rail > *,
  .binary-branch > * { position: relative; z-index: 1; }
  .binary-rail.source::after { background: #ef4444; }
  .binary-rail.sink::after { background: #64748b; }
  .binary-branch::after { background: #64748b; }
  .binary-circuit.active .binary-branch::after { background: var(--accent-2); box-shadow: 0 0 13px rgba(245, 158, 11, .6); }
  .binary-circuit.active .binary-rail.sink::after { background: var(--accent-3); box-shadow: 0 0 13px rgba(139, 92, 246, .6); }

  .rail-dot,
  .signal-pulse {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--surface);
    border: 2px solid currentColor;
    color: #64748b;
    font-weight: 900;
  }

  .source .rail-dot { color: #ef4444; }
  .binary-circuit.active .gate .signal-pulse { color: var(--accent-2); }
  .binary-circuit.active .sink .rail-dot { color: var(--accent-3); }

  .binary-device {
    min-height: 140px;
    display: grid;
    place-content: center;
    gap: 0.4rem;
    text-align: center;
    border: 2px solid #64748b;
    border-radius: 1rem;
    color: var(--text);
    background: var(--surface);
    font-weight: 800;
  }

  .binary-device small { color: var(--muted); font-weight: 600; }
  .binary-circuit.active .binary-device { border-color: var(--accent-3); box-shadow: 0 0 0 4px rgba(139, 92, 246, .13); }

  .water-system {
    display: grid;
    grid-template-columns: 1fr minmax(120px, .85fr) 1fr;
    gap: 0.5rem;
    padding: 1.15rem;
    align-items: end;
    min-height: 250px;
    background: linear-gradient(180deg, rgba(14, 165, 233, .07), transparent);
  }

  .tank {
    position: relative;
    height: 178px;
    overflow: hidden;
    border: 5px solid #64748b;
    border-top: 0;
    border-radius: 0 0 18px 18px;
    background: repeating-linear-gradient(90deg, transparent 0 29px, rgba(100,116,139,.15) 30px);
  }

  .tank-title {
    position: absolute;
    z-index: 2;
    top: 0.5rem;
    left: 0.55rem;
    font-size: 0.78rem;
    font-weight: 800;
    color: var(--text);
  }

  .water-fill {
    position: absolute;
    inset: auto 0 0;
    min-height: 0;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 0.5rem;
    color: #fff;
    font-size: 0.86rem;
    font-weight: 800;
    transition: height 0.18s linear;
    background: linear-gradient(180deg, #38bdf8, #2563eb);
  }

  .water-pipe {
    position: relative;
    height: 28px;
    margin-bottom: 56px;
    border-radius: 999px;
    background: #64748b;
    overflow: hidden;
  }

  .water-pipe small {
    position: absolute;
    width: 100%;
    text-align: center;
    top: 35px;
    color: var(--muted);
    font-size: 0.75rem;
    font-weight: 700;
  }

  .water-arrow {
    position: absolute;
    top: -4px;
    color: #dbeafe;
    font-size: 27px;
    opacity: 0;
  }

  .water-pipe.flowing .water-arrow { opacity: 1; animation: water-arrow 1.2s linear infinite; }
  .arrow-one { left: 4%; }
  .arrow-two { left: 36%; animation-delay: .4s !important; }
  .arrow-three { left: 68%; animation-delay: .8s !important; }

  .plain-wire {
    position: relative;
    height: 110px;
    display: flex;
    align-items: center;
    padding: 0 1.1rem;
  }

  .wire-core {
    width: 100%;
    height: 22px;
    border-radius: 999px;
    background: #64748b;
  }

  .wire-end {
    flex: 0 0 42px;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 42px;
    height: 42px;
    border: 3px solid currentColor;
    border-radius: 50%;
    background: var(--surface);
    font-size: 1.35rem;
    font-weight: 900;
  }

  .negative { color: #38bdf8; }
  .positive { color: #ef4444; }
  .electron {
    position: absolute;
    z-index: 2;
    left: 8%;
    color: #dbeafe;
    font-size: 1.65rem;
    opacity: 0;
  }

  .plain-wire.energized .wire-core { background: linear-gradient(90deg, #38bdf8, #6366f1, #ef4444); }
  .plain-wire.energized .electron { opacity: 1; animation: electron-flow 2.15s linear infinite; }
  .electron-two { animation-delay: .52s !important; }
  .electron-three { animation-delay: 1.04s !important; }
  .electron-four { animation-delay: 1.56s !important; }

  .dam-wire {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    gap: 0.7rem;
    align-items: center;
    padding: 1.25rem 1.1rem 0.75rem;
  }

  .dam-terminal {
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    border: 2px solid var(--border);
    border-radius: 50%;
    color: var(--text);
    font-weight: 900;
    background: var(--surface);
  }

  .dam-channel {
    position: relative;
    height: 110px;
    overflow: hidden;
    border: 8px solid #64748b;
    border-radius: 16px;
    background: linear-gradient(90deg, #0ea5e9 0 calc(42% + (var(--current) * 65%) - 3px), #334155 calc(42% + (var(--current) * 75%) - 3px));
  }

  .dam-wall {
    position: absolute;
    z-index: 2;
    bottom: 0;
    left: calc(50% - 13px);
    width: 26px;
    min-height: 14px;
    display: grid;
    place-items: center;
    color: white;
    font-size: 0.55rem;
    font-weight: 800;
    writing-mode: vertical-rl;
    background: #475569;
    border: 2px solid #e2e8f0;
    transition: height .18s ease;
  }

  .dam-particle {
    position: absolute;
    z-index: 1;
    top: 35px;
    color: #dbeafe;
    font-size: 1.2rem;
    animation: dam-current calc(5s - (var(--current) * 4s)) linear infinite;
    animation-play-state: running;
    opacity: var(--current);
  }

  .p-one { left: 3%; opacity: 1; }
  .p-two { left: 16%; animation-delay: .38s; opacity: 1; }
  .p-three { left: 29%; animation-delay: .76s; opacity: 1; }
  .p-four { left: 61%; animation-delay: 1.14s; }
  .p-five { left: 76%; animation-delay: 1.52s; }

  .heat-cloud {
    color: #dc2626;
    font-size: .78rem;
    font-weight: 800;
    text-transform: uppercase;
    opacity: var(--heat);
    transform: translateY(calc(var(--heat) * -8px));
    transition: opacity .18s ease, transform .18s ease;
  }

  .resistance-meter {
    display: flex;
    justify-content: space-between;
    padding: 0 1.1rem 1.1rem;
    color: var(--muted);
    font-size: .85rem;
  }

  .resistance-meter b { color: var(--text); }

  .comparison-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.85rem;
    padding: 1rem 1.1rem 1.2rem;
  }

  .transistor-card {
    padding: 0.8rem;
    border: 1px solid var(--border);
    border-radius: 0.9rem;
    background: var(--surface);
  }

  .card-heading {
    display: flex;
    justify-content: space-between;
    color: var(--muted);
    font-size: .82rem;
  }

  .card-heading b { color: var(--text); font-size: 1rem; }
  .transistor-card.conducting .card-heading span { color: #15803d; font-weight: 800; }

  .vertical-circuit {
    position: relative;
    width: 112px;
    height: 160px;
    margin: .55rem auto .35rem;
    display: grid;
    justify-items: center;
    align-content: space-between;
  }

  .vertical-track {
    position: absolute;
    top: 20px;
    bottom: 20px;
    width: 12px;
    border-radius: 999px;
    background: #94a3b8;
  }

  .conducting .vertical-track { background: linear-gradient(#ef4444, var(--accent-3)); box-shadow: 0 0 11px rgba(139,92,246,.55); }
  .power-marker, .vertical-output, .device-pill, .gate-link { position: relative; z-index: 1; }
  .power-marker { color: #ef4444; font-size: 1.25rem; font-weight: 900; }
  .vertical-output { align-self: end; padding: .2rem .45rem; border-radius: 99px; color: var(--muted); background: var(--surface-soft); font-size: .7rem; font-weight: 800; }
  .device-pill { margin-top: 48px; padding: .3rem .55rem; border-radius: .6rem; color: #fff; background: #334155; font-size: .76rem; font-weight: 800; }
  .gate-link { position: absolute; left: -8px; top: 84px; transform: translateX(-100%); padding: .25rem .4rem; border-radius: .4rem; color: var(--text); background: var(--accent-soft-3); font-size: .65rem; white-space: nowrap; }
  .transistor-card p { color: var(--muted); font-size: .78rem; text-align: center; }

  .floating-circuit,
  .direct-drain-circuit,
  .complete-not-circuit {
    position: relative;
    margin: 1rem 1.1rem 1.2rem;
    min-height: 280px;
    border: 1px solid var(--border);
    border-radius: 1rem;
    background: var(--surface);
    overflow: hidden;
    isolation: isolate;
  }

  .power-rail,
  .direct-source,
  .not-power {
    position: absolute;
    top: 18px;
    left: 12%;
    right: 12%;
    height: 15px;
    padding-left: .3rem;
    color: #fff;
    border-radius: 999px;
    background: #ef4444;
    font-size: .7rem;
    font-weight: 800;
    line-height: 15px;
  }

  .pnp-switch,
  .direct-pnp,
  .not-pnp,
  .not-npn {
    position: absolute;
    display: grid;
    place-content: center;
    gap: .15rem;
    text-align: center;
    color: #fff;
    background: #475569;
    border-radius: .65rem;
    font-size: .72rem;
    font-weight: 800;
  }

  .pnp-switch {
    top: 69px;
    left: calc(50% - 39px);
    width: 78px;
    height: 52px;
  }

  .pnp-switch::before,
  .pnp-switch::after {
    content: "";
    position: absolute;
    left: calc(50% - 5px);
    width: 10px;
    background: #94a3b8;
  }

  .pnp-switch::before { height: 38px; bottom: 100%; background: #ef4444 !important; }
  .pnp-switch::after { height: 43px; top: 100%; }
  .pnp-switch.open { background: var(--accent-3); box-shadow: 0 0 12px rgba(139,92,246,.45); }
  .pnp-switch.open::before, .pnp-switch.open::after { background: var(--accent-3); }

  .gate-switch {
    position: absolute;
    top: 84px;
    left: 12%;
    display: flex;
    width: 50%;
    align-items: center;
    gap: .35rem;
    color: var(--muted);
    font-size: .72rem;
    font-weight: 800;
  }

  .gate-switch i {
    display: block;
    width: 70%;
    z-index: -1;
    height: 8px;
    border-radius: 99px;
    background: #94a3b8;
  }

  .gate-switch.active i { background: var(--accent-2); box-shadow: 0 0 10px rgba(245,158,11,.6); }

  .floating-output {
    position: absolute;
    top: 145px;
    left: 49%;
    right: 10%;
    height: 70px;
  }

  .output-wire {
    position: absolute;
    top: 12px;
    left: 0;
    right: 66px;
    height: 10px;
    border-radius: 99px;
    background: var(--accent-3);
  }

  .floating-output.floating .output-wire { background: #94a3b8; border: 2px dashed var(--accent-2); animation: floating-wire .28s steps(2) infinite; }
  .floating-label { position: absolute; top: 26px; left: 0; color: var(--muted); font-size: .68rem; font-weight: 800; }
  .lamp-shell { position: absolute; top: -13px; right: 8px; width: 49px; height: 49px; opacity: var(--lamp-level); transition: opacity .1s ease; }
  .lamp-bulb { position: absolute; inset: 8px; border: 4px solid #f59e0b; border-radius: 50%; background: #fef3c7; box-shadow: 0 0 20px rgba(245,158,11,.8); }
  .lamp-shell::after { content: ""; position: absolute; left: 18px; bottom: 0; width: 14px; height: 11px; border-radius: 0 0 5px 5px; background: #64748b; }
  .lamp-ray { position: absolute; width: 4px; height: 8px; border-radius: 99px; background: #f59e0b; }
  .ray-a { top: 0; left: 23px; } .ray-b { top: 6px; right: 2px; transform: rotate(45deg); } .ray-c { top: 6px; left: 2px; transform: rotate(-45deg); }
  .no-ground { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); color: #dc2626; font-size: .72rem; font-weight: 800; }

  .direct-source { width: 80%; }
  .direct-pnp { top: 64px; left: 34%; width: 74px; height: 44px; }
  .direct-pnp::before, .direct-pnp::after { content: ""; position: absolute; left: 32px; width: 10px; background: #94a3b8; }
  .direct-pnp::before { background: #ef4444; }
  .direct-pnp::before { height: 32px; bottom: 100%; } .direct-pnp::after { height: 150%; top: 100%; }
  .direct-pnp.open { background: var(--accent-3); } .direct-pnp.open::after { background: linear-gradient(var(--accent-3) 0%, #7c7e82 80%); }
  .direct-input { position: absolute; left: 8%; top: 80px; color: black; background: var(--muted); font-size: .68rem; font-weight: 800; width: 35%; padding-inline: 0.5rem; border-radius: 100vw; z-index: -1; }
  .direct-input.active { background: var(--accent-2); }
  .dead-output { position: absolute; bottom: 30%; left: 40%; background: var(--muted); color: black; font-size: .7rem; font-weight: 800; width: 20%; border-radius: 100vw; padding-inline: 0.5rem; }
  .dead-lamp { position: absolute; left: 60%; bottom: 25%; width: 40px; height: 40px; border: 4px solid #64748b; border-radius: 50%; opacity: .5; }
  .dead-lamp span { position: absolute; left: 7px; right: 7px; top: 15px; height: 4px; background: #64748b; transform: rotate(-35deg); }
  .ground-symbol { text-align: center; position: absolute; left: 40%; bottom: 15%; color: #7c7e82; font-size: .7rem; font-weight: 800; }

  .not-power { left: 15%; right: 15%; }
  .not-pnp { top: 65px; left: calc(50% - 42px); width: 84px; height: 45px; }
  .not-pnp::before, .not-pnp::after, .not-npn::before, .not-npn::after { content: ""; position: absolute; left: 37px; width: 10px; background: #94a3b8; }
  .not-pnp::before { height: 32px; bottom: 100%; } .not-pnp::after { height: 31px; top: 100%; }
  .not-pnp.conducting, .not-npn.conducting { background: var(--accent-3); box-shadow: 0 0 13px rgba(139,92,246,.42); }
  .not-pnp.conducting::before, .not-pnp.conducting::after, .not-npn.conducting::before, .not-npn.conducting::after { background: var(--accent-3); }
  .not-output-node { position: absolute; top: 116px; left: 50%; width: 160px; height: 65px; }
  .not-output-node::before { content: ""; position: absolute; top: 9px; left: 0; width: 112px; height: 10px; border-radius: 99px; background: var(--accent-3); }
  .input-on .not-output-node::before { content: ""; position: absolute; top: 9px; left: 0; width: 112px; height: 10px; border-radius: 99px; background: #94a3b8; }
  .not-output-label { position: absolute; top: 25px; left: 0; color: var(--muted); font-size: .68rem; font-weight: 800; }
  .not-lamp { position: absolute; top: -14px; right: 0; display: grid; justify-items: center; gap: .1rem; color: var(--muted); font-size: .65rem; font-weight: 800; }
  .not-lamp i { display: block; width: 40px; height: 40px; border: 4px solid #64748b; border-radius: 50%; background: #e5e7eb; }
  .not-lamp.on i { border-color: #f59e0b; background: #fef08a; box-shadow: 0 0 20px rgba(245,158,11,.85); }
  .not-lamp.on { color: #a16207; }
  .not-npn { top: 184px; left: calc(50% - 42px); width: 84px; height: 40px; }
  .not-npn::before { height: 26px; bottom: 100%; } .not-npn::after { height: 18px; top: 100%; }
  .not-ground { position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); color: #757a85; font-size: .72rem; font-weight: 800; }
  .not-input-wire { color: black; z-index: -1; padding-inline: 0.5rem; border-radius: 100vw; position: absolute; left: 8%; top: 96px; background: var(--muted); font-size: .72rem; font-weight: 800; width: 40%;}
  .not-input-wire.active { background: var(--accent-2); }
  .not-result { margin: -0.55rem 1.1rem 1rem; padding: .6rem .75rem; color: var(--text); border-radius: .65rem; background: var(--accent-soft); font-size: .83rem; font-weight: 700; }

  @keyframes water-arrow {
    from { transform: translateX(-18px); }
    to { transform: translateX(45px); }
  }

  @keyframes electron-flow {
    from { transform: translateX(0); }
    to { transform: translateX(calc(100vw - 110px)); }
  }

  @keyframes dam-current {
    0% { transform: translateX(0); }
    48% { transform: translateX(42px); }
    50%, 100% { transform: translateX(42px); }
  }

  @keyframes floating-wire {
    from { opacity: .4; }
    to { opacity: 1; }
  }

  @media (max-width: 620px) {
    .anatomy-stage { grid-template-columns: 1fr; }
    .anatomy-copy { text-align: center; }
    .amplifier-toolbar,
    .binary-demo-top,
    .water-topline,
    .wire-title,
    .resistance-head,
    .comparison-header,
    .logic-demo-head { align-items: stretch; flex-direction: column; }
    .amplifier-toolbar label,
    .resistance-head label { min-width: 0; }
    .binary-circuit { grid-template-columns: 1fr 1fr; }
    .binary-device { grid-column: 1 / -1; min-height: 68px; order: 3; }
    .binary-rail.sink { grid-column: 2; grid-row: 2; }
    .binary-branch { grid-column: 1; grid-row: 2; }
    .comparison-grid { grid-template-columns: 1fr; }
    .water-system { grid-template-columns: 1fr; align-items: center; }
    .water-pipe { width: 28px; height: 82px; margin: 0 auto; }
    .water-pipe small { top: 28px; left: 36px; width: 80px; text-align: left; }
    .water-arrow { transform: rotate(90deg); left: 0 !important; }
    .water-pipe.flowing .water-arrow { animation-name: water-arrow-mobile; }
    .dam-wire { grid-template-columns: auto 1fr auto; }
    .heat-cloud { grid-column: 2; text-align: center; }
    .floating-circuit, .direct-drain-circuit, .complete-not-circuit { margin-inline: .65rem; }
  }

  @keyframes water-arrow-mobile {
    from { transform: translateY(-16px) rotate(90deg); }
    to { transform: translateY(35px) rotate(90deg); }
  }
</style>
