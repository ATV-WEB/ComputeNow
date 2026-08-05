<script lang="ts">
  import { onMount } from "svelte";

  let decimalCounter = 8;

  let tapeCounter = 8;
  let tapeDigits = [0, 0, 8];
  let tapePreviousDigits = [0, 0, 8];
  let tapeChangeKey = 0;
  let tapeAnimating = false;

  let binaryCounter = 0;
  let binaryBits = [false, false, false];

  let selectedPlace: "hundreds" | "tens" | "units" = "hundreds";
  let selectedCalculation = 900;
  let selectedDecimalPower = 0;
  let selectedBinaryPower = 0;

  let lampOn = false;

  let decimalTensWire = 1;
  let decimalUnitsWire = 2;
  let compactBits = [true, true, false, false];
  let conversionBits = [true, true, false, false];
  let conversionValue = 12;
  let conversionFormula = "4 + 8";

  const decimalDigits = Array.from({ length: 10 }, (_, index) => index);

  $: binaryBits = [
    Boolean(binaryCounter & 4),
    Boolean(binaryCounter & 2),
    Boolean(binaryCounter & 1),
  ];
  $: conversionValue =
    (conversionBits[0] ? 8 : 0) +
    (conversionBits[1] ? 4 : 0) +
    (conversionBits[2] ? 2 : 0) +
    (conversionBits[3] ? 1 : 0);
  $: conversionFormula =
    [
      conversionBits[3] ? "1" : "",
      conversionBits[2] ? "2" : "",
      conversionBits[1] ? "4" : "",
      conversionBits[0] ? "8" : "",
    ]
      .filter(Boolean)
      .join(" + ") || "0";

  function getTapeDigits(value: number): number[] {
    return [
      Math.floor(value / 100) % 10,
      Math.floor(value / 10) % 10,
      value % 10,
    ];
  }

  function incrementTapeCounter(): void {
    if (tapeAnimating) return;

    tapePreviousDigits = [...tapeDigits];
    tapeCounter = (tapeCounter + 1) % 1000;
    tapeDigits = getTapeDigits(tapeCounter);
    tapeChangeKey += 1;
    tapeAnimating = true;

    window.setTimeout(() => {
      tapePreviousDigits = [...tapeDigits];
      tapeChangeKey += 1;
      tapeAnimating = false;
    }, 1050);
  }

  function toggleCompactBit(index: number): void {
    compactBits = compactBits.map((bit, bitIndex) =>
      bitIndex === index ? !bit : bit,
    );
  }

  function toggleConversionBit(index: number): void {
    conversionBits = conversionBits.map((bit, bitIndex) =>
      bitIndex === index ? !bit : bit,
    );
  }

  onMount(() => {
    const binaryTimer = window.setInterval(() => {
      binaryCounter = (binaryCounter + 1) % 8;
    }, 1250);

    return () => window.clearInterval(binaryTimer);
  });
</script>

<p>
  Já parou para pensar como um computador funciona? Como que aqueles códigos que
  você vê nos filmes viram aplicações, sites, sistemas operacionais utilizados
  em escala global no dia a dia?
</p>

<p>
  Tudo começa com um termo que talvez você já tenha ouvido falar, o tal do
  Binário, mas o que exatamente é o binário? Talvez você já tenha escutado que
  binário significa zeros (0) e uns (1), e essa explicação não está errada, mas
  tem mais para essa explicação. Mas primeiro precisamos entender como funcionam
  os diferentes sistemas numéricos, para poder entender como usar o binário.
</p>

<p>
  O sistema numérico mais utilizado é o decimal, onde os números vão do zero (0)
  até o nove (9) e depois repetem, desse jeito:
</p>

<figure class="elemento">
  <div class="counter-demo" aria-label="Contador decimal interativo">
    <div class="counter-display" aria-live="polite">
      <span>valor atual</span>
      <output>{decimalCounter}</output>
    </div>
    <div class="counter-actions">
      <div class="add-control">
        <span class="click-cue" aria-hidden="true">↓ clique aqui</span>
        <button
          type="button"
          class="add-one"
          on:click={() => (decimalCounter += 1)}
        >
          <span aria-hidden="true">＋</span> somar 1
        </button>
      </div>
      <button
        type="button"
        class="counter-reset"
        on:click={() => (decimalCounter = 8)}
      >
        reiniciar
      </button>
    </div>
  </div>
</figure>

<p>
  Mas isso você já sabia, o que talvez você nunca tenha prestado atenção é na
  forma como a troca do nove para o dez acontece, vamos ver em mais detalhes:
</p>

<figure class="elemento">
  <div
    class="tape-counter-demo"
    aria-label="Contador decimal de três casas com rolos numéricos"
  >
    <div class="tape-labels" aria-hidden="true">
      <span>centenas</span>
      <span>dezenas</span>
      <span>unidades</span>
    </div>
    <div
      class="tape-reels"
      aria-live="polite"
      aria-label={`Valor atual ${tapeCounter}`}
    >
      {#key tapeChangeKey}
        <div
          class="tape-reel"
          class:changed={tapePreviousDigits[0] !== tapeDigits[0]}
        >
          <div
            class:rolling={tapeAnimating &&
              tapePreviousDigits[0] !== tapeDigits[0]}
            class="reel-motion"
            style="--reel-delay: 280ms; --reel-duration: 820ms;"
          >
            <span class="reel-number leaving">{tapePreviousDigits[0]}</span>
            <span class="reel-number arriving">{tapeDigits[0]}</span>
          </div>
        </div>
        <div
          class="tape-reel"
          class:changed={tapePreviousDigits[1] !== tapeDigits[1]}
        >
          <div
            class:rolling={tapeAnimating &&
              tapePreviousDigits[1] !== tapeDigits[1]}
            class="reel-motion"
            style="--reel-delay: 150ms; --reel-duration: 720ms;"
          >
            <span class="reel-number leaving">{tapePreviousDigits[1]}</span>
            <span class="reel-number arriving">{tapeDigits[1]}</span>
          </div>
        </div>
        <div
          class="tape-reel"
          class:changed={tapePreviousDigits[2] !== tapeDigits[2]}
        >
          <div
            class:rolling={tapeAnimating &&
              tapePreviousDigits[2] !== tapeDigits[2]}
            class="reel-motion"
            style="--reel-delay: 0ms; --reel-duration: 540ms;"
          >
            <span class="reel-number leaving">{tapePreviousDigits[2]}</span>
            <span class="reel-number arriving">{tapeDigits[2]}</span>
          </div>
        </div>
      {/key}
    </div>
    <button
      type="button"
      class="tape-add"
      on:click={incrementTapeCounter}
      disabled={tapeAnimating}
    >
      somar 1
    </button>
  </div>
</figure>

<p>
  Perceba que no sistema decimal, existem apenas 10 números que se repetem (por
  isso se chama decimal), os números 0, 1, 2, 3, 4, 5, 6, 7, 8 e 9, perceba que
  não existe número 10, e que ele é composto pelos números 1 e 0, chamamos esse
  sistema de base 10.
</p>

<p>
  Mas o que isso tem a ver com binário? Tudo! Pois no sistema binário existem
  apenas 2 números, o número 0 e o número 1, então começamos no zero, e quando
  somamos 1, já acabou os números, então iniciamos essa posição decimal, e
  adicionamos mais 1 na próxima posição e chamamos esse sistema de base 2.
</p>

<figure class="elemento">
  <div
    class="binary-counter-demo"
    aria-label="Contador binário automático de três dígitos"
  >
    <div class="binary-caption-row">
      <span>contador binário</span>
      <span class="binary-running"><i aria-hidden="true"></i> em execução</span>
    </div>
    <div class="binary-counter-body" aria-live="polite">
      {#key binaryCounter}
        <div
          class="binary-triplet"
          aria-label={`Binário ${binaryBits.map((bit) => (bit ? 1 : 0)).join("")}`}
        >
          <span class:active={binaryBits[0]} class="binary-cell"
            >{binaryBits[0] ? 1 : 0}</span
          >
          <span class:active={binaryBits[1]} class="binary-cell"
            >{binaryBits[1] ? 1 : 0}</span
          >
          <span class:active={binaryBits[2]} class="binary-cell"
            >{binaryBits[2] ? 1 : 0}</span
          >
        </div>
      {/key}
      <div class="decimal-readout">
        <span>decimal</span>
        <output>{binaryCounter}</output>
      </div>
    </div>
  </div>
</figure>

<p>
  Mas como converter facilmente entre números binários e números decimais? não
  dá para contar 1 por um até chegar no número desejado.
</p>

<p>
  Bom, vamos voltar aos números de base 10, quando vemos um número como o 926
  ele é dividido em 3 casas decimais, a das unidades, dezenas, e centenas.
</p>

<figure class="elemento">
  <div class="place-value-demo" aria-label="Valor posicional do número 926">
    <p class="visual-instruction">
      Clique em uma casa para ver sua contribuição.
    </p>
    <div class="place-value-cards">
      <button
        type="button"
        class:active={selectedPlace === "hundreds"}
        on:click={() => (selectedPlace = "hundreds")}
        aria-pressed={selectedPlace === "hundreds"}
      >
        <strong>9</strong>
        <span>centenas</span>
        <em>100</em>
      </button>
      <button
        type="button"
        class:active={selectedPlace === "tens"}
        on:click={() => (selectedPlace = "tens")}
        aria-pressed={selectedPlace === "tens"}
      >
        <strong>2</strong>
        <span>dezenas</span>
        <em>10</em>
      </button>
      <button
        type="button"
        class:active={selectedPlace === "units"}
        on:click={() => (selectedPlace = "units")}
        aria-pressed={selectedPlace === "units"}
      >
        <strong>6</strong>
        <span>unidades</span>
        <em>1</em>
      </button>
    </div>
    <output class="place-contribution" aria-live="polite">
      {selectedPlace === "hundreds"
        ? "9 × 100 = 900"
        : selectedPlace === "tens"
          ? "2 × 10 = 20"
          : "6 × 1 = 6"}
    </output>
  </div>
</figure>

<p>para formar o número podemos somar os dígitos individuais, por exemplo:</p>

<figure class="elemento">
  <div class="decomposition-demo" aria-label="Decomposição do número 926">
    <div class="decomposition-number" aria-hidden="true">
      <span>9<small>100</small></span>
      <span>2<small>10</small></span>
      <span>6<small>1</small></span>
    </div>
    <div class="decomposition-equation" aria-live="polite">
      <span>900 + 20 + 6 =</span>
      <output>926</output>
    </div>
  </div>
</figure>

<p>
  Cada casa que andamos para frente elevamos seu valor com mais um zero no
  final, veja só:
</p>

<figure class="elemento">
  <div
    class="decimal-powers-demo"
    aria-label="Casas decimais e suas potências de dez"
  >
    <div class="decimal-power-row">
      <button
        type="button"
        class:active={selectedDecimalPower === 3}
        on:click={() => (selectedDecimalPower = 3)}
        aria-pressed={selectedDecimalPower === 3}
        ><span>casa 3</span><strong>10<sup>3</sup></strong><em>1000</em></button
      >
      <button
        type="button"
        class:active={selectedDecimalPower === 2}
        on:click={() => (selectedDecimalPower = 2)}
        aria-pressed={selectedDecimalPower === 2}
        ><span>casa 2</span><strong>10<sup>2</sup></strong><em>100</em></button
      >
      <button
        type="button"
        class:active={selectedDecimalPower === 1}
        on:click={() => (selectedDecimalPower = 1)}
        aria-pressed={selectedDecimalPower === 1}
        ><span>casa 1</span><strong>10<sup>1</sup></strong><em>10</em></button
      >
      <button
        type="button"
        class:active={selectedDecimalPower === 0}
        on:click={() => (selectedDecimalPower = 0)}
        aria-pressed={selectedDecimalPower === 0}
        ><span>casa 0</span><strong>10<sup>0</sup></strong><em>1</em></button
      >
    </div>
    <output class="power-result"
      >10<sup>{selectedDecimalPower}</sup> = {10 **
        selectedDecimalPower}</output
    >
  </div>
</figure>

<p>
  perceba que usamos a base do sistema numérico como base na potenciação e o
  expoente é a posição da casa da direita para a esquerda, começamos em 0 pois o
  primeiro dígito não chega ao valor da base (10). Podemos fazer o mesmo em
  binário, porém, temos que levar em consideração que cada casa só consegue
  armazenar 2 estados, um e zero, então vamos contar os valores:
</p>

<figure class="elemento">
  <div
    class="binary-powers-demo"
    aria-label="Casas binárias e suas potências de dois"
  >
    <div class="binary-power-row">
      <button
        type="button"
        class:active={selectedBinaryPower === 3}
        on:click={() => (selectedBinaryPower = 3)}
        aria-pressed={selectedBinaryPower === 3}
        ><span>casa 3</span><strong>2<sup>3</sup></strong><em>8</em></button
      >
      <button
        type="button"
        class:active={selectedBinaryPower === 2}
        on:click={() => (selectedBinaryPower = 2)}
        aria-pressed={selectedBinaryPower === 2}
        ><span>casa 2</span><strong>2<sup>2</sup></strong><em>4</em></button
      >
      <button
        type="button"
        class:active={selectedBinaryPower === 1}
        on:click={() => (selectedBinaryPower = 1)}
        aria-pressed={selectedBinaryPower === 1}
        ><span>casa 1</span><strong>2<sup>1</sup></strong><em>2</em></button
      >
      <button
        type="button"
        class:active={selectedBinaryPower === 0}
        on:click={() => (selectedBinaryPower = 0)}
        aria-pressed={selectedBinaryPower === 0}
        ><span>casa 0</span><strong>2<sup>0</sup></strong><em>1</em></button
      >
    </div>
    <output class="binary-power-result"
      >2<sup>{selectedBinaryPower}</sup> = {2 ** selectedBinaryPower}</output
    >
  </div>
</figure>

<p>
  Não se preocupe, você não precisa ficar resolvendo conta de exponenciação toda
  vez, basta lembrar que o próximo dígito sempre é 2 vezes o anterior, por
  exemplo, depois do 8 vem o 16, depois o 32, depois o 64 e assim por diante, na
  base 10 o próximo dígito sempre é 10 vezes o proximo, 10, 100, 1000, 10000 e
  assim por diante.
</p>

<p>
  E é isso, agora você já entende que binário é nada mais que uma forma de
  contar só com 2 dígitos, o zero e o um, mas talvez você esteja se perguntando,
  por que usar binário?
</p>

<h2>Por que usar binário?</h2>

<p>
  Talvez você já tenha alguém usando o termo binário para se referir a algo que
  ou é de um jeito ou de outro, sem meio termo, e bom, o mesmo vale para a
  eletricidade, podemos dizer que uma luz é um item binário, ou ela tá ligada,
  ou desligada.
</p>

<figure class="elemento">
  <div class="switch-light-demo" aria-label="Interruptor e luz interativos">
    <div class="switch-circuit">
      <button
        type="button"
        role="switch"
        aria-checked={lampOn}
        class:on={lampOn}
        class="power-switch"
        on:click={() => (lampOn = !lampOn)}
      >
        <span class="switch-lever" aria-hidden="true"></span>
        <span class="sr-only">Alternar interruptor</span>
      </button>
      <span class:on={lampOn} class="switch-wire wire-left" aria-hidden="true"
      ></span>
      <output class:on={lampOn} class="signal-bit" aria-live="polite"
        >{lampOn ? 1 : 0}</output
      >
      <span class:on={lampOn} class="switch-wire wire-right" aria-hidden="true"
      ></span>
      <div
        class:on={lampOn}
        class="lamp"
        aria-label={lampOn ? "Luz ligada" : "Luz desligada"}
      >
        <span class="lamp-rays" aria-hidden="true">✦</span>
        <span class="lamp-bulb" aria-hidden="true"></span>
        <span class="lamp-base" aria-hidden="true"></span>
      </div>
    </div>
    <span class="switch-prompt" aria-hidden="true">clique no interruptor</span>
  </div>
</figure>

<p>
  dessa forma podemos fazer cálculos em circuitos elétricos utilizando apenas 1
  fio por dígito binário, imagine por exemplo que queiramos passar o número 12,
  em um circuito base 10 precisaríamos de 20 fios, 10 para cada número de cada
  dígito
</p>

<figure class="elemento">
  <div
    class="decimal-wires-demo"
    aria-label="Circuito decimal com vinte fios e vinte luzes"
  >
    <div class="decimal-wire-heading">
      <div><strong>dezenas</strong><span>selecione um fio</span></div>
      <div><strong>unidades</strong><span>selecione um fio</span></div>
      <output aria-live="polite"
        >número <b>{decimalTensWire}{decimalUnitsWire}</b></output
      >
    </div>
    <div class="decimal-circuit-grid">
      <div class="wire-bank" aria-label="Dez fios para as dezenas">
        {#each decimalDigits as digit}
          <button
            type="button"
            class:active={decimalTensWire === digit}
            on:click={() => (decimalTensWire = digit)}
            aria-pressed={decimalTensWire === digit}
          >
            <span class="wire-number">{digit}</span><span class="wire-stroke"
            ></span>
          </button>
        {/each}
      </div>
      <div class="wire-bank" aria-label="Dez fios para as unidades">
        {#each decimalDigits as digit}
          <button
            type="button"
            class:active={decimalUnitsWire === digit}
            on:click={() => (decimalUnitsWire = digit)}
            aria-pressed={decimalUnitsWire === digit}
          >
            <span class="wire-number">{digit}</span><span class="wire-stroke"
            ></span>
          </button>
        {/each}
      </div>
      <div class="light-bank" aria-label="Vinte luzes, em duas colunas">
        <div class="light-column" aria-label="Luzes das dezenas">
          {#each decimalDigits as digit}
            <span class:lit={decimalTensWire === digit} class="decimal-light"
              ><i aria-hidden="true"></i>{digit}</span
            >
          {/each}
        </div>
        <div class="light-column" aria-label="Luzes das unidades">
          {#each decimalDigits as digit}
            <span class:lit={decimalUnitsWire === digit} class="decimal-light"
              ><i aria-hidden="true"></i>{digit}</span
            >
          {/each}
        </div>
      </div>
    </div>
  </div>
</figure>

<p>
  Perceba como esse circuito é enorme e complexo para algo tão simples, agora
  imagine fazer conta com números gigantescos, operações complexas, ia ser um
  caos completo, por outro lado, o mesmo circuito em binário é muito mais
  compacto, veja só:
</p>

<figure class="elemento">
  <div
    class="compact-wires-demo"
    aria-label="Circuito binário compacto de quatro fios"
  >
    <div class="compact-wire-panel">
      <div class="compact-inputs">
        <span class="compact-title">4 fios</span>
        <button
          type="button"
          class:on={compactBits[0]}
          on:click={() => toggleCompactBit(0)}
          aria-pressed={compactBits[0]}
          ><span>fio 1</span><i aria-hidden="true"></i></button
        >
        <button
          type="button"
          class:on={compactBits[1]}
          on:click={() => toggleCompactBit(1)}
          aria-pressed={compactBits[1]}
          ><span>fio 2</span><i aria-hidden="true"></i></button
        >
        <button
          type="button"
          class:on={compactBits[2]}
          on:click={() => toggleCompactBit(2)}
          aria-pressed={compactBits[2]}
          ><span>fio 3</span><i aria-hidden="true"></i></button
        >
        <button
          type="button"
          class:on={compactBits[3]}
          on:click={() => toggleCompactBit(3)}
          aria-pressed={compactBits[3]}
          ><span>fio 4</span><i aria-hidden="true"></i></button
        >
      </div>
      <div class="compact-connector" aria-hidden="true">
        <span
          style={`background-color: ${compactBits[0] ? "var(--accent)" : "#42536f"}`}
        ></span>
        <span
          style={`background-color: ${compactBits[1] ? "var(--accent)" : "#42536f"}`}
        ></span>
        <span
          style={`background-color: ${compactBits[2] ? "var(--accent)" : "#42536f"}`}
        ></span>
        <span
          style={`background-color: ${compactBits[3] ? "var(--accent)" : "#42536f"}`}
        ></span>
      </div>
      <div class="compact-light-panel">
        <span>painel</span>
        <div
          class="compact-lights"
          aria-label={`Painel binário ${compactBits.map((bit) => (bit ? 1 : 0)).join("")}`}
        >
          <i class:on={compactBits[0]}></i>
          <i class:on={compactBits[1]}></i>
          <i class:on={compactBits[2]}></i>
          <i class:on={compactBits[3]}></i>
        </div>
        <output aria-live="polite"
          >{compactBits.map((bit) => (bit ? 1 : 0)).join("")}</output
        >
        <output aria-live="polite"
          >Decimal: {compactBits.reduce(
            (acc, bit, index) => acc + (bit ? Math.pow(2, 3 - index) : 0),
            0,
          )}</output
        >
      </div>
    </div>
    <p class="compact-hint">Clique em um fio para alternar sua luz.</p>
  </div>
</figure>

<p>
  Se interpretarmos as luzes acesas como 1s e as apagadas como 0s, vamos ter o
  número 1100 em binário, que convertendo para decimal.
</p>

<figure class="elemento">
  <div
    class="binary-conversion-demo"
    aria-label="Conversão de binário para decimal"
  >
    <div class="conversion-heading">
      <span>binário</span><span>valor decimal</span>
    </div>
    <div class="conversion-layout">
      <div class="conversion-bits">
        <button
          type="button"
          class:on={conversionBits[0]}
          on:click={() => toggleConversionBit(0)}
          aria-pressed={conversionBits[0]}
          ><small>casa 3</small><strong>{conversionBits[0] ? 1 : 0}</strong><em
            >8</em
          ></button
        >
        <button
          type="button"
          class:on={conversionBits[1]}
          on:click={() => toggleConversionBit(1)}
          aria-pressed={conversionBits[1]}
          ><small>casa 2</small><strong>{conversionBits[1] ? 1 : 0}</strong><em
            >4</em
          ></button
        >
        <button
          type="button"
          class:on={conversionBits[2]}
          on:click={() => toggleConversionBit(2)}
          aria-pressed={conversionBits[2]}
          ><small>casa 1</small><strong>{conversionBits[2] ? 1 : 0}</strong><em
            >2</em
          ></button
        >
        <button
          type="button"
          class:on={conversionBits[3]}
          on:click={() => toggleConversionBit(3)}
          aria-pressed={conversionBits[3]}
          ><small>casa 0</small><strong>{conversionBits[3] ? 1 : 0}</strong><em
            >1</em
          ></button
        >
      </div>
      <div class="conversion-sum" aria-live="polite">
        <span>{conversionFormula}</span>
        <b>=</b>
        <output>{conversionValue}</output>
      </div>
    </div>
    <p class="compact-hint">
      As casas da direita para a esquerda valem 1, 2, 4 e 8. Clique nos bits
      para testar.
    </p>
  </div>
</figure>

<p>
  Mesmo resultado do primeiro circuito, porém muito menor e fácil de trabalhar,
  esse é o mesmo princípio que os computadores usam, e talvez você já tenha
  usado a terminologia binária sem nem perceber, para facilitar a comunicação
  chamamos um número binário de bit, a menor unidade que um computador consegue
  calcular, da mesma forma que um número de 0 à 9 é chamado de dígito, um valor
  de 0 à 1 em binário é chamado de bit, quando juntamos 8 deles, chamamos de
  byte, e sim, quando alguém diz que um arquivo tem 10 megabytes, são desses
  bytes que ela está falando.
</p>

<p>
  Todos os arquivos do seu computador são armazenados em bits, e do mesmo jeito
  que temos nomenclaturas para mil, milhão, bilhão, o computador também tem, 1
  kilobyte, são mil bytes, ou 8 mil bits, 1 megabyte são 1 milhão de bytes, 1
  gigabyte são 1 bilhão de bytes, então da próxima vez que seu celular de 128
  gigas reclamar que está sem espaço, lembre-se, você está armazenando quase 128
  bilhões de bytes de dados, ou 1 trilhão e 24 bilhões de bits, é muita coisa!
</p>

<figure class="elemento">
  <div class="storage-table-demo">
    <table>
      <caption
        >Tabela de conversão entre unidades de armazenamento, bytes e bits</caption
      >
      <thead>
        <tr>
          <th scope="col">Unidade</th>
          <th scope="col">Bytes</th>
          <th scope="col">Bits</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th scope="row">kilobyte (KB)</th>
          <td>1.000</td>
          <td>8.000</td>
        </tr>
        <tr>
          <th scope="row">megabyte (MB)</th>
          <td>1.000.000</td>
          <td>8.000.000</td>
        </tr>
        <tr>
          <th scope="row">gigabyte (GB)</th>
          <td>1.000.000.000</td>
          <td>8.000.000.000</td>
        </tr>
        <tr>
          <th scope="row">terabyte (TB)</th>
          <td>1.000.000.000.000</td>
          <td>8.000.000.000.000</td>
        </tr>
      </tbody>
    </table>
  </div>
</figure>

<style>
  .elemento {
    margin: 1.75rem 0;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    overflow: hidden;
    background: var(--surface-soft);
  }

  .counter-demo,
  .tape-counter-demo,
  .binary-counter-demo,
  .place-value-demo,
  .decomposition-demo,
  .decimal-powers-demo,
  .binary-powers-demo,
  .switch-light-demo,
  .decimal-wires-demo,
  .compact-wires-demo,
  .binary-conversion-demo,
  .storage-table-demo {
    color: var(--text);
  }

  button {
    font: inherit;
  }

  .counter-demo {
    min-height: 15rem;
    padding: 1.5rem;
    display: grid;
    place-items: center;
    gap: 1.25rem;
    background: radial-gradient(
        circle at 20% 15%,
        color-mix(in srgb, var(--accent) 18%, transparent),
        transparent 36%
      ),
      var(--surface-soft);
  }

  .counter-display {
    min-width: min(100%, 21rem);
    padding: 1.1rem 1.5rem;
    border: 1px solid var(--border);
    border-radius: 1rem;
    background: var(--surface);
    text-align: center;
    box-shadow: 0 12px 24px rgba(55, 31, 120, 0.1);
  }

  .counter-display span,
  .decimal-readout span,
  .binary-caption-row > span:first-child,
  .compact-title,
  .compact-light-panel > span,
  .conversion-heading,
  .tape-labels,
  .visual-instruction {
    display: block;
    color: var(--muted);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .counter-display output {
    display: block;
    margin-top: 0.1rem;
    color: var(--accent);
    font-size: clamp(3rem, 9vw, 5.25rem);
    font-variant-numeric: tabular-nums;
    font-weight: 800;
    line-height: 1;
  }

  .counter-actions,
  .add-control {
    display: flex;
    align-items: end;
    justify-content: center;
    gap: 0.75rem;
  }

  .add-control {
    position: relative;
  }

  .click-cue {
    position: absolute;
    right: 0;
    bottom: calc(100% + 0.25rem);
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 800;
    white-space: nowrap;
    animation: nudge-down 1.25s ease-in-out infinite;
  }

  .add-one,
  .tape-add {
    border: 1px solid color-mix(in srgb, var(--accent) 78%, var(--border));
    border-radius: 0.7rem;
    padding: 0.7rem 1rem;
    background: var(--accent);
    color: white;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 6px 0 color-mix(in srgb, var(--accent) 58%, #000);
    transition:
      transform 0.16s ease,
      box-shadow 0.16s ease;
  }

  .add-one:hover,
  .tape-add:hover {
    transform: translateY(-2px);
  }

  .add-one:active,
  .tape-add:active {
    transform: translateY(3px);
    box-shadow: 0 3px 0 color-mix(in srgb, var(--accent) 58%, #000);
  }

  .counter-reset {
    border: 1px solid var(--border);
    border-radius: 0.7rem;
    padding: 0.7rem 0.9rem;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
  }

  .tape-counter-demo {
    min-height: 16rem;
    padding: 1.5rem;
    display: grid;
    place-items: center;
    gap: 0.7rem;
    background: linear-gradient(
      135deg,
      color-mix(in srgb, var(--accent) 9%, transparent),
      transparent 60%
    );
  }

  .tape-labels,
  .tape-reels {
    width: min(100%, 25rem);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.55rem;
  }

  .tape-labels span {
    text-align: center;
    font-size: 0.63rem;
  }

  .tape-reel {
    height: clamp(4rem, 12vw, 5.75rem);
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.8rem;
    background: repeating-linear-gradient(
        0deg,
        transparent 0,
        transparent 17px,
        color-mix(in srgb, var(--border) 32%, transparent) 18px
      ),
      var(--surface);
    box-shadow: inset 0 0 0 0.35rem
      color-mix(in srgb, var(--surface-soft) 70%, transparent);
  }

  .reel-motion {
    position: relative;
    height: 100%;
    overflow: hidden;
  }

  .reel-number {
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    color: var(--accent);
    font-size: clamp(2.6rem, 10vw, 4.5rem);
    font-variant-numeric: tabular-nums;
    font-weight: 850;
    line-height: 1;
  }

  .reel-number.arriving {
    display: none;
    transform: translateY(-100%);
  }

  .reel-motion.rolling .reel-number.arriving {
    display: grid;
    animation: reel-in var(--reel-duration) cubic-bezier(0.16, 0.85, 0.31, 1)
      var(--reel-delay) both;
  }

  .reel-motion.rolling .reel-number.leaving {
    animation: reel-out var(--reel-duration) cubic-bezier(0.16, 0.85, 0.31, 1)
      var(--reel-delay) both;
  }

  .tape-add:disabled {
    cursor: wait;
    opacity: 0.65;
  }

  .binary-counter-demo {
    min-height: 10rem;
    padding: 1.35rem;
    display: grid;
    place-items: center;
    gap: 1rem;
    background: #10172a;
    color: #edf3ff;
  }

  .binary-caption-row,
  .binary-counter-body {
    width: min(100%, 30rem);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .binary-caption-row > span:first-child,
  .decimal-readout span {
    color: #a9b9d9;
  }

  .binary-running {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: #a9b9d9;
    font-size: 0.78rem;
  }

  .binary-running i {
    width: 0.55rem;
    height: 0.55rem;
    border-radius: 50%;
    background: #5ff0a0;
    box-shadow: 0 0 0 0 rgba(95, 240, 160, 0.72);
    animation: status-pulse 1.5s infinite;
  }

  .binary-triplet {
    display: flex;
    gap: 0.45rem;
  }

  .binary-cell {
    width: clamp(3.25rem, 14vw, 4.4rem);
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    border: 1px solid #3e4f75;
    border-radius: 0.75rem;
    background: #1c2842;
    color: #7182a5;
    font-size: clamp(1.85rem, 7vw, 2.8rem);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-weight: 800;
    animation: bit-refresh 0.42s ease both;
  }

  .binary-cell.active {
    border-color: #62e9a4;
    background: #173d38;
    color: #77f5b1;
    box-shadow:
      inset 0 0 1rem rgba(95, 240, 160, 0.22),
      0 0 1rem rgba(95, 240, 160, 0.12);
  }

  .decimal-readout {
    min-width: 4.6rem;
    text-align: center;
  }

  .decimal-readout output {
    display: block;
    margin-top: 0.1rem;
    color: #ffd36d;
    font-size: 3rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-weight: 800;
    line-height: 1;
  }

  .place-value-demo,
  .decomposition-demo,
  .decimal-powers-demo,
  .binary-powers-demo {
    padding: 1.45rem;
    background: linear-gradient(
      120deg,
      color-mix(in srgb, var(--accent) 7%, transparent),
      transparent 55%
    );
  }

  .visual-instruction {
    margin: 0 0 1rem;
    text-align: center;
  }

  .place-value-cards,
  .decomposition-number {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.65rem;
    max-width: 32rem;
    margin: auto;
  }

  .place-value-cards button {
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 0.65rem 0.35rem;
    display: grid;
    place-items: center;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    transition:
      transform 0.16s ease,
      border-color 0.16s ease,
      background 0.16s ease;
  }

  .place-value-cards button:hover,
  .place-value-cards button.active {
    transform: translateY(-3px);
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 12%, var(--surface));
  }

  .place-value-cards strong,
  .decomposition-number span {
    color: var(--accent);
    font-size: clamp(2.3rem, 9vw, 3.8rem);
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }

  .place-value-cards span {
    margin-top: 0.3rem;
    color: var(--muted);
    font-size: 0.75rem;
  }

  .place-value-cards em {
    margin-top: 0.35rem;
    color: var(--text);
    font-size: 1rem;
    font-style: normal;
    font-weight: 800;
  }

  .place-contribution {
    display: block;
    width: fit-content;
    max-width: 100%;
    margin: 1rem auto 0;
    border-radius: 999px;
    padding: 0.5rem 0.85rem;
    background: var(--surface);
    color: var(--accent);
    font-weight: 800;
  }

  .decomposition-number {
    max-width: 23rem;
  }

  .decomposition-number span {
    display: grid;
    place-items: center;
    gap: 0.3rem;
    min-height: 5.2rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    background: var(--surface);
  }

  .decomposition-number small {
    color: var(--muted);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .decomposition-equation {
    margin: 1.25rem auto 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.45rem;
    color: var(--muted);
    font-size: clamp(1.1rem, 4vw, 1.5rem);
    font-weight: 800;
  }

  .decomposition-equation output {
    color: var(--accent);
  }

  .decimal-power-row,
  .binary-power-row {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0.5rem;
    max-width: 39rem;
    margin: auto;
  }

  .decimal-power-row button,
  .binary-power-row button {
    min-height: 7rem;
    border: 1px solid var(--border);
    border-radius: 0.75rem;
    padding: 0.6rem 0.25rem;
    display: grid;
    align-content: center;
    gap: 0.35rem;
    background: var(--surface);
    color: var(--text);
    cursor: pointer;
    transition:
      transform 0.16s ease,
      background 0.16s ease;
  }

  .decimal-power-row button:hover,
  .decimal-power-row button.active,
  .binary-power-row button:hover,
  .binary-power-row button.active {
    transform: translateY(-3px);
    border-color: var(--accent);
    background: color-mix(in srgb, var(--accent) 13%, var(--surface));
  }

  .decimal-power-row span,
  .binary-power-row span {
    color: var(--muted);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
  }

  .decimal-power-row strong,
  .binary-power-row strong {
    color: var(--accent);
    font-size: clamp(1.25rem, 4vw, 1.75rem);
  }

  .decimal-power-row em,
  .binary-power-row em {
    color: var(--text);
    font-size: 0.9rem;
    font-style: normal;
    font-weight: 800;
  }

  .power-result,
  .binary-power-result {
    display: block;
    width: fit-content;
    margin: 1rem auto 0;
    border: 1px dashed var(--border);
    border-radius: 0.6rem;
    padding: 0.55rem 0.8rem;
    background: var(--surface);
    color: var(--accent);
    font-size: 1.15rem;
    font-weight: 800;
  }

  .binary-powers-demo {
    background: linear-gradient(
      120deg,
      rgba(44, 92, 190, 0.12),
      transparent 55%
    );
  }

  .binary-powers-demo .binary-power-row button.active,
  .binary-powers-demo .binary-power-row button:hover {
    border-color: #2c5cbe;
    background: rgba(44, 92, 190, 0.13);
  }

  .binary-powers-demo .binary-power-row strong,
  .binary-powers-demo .binary-power-result {
    color: #2c5cbe;
  }

  .switch-light-demo {
    min-height: 16rem;
    padding: 1.4rem;
    display: grid;
    place-items: center;
    gap: 0.75rem;
    background: linear-gradient(115deg, #142039, #202445);
  }

  .switch-circuit {
    width: min(100%, 36rem);
    display: grid;
    grid-template-columns: auto minmax(1rem, 1fr) auto minmax(1rem, 1fr) auto;
    align-items: center;
    gap: 0.5rem;
  }

  .power-switch {
    position: relative;
    width: 4.1rem;
    height: 4.1rem;
    border: 2px solid #7890b8;
    border-radius: 0.8rem;
    background: #202f4b;
    cursor: pointer;
  }

  .power-switch::before {
    content: "";
    position: absolute;
    inset: 0.6rem 1.55rem;
    border-radius: 999px;
    background: #0e172b;
  }

  .switch-lever {
    position: absolute;
    z-index: 1;
    top: 0.8rem;
    left: 1.78rem;
    width: 0.55rem;
    height: 2.45rem;
    border-radius: 999px;
    background: #d7e1f7;
    transform-origin: bottom center;
    transform: rotate(-32deg);
    transition:
      transform 0.3s ease,
      background 0.3s ease;
  }

  .power-switch.on {
    border-color: #ffe17b;
    box-shadow: 0 0 1.25rem rgba(255, 217, 94, 0.38);
  }

  .power-switch.on .switch-lever {
    background: #ffe17b;
    transform: rotate(32deg);
  }

  .switch-wire {
    height: 0.25rem;
    border-radius: 999px;
    background: #465575;
    transition:
      background 0.3s ease,
      box-shadow 0.3s ease;
  }

  .switch-wire.on {
    background: #ffe17b;
    box-shadow: 0 0 0.75rem rgba(255, 217, 94, 0.9);
  }

  .signal-bit {
    width: 2.2rem;
    height: 2.2rem;
    display: grid;
    place-items: center;
    border: 1px solid #6c7b9d;
    border-radius: 50%;
    background: #15223c;
    color: #a6b4ce;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-size: 1.25rem;
    font-weight: 800;
    transition: all 0.3s ease;
  }

  .signal-bit.on {
    border-color: #ffe17b;
    background: #554319;
    color: #fff3bc;
    box-shadow: 0 0 1rem rgba(255, 217, 94, 0.5);
  }

  .lamp {
    position: relative;
    width: 4.8rem;
    height: 5.35rem;
    display: grid;
    justify-items: center;
    align-content: end;
  }

  .lamp-bulb {
    width: 3rem;
    height: 3.2rem;
    border: 0.45rem solid #7486a8;
    border-radius: 50% 50% 44% 44%;
    background: #2c3852;
    transition: all 0.3s ease;
  }

  .lamp-base {
    width: 1.85rem;
    height: 0.8rem;
    margin-top: -0.25rem;
    border-radius: 0 0 0.3rem 0.3rem;
    background: #aab8d0;
  }

  .lamp-rays {
    position: absolute;
    top: -0.5rem;
    color: transparent;
    font-size: 3rem;
    transition:
      color 0.3s ease,
      text-shadow 0.3s ease;
  }

  .lamp.on .lamp-bulb {
    border-color: #ffed9c;
    background: #ffe17b;
    box-shadow: 0 0 1.8rem rgba(255, 217, 94, 0.95);
  }

  .lamp.on .lamp-rays {
    color: #ffe17b;
    text-shadow: 0 0 1.3rem #ffe17b;
    animation: lamp-glow 1.3s ease-in-out infinite;
  }

  .switch-prompt {
    color: #dce6fb;
    font-size: 0.83rem;
    font-weight: 700;
    animation: nudge-right 1.25s ease-in-out infinite;
  }

  .decimal-wires-demo {
    padding: 1.35rem;
    background: #17223a;
    color: #e7efff;
  }

  .decimal-wire-heading {
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    gap: 0.7rem;
    align-items: center;
    margin-bottom: 1rem;
  }

  .decimal-wire-heading > div {
    display: grid;
    gap: 0.1rem;
  }

  .decimal-wire-heading strong {
    color: #c8d7fb;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .decimal-wire-heading span {
    color: #92a6d2;
    font-size: 0.75rem;
  }

  .decimal-wire-heading output {
    border: 1px solid #51668f;
    border-radius: 0.65rem;
    padding: 0.45rem 0.65rem;
    color: #cedbfd;
    font-size: 0.75rem;
    text-align: center;
  }

  .decimal-wire-heading output b {
    display: block;
    color: #ffdc6b;
    font-size: 1.35rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
  }

  .decimal-circuit-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(10.5rem, 1.15fr);
    gap: 0.8rem;
    align-items: stretch;
  }

  .wire-bank {
    display: grid;
    grid-template-rows: repeat(10, 1fr);
    gap: 0.27rem;
  }

  .wire-bank button {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    border: 0;
    padding: 0;
    background: transparent;
    color: #778aa8;
    cursor: pointer;
  }

  .wire-number {
    width: 1.2rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-size: 0.75rem;
    text-align: right;
  }

  .wire-stroke {
    height: 0.28rem;
    flex: 1;
    border-radius: 99px;
    background: #42536f;
    transition:
      background 0.2s ease,
      box-shadow 0.2s ease;
  }

  .wire-bank button.active {
    color: #ffe17b;
  }

  .wire-bank button.active .wire-stroke {
    background: #ffcf43;
    box-shadow: 0 0 0.5rem rgba(255, 207, 67, 0.75);
  }

  .light-bank {
    min-width: 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    padding: 0.55rem;
    border: 1px solid #4e6288;
    border-radius: 0.75rem;
    background: #0f1930;
  }

  .light-column {
    display: grid;
    grid-template-rows: repeat(10, 1fr);
    gap: 0.23rem;
  }

  .decimal-light {
    min-height: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #6f82a2;
    font-size: 0.68rem;
  }

  .decimal-light i {
    width: 0.73rem;
    height: 0.73rem;
    border: 1px solid #63789e;
    border-radius: 50%;
    background: #293852;
    transition: all 0.2s ease;
  }

  .decimal-light.lit {
    color: #ffe792;
  }

  .decimal-light.lit i {
    border-color: #ffe792;
    background: #ffcf43;
    box-shadow: 0 0 0.65rem rgba(255, 207, 67, 0.9);
  }

  .compact-wires-demo {
    padding: 1.5rem;
    background: linear-gradient(135deg, #132440, #1d3151);
    color: #e8f1ff;
  }

  .compact-wire-panel {
    display: grid;
    grid-template-columns: minmax(7.5rem, 1fr) minmax(2.5rem, 0.7fr) minmax(
        7.5rem,
        1fr
      );
    gap: 0.7rem;
    align-items: center;
    max-width: 35rem;
    margin: auto;
  }

  .compact-inputs {
    display: grid;
    gap: 0.45rem;
  }

  .compact-title {
    color: #bdceef;
  }

  .compact-inputs button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    border: 1px solid #506a94;
    border-radius: 0.55rem;
    padding: 0.45rem 0.6rem;
    background: #152744;
    color: #b8c9e7;
    cursor: pointer;
  }

  .compact-inputs button i,
  .compact-lights i {
    width: 0.72rem;
    height: 0.72rem;
    border: 1px solid #7791b9;
    border-radius: 50%;
    background: #263b5d;
    transition: all 0.2s ease;
  }

  .compact-inputs button.on {
    border-color: #79e9b5;
    color: #e7fff4;
  }

  .compact-inputs button.on i,
  .compact-lights i.on {
    border-color: #87f7c2;
    background: #64e4aa;
    box-shadow: 0 0 0.65rem rgba(100, 228, 170, 0.85);
  }

  .compact-connector {
    display: grid;
    gap: 0.95rem;
  }

  .compact-connector span {
    height: 0.22rem;
    border-radius: 999px;
    background: #5b78a3;
  }

  .compact-light-panel {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border: 1px solid #6685b2;
    border-radius: 0.8rem;
    background: #0d1d36;
  }

  .compact-light-panel > span {
    color: #bdceef;
  }

  .compact-lights {
    display: flex;
    gap: 0.52rem;
  }

  .compact-lights i {
    width: 1.15rem;
    height: 1.15rem;
  }

  .compact-light-panel output {
    color: #ffdd72;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-size: 1.25rem;
    font-weight: 800;
  }

  .compact-hint {
    margin: 1rem 0 0;
    color: white !important;
    font-size: 0.82rem;
    text-align: center;
  }

  .binary-conversion-demo {
    padding: 1.45rem;
    background: linear-gradient(130deg, #101b34, #1a2d4d);
    color: #edf5ff;
  }

  .conversion-heading {
    display: flex;
    justify-content: space-between;
    max-width: 35rem;
    margin: auto auto 0.55rem;
    color: #aac1e7;
  }

  .conversion-layout {
    max-width: 35rem;
    margin: auto;
  }

  .conversion-bits {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.45rem;
  }

  .conversion-bits button {
    display: grid;
    gap: 0.25rem;
    border: 1px solid #506b98;
    border-radius: 0.65rem;
    padding: 0.5rem 0.2rem;
    background: #132442;
    color: #a9bad8;
    cursor: pointer;
    transition:
      transform 0.16s ease,
      background 0.16s ease;
  }

  .conversion-bits button:hover {
    transform: translateY(-2px);
  }

  .conversion-bits button.on {
    border-color: #7ae9b7;
    background: #153d3b;
    color: #eafff5;
  }

  .conversion-bits small {
    color: #9bb0d4;
    font-size: 0.66rem;
  }

  .conversion-bits strong {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
    font-size: clamp(1.55rem, 6vw, 2.25rem);
    line-height: 1;
  }

  .conversion-bits em {
    color: #ffdb75;
    font-style: normal;
    font-weight: 800;
  }

  .conversion-sum {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.55rem;
    color: #ffdb75;
    font-size: clamp(1.2rem, 4vw, 1.55rem);
    font-weight: 800;
  }

  .conversion-sum output {
    min-width: 2.3rem;
    border-radius: 0.5rem;
    padding: 0.2rem 0.45rem;
    background: #ffdb75;
    color: #16213a;
    text-align: center;
  }

  .storage-table-demo {
    overflow-x: auto;
    padding: 1.2rem;
    background: var(--surface);
  }

  .storage-table-demo table {
    width: 100%;
    min-width: 32rem;
    border-collapse: collapse;
    color: var(--text);
    text-align: left;
  }

  .storage-table-demo caption {
    margin-bottom: 0.85rem;
    color: var(--muted);
    font-size: 0.84rem;
    text-align: left;
  }

  .storage-table-demo th,
  .storage-table-demo td {
    border-bottom: 1px solid var(--border);
    padding: 0.72rem 0.8rem;
  }

  .storage-table-demo thead th {
    background: color-mix(in srgb, var(--accent) 12%, var(--surface));
    color: var(--accent);
    font-size: 0.82rem;
    letter-spacing: 0.03em;
    text-transform: uppercase;
  }

  .storage-table-demo tbody th {
    color: var(--text);
  }

  .storage-table-demo td {
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      monospace;
  }

  .storage-table-demo tbody tr:hover {
    background: color-mix(in srgb, var(--accent) 8%, var(--surface));
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  @keyframes nudge-down {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(0.3rem);
    }
  }

  @keyframes nudge-right {
    0%,
    100% {
      transform: translateX(0);
    }
    50% {
      transform: translateX(0.35rem);
    }
  }

  @keyframes reel-out {
    to {
      transform: translateY(100%);
      opacity: 0.25;
    }
  }

  @keyframes reel-in {
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes status-pulse {
    70% {
      box-shadow: 0 0 0 0.45rem rgba(95, 240, 160, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(95, 240, 160, 0);
    }
  }

  @keyframes bit-refresh {
    0% {
      transform: translateY(-0.3rem) scale(0.92);
      opacity: 0.35;
    }
    100% {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }

  @keyframes lamp-glow {
    50% {
      transform: scale(1.08);
    }
  }

  @media (max-width: 600px) {
    .counter-actions {
      align-items: stretch;
      flex-direction: column;
    }

    .add-control {
      justify-content: center;
    }

    .counter-reset {
      width: 100%;
    }

    .binary-counter-body {
      flex-direction: column;
    }

    .decimal-readout {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .decimal-readout output {
      margin: 0;
    }

    .decimal-power-row,
    .binary-power-row {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .switch-circuit {
      grid-template-columns: auto 1fr auto;
      grid-template-areas:
        "switch left bit"
        ". right lamp";
      row-gap: 0.75rem;
    }

    .power-switch {
      grid-area: switch;
    }
    .wire-left {
      grid-area: left;
    }
    .signal-bit {
      grid-area: bit;
    }
    .wire-right {
      grid-area: right;
    }
    .lamp {
      grid-area: lamp;
    }

    .decimal-wire-heading {
      grid-template-columns: 1fr 1fr;
    }

    .decimal-wire-heading output {
      grid-column: 1 / -1;
    }

    .decimal-circuit-grid {
      grid-template-columns: 1fr 1fr;
    }

    .light-bank {
      grid-column: 1 / -1;
    }

    .compact-wire-panel {
      grid-template-columns: 1fr;
    }

    .compact-connector {
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
    }

    .compact-light-panel {
      max-width: 14rem;
      width: 100%;
      justify-self: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }
</style>
