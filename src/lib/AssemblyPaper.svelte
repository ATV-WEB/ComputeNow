<script lang="ts">
  export let code: string;
  export let title = "Programa assembly";

  const opcodes = new Set([
    "FIM",
    "CARREGAR",
    "ARMAZENAR",
    "DEFINIR",
    "SOMAR",
    "SUBTRAIR",
    "MAIORQUE",
    "IGUAL",
    "PULAR",
    "IRPARA",
  ]);

  const escapeHtml = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const highlightCodePart = (codeStr: string) => {
    const safe = escapeHtml(codeStr);
    const [first, ...rest] = safe.split(/(\s+)/);
    if (opcodes.has(first)) {
      return `<span class="opcode">${first}</span>${rest.join("").replace(/\b(\d+)\b/g, '<span class="number">$1</span>')}`;
    }
    return safe.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');
  };

  interface AssemblyLine {
    num: string;
    code: string;
    comment: string;
  }

  const parseAssembly = (rawCode: string): AssemblyLine[] => {
    const rawLines = rawCode
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const lines: AssemblyLine[] = [];
    let i = 0;

    while (i < rawLines.length) {
      if (
        /^\d+$/.test(rawLines[i]) &&
        i + 1 < rawLines.length &&
        !/^\d+$/.test(rawLines[i + 1])
      ) {
        const num = rawLines[i];
        const codePart = rawLines[i + 1];
        let commentPart = "";

        if (
          i + 2 < rawLines.length &&
          !/^\d+$/.test(rawLines[i + 2]) &&
          !opcodes.has(rawLines[i + 2].split(/\s+/)[0])
        ) {
          commentPart = rawLines[i + 2];
          i += 3;
        } else {
          i += 2;
        }
        lines.push({ num, code: codePart, comment: commentPart });
      } else {
        lines.push({ num: "", code: rawLines[i], comment: "" });
        i++;
      }
    }
    return lines;
  };

  $: parsedLines = parseAssembly(code);

  async function copyCode() {
    await navigator.clipboard?.writeText(code);
  }
</script>

<section class="assembly-paper" aria-label={title}>
  <header>
    <span>ASSEMBLY</span>
    <strong>{title}</strong>
    <button on:click={copyCode}>Copiar</button>
  </header>
  <div class="paper-scroll">
    <div class="paper">
      <div class="holes left" aria-hidden="true"></div>
      <pre>{#each parsedLines as line}<div class="paper-line"><span
              class="line-number">{line.num}</span
            ><span class="code-part">{@html highlightCodePart(line.code)}</span
            >{#if line.comment}<span class="comment"
                >; {line.comment.replace(/^;\s*/, "")}</span
              >{/if}</div>{/each}</pre>
      <div class="holes right" aria-hidden="true"></div>
    </div>
  </div>
</section>

<style>
  .assembly-paper {
    margin: 1.75rem 0;
    overflow: hidden;
    border: 1px solid #b89b66;
    border-radius: 0.8rem;
    background: #3a2b18;
    box-shadow: 0 0.75rem 1.75rem rgba(68, 45, 15, 0.2);
  }
  header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 1rem;
    color: #f5e8c8;
    background: #2a1e11;
    font-size: 0.78rem;
    letter-spacing: 0.08em;
  }
  header strong {
    flex: 1;
    font-size: 0.8rem;
    letter-spacing: 0.03em;
  }
  header button {
    border: 1px solid #8f7146;
    border-radius: 0.35rem;
    background: transparent;
    color: inherit;
    padding: 0.3rem 0.5rem;
    cursor: pointer;
    font: inherit;
  }
  header button:hover {
    background: #5a3e1c;
  }
  .paper-scroll {
    overflow: auto;
  }

  .paper {
    position: relative;
    min-width: max-content;
    padding: 1rem 3.25rem;
    background: #f8edcf;
  }

  .paper::before,
  .paper::after {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1.2rem;
    background: repeating-radial-gradient(
      circle at center 0.8rem,
      #3a2b18 0 0.27rem,
      transparent 0.3rem 1.65rem
    );
    opacity: 0.9;
    z-index: 2;
  }
  .paper::before {
    left: 0.45rem;
  }
  .paper::after {
    right: 0.45rem;
  }

  pre {
    position: relative;
    z-index: 1;
    margin: 0;
    color: #392916;
    font:
      0.9rem/1.65 "Courier New",
      ui-monospace,
      monospace;
  }

  /* Alinhamento por Grid e fundo dinâmico por linha para evitar descompassos */
  .paper-line {
    display: grid;
    grid-template-columns: 2.5rem 14rem 1fr;
    gap: 1.5rem;
    min-height: 1.8rem;
    padding: 0.1rem 0.5rem;
    white-space: pre;
    align-items: center;
    border-radius: 0.25rem;
  }

  /* Linhas ímpares com fundo mais escuro e perfeitamente alinhadas */
  .paper-line:nth-child(odd) {
    background: rgba(114, 82, 42, 0.14);
  }

  .paper-line :global(.opcode) {
    color: #9f1239;
    font-weight: 700;
  }
  .paper-line :global(.number) {
    color: #1d4ed8;
  }
  .line-number {
    color: #1d4ed8;
    font-weight: 600;
  }
  .comment {
    color: #475569;
    font-style: italic;
  }

  .holes {
    display: none;
  }
</style>
