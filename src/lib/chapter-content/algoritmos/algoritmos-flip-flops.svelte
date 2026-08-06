<script lang="ts">
  let srQ = $state(false);
  let srLastAction = $state<"Set" | "Reset" | null>(null);

  const setSrState = (nextState: boolean) => {
    srQ = nextState;
    srLastAction = nextState ? "Set" : "Reset";
  };

  let dInput = $state(false);
  let dQ = $state(false);
  let dClockHigh = $state(false);
  let dClockTimer: ReturnType<typeof setTimeout> | undefined;
  let dClockPulseId = 0;

  const pulseDClock = () => {
    if (dClockTimer) clearTimeout(dClockTimer);
    const pulseId = ++dClockPulseId;
    dClockHigh = true;
    dQ = dInput;
    dClockTimer = setTimeout(() => {
      // Um clique novo não pode ser desligado por um temporizador antigo.
      if (pulseId === dClockPulseId) {
        dClockHigh = false;
        dClockTimer = undefined;
      }
    }, 700);
  };

  let byteInputBits = $state<boolean[]>(Array<boolean>(8).fill(false));
  let byteStoredBits = $state<boolean[]>(Array<boolean>(8).fill(false));
  let byteClockHigh = $state(false);
  let byteClockTimer: ReturnType<typeof setTimeout> | undefined;

  const toggleBit = (bits: boolean[], bitIndex: number) =>
    bits.map((bit, index) => (index === bitIndex ? !bit : bit));

  const formatBits = (bits: boolean[]) =>
    bits.map((bit) => (bit ? "1" : "0")).join("");

  const pulseByteClock = () => {
    if (byteClockTimer) clearTimeout(byteClockTimer);
    byteClockHigh = true;
    byteStoredBits = [...byteInputBits];
    byteClockTimer = setTimeout(() => {
      byteClockHigh = false;
    }, 450);
  };

  let muxInputOne = $state(false);
  let muxInputTwo = $state(false);
  let muxControl = $state(false);

  let memoryInputBits = $state<boolean[]>(Array<boolean>(4).fill(false));
  let memoryAddressBits = $state<boolean[]>(Array<boolean>(2).fill(false));
  let memoryWriteMode = $state(false);
  let memorySlots = $state<boolean[][]>(Array.from(
    { length: 4 },
    () => Array<boolean>(4).fill(false),
  ));
  let memoryClockHigh = $state(false);
  let memoryClockTimer: ReturnType<typeof setTimeout> | undefined;
  let memoryClockPulseId = 0;
  let memoryActivity = $state("Pronto para ler o endereço 00.");
  let memoryAddressIndex = $derived(
    (memoryAddressBits[0] ? 2 : 0) + (memoryAddressBits[1] ? 1 : 0),
  );
  let selectedMemoryBits = $derived(memorySlots[memoryAddressIndex]);

  const bitsToDecimal = (bits: boolean[]) =>
    bits.reduce((total, bit) => total * 2 + (bit ? 1 : 0), 0);

  const pulseMemoryClock = () => {
    if (memoryClockTimer) clearTimeout(memoryClockTimer);
    const pulseId = ++memoryClockPulseId;
    memoryClockHigh = true;

    if (memoryWriteMode) {
      memorySlots = memorySlots.map((slot, index) =>
        index === memoryAddressIndex ? [...memoryInputBits] : slot,
      );
      memoryActivity =
        "Escreveu " +
        formatBits(memoryInputBits) +
        " no endereço " +
        memoryAddressBits.map((bit) => (bit ? "1" : "0")).join("") +
        ".";
    } else {
      memoryActivity =
        "Leu " +
        formatBits(selectedMemoryBits) +
        " do endereço " +
        memoryAddressBits.map((bit) => (bit ? "1" : "0")).join("") +
        ".";
    }

    memoryClockTimer = setTimeout(() => {
      if (pulseId === memoryClockPulseId) {
        memoryClockHigh = false;
        memoryClockTimer = undefined;
      }
    }, 700);
  };

  let srCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let dCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let muxCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let memoryCanvas = $state<HTMLCanvasElement | undefined>(undefined);

  const canvasColors = {
    board: "#122033", track: "#41526c", text: "#edf4ff", muted: "#aab8cc",
    teal: "#2dd4bf", purple: "#a78bfa", orange: "#fb923c", blue: "#38bdf8",
    red: "#fb7185", yellow: "#fde047", pink: "#f472b6", dark: "#111827"
  };

  function canvasContext(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = canvasColors.board;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(148, 163, 184, .12)";
    for (let x = 22; x < canvas.width; x += 22) for (let y = 22; y < canvas.height; y += 22) ctx.fillRect(x, y, 2, 2);
    return ctx;
  }

  function canvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 14, color = canvasColors.text, align: CanvasTextAlign = "center") {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(text, x, y);
  }

  function canvasWire(ctx: CanvasRenderingContext2D, points: number[], active: boolean, color: string) {
    ctx.beginPath(); ctx.moveTo(points[0], points[1]);
    for (let index = 2; index < points.length; index += 2) ctx.lineTo(points[index], points[index + 1]);
    ctx.strokeStyle = active ? color : "rgba(100, 123, 153, .42)";
    ctx.lineWidth = active ? 7 : 2.5;
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    if (active) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
    ctx.stroke(); ctx.shadowBlur = 0;
  }

  function canvasButton(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, label: string, active: boolean, color: string, value?: string) {
    ctx.fillStyle = active ? color : "#1f2d43";
    ctx.strokeStyle = active ? "#f8fafc" : "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y, width, 54, 10); ctx.fill(); ctx.stroke();
    canvasText(ctx, label, x + width / 2, y + 20, 14);
    if (value) canvasText(ctx, value, x + width / 2, y + 39, 13, active ? "#fff" : canvasColors.muted);
    return { x: x + width, y: y + 27 };
  }

  function canvasBlock(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, title: string, active = false, subtitle?: string) {
    ctx.fillStyle = active ? "#1d4f58" : "#203047";
    ctx.strokeStyle = active ? canvasColors.teal : "#73839a";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(x, y, width, height, 12); ctx.fill(); ctx.stroke();
    canvasText(ctx, title, x + width / 2, y + height / 2 - (subtitle ? 9 : 0), 15);
    if (subtitle) canvasText(ctx, subtitle, x + width / 2, y + height / 2 + 14, 11, canvasColors.muted);
  }

  function canvasLamp(ctx: CanvasRenderingContext2D, x: number, y: number, active: boolean, label: string) {
    ctx.fillStyle = active ? canvasColors.yellow : "#334155";
    if (active) { ctx.shadowColor = canvasColors.yellow; ctx.shadowBlur = 18; }
    ctx.beginPath(); ctx.arc(x, y, 23, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    canvasText(ctx, active ? "1" : "0", x, y, 15, active ? "#713f12" : canvasColors.muted);
    canvasText(ctx, label, x, y + 43, 12, canvasColors.muted);
  }

  function canvasHeader(ctx: CanvasRenderingContext2D, title: string, subtitle: string) {
    canvasText(ctx, title, ctx.canvas.width / 2, 30, 20);
    canvasText(ctx, subtitle, ctx.canvas.width / 2, 52, 12, canvasColors.muted);
  }

  function drawSrCanvas() {
    if (!srCanvas) return; const ctx = canvasContext(srCanvas); if (!ctx) return;
    canvasHeader(ctx, "Latch SR", "Set e Reset mantêm o estado até o próximo pulso");
    const set = canvasButton(ctx, 40, 105, 150, "Set (S)", srLastAction === "Set", canvasColors.teal, "1");
    const reset = canvasButton(ctx, 40, 245, 150, "Reset (R)", srLastAction === "Reset", canvasColors.orange, "1");
    canvasBlock(ctx, 330, 95, 140, 74, "NAND", srQ, "Q");
    canvasBlock(ctx, 330, 235, 140, 74, "NAND", !srQ, "Q̅");
    canvasWire(ctx, [set.x, set.y, 270, set.y, 270, 117, 330, 117], srLastAction === "Set", canvasColors.teal);
    canvasWire(ctx, [reset.x, reset.y, 270, reset.y, 270, 287, 330, 287], srLastAction === "Reset", canvasColors.orange);
    // Os dois caminhos de realimentação usam corredores diferentes da placa.
    // Há apenas um cruzamento inevitável, em vez de fios inteiros sobrepostos.
    canvasWire(ctx, [470, 132, 520, 132], srQ, canvasColors.red);
    canvasWire(ctx, [520, 132, 725, 132], srQ, canvasColors.red);
    canvasWire(ctx, [520, 132, 520, 340, 300, 340, 300, 287, 330, 287], srQ, canvasColors.red);
    canvasWire(ctx, [470, 272, 490, 272], !srQ, canvasColors.blue);
    canvasWire(ctx, [490, 272, 725, 272], !srQ, canvasColors.blue);
    canvasWire(ctx, [490, 272, 490, 70, 300, 70, 300, 117, 330, 117], !srQ, canvasColors.blue);
    canvasLamp(ctx, 765, 132, srQ, "Q");
    canvasLamp(ctx, 765, 272, !srQ, "Q̅");
  }

  function drawDCanvas() {
    if (!dCanvas) return; const ctx = canvasContext(dCanvas); if (!ctx) return;
    canvasHeader(ctx, "D Flip-Flop", "O Clock grava D em Q somente durante o pulso");
    const data = canvasButton(ctx, 35, 110, 160, "Entrada D", dInput, canvasColors.teal, dInput ? "1" : "0");
    const clock = canvasButton(ctx, 35, 280, 160, "Clock", dClockHigh, canvasColors.purple, dClockHigh ? "pulso" : "0");
    canvasBlock(ctx, 280, 105, 100, 65, "NOT", !dInput, "inversor");
    canvasBlock(ctx, 445, 92, 110, 70, "AND", dInput && dClockHigh, "Set");
    canvasBlock(ctx, 445, 255, 110, 70, "AND", !dInput && dClockHigh, "Reset");
    canvasBlock(ctx, 650, 145, 130, 145, "SR LATCH", dQ, "memória");
    // A entrada D se divide em dois ramos, sem repetir o mesmo traço.
    canvasWire(ctx, [data.x, data.y, 240, data.y], dInput, canvasColors.teal);
    canvasWire(ctx, [240, 137, 280, 137], dInput, canvasColors.teal);
    canvasWire(ctx, [240, 137, 240, 82, 420, 82, 420, 120, 445, 120], dInput, canvasColors.teal);
    canvasWire(ctx, [380, 137, 420, 137, 420, 290, 445, 290], !dInput, canvasColors.orange);
    // O clock usa um barramento inferior e dois pequenos taps até as portas AND.
    canvasWire(ctx, [clock.x, clock.y, 235, clock.y, 235, 350, 400, 350], dClockHigh, canvasColors.purple);
    canvasWire(ctx, [400, 350, 400, 145, 445, 145], dClockHigh, canvasColors.purple);
    canvasWire(ctx, [400, 350, 400, 315, 445, 315], dClockHigh, canvasColors.purple);
    canvasWire(ctx, [555, 127, 605, 127, 605, 182, 650, 182], dInput && dClockHigh, canvasColors.teal);
    canvasWire(ctx, [555, 290, 605, 290, 605, 252, 650, 252], !dInput && dClockHigh, canvasColors.orange);
    canvasWire(ctx, [780, 182, 825, 182], dQ, canvasColors.red);
    canvasWire(ctx, [780, 252, 825, 252], !dQ, canvasColors.blue);
    canvasLamp(ctx, 855, 182, dQ, "Q"); canvasLamp(ctx, 855, 252, !dQ, "Q̅");
  }

  function drawMuxCanvas() {
    if (!muxCanvas) return; const ctx = canvasContext(muxCanvas); if (!ctx) return;
    const output = muxControl ? muxInputOne : muxInputTwo;
    canvasHeader(ctx, "Multiplexer 2 para 1", "Controle = 1 seleciona Entrada 1; Controle = 0 seleciona Entrada 2");
    const one = canvasButton(ctx, 35, 92, 155, "Entrada 1", muxInputOne, canvasColors.teal, muxInputOne ? "1" : "0");
    const control = canvasButton(ctx, 35, 190, 155, "Controle", muxControl, canvasColors.purple, muxControl ? "1" : "0");
    const two = canvasButton(ctx, 35, 288, 155, "Entrada 2", muxInputTwo, canvasColors.orange, muxInputTwo ? "1" : "0");
    canvasBlock(ctx, 365, 93, 110, 62, "AND", muxInputOne && muxControl, "Entrada 1");
    canvasBlock(ctx, 255, 240, 88, 60, "NOT", !muxControl, "Controle");
    canvasBlock(ctx, 365, 265, 110, 62, "AND", muxInputTwo && !muxControl, "Entrada 2");
    canvasBlock(ctx, 640, 170, 125, 90, "OR", output, "Saída");
    canvasWire(ctx, [one.x, one.y, 365, one.y], muxInputOne, canvasColors.teal);
    canvasWire(ctx, [two.x, two.y, 365, two.y], muxInputTwo, canvasColors.orange);
    // O controle se divide depois de um único trecho: um ramo alimenta o AND
    // superior e o outro passa pelo inversor antes do AND inferior.
    canvasWire(ctx, [control.x, control.y, 235, control.y], muxControl, canvasColors.purple);
    canvasWire(ctx, [235, control.y, 300, control.y, 300, 145, 365, 145], muxControl, canvasColors.purple);
    canvasWire(ctx, [235, control.y, 235, 270, 255, 270], muxControl, canvasColors.purple);
    
    canvasWire(ctx, [343, 270, 355, 270, 355, 296, 365, 296], !muxControl, canvasColors.blue);
    
    canvasWire(ctx, [475, 124, 580, 124, 580, 195, 640, 195], muxInputOne && muxControl, canvasColors.teal);
    canvasWire(ctx, [475, 296, 580, 296, 580, 235, 640, 235], muxInputTwo && !muxControl, canvasColors.orange);
    canvasWire(ctx, [765, 215, 830, 215], output, canvasColors.red);
    canvasLamp(ctx, 865, 215, output, "Saída");
  }

  function drawMemoryCanvas() {
    if (!memoryCanvas) return; const ctx = canvasContext(memoryCanvas); if (!ctx) return;
    const address = memoryAddressBits.map((bit) => bit ? "1" : "0").join("");
    canvasHeader(ctx, "Memória endereçável de 4 palavras", memoryActivity);
    canvasText(ctx, "Dados de entrada", 120, 82, 13, canvasColors.muted);
    memoryInputBits.forEach((bit, index) => canvasButton(ctx, 35 + index * 40, 102, 34, `D${3 - index}`, bit, canvasColors.teal, bit ? "1" : "0"));
    canvasBlock(ctx, 250, 85, 155, 80, "BARRAMENTO", memoryInputBits.some(Boolean), formatBits(memoryInputBits));
    memoryInputBits.forEach((bit, index) => {
      const outputX = 69 + index * 40;
      const laneY = 112 + index * 17;
      canvasWire(ctx, [outputX, 129, outputX + 12, 129, outputX + 12, laneY, 250, laneY], bit, canvasColors.teal);
    });

    canvasText(ctx, "Endereço", 100, 195, 13, canvasColors.muted);
    const addressOne = canvasButton(ctx, 35, 210, 64, "A1", memoryAddressBits[0], canvasColors.blue, memoryAddressBits[0] ? "1" : "0");
    const addressZero = canvasButton(ctx, 107, 210, 64, "A0", memoryAddressBits[1], canvasColors.blue, memoryAddressBits[1] ? "1" : "0");
    canvasBlock(ctx, 450, 200, 150, 70, "SELEÇÃO", true, `endereço ${address}`);
    // As duas linhas de endereço percorrem faixas separadas acima do controle.
    canvasWire(ctx, [addressOne.x, addressOne.y, addressOne.x, 180, 450, 180, 450, 220], memoryAddressBits[0], canvasColors.blue);
    canvasWire(ctx, [addressZero.x, addressZero.y, addressZero.x, 190, 435, 190, 435, 250, 450, 250], memoryAddressBits[1], canvasColors.blue);

    const mode = canvasButton(ctx, 35, 300, 150, memoryWriteMode ? "Escrita" : "Leitura", memoryWriteMode, canvasColors.pink, memoryWriteMode ? "1" : "0");
    const clock = canvasButton(ctx, 35, 370, 150, "Clock", memoryClockHigh, canvasColors.purple, memoryClockHigh ? "pulso" : "0");
    canvasBlock(ctx, 250, 225, 155, 90, "CONTROLE", memoryWriteMode, memoryWriteMode ? "escrever" : "ler");
    canvasWire(ctx, [327, 165, 327, 225], memoryInputBits.some(Boolean), canvasColors.teal);
    canvasWire(ctx, [mode.x, mode.y, 220, mode.y, 220, 250, 250, 250], memoryWriteMode, canvasColors.pink);
    canvasWire(ctx, [clock.x, clock.y, 235, clock.y, 235, 285, 250, 285], memoryClockHigh, canvasColors.purple);

    memorySlots.forEach((slot, index) => {
      const y = 80 + index * 75;
      const selected = memoryAddressIndex === index;
      canvasBlock(ctx, 645, y, 145, 54, `Flip-Flop ${index}`, selected, formatBits(slot));
      // Somente a palavra selecionada recebe as três trilhas; isso evita uma
      // malha de cabos sobrepostos e deixa o caminho de leitura/escrita visível.
      if (selected) {
        canvasWire(ctx, [600, 235, 620, 235, 620, y + 14, 645, y + 14], true, canvasColors.blue);
        canvasWire(ctx, [405, 270, 570, 270, 570, y + 38, 645, y + 38], memoryWriteMode && memoryClockHigh, canvasColors.pink);
        canvasWire(ctx, [790, y + 27, 810, y + 27, 810, 230, 830, 230], slot.some(Boolean), canvasColors.red);
      }
    });
    canvasBlock(ctx, 830, 190, 115, 80, "MUX DE SAÍDA", selectedMemoryBits.some(Boolean), `endereço ${address}`);
    canvasWire(ctx, [945, 230, 950, 230], selectedMemoryBits.some(Boolean), canvasColors.red);
    canvasLamp(ctx, 972, 230, selectedMemoryBits.some(Boolean), formatBits(selectedMemoryBits));
    canvasText(ctx, `${bitsToDecimal(selectedMemoryBits)} decimal`, 972, 285, 12, canvasColors.muted);
  }

  function drawCanvases() { drawSrCanvas(); drawDCanvas(); drawMuxCanvas(); drawMemoryCanvas(); }

  $effect(() => {
    drawCanvases();
  });
</script>

<p>Flip Flops é um nome bem engraçado para um circuito, uma pena que de engraçado eles não tem nada. Flip Flops são circuitos capazes de armazenar um estado binário, diferente dos circuitos que vimos até agora que recebiam sinais de entrada e retornam algum valor de saída instantaneamente, os flip flops tem um objetivo diferente, eles servem para armazenar um estado binário, que pode ser lido e escrito, neste capítulo vamos finalmente dar memoria para nossos circuitos lógicos! Uma pena que eles vão ter que lidar com o peso de suas ações passadas.</p>

<p>Para criar um flip flop precisamos apenas de 2 NAND GATEs, vamos ver seu diagrama:</p>

<figure class="elemento sr-elemento">
  <div class="canvas-board sr-board">
    <canvas bind:this={srCanvas} class="flip-canvas" width="840" height="380" aria-hidden="true"></canvas>
    <button class="canvas-hit sr-set-hit" type="button" aria-label="Ativar Set" aria-pressed={srLastAction === "Set"} onclick={() => setSrState(true)}></button>
    <button class="canvas-hit sr-reset-hit" type="button" aria-label="Ativar Reset" aria-pressed={srLastAction === "Reset"} onclick={() => setSrState(false)}></button>
  </div>
  <p class="diagram-hint">Clique em Set ou Reset. O estado continua na saída até o próximo comando.</p>
</figure>

<p>Temos 2 entradas, a R e S, elas vem do inglês Reset, e Set, ou Reset, e Definir, quando entramos com um sinal positivo na entrada Set, a nossa saída vai ser positiva, e permanecer positiva até que uma carga seja inserida na porta Reset, quando isso acontece a saída de energia desliga, vale lembrar que, quando falo da “saída” me refiro à saída padrão e não ao seu complemento, que nada mais é que um termo chique para contrario, ou seja, o complemento da saída é o valor contrário da saída, se a saída é positiva, o complemento é desligado, se o complemento é positivo, a saída é desligada, é impossível ter ambos positivos.</p>

<p>Mas não se preocupe com complementos, eles não são relevantes para a finalidade à qual vamos usar os circuitos de flip flop, para nosso curso estamos mais interessados na capacidade de manter o valor da sua saída o mesmo sem nenhuma entrada, isso é, com um único pulso na entrada set ou reset, o flip flop alterna de estado e o mantém até o próximo pulso, ele lembra o que foi definido, diferente de mim que já esquecido do que eu tava falando.</p>

<p>Agora vamos ver sobre os D-Flip Flops, ou Data Flip Flops, o seu princípio é simples, vamos ter 1 entrada de dados, positiva ou negativa, e um valor chamado Clock, ou relógio em português.</p>

<figure class="elemento d-elemento">
  <div class="canvas-board d-board">
    <canvas bind:this={dCanvas} class="flip-canvas" width="900" height="390" aria-hidden="true"></canvas>
    <button class="canvas-hit d-input-hit" type="button" aria-label="Alternar entrada D" aria-pressed={dInput} onclick={() => (dInput = !dInput)}></button>
    <button class="canvas-hit d-clock-hit" type="button" aria-label="Enviar pulso de Clock" onclick={pulseDClock}></button>
  </div>
  <p class="diagram-hint">Mude D e envie um pulso de Clock: somente o pulso altera o valor armazenado em Q.</p>
</figure>

<p>Como vimos anteriormente um flip flop tinha uma entrada para definir seu valor como positivo, e uma entrada reset para definir seu valor como negativo, nos data flip flops a ideia é diferente vamos ter uma única entrada de dados, e utilizando um NOT GATE conseguimos definir que se essa entrada de dados for positiva, a saída é positiva, mas se ela for negativa, a saída deve ser negativa, por fim, para garantir que independente do bit que queiramos salvar, seja 0 ou 1, vamos ter outra entrada, a entrada Clock, ela controla quando vamos de fato salvar esse dado, se clock for negativo, a saída do flip flop se mantém, independente de qual seja a entrada, mas se clock for positivo, qualquer valor, seja positivo ou negativo que enviarmos para o flip flop será armazenado e passará a ser a saída dali em diante.</p>

<p>A Partir disso, podemos conectar 8 flip flops em conjunto para criar uma memória de 1 byte de tamanho, como a nossa entrada clock serve apenas para controlar quando queremos ler e quando queremos escrever, podemos ligar um único fio para todos os clocks dos flips flops ao mesmo tempo, assim vamos ter 9 fios de entrada, 1 para cada flip flop, e o nosso clock global.</p>

<figure class="elemento byte-elemento">
  <div class="diagram-heading">
    <span class="diagram-kicker">Memória de 1 byte</span>
    <span class="state-readout">Entrada: {formatBits(byteInputBits)} · Armazenado: {formatBits(byteStoredBits)}</span>
  </div>
  <div class="byte-toolbar">
    <span>Altere qualquer entrada de dados e depois acione o clock global.</span>
    <button class:active={byteClockHigh} onclick={pulseByteClock}>Clock global</button>
  </div>
  <div class="byte-memory" aria-label="Memória de oito D Flip-Flops">
    <div class:active={byteClockHigh} class="byte-clock-bus">
      <span>Clock global</span>
    </div>
    <div class="byte-grid">
      {#each byteInputBits as bit, index}
        <div class="byte-row">
          <button
            class:active={bit}
            aria-label={"Entrada de dados " + (7 - index) + ": " + (bit ? "1" : "0")}
            aria-pressed={bit}
            onclick={() => (byteInputBits = toggleBit(byteInputBits, index))}
          >
            D{7 - index}: {bit ? "1" : "0"}
          </button>
          <span class:active={bit} class="byte-data-wire"></span>
          <div class:active={byteClockHigh} class="byte-clock-tap"></div>
          <div class:active={byteStoredBits[index]} class="byte-flip-flop">
            <strong>D Flip-Flop {7 - index}</strong>
            <span>Q = {byteStoredBits[index] ? "1" : "0"}</span>
          </div>
          <span class:active={byteStoredBits[index]} class="byte-output-light"></span>
        </div>
      {/each}
    </div>
  </div>
</figure>

<p>Vamos definir 1 byte, ou 8 bits como um tamanho padrão de memória para simplificar esse curso, mas convenhamos que um circuito que armazena 1 dado é meio inútil né,  se pudéssemos armazenar vários dados isso sim, seria bem mais interessante.</p>

<p>Para isso, vamos introduzir o conceito de endereços de memória, diferente do que vimos até agora, onde cada conceito novo era um circuito eletrônico, esse novo conceito é mais abstrato, mas não é difícil de entender quando usamos a metáfora certa, para entender o conceito de endereços de memória, vamos imaginar uma rua de uma vizinhança qualquer.</p>

<figure>
  <img src="/ComputeNow/images/chapter-content/algoritmos/image1.jpg" alt="Uma rua com casas de diferentes cores, cada casa tem um número e uma garagem, algumas garagens estão abertas e outras fechadas, algumas casas tem carros na garagem e outras não.">
  <figcaption>Fonte: <a href="https://pixabay.com/users/ponynyc-17558807/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5428045">Anthony Lopez</a> from <a href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=5428045">Pixabay</a></figcaption>
</figure>

<p>Em uma rua, cada casa possuí um número, possuí um endereço, vamos aplicar esse mesmo conceito no nosso circuito elétrico, vamos por conjuntos de 8 d flip flops, cada um deles vai ser um endereço, uma casa que armazena 1 byte de memória, e vamos ter várias casas dessas, umas 4 por agora já está de bom tamanho, todas elas vão receber nosso sinal global de clock, no nosso exemplo é como se todas as garagens das casas abrissem e fechassem ao mesmo tempo, e, peraí, se todas as portas da garagem abrem ao mesmo tempo, como a gente impede que o carro errado entre na casa errada?</p>

<p>Bom vamos precisar colocar um pouco mais de controle nessa história, temos muito trabalho a fazer aqui ainda, mas vamos por partes para não me deixar triste, nosso primeiro passo aqui é entender como um multiplexer funciona. Multiplexer? o que é isso, sua função é bem simples, você já viu isso antes, você conecta um videogame, um aparelho de blu-ray ou dvd na sua tv, e consegue no controle trocar entre as entradas, isso é um multiplexer, você dá várias entradas e com um sinal de controle você consegue trocar entre qual das entradas você quer que saia na saída, seu circuito é assim:</p>

<figure class="elemento mux-elemento">
  <div class="canvas-board mux-board">
    <canvas bind:this={muxCanvas} class="flip-canvas" width="930" height="400" aria-hidden="true"></canvas>
    <button class="canvas-hit mux-one-hit" type="button" aria-label="Alternar entrada 1" aria-pressed={muxInputOne} onclick={() => (muxInputOne = !muxInputOne)}></button>
    <button class="canvas-hit mux-control-hit" type="button" aria-label="Alternar sinal de controle" aria-pressed={muxControl} onclick={() => (muxControl = !muxControl)}></button>
    <button class="canvas-hit mux-two-hit" type="button" aria-label="Alternar entrada 2" aria-pressed={muxInputTwo} onclick={() => (muxInputTwo = !muxInputTwo)}></button>
  </div>
</figure>

<p>O princípio é que usando um AND GATE entre a entrada e o sinal de controle, o sinal de controle passa a controlar se o sinal de entrada passa ou não, fazemos isso para a entrada 1 e invertemos o sinal de controle na entrada 2, assim o sinal positivo aciona a entrada 1 e desliga a entrada 2, e o sinal desligado ativa a entrada 2 e desliga a entrada 1, por fim usamos um OR GATE para juntar a saída dos AND GATEs numa única saída.</p>

<p>Multiplexers são componentes simples mas vitais no mundo da computação já que permitem que enviemos várias entradas para uma unica saída através de um sinal de controle, um dos seus usos comuns além de dispositivos de mídia como televisões e monitores, é em aplicativos, onde há um limite de banda, então multiplexers são usados para enviar diferentes sinais de forma alternada.</p>

<p>Vamos usar um multiplex de uma forma meio inusitada no nosso circuito, vamos conectar nossa entrada de dados na entrada 1, e o valor atual do nosso flip flop na entrada 2, dessa forma o sinal de controle alterna entre enviar para o flip flop, uma entrada de dados nova ou o mesmo estado que já estava, vamos chamar o sinal de controle de sinal de escrita, já que quando ativo, qualquer dado que passamos é escrito no estado do flip flop, caso contrário, nada muda, o motivo de fazermos assim invés de cortar o sinal do clock usando um AND GATE é por motivos de sincronia, quando fazemos usando multiplexes todos os multiplexes e flip flops atuam ao mesmo tempo, porém, isso consome mais energia, se cortarmos o sinal de clock alguns flip flops trabalham enquanto outros não, e isso pode causar problemas de sincronização quando atingimos velocidades de operação absurdamente altas.</p>

<p>Então vamos re-analisar o cenário atual, temos uma entrada de dados com a informação que desejamos escrever na memória, temos uma entrada com o endereço daquela memória, uma entrada que especifica se é uma operação de leitura ou escrita, e por fim, um sinal de clock. Se a operação for de leitura vamos utilizar somente as entradas de endereço de memória e nosso controle leitura escrita, como flip flops sempre estão dando suas saídas de forma constante, não é necessário um pulso do clock, por fim na saída disso tudo vamos ter mais multiplexes para escolher qual dos flip flops vamos estar lendo dados, como todos vão estar sempre dando suas saídas, precisamos filtrar esses dados para que somente o flip flop que escolhemos no endereço tenha seus dados na saída.</p>

<figure class="elemento memory-interface-elemento">
  <div class="canvas-board memory-board">
    <canvas bind:this={memoryCanvas} class="flip-canvas memory-canvas" width="1000" height="460" aria-hidden="true"></canvas>
    {#each memoryInputBits as bit, index}
      <button class="canvas-hit memory-data-hit" style={`--hit-index: ${index}`} type="button" aria-label={`Alternar dado D${3 - index}`} aria-pressed={bit} onclick={() => (memoryInputBits = toggleBit(memoryInputBits, index))}></button>
    {/each}
    {#each memoryAddressBits as bit, index}
      <button class="canvas-hit memory-address-hit" style={`--hit-index: ${index}`} type="button" aria-label={`Alternar endereço A${1 - index}`} aria-pressed={bit} onclick={() => (memoryAddressBits = toggleBit(memoryAddressBits, index))}></button>
    {/each}
    <button class="canvas-hit memory-mode-hit" type="button" aria-label="Alternar entre leitura e escrita" aria-pressed={memoryWriteMode} onclick={() => (memoryWriteMode = !memoryWriteMode)}></button>
    <button class="canvas-hit memory-clock-hit" type="button" aria-label="Enviar pulso de Clock para memória" onclick={pulseMemoryClock}></button>
  </div>
</figure>

<p>Pode não parecer, mas essa é a base para todos os componentes de memória de um computador, dos registradores dentro da CPU até a memória RAM, e com isso fora do caminho estamos cada vez mais perto de chegarmos a um sistema computacional de uso genérico. Agora que sabemos como a memória funciona, vamos ver como esse tal de clock que tanto vimos funciona e porque ele existe.</p>

<style>
  .elemento {
    margin: 1.75rem 0;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 0.875rem;
    background: var(--surface-soft);
  }

  .canvas-board {
    position: relative;
  }

  .flip-canvas {
    display: block;
    width: 100%;
    height: auto;
    background: #122033;
    pointer-events: none;
    user-select: none;
  }

  .diagram-hint {
    margin: 0;
    padding: 0.65rem 1rem 0.9rem;
    color: var(--muted);
    font-size: 0.85rem;
  }

  .diagram-heading,
  .byte-toolbar {
    display: flex;
    gap: 0.7rem;
    align-items: center;
    justify-content: space-between;
    padding: 0.85rem 1rem;
  }

  .diagram-heading {
    border-bottom: 1px solid var(--border);
    background: color-mix(in srgb, var(--surface) 75%, transparent);
  }

  .diagram-kicker {
    color: var(--accent-3);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .state-readout {
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.82rem;
    text-align: right;
  }

  button {
    border: 1px solid var(--border);
    border-radius: 0.6rem;
    padding: 0.5rem 0.7rem;
    background: var(--surface);
    color: var(--text);
    font: inherit;
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
  }

  button:hover { border-color: var(--accent-3); }
  button.active { border-color: var(--accent); background: var(--accent); color: #092624; box-shadow: 0 0 0.85rem color-mix(in srgb, var(--accent) 52%, transparent); }

  /* Botões semânticos sobre o desenho: a área clicável coincide com cada
     interruptor renderizado no canvas, inclusive em telas menores. */
  .canvas-hit {
    position: absolute;
    z-index: 1;
    display: block;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0.6rem;
    background: transparent;
    box-shadow: none;
    color: transparent;
    cursor: pointer;
    touch-action: manipulation;
  }

  .canvas-hit:hover { border: 0; background: rgb(255 255 255 / 8%); }
  .canvas-hit:focus-visible { outline: 3px solid #f8fafc; outline-offset: -3px; background: rgb(255 255 255 / 12%); }

  .sr-set-hit { top: 27.6316%; left: 4.7619%; width: 17.8571%; height: 14.2105%; }
  .sr-reset-hit { top: 64.4737%; left: 4.7619%; width: 17.8571%; height: 14.2105%; }

  .d-input-hit { top: 28.2051%; left: 3.8889%; width: 17.7778%; height: 13.8462%; }
  /* Os clocks têm uma margem de toque extra, sem alcançar outro controle. */
  .d-clock-hit { top: 69.2308%; left: 2.7778%; width: 20%; height: 18.9744%; }

  .mux-one-hit { top: 23%; left: 3.7634%; width: 16.6667%; height: 13.5%; }
  .mux-control-hit { top: 47.5%; left: 3.7634%; width: 16.6667%; height: 13.5%; }
  .mux-two-hit { top: 72%; left: 3.7634%; width: 16.6667%; height: 13.5%; }

  .memory-data-hit {
    top: 22.1739%;
    left: calc(3.5% + var(--hit-index) * 4%);
    width: 3.4%;
    height: 11.7391%;
  }

  .memory-address-hit {
    top: 45.6522%;
    left: calc(3.5% + var(--hit-index) * 7.2%);
    width: 6.4%;
    height: 11.7391%;
  }

  .memory-mode-hit { top: 65.2174%; left: 3.5%; width: 15%; height: 11.7391%; }
  .memory-clock-hit { top: 78.2609%; left: 2.5%; width: 17%; height: 16.087%; }

  .byte-toolbar {
    flex-wrap: wrap;
    color: var(--muted);
    font-size: 0.88rem;
  }

  .byte-memory {
    position: relative;
    overflow-x: auto;
    padding: 1rem;
    background: var(--surface);
  }

  .byte-clock-bus {
    display: flex;
    width: 70%;
    margin-left: 25%;
    margin-bottom: 1rem;
    height: 1.3rem;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: color-mix(in srgb, var(--muted) 36%, transparent);
    color: var(--surface);
    font-size: 0.7rem;
    font-weight: 800;
  }

  .byte-clock-bus.active { background: #8b5cf6; box-shadow: 0 0 0.85rem #8b5cf6; }
  .byte-grid { display: grid; min-width: 700px; gap: 0.45rem; }
  .byte-row { display: grid; grid-template-columns: 115px 60px 22px minmax(210px, 1fr) 22px; gap: 0.45rem; align-items: center; }
  .byte-row button { text-align: left; }
  .byte-data-wire { height: 0.45rem; border-radius: 999px; background: color-mix(in srgb, var(--muted) 35%, transparent); }
  .byte-data-wire.active { background: #22c5b3; box-shadow: 0 0 0.65rem #22c5b3; }
  .byte-clock-tap { height: 1.15rem; border-right: 4px solid color-mix(in srgb, var(--muted) 45%, transparent); }
  .byte-clock-tap.active { border-color: #8b5cf6; box-shadow: 3px 0 0.55rem color-mix(in srgb, #8b5cf6 80%, transparent); }

  .byte-flip-flop {
    display: flex;
    min-height: 2.65rem;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.7rem;
    border: 2px solid var(--border);
    border-radius: 0.55rem;
    background: var(--surface-soft);
    color: var(--muted);
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
  }

  .byte-flip-flop strong { color: var(--text); }
  .byte-flip-flop.active { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 21%, var(--surface)); }
  .byte-output-light { width: 1rem; height: 1rem; border: 2px solid var(--border); border-radius: 50%; background: var(--surface-soft); }
  .byte-output-light.active { border-color: #fecaca; background: #ef4444; box-shadow: 0 0 0.8rem #ef4444; }

  img { display: block; max-width: 100%; height: auto; margin: 1.75rem auto; border-radius: 0.875rem; }

  @media (max-width: 620px) {
    .diagram-heading, .byte-toolbar { align-items: flex-start; flex-direction: column; }
    .state-readout { text-align: left; }
    .byte-clock-bus { margin-left: 0; }
  }
</style>
