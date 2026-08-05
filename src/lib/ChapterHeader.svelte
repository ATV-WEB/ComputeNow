<script>
  export let title = "";
  export let courseTitle = "";
  export let chapterNumber = 0;
  export let totalChapters = 0;
</script>

<header class="chapter-header">
  <div>
    <p class="eyebrow">Capítulo {chapterNumber} de {totalChapters}</p>
    <h1>{title}</h1>
    <p class="course-label">{courseTitle}</p>
  </div>
</header>

<style>
  .chapter-header {
    border-bottom: 1px solid var(--border);
    padding: 1rem;
    margin: 1.5rem;
    background: var(--accent);
    border-radius: 4px;
    clip-path: polygon(0 30%, 5% 0, 100% 0, 100% 80%, 98% 100%, 0 100%);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 0.76rem;
    font-weight: 700;
    color: var(--hero-text);
    margin: 0 0 0.4rem;
    text-align: right;
  }

  h1 {
    margin: 0 0 0.35rem;
    font-size: 2.8rem;
    color: var(--hero-text);
    text-align: right;
    font-family: blackops, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  .course-label {
    margin: 0;
    text-align: left;
    color: var(--hero-text);
  }
</style>
