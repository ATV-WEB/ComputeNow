<script lang="ts">
  import { courses } from "../data/content";
  import CourseCard from "../lib/CourseCard.svelte";

  export let completed: Record<string, boolean>;
  export let onOpenCourse: (courseId: string, chapterId: string) => void;
</script>

<main class="page">
  <section class="card">
    <div class="section-head">
      <div class="head">
        <p class="eyebrow">Catálogo</p>
        <h2>Cursos disponíveis</h2>
      </div>
    </div>
    <div class="cards-grid">
      {#each courses as course}
        <CourseCard {course} {completed} {onOpenCourse} showTrack={true} />
      {/each}
    </div>
  </section>
</main>

<style>
  .cards-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    margin-block: 1rem;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .head {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
</style>
