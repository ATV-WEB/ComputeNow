<script lang="ts">
  import ChapterHeader from "../lib/ChapterHeader.svelte";
  import { getModuleCompletion } from "../lib/utils";

  // Chapters

  import algoritmosBinarioContent from "../lib/chapter-content/algoritmos/algoritmos-binario.svelte";
  import algoritmosTransistorContent from "../lib/chapter-content/algoritmos/algoritmos-transistor.svelte";
  import algoritmosAndOrNandContent from "../lib/chapter-content/algoritmos/algoritmos-and-or-nand.svelte";
  import algoritmosTabelaVerdadeContent from "../lib/chapter-content/algoritmos/algoritmos-tabela-verdade.svelte";
  import algoritmosComposicaoPortasLogicasContent from "../lib/chapter-content/algoritmos/algoritmos-composicao-portas-logicas.svelte";
  import algoritmosSomandoNumerosPortasLogicasContent from "../lib/chapter-content/algoritmos/algoritmos-somando-numeros-portas-logicas.svelte";
  import algoritmosFlipFlopsContent from "../lib/chapter-content/algoritmos/algoritmos-flip-flops.svelte";
  import algoritmosClockContent from "../lib/chapter-content/algoritmos/algoritmos-clock.svelte";
  import algoritmosAssemblyContent from "../lib/chapter-content/algoritmos/algoritmos-assembly.svelte";
  import algoritmosLinguagensAltoNivelContent from "../lib/chapter-content/algoritmos/algoritmos-linguagens-alto-nivel.svelte";
  import algoritmosIfElseContent from "../lib/chapter-content/algoritmos/algoritmos-if-else.svelte";
  import algoritmosTiposSimplesContent from "../lib/chapter-content/algoritmos/algoritmos-tipos-simples.svelte";
  import algoritmosNumerosContent from "../lib/chapter-content/algoritmos/algoritmos-numeros.svelte";
  import algoritmosPonteirosContent from "../lib/chapter-content/algoritmos/algoritmos-ponteiros.svelte";
  import algoritmosEstruturasEObjetosCustomizadosContent from "../lib/chapter-content/algoritmos/algoritmos-estruturas-e-objetos-customizados.svelte";
  import algoritmosWhileLoopContent from "../lib/chapter-content/algoritmos/algoritmos-while-loop.svelte";
  import algoritmosDoWhileContent from "../lib/chapter-content/algoritmos/algoritmos-do-while.svelte";
  import algoritmosForLoopContent from "../lib/chapter-content/algoritmos/algoritmos-for-loop.svelte";
  import algoritmosFuncoesContent from "../lib/chapter-content/algoritmos/algoritmos-funcoes.svelte";
  import algoritmosParametrosContent from "../lib/chapter-content/algoritmos/algoritmos-parametros.svelte";
  import algoritmosRetornoContent from "../lib/chapter-content/algoritmos/algoritmos-retorno.svelte";
  import algoritmosRecursividadeContent from "../lib/chapter-content/algoritmos/algoritmos-recursividade.svelte";

  // logic

  export let currentCourse: (typeof import("../data/content").courses)[number];
  export let currentChapter: (typeof import("../data/content").courses)[number]["modules"][number]["chapters"][number];
  export let completed: Record<string, boolean>;
  export let onOpenChapter: (courseId: string, chapterId: string) => void;
  export let onMarkCompleted: (chapterId: string) => void;
  export let onToggleCompleted: (chapterId: string, value: boolean) => void;

  const unmarkCompleted = (chapterId: string) => {
    onToggleCompleted(chapterId, false);
  };

  let sidebarOpen = true;
  let activeChapterKey = currentChapter.id;

  const contentComponents = {
    'algoritmos-binario': algoritmosBinarioContent,
    'algoritmos-transistor': algoritmosTransistorContent,
    'algoritmos-and-or-nand': algoritmosAndOrNandContent,
    'algoritmos-tabela-verdade': algoritmosTabelaVerdadeContent,
    'algoritmos-composicao-portas-logicas': algoritmosComposicaoPortasLogicasContent,
    'algoritmos-somando-numeros-portas-logicas': algoritmosSomandoNumerosPortasLogicasContent,
    'algoritmos-flip-flops': algoritmosFlipFlopsContent,
    'algoritmos-clock': algoritmosClockContent,
    'algoritmos-assembly': algoritmosAssemblyContent,
    'algoritmos-linguagens-alto-nivel': algoritmosLinguagensAltoNivelContent,
    'algoritmos-if-else': algoritmosIfElseContent,
    'algoritmos-tipos-simples': algoritmosTiposSimplesContent,
    'algoritmos-numeros': algoritmosNumerosContent,
    'algoritmos-ponteiros': algoritmosPonteirosContent,
    'algoritmos-estruturas-e-objetos-customizados': algoritmosEstruturasEObjetosCustomizadosContent,
    'algoritmos-while-loop': algoritmosWhileLoopContent,
    'algoritmos-do-while': algoritmosDoWhileContent,
    'algoritmos-for-loop': algoritmosForLoopContent,
    'algoritmos-funcoes': algoritmosFuncoesContent,
    'algoritmos-parametros': algoritmosParametrosContent,
    'algoritmos-retorno': algoritmosRetornoContent,
    'algoritmos-recursividade': algoritmosRecursividadeContent,
  } as const;

  const toggleSidebar = () => {
    sidebarOpen = !sidebarOpen;
  };

  $: if (currentChapter.id !== activeChapterKey) {
    activeChapterKey = currentChapter.id;
  }
</script>

<main class={`chapter-layout ${sidebarOpen ? "open" : "closed"}`}>
  <button
    class={`sidebar-toggle ${sidebarOpen ? "open" : "closed"}`}
    on:click={toggleSidebar}
    aria-label="Alternar barra lateral"
  >
    {sidebarOpen ? "⟨" : "⟩"}
  </button>
  <aside class={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
    <div class="sidebar-content">
      <h3 class="sidebar-course-title">{currentCourse.title}</h3>
      {#each currentCourse.modules as module}
        {@const status = getModuleCompletion(module, completed)}
        <div class="module-block">
          <div class="module-row">
            <strong>{module.title}</strong>
            {#if status.completed}
              <span class="dot done">●</span>
            {:else if status.completedCount > 0}
              <span class="dot partial">●</span>
            {/if}
          </div>
          <div class="chapter-cards">
            {#each module.chapters as chapter}
              {@const isActive = chapter.id === currentChapter.id}
              <button
                class:active={isActive}
                class="chapter-card"
                on:click={() => onOpenChapter(currentCourse.id, chapter.id)}
              >
                <span>{chapter.title}</span>
                {#if completed[chapter.id]}
                  <span class="check">✓</span>
                {/if}
              </button>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </aside>

  <section class="card">
    <ChapterHeader
      title={currentChapter.title}
      courseTitle={currentCourse.title}
      chapterNumber={currentCourse.modules
        .flatMap((module) => module.chapters)
        .findIndex((chapter) => chapter.id === currentChapter.id) + 1}
      totalChapters={currentCourse.modules.flatMap((module) => module.chapters)
        .length}
    />
    <div class="chapter-content">
      {#if currentChapter.contentComponent}
        {@const ContentComponent =
          contentComponents[
            currentChapter.contentComponent as keyof typeof contentComponents
          ]}
          {#if ContentComponent}
          {#key activeChapterKey}
            <ContentComponent />
          {/key}
        {/if}
      {/if}
      <div class="chapter-footer">
        {#if completed[currentChapter.id]}
          <button
            class="secondary"
            on:click={() => unmarkCompleted(currentChapter.id)}
            >Desmarcar como concluído</button
          >
        {:else}
          <button
            class="secondary"
            on:click={() => onMarkCompleted(currentChapter.id)}
            >Marcar como concluído</button
          >
        {/if}
      </div>
    </div>
  </section>
</main>

<style>
  .chapter-layout {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    min-height: calc(100vh - 72px);
    width: 100%;
    position: relative;
    transition: grid-template-columns 0.2s ease;
  }

  .chapter-layout.closed {
    grid-template-columns: 0 1fr;
  }

  .chapter-layout.closed .sidebar {
    transform: translateX(-100%);
    opacity: 0;
    transition:
      transform 0.7s ease-out,
      opacity 0.2s ease-out;
  }

  .sidebar {
    width: min(320px, 86vw);
    background: var(--accent-soft-2);
    color: var(--text);
    border: none;
    box-shadow: none;
    position: sticky;
    top: var(--header-height);
    z-index: 15;
    max-height: calc(100vh - var(--header-height));
    overflow: auto;
    transition:
      transform 0.3s ease-out,
      opacity 0.2s ease-out;
  }

  .sidebar-content {
    position: sticky;
    padding: 1rem;
    top: var(--header-height);
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    height: fit-content;
  }

  .sidebar-toggle {
    position: fixed;
    top: calc(var(--header-height) + 0.5rem);
    left: calc(0.5rem + max((100vw - 1440px) / 2, 0px));
    z-index: 31;
    border-radius: 999px;
    aspect-ratio: 1;
    width: 2.5rem;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    cursor: pointer;
  }

  .sidebar-course-title {
    text-align: right;
  }

  .module-block {
    padding-top: 0.8rem;
    margin-top: 0.8rem;
  }

  .chapter-cards {
    display: grid;
    gap: 0.5rem;
    margin-top: 0.6rem;
  }

  .chapter-card {
    width: 100%;
    text-align: left;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 12px;
    background: transparent;
    border: 0;
    color: var(--text);
    padding: 0.7rem 0.8rem;
    min-height: 44px;
    cursor: pointer;
  }

  .chapter-card.active {
    background: var(--accent-soft);
  }

  .module-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .dot {
    font-size: 0.8rem;
  }

  .dot.done {
    color: #16a34a;
  }

  .dot.partial {
    color: var(--accent-2);
  }

  .check {
    color: var(--accent);
    font-weight: 700;
  }

  .chapter-content {
    min-width: 0;
    transition: margin-left 0.2s ease;
    max-width: 90ch;
    margin-inline: auto;
    padding: 1rem;
  }

  .chapter-content :global(p) {
    margin: 0 0 1rem;
    line-height: 1.7;
    color: var(--text);
  }

  .chapter-content :global(h2) {
    margin: 2.25rem 0 1rem;
    color: var(--text);
    font-size: clamp(1.35rem, 2vw, 1.75rem);
    line-height: 1.25;
  }

  .chapter-content :global(ol),
  .chapter-content :global(ul) {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
    color: var(--muted);
    line-height: 1.7;
  }

  .chapter-content :global(li + li) {
    margin-top: 0.35rem;
  }

  .chapter-content :global(a) {
    color: var(--accent);
    overflow-wrap: anywhere;
  }

  .chapter-footer {
    margin-top: 2rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .chapter-footer .secondary {
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface-soft);
    color: var(--text);
    cursor: pointer;
  }

  .success {
    color: #15803d;
    font-weight: 700;
  }

  @media (max-width: 800px) {
    .chapter-layout {
      grid-template-columns: 1fr !important;
    }

    .sidebar {
      position: fixed;
      height: 100%;
      backdrop-filter: blur(6px);
    }
  }
</style>
