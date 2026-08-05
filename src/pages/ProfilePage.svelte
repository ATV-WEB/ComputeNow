<script lang="ts">
  import { courses } from "../data/content";
  import CourseCard from "../lib/CourseCard.svelte";

  export let completed: Record<string, boolean>;
  export let onClearProgress: () => void;
  export let onClearCourseProgress: (courseId: string) => void;
</script>

<main class="page">
  <section class="card profile-card">
    <div class="section-head">
      <div>
        <p class="eyebrow">Perfil</p>
        <h2>Seu progresso</h2>
      </div>
      <button class="clear-course" on:click={onClearProgress}>Limpar dados</button>
    </div>
    <div class="cards-grid">
      {#each courses as course}
        <div class="course-stack">
          <CourseCard {course} {completed} onOpenCourse={() => undefined} />
          <button
            class="clear-course"
            on:click={() => onClearCourseProgress(course.id)}
          >
            Limpar progresso deste curso
          </button>
        </div>
      {/each}
    </div>
  </section>
</main>

<style>
  .cards-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  }

  .profile-card {
    display: flex;
    flex-direction: column;
    gap: 0.7rem;
  }

  .course-stack {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .clear-course {
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface-soft);
    color: var(--text);
    cursor: pointer;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }
</style>
