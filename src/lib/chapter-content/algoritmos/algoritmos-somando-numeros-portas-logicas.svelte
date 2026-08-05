<script lang="ts">
  let halfA = $state(false);
  let halfB = $state(false);
  let stepA = $state(false);
  let stepB = $state(false);
  let stepCarry = $state(false);
  let fourA = $state(7);
  let fourB = $state(4);
  let fourCarry = $state(false);
  let eightA = $state(7);
  let eightB = $state(4);
  let eightCarry = $state(false);
  let aluA = $state(5);
  let aluB = $state(2);
  let opcode = $state(4);

  const binary = (value: number, width: number) =>
    Math.max(0, value).toString(2).padStart(width, "0").slice(-width);
  const change = (value: number, delta: number, limit: number) =>
    (value + delta + limit) % limit;
  const opcodes: Array<[number, string]> = [[1, "Soma"], [2, "Subtração"], [4, "Multiplicação"], [8, "Divisão"]];
  const operationResult = (operation: number) =>
    operation === 1 ? aluA + aluB
      : operation === 2 ? aluA - aluB
        : operation === 4 ? aluA * aluB
          : aluB === 0 ? 0 : Math.floor(aluA / aluB);

  let halfSum = $derived(Number(halfA !== halfB));
  let halfCarry = $derived(Number(halfA && halfB));
  let firstXor = $derived(stepA !== stepB);
  let fullSum = $derived(Number(firstXor !== stepCarry));
  let carryAB = $derived(stepA && stepB);
  let carryInput = $derived(firstXor && stepCarry);
  let fullCarry = $derived(Number(carryAB || carryInput));
  let fourTotal = $derived(fourA + fourB + Number(fourCarry));
  let eightTotal = $derived(eightA + eightB + Number(eightCarry));
  let aluResult = $derived(operationResult(opcode));

  let halfCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let stageOneCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let stageTwoCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let stageAndOneCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let stageAndTwoCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let stageFinalCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let fourBitCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let eightBitCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let aluOverviewCanvas = $state<HTMLCanvasElement | undefined>(undefined);
  let aluSelectCanvas = $state<HTMLCanvasElement | undefined>(undefined);

  const colors = {
    board: "#122033", inactive: "rgba(100, 123, 153, .43)", text: "#edf4ff", muted: "#aab8cc",
    blue: "#38bdf8", green: "#34d399", orange: "#fb923c", purple: "#a78bfa",
    cyan: "#22d3ee", magenta: "#f472b6", yellow: "#fde047", red: "#fb7185",
    teal: "#2dd4bf", panel: "#203047", dark: "#111827"
  };

  function board(canvas: HTMLCanvasElement) {
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

  function label(ctx: CanvasRenderingContext2D, value: string | number, x: number, y: number, size = 14, color = colors.text, align: CanvasTextAlign = "center") {
    ctx.fillStyle = color;
    ctx.font = `600 ${size}px system-ui, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = "middle";
    ctx.fillText(String(value), x, y);
  }

  function header(ctx: CanvasRenderingContext2D, title: string, subtitle: string) {
    label(ctx, title, ctx.canvas.width / 2, 28, 20);
    label(ctx, subtitle, ctx.canvas.width / 2, 51, 12, colors.muted);
  }

  function wire(ctx: CanvasRenderingContext2D, points: number[], active: boolean, color: string, width = 6) {
    ctx.beginPath();
    ctx.moveTo(points[0], points[1]);
    for (let index = 2; index < points.length; index += 2) ctx.lineTo(points[index], points[index + 1]);
    ctx.strokeStyle = active ? color : colors.inactive;
    ctx.lineWidth = active ? width : 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (active) { ctx.shadowColor = color; ctx.shadowBlur = 10; }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function control(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, title: string, value: string | number | undefined, active: boolean, color: string) {
    ctx.fillStyle = active ? color : "#1f2d43";
    ctx.strokeStyle = active ? "#f8fafc" : "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, 54, 10);
    ctx.fill();
    ctx.stroke();
    label(ctx, title, x + width / 2, value === undefined ? y + 27 : y + 19, 14);
    if (value !== undefined) label(ctx, value, x + width / 2, y + 39, 12, active ? "#fff" : colors.muted);
    return { x: x + width, y: y + 27 };
  }

  function gate(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, title: string, active: boolean, subtitle?: string) {
    ctx.fillStyle = active ? "#1d4f58" : colors.panel;
    ctx.strokeStyle = active ? colors.teal : "#73839a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 13);
    ctx.fill();
    ctx.stroke();
    label(ctx, title, x + width / 2, y + height / 2 - (subtitle ? 9 : 0), 15);
    if (subtitle) label(ctx, subtitle, x + width / 2, y + height / 2 + 14, 11, colors.muted);
  }

  function panel(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, value: string | number, title: string, active: boolean, color: string) {
    ctx.fillStyle = active ? "#1b3d4c" : "#1a2739";
    ctx.strokeStyle = active ? color : "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 12);
    ctx.fill();
    ctx.stroke();
    label(ctx, value, x + width / 2, y + height / 2 - 10, 22, active ? "#f8fafc" : colors.text);
    label(ctx, title, x + width / 2, y + height / 2 + 18, 11, colors.muted);
  }

  function lamp(ctx: CanvasRenderingContext2D, x: number, y: number, active: boolean, title: string, value = "") {
    ctx.fillStyle = active ? colors.yellow : "#334155";
    if (active) { ctx.shadowColor = colors.yellow; ctx.shadowBlur = 18; }
    ctx.beginPath(); ctx.arc(x, y, 24, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    if (value) label(ctx, value, x, y, 14, active ? "#713f12" : colors.muted);
    label(ctx, title, x, y + 43, 12, colors.muted);
  }

  function stageControls(ctx: CanvasRenderingContext2D) {
    const a = control(ctx, 35, 85, 160, "A", Number(stepA), stepA, colors.blue);
    const b = control(ctx, 35, 175, 160, "B", Number(stepB), stepB, colors.green);
    const carry = control(ctx, 35, 265, 160, "Vem Um", Number(stepCarry), stepCarry, colors.orange);
    return { a, b, carry };
  }

  function drawHalfAdder() {
    if (!halfCanvas) return;
    const ctx = board(halfCanvas); if (!ctx) return;
    header(ctx, "Half Adder", "A soma sai em Resultado; o excesso segue em Vai um");
    const a = control(ctx, 40, 100, 150, "Entrada A", Number(halfA), halfA, colors.blue);
    const b = control(ctx, 40, 230, 150, "Entrada B", Number(halfB), halfB, colors.green);
    gate(ctx, 370, 95, 130, 74, "XOR", Boolean(halfSum), "resultado");
    gate(ctx, 370, 235, 130, 74, "AND", Boolean(halfCarry), "vai um");
    wire(ctx, [a.x, a.y, 370, a.y], halfA, colors.blue);
    wire(ctx, [b.x, b.y, 240, b.y, 240, 147, 370, 147], halfB, colors.green);
    wire(ctx, [a.x, a.y, 340, a.y, 340, 252, 370, 252], halfA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 287, 370, 287], halfB, colors.green);
    wire(ctx, [500, 132, 720, 132], Boolean(halfSum), colors.cyan);
    wire(ctx, [500, 272, 740, 272], Boolean(halfCarry), colors.red);
    panel(ctx, 760, 87, 130, 92, halfSum, "Resultado", Boolean(halfSum), colors.cyan);
    lamp(ctx, 800, 272, Boolean(halfCarry), "Vai um", String(halfCarry));
  }

  function drawStageOne() {
    if (!stageOneCanvas) return;
    const ctx = board(stageOneCanvas); if (!ctx) return;
    header(ctx, "Somador completo · etapa 1", "Primeiro XOR: calcula A + B");
    const { a, b, carry } = stageControls(ctx);
    gate(ctx, 360, 130, 140, 80, "XOR", firstXor, "A + B");
    wire(ctx, [a.x, a.y, 265, a.y, 265, 150, 360, 150], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 300, b.y, 300, 190, 360, 190], stepB, colors.green);
    wire(ctx, [500, 170, 770, 170], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 240, carry.y, 240, 395, 690, 395], stepCarry, colors.orange);
    panel(ctx, 810, 125, 125, 90, Number(firstXor), "A XOR B", firstXor, colors.purple);
    label(ctx, "Vem Um segue para a próxima etapa", 700, 395, 12, colors.muted, "left");
  }

  function drawStageTwo() {
    if (!stageTwoCanvas) return;
    const ctx = board(stageTwoCanvas); if (!ctx) return;
    header(ctx, "Somador completo · etapa 2", "O segundo XOR adiciona o Vem Um");
    const { a, b, carry } = stageControls(ctx);
    gate(ctx, 310, 130, 140, 80, "XOR", firstXor, "A + B");
    gate(ctx, 570, 130, 140, 80, "XOR", Boolean(fullSum), "resultado");
    wire(ctx, [a.x, a.y, 255, a.y, 255, 150, 310, 150], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 190, 310, 190], stepB, colors.green);
    wire(ctx, [450, 170, 520, 170, 520, 150, 570, 150], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 235, carry.y, 540, carry.y, 540, 190, 570, 190], stepCarry, colors.orange);
    wire(ctx, [710, 170, 800, 170], Boolean(fullSum), colors.cyan);
    panel(ctx, 830, 125, 125, 90, fullSum, "Resultado", Boolean(fullSum), colors.cyan);
  }

  function drawStageAndOne() {
    if (!stageAndOneCanvas) return;
    const ctx = board(stageAndOneCanvas); if (!ctx) return;
    header(ctx, "Somador completo · etapa 3", "O primeiro AND detecta A e B positivos");
    const { a, b, carry } = stageControls(ctx);
    gate(ctx, 310, 120, 135, 76, "XOR", firstXor, "A + B");
    gate(ctx, 555, 120, 135, 76, "XOR", Boolean(fullSum), "resultado");
    gate(ctx, 555, 330, 135, 76, "AND", carryAB, "A e B");
    wire(ctx, [a.x, a.y, 255, a.y, 255, 140, 310, 140], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 178, 310, 178], stepB, colors.green);
    wire(ctx, [445, 140, 555, 140], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 525, 290, 525, 178, 555, 178], stepCarry, colors.orange);
    wire(ctx, [690, 158, 790, 158], Boolean(fullSum), colors.cyan);
    wire(ctx, [a.x, a.y, 250, a.y, 250, 350, 555, 350], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 225, b.y, 225, 386, 555, 386], stepB, colors.green);
    wire(ctx, [690, 368, 810, 368], carryAB, colors.magenta);
    panel(ctx, 820, 113, 120, 90, fullSum, "Resultado", Boolean(fullSum), colors.cyan);
    lamp(ctx, 850, 368, carryAB, "A e B", String(Number(carryAB)));
  }

  function drawStageAndTwo() {
    if (!stageAndTwoCanvas) return;
    const ctx = board(stageAndTwoCanvas); if (!ctx) return;
    header(ctx, "Somador completo · etapa 4", "Dois ANDs calculam os possíveis Vai um");
    const { a, b, carry } = stageControls(ctx);
    gate(ctx, 310, 120, 135, 76, "XOR", firstXor, "A + B");
    gate(ctx, 555, 120, 135, 76, "XOR", Boolean(fullSum), "resultado");
    gate(ctx, 555, 300, 135, 76, "AND", carryAB, "A e B");
    gate(ctx, 555, 420, 135, 76, "AND", carryInput, "XOR e vem um");
    wire(ctx, [a.x, a.y, 255, a.y, 255, 140, 310, 140], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 178, 310, 178], stepB, colors.green);
    wire(ctx, [445, 158, 505, 158, 505, 140, 555, 140], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 230, carry.y, 230, 280, 525, 280, 525, 178, 555, 178], stepCarry, colors.orange);
    wire(ctx, [690, 158, 790, 158], Boolean(fullSum), colors.cyan);
    wire(ctx, [a.x, a.y, 255, a.y, 255, 320, 525, 320, 555, 320], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 356, 555, 356], stepB, colors.green);
    wire(ctx, [445, 158, 485, 158, 485, 440, 555, 440], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 230, carry.y, 230, 476, 555, 476], stepCarry, colors.orange);
    wire(ctx, [690, 338, 810, 338], carryAB, colors.magenta);
    wire(ctx, [690, 458, 810, 458], carryInput, colors.yellow);
    panel(ctx, 820, 113, 120, 90, fullSum, "Resultado", Boolean(fullSum), colors.cyan);
    lamp(ctx, 850, 338, carryAB, "A e B", String(Number(carryAB)));
    lamp(ctx, 850, 458, carryInput, "XOR e vem um", String(Number(carryInput)));
  }

  function drawStageFinal() {
    if (!stageFinalCanvas) return;
    const ctx = board(stageFinalCanvas); if (!ctx) return;
    header(ctx, "Somador completo · etapa final", "O OR une os dois caminhos de Vai um");
    const { a, b, carry } = stageControls(ctx);
    gate(ctx, 300, 115, 130, 76, "XOR", firstXor, "A + B");
    gate(ctx, 530, 115, 130, 76, "XOR", Boolean(fullSum), "resultado");
    gate(ctx, 530, 285, 130, 76, "AND", carryAB, "A e B");
    gate(ctx, 530, 405, 130, 76, "AND", carryInput, "XOR e vem um");
    gate(ctx, 760, 335, 120, 86, "OR", Boolean(fullCarry), "vai um");
    wire(ctx, [a.x, a.y, 255, a.y, 255, 140, 300, 140], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 178, 300, 178], stepB, colors.green);
    wire(ctx, [435, 158, 505, 158, 505, 140, 525, 140], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 230, carry.y, 230, 280, 505, 280, 505, 178, 525, 178], stepCarry, colors.orange);
    wire(ctx, [665, 158, 790, 158], Boolean(fullSum), colors.cyan);
    wire(ctx, [a.x, a.y, 255, a.y, 255, 320, 525, 320, 520, 320], stepA, colors.blue);
    wire(ctx, [b.x, b.y, 280, b.y, 280, 350, 530, 350], stepB, colors.green);
    wire(ctx, [445, 158, 485, 158, 485, 440, 530, 440], firstXor, colors.purple);
    wire(ctx, [carry.x, carry.y, 230, carry.y, 230, 476, 530, 476], stepCarry, colors.orange);
    
    wire(ctx, [660, 323, 715, 323, 715, 355, 760, 355], carryAB, colors.magenta);
    wire(ctx, [660, 443, 715, 443, 715, 401, 760, 401], carryInput, colors.yellow);
    wire(ctx, [880, 378, 915, 378], Boolean(fullCarry), colors.red);
    panel(ctx, 770, 105, 120, 90, fullSum, "Resultado", Boolean(fullSum), colors.cyan);
    lamp(ctx, 945, 378, Boolean(fullCarry), "Vai um", String(fullCarry));
  }

  function drawNumberAdjuster(ctx: CanvasRenderingContext2D, x: number, y: number, name: string, value: number, width: number, color: string) {
    control(ctx, x, y, 54, "−", undefined, false, color);
    panel(ctx, x + 66, y - 4, 108, 62, binary(value, width), `${name} = ${value}`, value > 0, color);
    control(ctx, x + 186, y, 54, "+", undefined, false, color);
  }

  function drawBitAdder(ctx: CanvasRenderingContext2D, prefix: string, aValue: number, bValue: number, carryIn: boolean, total: number, blockName: string) {
    drawNumberAdjuster(ctx, 35, 88, "A", aValue, prefix === "4" ? 4 : 8, colors.blue);
    drawNumberAdjuster(ctx, 35, 205, "B", bValue, prefix === "4" ? 4 : 8, colors.green);
    control(ctx, 35, 355, 240, "Carry in", Number(carryIn), carryIn, colors.orange);
    const blockWidth = 115;
    const startX = 300;
    const blockCount = 4;
    const carries = [Number(carryIn)];
    header(ctx, `${prefix}-Bit Adder`, `${aValue} + ${bValue}${carryIn ? " + carry" : ""} = ${total}`);
    wire(ctx, [275, 115, 865, 115], aValue > 0, colors.blue, 5);
    wire(ctx, [275, 232, 865, 232], bValue > 0, colors.green, 5);
    for (let index = 0; index < blockCount; index += 1) {
      const x = startX + index * 145;
      const sourceBit = prefix === "4" ? index : index * 2;
      const aBit = Boolean((aValue >> sourceBit) & 1);
      const bBit = Boolean((bValue >> sourceBit) & 1);
      const amount = Number(aBit) + Number(bBit) + carries[index];
      const sumBit = amount % 2;
      const carryOut = amount > 1 ? 1 : 0;
      carries.push(carryOut);
      gate(ctx, x, 180, blockWidth, 96, blockName, Boolean(sumBit || carryOut), `bit ${sourceBit}`);
      wire(ctx, [x + blockWidth / 2, 115, x + blockWidth / 2, 180], aBit, colors.blue);
      wire(ctx, [x + blockWidth / 2, 232, x + blockWidth / 2, 276], bBit, colors.green);
      if (index === 0) wire(ctx, [275, 382, x, 382, x, 238], carryIn, colors.orange);
      else wire(ctx, [x - 30, 238, x, 238], Boolean(carries[index]), colors.orange);
      if (index < blockCount - 1) wire(ctx, [x + blockWidth, 238, x + 145, 238], Boolean(carryOut), colors.orange);
      label(ctx, sumBit, x + blockWidth / 2, 304, 16, sumBit ? colors.cyan : colors.muted);
      wire(ctx, [x + blockWidth / 2, 276, x + blockWidth / 2, 334], Boolean(sumBit), colors.cyan);
    }
    wire(ctx, [300, 334, 845, 334], total > 0, colors.cyan, 5);
    panel(ctx, 885, 190, 150, 92, binary(total, prefix === "4" ? 5 : 9), `Resultado = ${total}`, total > 0, colors.cyan);
  }

  function drawFourBitAdder() {
    if (!fourBitCanvas) return;
    const ctx = board(fourBitCanvas); if (!ctx) return;
    drawBitAdder(ctx, "4", fourA, fourB, fourCarry, fourTotal, "1-BIT ADDER");
  }

  function drawEightBitAdder() {
    if (!eightBitCanvas) return;
    const ctx = board(eightBitCanvas); if (!ctx) return;
    drawBitAdder(ctx, "8", eightA, eightB, eightCarry, eightTotal, "4-BIT ADDER");
  }

  function drawAluInputs(ctx: CanvasRenderingContext2D) {
    drawNumberAdjuster(ctx, 35, 90, "A", aluA, 4, colors.blue);
    drawNumberAdjuster(ctx, 35, 205, "B", aluB, 4, colors.green);
  }

  function drawAluOverview() {
    if (!aluOverviewCanvas) return;
    const ctx = board(aluOverviewCanvas); if (!ctx) return;
    header(ctx, "ULA · todas as operações", "As quatro operações recebem os mesmos dois barramentos");
    drawAluInputs(ctx);
    gate(ctx, 330, 85, 170, 86, "4-BIT ADDER", true, String(operationResult(1)));
    gate(ctx, 550, 85, 170, 86, "4-BIT SUBTRACTOR", true, String(operationResult(2)));
    gate(ctx, 330, 265, 170, 86, "4-BIT MULTIPLIER", true, String(operationResult(4)));
    gate(ctx, 550, 265, 170, 86, "4-BIT DIVIDER", true, aluB === 0 ? "—" : String(operationResult(8)));
    wire(ctx, [275, 117, 300, 117, 300, 65, 720, 65], aluA > 0, colors.blue, 5);
    wire(ctx, [275, 232, 300, 232, 300, 375, 720, 375], aluB > 0, colors.green, 5);
    wire(ctx, [415, 65, 415, 85], aluA > 0, colors.blue);
    wire(ctx, [635, 65, 635, 85], aluA > 0, colors.blue);
    wire(ctx, [415, 375, 415, 351], aluB > 0, colors.green);
    wire(ctx, [635, 375, 635, 351], aluB > 0, colors.green);
    wire(ctx, [420, 170, 420, 230, 830, 230], true, colors.green);
    wire(ctx, [640, 170, 640, 230, 830, 230], true, colors.blue);
    wire(ctx, [420, 265, 420, 230, 830, 230], true, colors.orange);
    wire(ctx, [640, 265, 640, 230, 830, 230], true, colors.magenta);
    panel(ctx, 865, 184, 155, 94, binary(aluResult, 4), `Saída atual = ${aluResult}`, aluResult !== 0, colors.cyan);
  }

  function drawAluSelectable() {
    if (!aluSelectCanvas) return;
    const ctx = board(aluSelectCanvas); if (!ctx) return;
    header(ctx, "ULA · opcode selecionável", "Somente a operação escolhida alcança o painel de saída");
    drawAluInputs(ctx);
    gate(ctx, 330, 78, 170, 82, "4-BIT ADDER", opcode === 1, String(operationResult(1)));
    gate(ctx, 550, 78, 170, 82, "4-BIT SUBTRACTOR", opcode === 2, String(operationResult(2)));
    gate(ctx, 330, 248, 170, 82, "4-BIT MULTIPLIER", opcode === 4, String(operationResult(4)));
    gate(ctx, 550, 248, 170, 82, "4-BIT DIVIDER", opcode === 8, aluB === 0 ? "—" : String(operationResult(8)));
    wire(ctx, [275, 117, 300, 117, 300, 58, 720, 58], aluA > 0, colors.blue, 5);
    wire(ctx, [275, 232, 300, 232, 300, 352, 720, 352], aluB > 0, colors.green, 5);
    wire(ctx, [415, 58, 415, 78], aluA > 0, colors.blue);
    wire(ctx, [635, 58, 635, 78], aluA > 0, colors.blue);
    wire(ctx, [415, 352, 415, 330], aluB > 0, colors.green);
    wire(ctx, [635, 352, 635, 330], aluB > 0, colors.green);
    const opcodeColors = [colors.green, colors.blue, colors.orange, colors.magenta];
    opcodes.forEach(([value, name], index) => {
      const x = 300 + index * 150;
      const active = opcode === value;
      control(ctx, x, 420, 130, binary(value, 4), name, active, opcodeColors[index]);
      if (index === 0) wire(ctx, [x + 65, 420, x + 65, 160], active, colors.green);
      else if (index === 1) wire(ctx, [x + 65, 420, x + 65, 190, x+150, 190, x+150, 160], active, colors.blue);
      else if (index === 2) wire(ctx, [x + 65, 420, x + 65, 390, 460, 390, 460, 335], active, colors.orange);
      else if (index === 3) wire(ctx, [x + 65, 420, x + 65, 390, 700, 390, 700, 335], active, colors.magenta);
    });
    wire(ctx, [420, 165, 420, 220, 830, 220], opcode === 1, colors.green);
    wire(ctx, [640, 165, 640, 220, 830, 220], opcode === 2, colors.blue);
    wire(ctx, [420, 245, 420, 220, 830, 220], opcode === 4, colors.orange);
    wire(ctx, [640, 245, 640, 220, 830, 220], opcode === 8, colors.magenta);
    panel(ctx, 865, 178, 160, 94, binary(aluResult, 4), `Resultado = ${aluResult}`, aluResult !== 0, colors.cyan);
  }

  $effect(() => {
    drawHalfAdder();
    drawStageOne();
    drawStageTwo();
    drawStageAndOne();
    drawStageAndTwo();
    drawStageFinal();
    drawFourBitAdder();
    drawEightBitAdder();
    drawAluOverview();
    drawAluSelectable();
  });
</script>

<p>Você não leu o título desse capítulo errado, vamos sim somar números usando apenas aquelas portas lógicas que já vimos anteriormente, impressionante como tudo que já vimos antes está sendo útil nos capítulos seguintes, quase como se tudo tivesse sido planejado com antecedência 👀.</p>

<p>Mas, enfim, o que significa somar números usando portas lógicas? Afinal elas só tem dois estados, ligado e desligado, são binárias, essa soma vai ser de números decimais que nem uma calculadora normal?</p>

<p>Um passo de cada vez, não, não iremos somar números decimais como numa calculadora convencional, mas sim números binários, até o fim do capítulo vamos estar somando grandes números, mas primeiramente vamos começar somando apenas 2 números binários, isto é, dois números que são ou zero ou um, na computação, esses números são conhecidos como bits, a menor quantidade que um computador consegue armazenar, para simplificar as coisas a partir de agora sempre que nos referirmos a um bit, lembre-se que nada mais é que um número que é zero ou um, um número binário.</p>

<p>Vamos ver na tabela verdade qual deve ser as entradas da nossa super calculadora e quais suas saídas.</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>Saída Resultado</th>
      <th>Saída “Vai Um”</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
  </tbody>
</table></div>

<p>Olha só, nenhuma das tabela verdade que vimos até agora tinha mais que uma saída, mas afinal o que são essas saídas, e como assim “Saída Vai Um”?</p>

<p>Vamos começar com a “saída Resultado”, como esse nosso circuito tem o propósito de somar dois bits, vamos analisar a relação dessa saída com os valores da entrada, na primeira linha ambas as entradas são 0 e a saída também é 0, o que faz total sentido 0 + 0 é igual a 0, o mesmo para as próximas colunas 1+0=1 e 0+1=1, mas nessa última coluna, 1+1, bom normalmente 1+1=2 mas o número 2 não existe em binário, ao invés usamos a grafia 10, já que o primeiro bit (o da direita) volta a ser zero e vai um para o próximo bit, do mesmo jeito que acontece no sistema decimal quando somamos 09+01=10, o primeiro dígito (o da direita) volta ao zero e vai um para o próximo, como nossa saída resultado tem somente 1 bit de tamanho, quando o primeiro bit volta a ser zero para mandar um para o próximo, isso faz com que a nossa “Saída Resultado” vire zero, e se não ficou óbvio até agora, a “Saída Vai um” é um sinal que indica que mandamos 1 bit para a próxima casa decimal.</p>

<p>Nos livros didáticos em inglês esse circuito é chamado de Half-Adder (Meio somador) isto porque ele exclusivamente só consegue somar 2 bits e retornar o valor da soma e se 1 bit foi enviado para a próxima casa binária.</p>

<p>Vamos ver o diagrama desse tal de Half-Adder:</p>

<figure class="elemento">
  <div class="canvas-board half-board" role="group" aria-label="Half Adder interativo">
    <canvas bind:this={halfCanvas} class="adder-canvas" width="960" height="390" aria-hidden="true"></canvas>
    <button class="canvas-hit half-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={halfA} onclick={() => (halfA = !halfA)}></button>
    <button class="canvas-hit half-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={halfB} onclick={() => (halfB = !halfB)}></button>
  </div>
</figure>

<p>Olha só, nosso primeiro uso para o XOR GATE que criamos no capítulo passado, como podemos ver na tabela verdade o valor do resultado da nossa conta é exatamente igual ao resultado de um XOR GATE, já o valor da nossa “Saída Vai Um” é igual a de um AND GATE que fica ativo somente quando ambas as entradas são verdadeiras.</p>

<p>Mas, se esse é o meio somador, quem é o somador completo?</p>

<p>Ótima pergunta! Um somador passa a ser completo a partir do momento em que podemos conectar vários somadores em sequência para calcular somas cada vez maiores, vamos ver a tabela verdade de um somador completo:</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>A</th>
      <th>B</th>
      <th>Veio Um</th>
      <th>Resultado</th>
      <th>Vai Um</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
    </tr>
    <tr>
      <td>1</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
    </tr>
    <tr>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
      <td>1</td>
    </tr>
  </tbody>
</table></div>

<p>Caramba, que tabelão, imagina ter que montar um circuito com tantas entradas e saídas e não ter uma tabela verdade para auxiliar, principalmente agora que vamos começar a trabalhar com 3 entradas.</p>

<p>Vamos Começar a desmontar a lógica por trás dessa tabela, podemos ver que temos as mesmas entradas de antes, mas agora temos uma adicional a “Veio Um” que como o nome já diz, serve para conectarmos a saída de outro somador para que possamos contar grandes números, na prática, tudo que estamos fazendo nesse circuito é somar 3 números de entrada, e o resultado vai sair nas mesmas duas saídas que já conhecemos, o único caso mais diferentão é quando as 3 entradas são verdadeiras, onde além de termos uma saída verdadeira no nosso “Vai Um” vamos ter a saída do “Resultado” verdadeira também, é como se fizéssemos duas somas, 1+1 que vai dar resultado 0 e “Vai Um” positivo, e em seguida somamos o resultado 0 com 1 denovo, 0+1 vai dar resultado 1 e mantemos o “Vai Um” de antes, assim ambas as saídas ficam positivas.</p>

<p>Na teoria tudo é lindo, mas como vamos montar um circuito desses? Bom vamos ver, mas dessa vez vamos construir o circuito um passo de cada vez:</p>

<figure class="elemento">
  <div class="canvas-board step-board" role="group" aria-label="Primeira etapa do somador completo">
    <canvas bind:this={stageOneCanvas} class="adder-canvas" width="1000" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit step-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={stepA} onclick={() => (stepA = !stepA)}></button>
    <button class="canvas-hit step-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={stepB} onclick={() => (stepB = !stepB)}></button>
    <button class="canvas-hit step-carry-hit" type="button" aria-label="Alternar Vem Um" aria-pressed={stepCarry} onclick={() => (stepCarry = !stepCarry)}></button>
  </div>
</figure>

<p>Primeiramente temos um XOR GATE que vai lidar com a primeira parte da conta, o sinal “Resultado” da operação A+B.</p>

<figure class="elemento">
  <div class="canvas-board step-board" role="group" aria-label="Segunda etapa do somador completo">
    <canvas bind:this={stageTwoCanvas} class="adder-canvas" width="1000" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit step-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={stepA} onclick={() => (stepA = !stepA)}></button>
    <button class="canvas-hit step-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={stepB} onclick={() => (stepB = !stepB)}></button>
    <button class="canvas-hit step-carry-hit" type="button" aria-label="Alternar Vem Um" aria-pressed={stepCarry} onclick={() => (stepCarry = !stepCarry)}></button>
  </div>
</figure>

<p>Agora fazemos a soma do “Resultado” da primeira parte da conta com o nosso valor “Vem Um”, Caso A e B sejam verdadeiros “Resultado” vai ser 0, mas se somente um dos dois for verdadeiro “Resultado” vai ser 1, em seguida “Resultado” é somado com “Vem Um”, se ambos forem verdadeiros a saída ciano deve ser 0, já que nossa conta é 1+0+1 ou 0+1+1 que ambas vão ter seu primeiro bit como zero, agora se somente uma das entradas for verdadeira, o valor apenas seguirá em frente e nossa saída ciano vai ser 1 já que a conta vai ser: 0+0+1 ou 0+1+0 ou 1+0+0, cujo resultado é 1, e caso nossa conta seja 1+1+1, o primeiro XOR vai nos dar um resultado de zero, o que vai permitir que o valor de 1 de “Vem Um” possa dar continuidade para a saída cinza, isso completa a lógica de calcular o primeiro bit de uma soma com 3 números.</p>

<p>Mas ainda falta calcular o “Vai Um” do nosso somador completo, e para isso vamos começar listando quando queremos que “Vai Um” seja positivo e quando ele deve ser negativo. Ele deve ser positivo quando A e B forem positivo, A e “vem Um” forem positivos, B e “vem Um” forem positivos, e A,B e “vem Um” forem positivos, do contrário ele deve ser negativo. Para a nossa sorte, podemos lidar com o sinal A e B positivos da mesma forma que fizemos no meio somador, usando um AND entre as entradas A e B.</p>

<figure class="elemento">
  <div class="canvas-board step-board" role="group" aria-label="Terceira etapa do somador completo">
    <canvas bind:this={stageAndOneCanvas} class="adder-canvas" width="1000" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit step-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={stepA} onclick={() => (stepA = !stepA)}></button>
    <button class="canvas-hit step-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={stepB} onclick={() => (stepB = !stepB)}></button>
    <button class="canvas-hit step-carry-hit" type="button" aria-label="Alternar Vem Um" aria-pressed={stepCarry} onclick={() => (stepCarry = !stepCarry)}></button>
  </div>
</figure>

<p>Utilizamos um AND GATE para determinar se A e B são positivos, mas ainda falta lidar com os casos que envolvem o “vem Um”, vamos começar focando nos casos: A+““vem Um” e B+“vem Um”, vamos fazer o mesmo processo que fizemos para calcular o valor de A+B, usar um AND GATE, mas dessa vez podemos usar a saída do primeiro XOR já que ela já é um indicador se A ou B são positivos, assim se juntarmos essa saída com a entrada “vem Um” em um AND GATE, o resultado vai ser ambas as condições A + “vem Um” e B + “vem Um” sendo resolvidas ao mesmo.</p>

<figure class="elemento">
  <div class="canvas-board step-board" role="group" aria-label="Quarta etapa do somador completo">
    <canvas bind:this={stageAndTwoCanvas} class="adder-canvas" width="1000" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit step-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={stepA} onclick={() => (stepA = !stepA)}></button>
    <button class="canvas-hit step-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={stepB} onclick={() => (stepB = !stepB)}></button>
    <button class="canvas-hit step-carry-hit" type="button" aria-label="Alternar Vem Um" aria-pressed={stepCarry} onclick={() => (stepCarry = !stepCarry)}></button>
  </div>
</figure>

<p>Estamos quase lá, mas nosso circuito atualmente tem 3 saídas ao invés das duas esperadas, a saída “Resultado” e duas saídas, uma que diz se A e B são positivos, e outra que diz se (A ou B) e “Vem Um” são positivos, precisamos dar um jeito de combinar essas duas saídas em uma única saída “Vai Um”, por sorte, se formos pensar nas entradas e saídas que temos vamos ter a seguinte tabela verdade:</p>

<div class="table-scroll"><table class="tabela">
  <thead>
    <tr>
      <th>A &amp; B</th>
      <th>(A ou B) &amp; “Vem Um”</th>
      <th>“Vai Um”</th>
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

<p>Se você se lembra, essa é a mesma tabela verdade do nosso querido OR GATE, isso significa que podemos usá-lo aqui para finalizar nosso circuito, vamos ver:</p>

<figure class="elemento">
  <div class="canvas-board step-board" role="group" aria-label="Circuito final do somador completo">
    <canvas bind:this={stageFinalCanvas} class="adder-canvas" width="1000" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit step-a-hit" type="button" aria-label="Alternar entrada A" aria-pressed={stepA} onclick={() => (stepA = !stepA)}></button>
    <button class="canvas-hit step-b-hit" type="button" aria-label="Alternar entrada B" aria-pressed={stepB} onclick={() => (stepB = !stepB)}></button>
    <button class="canvas-hit step-carry-hit" type="button" aria-label="Alternar Vem Um" aria-pressed={stepCarry} onclick={() => (stepCarry = !stepCarry)}></button>
  </div>
</figure>

<p>E dessa forma, criamos um somador completo, em inglês esse circuito que criamos é chamado de “1-Bit Adder”, em português: Somador de 1 bit, já que ele é capaz de somar quaisquer números de 1 bit que dermos de entrada, mas convenhamos, somar 1+1 não é muito interessante, para nossa sorte, todo o trabalho que tivemos implementando o “Vem Um” e “Vai Um” se paga aqui, já que podemos criar o seguinte circuito usando somadores de 1 bit:</p>

<figure class="elemento">
  <div class="canvas-board chain-board" role="group" aria-label="Somador de quatro bits interativo">
    <canvas bind:this={fourBitCanvas} class="adder-canvas" width="1060" height="480" aria-hidden="true"></canvas>
    <button class="canvas-hit chain-a-minus-hit" type="button" aria-label="Diminuir A" onclick={() => (fourA = change(fourA, -1, 16))}></button>
    <button class="canvas-hit chain-a-plus-hit" type="button" aria-label="Aumentar A" onclick={() => (fourA = change(fourA, 1, 16))}></button>
    <button class="canvas-hit chain-b-minus-hit" type="button" aria-label="Diminuir B" onclick={() => (fourB = change(fourB, -1, 16))}></button>
    <button class="canvas-hit chain-b-plus-hit" type="button" aria-label="Aumentar B" onclick={() => (fourB = change(fourB, 1, 16))}></button>
    <button class="canvas-hit chain-carry-hit" type="button" aria-label="Alternar Carry in" aria-pressed={fourCarry} onclick={() => (fourCarry = !fourCarry)}></button>
  </div>
</figure>

<p>Esse é o circuito de um somador de 4 bits, ou em inglês 4-Bit adder, ele funciona assim, nos interruptores em cima colocamos 2 números de 4 bits, o circuito soma esses números e nos dá um resultado em binário nas luzes de baixo, experimente colocar alguns números para ver, por exemplo 7 que em binário é 0111 e 4 que em binário é 0100, verá que as luzes vão acender formaram o número 11 que em binário é 1011.</p>

<p>Mas essa não é a parte mais legal, agora que temos um somador de 4 bits, podemos construir somadores ainda maiores, por exemplo:</p>

<figure class="elemento">
  <div class="canvas-board chain-board" role="group" aria-label="Somador de oito bits interativo">
    <canvas bind:this={eightBitCanvas} class="adder-canvas" width="1060" height="480" aria-hidden="true"></canvas>
    <button class="canvas-hit chain-a-minus-hit" type="button" aria-label="Diminuir A" onclick={() => (eightA = change(eightA, -1, 256))}></button>
    <button class="canvas-hit chain-a-plus-hit" type="button" aria-label="Aumentar A" onclick={() => (eightA = change(eightA, 1, 256))}></button>
    <button class="canvas-hit chain-b-minus-hit" type="button" aria-label="Diminuir B" onclick={() => (eightB = change(eightB, -1, 256))}></button>
    <button class="canvas-hit chain-b-plus-hit" type="button" aria-label="Aumentar B" onclick={() => (eightB = change(eightB, 1, 256))}></button>
    <button class="canvas-hit chain-carry-hit" type="button" aria-label="Alternar Carry in" aria-pressed={eightCarry} onclick={() => (eightCarry = !eightCarry)}></button>
  </div>
</figure>

<p>Bem similar não é mesmo? E agora podemos somar números de 8 bits, ou seja dois números entre 0 e 255. Poderíamos nos estender nesse curso e ver como é feito o circuito lógico da subtração, multiplicação e divisão, mas a complexidade desse circuitos seria bem alta para o que já vimos, e não seria necessário, então vamos pular esses circuitos, mas saiba que o princípio é o mesmo. Talvez durante essa jornada você tenha se perguntado qual o nosso objetivo aqui, tipo, para que fazer todos esses circuitos, onde estamos querendo chegar?</p>

<p>Esse tempo todo estivemos caminhando para a construção do que chamamos de ULA, Unidade Lógica Aritmética, ela é uma peça fundamental para um processador de computador, ela é quem vai fazer todas as contas matemáticas do computador, mas como ela funciona?</p>

<p>Veja o seguinte circuito a seguir:</p>

<figure class="elemento">
  <div class="canvas-board alu-board" role="group" aria-label="ULA com quatro operações interativa">
    <canvas bind:this={aluOverviewCanvas} class="adder-canvas" width="1080" height="500" aria-hidden="true"></canvas>
    <button class="canvas-hit alu-a-minus-hit" type="button" aria-label="Diminuir entrada A" onclick={() => (aluA = change(aluA, -1, 16))}></button>
    <button class="canvas-hit alu-a-plus-hit" type="button" aria-label="Aumentar entrada A" onclick={() => (aluA = change(aluA, 1, 16))}></button>
    <button class="canvas-hit alu-b-minus-hit" type="button" aria-label="Diminuir entrada B" onclick={() => (aluB = change(aluB, -1, 16))}></button>
    <button class="canvas-hit alu-b-plus-hit" type="button" aria-label="Aumentar entrada B" onclick={() => (aluB = change(aluB, 1, 16))}></button>
  </div>
</figure>

<p>Temos as 4 operações matemáticas nesse circuito, o problema é que sempre que damos qualquer entrada, as 4 operações são realizadas ao mesmo tempo e o resultado fica tudo embaralhado e errado, então tentando resolver o problema, colocamos AND GATES ligando a saídas dos nossos componentes matemáticos e um fio controle, cada operação tem um fio separado, isso faz com que possamos escolher qual operação a gente queira apenas ligando o fio de controle daquela operação (como se tivéssemos um interruptor liga desliga para escolhermos a operação que queremos).</p>

<figure class="elemento">
  <div class="canvas-board alu-select-board" role="group" aria-label="ULA com opcode interativa">
    <canvas bind:this={aluSelectCanvas} class="adder-canvas" width="1080" height="540" aria-hidden="true"></canvas>
    <button class="canvas-hit alu-select-a-minus-hit" type="button" aria-label="Diminuir entrada A" onclick={() => (aluA = change(aluA, -1, 16))}></button>
    <button class="canvas-hit alu-select-a-plus-hit" type="button" aria-label="Aumentar entrada A" onclick={() => (aluA = change(aluA, 1, 16))}></button>
    <button class="canvas-hit alu-select-b-minus-hit" type="button" aria-label="Diminuir entrada B" onclick={() => (aluB = change(aluB, -1, 16))}></button>
    <button class="canvas-hit alu-select-b-plus-hit" type="button" aria-label="Aumentar entrada B" onclick={() => (aluB = change(aluB, 1, 16))}></button>
    {#each opcodes as item, index}
      <button class="canvas-hit opcode-hit" style={`--opcode-index: ${index}`} type="button" aria-label={`Selecionar ${item[1]}`} aria-pressed={opcode === item[0]} onclick={() => (opcode = item[0])}></button>
    {/each}
  </div>
</figure>

<p>Agora podemos escolher qual operação nosso circuito faz através dessa nova entrada, mas, espera um pouco, por mais que cada 1 e 0 individualmente representa o controle liga desliga de uma operação, quando colocamos eles juntos assim, parece um número binário de 4 bits, não? Poderíamos então dizer que o número 1 é soma, o número 2, em binário 10, seria subtração, o 4, em binário 100, multiplicação, e o 8, em binário 1000, são operações matemáticas, podemos chamá-lo de opcode, abreviação de Operator Code em inglês para ser mais chique, em português a tradução seria Código de Operação, dessa forma poderíamos passar para nossa ULA (o nome do circuito que acabamos de ver caso tenha se esquecido), o número binário 0100 0101 0010, em decimal 4•5•2, 4 é o nosso opcode, e significa multiplicação, e 5 e 2 são as entradas, 5x2 = 10, ou em binário 1010.</p>

<p>Você sabia que em ALUs mais modernas, graças a circuitos eletrônicos mais complexos, os opcodes podem ser números como 1, 2, 3 (em binário obviamente) invés de serem múltiplos de 2 diretamente como fizemos no nosso exemplo, isso permite que mais operações possam ser executadas sem ter que aumentar o tamanho do opcode para ter mais bits.</p>

<p>😁 Parabéns! Agora você sabe somar números usando apenas portas lógicas!</p>

<p>😐 uau que incrível.</p>


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

  .adder-canvas {
    display: block;
    width: 100%;
    height: auto;
    background: #122033;
    pointer-events: none;
    user-select: none;
  }

  /* Cada área acompanha o interruptor desenhado no canvas e continua sendo
     um botão nativo para mouse, toque e teclado. */
  .canvas-hit {
    position: absolute;
    z-index: 1;
    display: block;
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

  .half-a-hit { top: 24.35%; left: 3.65%; width: 16.65%; height: 16%; }
  .half-b-hit { top: 57.69%; left: 3.65%; width: 16.65%; height: 16%; }

  .step-a-hit { top: 14.82%; left: 3%; width: 17.5%; height: 12%; }
  .step-b-hit { top: 31.48%; left: 3%; width: 17.5%; height: 12%; }
  .step-carry-hit { top: 48.15%; left: 3%; width: 17.5%; height: 12%; }

  .chain-a-minus-hit { top: 18.33%; left: 3.3%; width: 5.1%; height: 11.25%; }
  .chain-a-plus-hit { top: 18.33%; left: 20.85%; width: 5.1%; height: 11.25%; }
  .chain-b-minus-hit { top: 42.71%; left: 3.3%; width: 5.1%; height: 11.25%; }
  .chain-b-plus-hit { top: 42.71%; left: 20.85%; width: 5.1%; height: 11.25%; }
  .chain-carry-hit { top: 73.96%; left: 3.3%; width: 22.65%; height: 11.25%; }

  .alu-a-minus-hit { top: 18%; left: 3.24%; width: 5%; height: 10.8%; }
  .alu-a-plus-hit { top: 18%; left: 20.46%; width: 5%; height: 10.8%; }
  .alu-b-minus-hit { top: 41%; left: 3.24%; width: 5%; height: 10.8%; }
  .alu-b-plus-hit { top: 41%; left: 20.46%; width: 5%; height: 10.8%; }

  .alu-select-a-minus-hit { top: 16.67%; left: 3.24%; width: 5%; height: 10%; }
  .alu-select-a-plus-hit { top: 16.67%; left: 20.46%; width: 5%; height: 10%; }
  .alu-select-b-minus-hit { top: 37.96%; left: 3.24%; width: 5%; height: 10%; }
  .alu-select-b-plus-hit { top: 37.96%; left: 20.46%; width: 5%; height: 10%; }
  .opcode-hit { top: 77.78%; left: calc(27.778% + var(--opcode-index) * 13.889%); width: 12.037%; height: 10%; }
</style>
