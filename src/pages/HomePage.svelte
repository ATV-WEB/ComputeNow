<script lang="ts">
  import { courses } from "../data/content";
  import CourseCard from "../lib/CourseCard.svelte";

  export let completed: Record<string, boolean>;
  export let onNavigate: (view: "home" | "courses" | "tracks") => void;
  export let onOpenCourse: (courseId: string, chapterId: string) => void;
</script>

<main class="page">
  <section class="hero card">
    <div>
      <p class="eyebrow">Plataforma gratuita</p>
      <h1>Aprenda tecnologia com trilhas claras e progresso local.</h1>
      <p>
        Explore cursos, acompanhe seu desenvolvimento e marque capítulos como
        concluídos sem necessidade de cadastro.
      </p>
      <div class="hero-actions">
        <button on:click={() => onNavigate("courses")}>Ver cursos</button>
        <button class="secondary" on:click={() => onNavigate("tracks")}
          >Ver trilhas</button
        >
      </div>
    </div>
  </section>

  <section class="card">
    <div class="section-head">
      <h2>Cursos em destaque</h2>
      <button class="ghost" on:click={() => onNavigate("courses")}
        >Ver todos</button
      >
    </div>
    <div class="featured-grid">
      {#each courses.slice(0, 3) as course}
        <CourseCard {course} {completed} {onOpenCourse} />
      {/each}
    </div>
  </section>

  <section class="card section">
    <h2>Por que usar a ComputeNow?</h2>
    <div class="info-grid">
      <article class="info-card">
        <h3>Conteúdo organizado</h3>
        <p>Cursos em módulos e capítulos com navegação simples.</p>
      </article>
      <article class="info-card">
        <h3>Progresso persistido</h3>
        <p>Seu avanço fica salvo no navegador para continuar de onde parou.</p>
      </article>
      <article class="info-card">
        <h3>Trilhas flexíveis</h3>
        <p>
          Uma trilha pode reunir vários cursos e um curso pode aparecer em mais
          de uma trilha.
        </p>
      </article>
    </div>
  </section>
</main>

<style>
  .page {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .hero {
    display: flex;
    align-items: center;
    min-height: 280px;
    background: var(--hero-bg);
    color: var(--hero-text);
    padding: 1rem;
  }

  .hero h1 {
    font-size: 2.2rem;
    margin: 0.25rem 0 0.75rem;
  }

  .hero .eyebrow {
    color: var(--hero-text);
  }

  .hero-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1rem;
  }

  .hero button {
    padding: 0.8rem 1rem;
    border-radius: 999px;
    border: 0;
    background: rgba(255, 255, 255, 0.35);
    color: var(--hero-text);
    box-shadow: 0 6px 16px rgba(17, 17, 17, 0.12);
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .ghost {
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
  }

  .featured-grid,
  .info-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 0.5rem;
    background: var(--surface-soft);
  }
</style>
