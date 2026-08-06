<script lang="ts">
  import { courses, tracks } from "../data/content";
  import CourseCard from "../lib/CourseCard.svelte";

  export let completed: Record<string, boolean>;
  export let onOpenCourse: (courseId: string, chapterId: string) => void;
</script>

<main class="page">
  <section class="card">
    <div class="section-head">
      <div>
        <p class="eyebrow">Trilhas</p>
      </div>
    </div>
    <div class="cards-grid">
      {#each tracks as track}
        <article class="track-card card">
          <h3 class="track-title">{track.title}</h3>
          <p class="track-description">{track.description}</p>
          <div class="track-courses">
            {#each track.courseIds as courseId}
              {@const course = courses.find((item) => item.id === courseId)}
              {#if course}
                <CourseCard
                  {course}
                  {completed}
                  {onOpenCourse}
                  showTrack={false}
                />
              {/if}
            {/each}
          </div>
        </article>
      {/each}
    </div>
  </section>
</main>

<style>
  .cards-grid {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    align-items: start;
  }

  .track-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-height: 260px;
    justify-content: flex-start;
  }

  .track-courses {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.55rem;
  }

  .section-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .track-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .track-description {
    margin: 0;
  }
</style>
