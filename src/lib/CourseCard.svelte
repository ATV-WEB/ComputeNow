<script lang="ts">
  import type { Course } from "../data/content";
  import { getCourseProgress } from "../lib/utils";

  export let course: Course;
  export let completed: Record<string, boolean>;
  export let onOpenCourse: (courseId: string, chapterId: string) => void;
  export let showTrack: boolean = false;
</script>

<article class="course-card card">
  <div class="category-row">
    {#if showTrack}
      {#each course.category as category}
        <p class="pill">{category}</p>
      {/each}
    {/if}
  </div>
  <h3 class="course-title">{course.title}</h3>
  <p>{course.description}</p>
  <div class="progress-row">
    <span>{getCourseProgress(course.id, completed)}% concluído</span>
    <button
      class="enter-button"
      on:click={() => onOpenCourse(course.id, course.modules[0].chapters[0].id)}
      >Entrar</button
    >
  </div>
</article>

<style>
  .course-card {
    display: grid;
    grid-template-rows: auto 1fr auto;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background: var(--surface);
    border-top: 4px solid var(--accent);
  }

  .course-title {
    font-size: 1.3rem;
    font-weight: 600;
    margin: 0;
  }

  .category-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pill {
    display: inline-block;
    width: fit-content;
    background: var(--accent-soft-2);
    color: var(--accent);
    padding: 0.35rem 0.65rem;
    border-radius: 999px;
    font-size: 0.8rem;
    border: 1px solid var(--border);
  }

  .progress-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
  }

  .enter-button {
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    border: 1px solid var(--accent);
    background: var(--accent-soft-2);
    color: var(--accent);
    cursor: pointer;
  }
</style>
