<script lang="ts">
  export let code: string;
  export let language = "text";
  export let title: string | undefined = undefined;
  export let showLineNumbers = true;

  const keywordGroups: Record<string, string[]> = {
    javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "from", "export", "async", "await", "class", "new", "true", "false", "null", "undefined"],
    typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "import", "from", "export", "async", "await", "class", "interface", "type", "extends", "true", "false", "null", "undefined"],
    python: ["def", "return", "if", "else", "elif", "for", "while", "import", "from", "class", "in", "True", "False", "None", "and", "or", "not"],
    css: ["display", "grid", "flex", "color", "background", "position", "padding", "margin", "border", "width", "height", "font"],
    html: ["div", "span", "button", "section", "main", "script", "style", "class", "id", "href", "src"]
  };

  const escapeHtml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

  function highlight(source: string, currentLanguage: string) {
    const keywords = keywordGroups[currentLanguage.toLowerCase()] ?? [];
    const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|#[^\n]*|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
    let result = "";
    let cursor = 0;

    for (const match of source.matchAll(tokenPattern)) {
      const token = match[0];
      const start = match.index ?? 0;
      result += escapeHtml(source.slice(cursor, start));
      const type = token.startsWith("//") || token.startsWith("#")
        ? "comment"
        : token.startsWith('"') || token.startsWith("'")
          ? "string"
          : /^\d/.test(token)
            ? "number"
            : keywords.includes(token)
              ? "keyword"
              : "";
      result += type ? `<span class="token-${type}">${escapeHtml(token)}</span>` : escapeHtml(token);
      cursor = start + token.length;
    }

    return result + escapeHtml(source.slice(cursor));
  }

  async function copyCode() {
    await navigator.clipboard?.writeText(code);
  }
</script>

<section class="code-block" aria-label={title ?? `Código ${language}`}>
  <header>
    <span class="dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <strong>{title ?? language}</strong>
    <button on:click={copyCode} aria-label="Copiar código">Copiar</button>
  </header>
  <div class:with-lines={showLineNumbers} class="code-scroll">
    {#if showLineNumbers}
      <ol aria-hidden="true">{#each code.split("\n") as _}<li></li>{/each}</ol>
    {/if}
    <pre><code class={`language-${language}`}>{@html highlight(code, language)}</code></pre>
  </div>
</section>

<style>
  .code-block { margin: 1.75rem 0; overflow: hidden; border: 1px solid #27364d; border-radius: .875rem; background: #0b1220; color: #dbeafe; box-shadow: 0 .75rem 1.75rem rgba(15, 23, 42, .16); }
  header { display: flex; align-items: center; gap: .65rem; min-height: 2.75rem; padding: 0 .75rem; border-bottom: 1px solid #27364d; background: #111c2e; font-size: .82rem; }
  header strong { flex: 1; color: #cbd5e1; text-transform: lowercase; letter-spacing: .03em; }
  .dots { display: flex; gap: .3rem; }.dots i { width: .58rem; aspect-ratio: 1; border-radius: 50%; background: #64748b; }.dots i:nth-child(1) { background: #fb7185; }.dots i:nth-child(2) { background: #fbbf24; }.dots i:nth-child(3) { background: #34d399; }
  button { border: 0; border-radius: .4rem; background: transparent; color: #93c5fd; padding: .35rem .5rem; cursor: pointer; font: inherit; } button:hover { background: #1e3a5f; color: #fff; }
  .code-scroll { display: grid; grid-template-columns: auto minmax(0, 1fr); overflow: auto; max-height: 32rem; }.code-scroll ol { margin: 0; padding: 1rem .75rem 1rem 2.5rem; border-right: 1px solid #27364d; color: #64748b; text-align: right; font: .85rem/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; user-select: none; }.code-scroll pre { margin: 0; padding: 1rem; min-width: max-content; font: .9rem/1.65 ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; white-space: pre; }.code-scroll code { font: inherit; }
  :global(.token-keyword) { color: #c084fc; }:global(.token-string) { color: #86efac; }:global(.token-comment) { color: #94a3b8; font-style: italic; }:global(.token-number) { color: #fbbf24; }
</style>
