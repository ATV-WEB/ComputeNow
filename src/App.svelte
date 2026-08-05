<script lang="ts">
  import { onMount } from "svelte";
  import { courses } from "./data/content";
  import Topbar from "./lib/Topbar.svelte";
  import Footer from "./lib/Footer.svelte";
  import HomePage from "./pages/HomePage.svelte";
  import CoursesPage from "./pages/CoursesPage.svelte";
  import TracksPage from "./pages/TracksPage.svelte";
  import ProfilePage from "./pages/ProfilePage.svelte";
  import ChapterPage from "./pages/ChapterPage.svelte";
  import {
    readProgress,
    readTheme,
    saveProgress,
    saveTheme,
  } from "./lib/utils";
  import type { View } from "./types";

  let currentView: View = "home";
  let theme: "light" | "dark" = "light";
  let completed: Record<string, boolean> = {};
  let currentCourse = null as (typeof courses)[number] | null;
  let currentChapter = null as
    | (typeof courses)[number]["modules"][number]["chapters"][number]
    | null;

  const resolveRoute = (path: string) => {
    const normalized = path.replace(/^\/+|\/+$/g, "") || "home";
    const parts = normalized.split("/");

    if (parts[0] === "cursos") {
      currentView = "courses";
      currentCourse = null;
      currentChapter = null;
      return;
    }

    if (parts[0] === "trilhas") {
      currentView = "tracks";
      currentCourse = null;
      currentChapter = null;
      return;
    }

    if (parts[0] === "perfil") {
      currentView = "profile";
      currentCourse = null;
      currentChapter = null;
      return;
    }

    if (parts[0] === "curso" && parts[2] === "capitulo") {
      const course = courses.find((item) => item.id === parts[1]) ?? null;
      const chapter =
        course?.modules
          .flatMap((module) => module.chapters)
          .find((item) => item.id === parts[3]) ?? null;

      currentCourse = course;
      currentChapter = chapter;
      currentView = chapter ? "chapter" : "home";
      return;
    }

    currentView = "home";
    currentCourse = null;
    currentChapter = null;
  };

  const goToRoute = (path: string, shouldPush = true) => {
    const nextPath = path.startsWith("/") ? path : `/${path}`;
    if (shouldPush) {
      window.history.pushState({}, "", nextPath);
    } else {
      window.history.replaceState({}, "", nextPath);
    }
    resolveRoute(nextPath);
  };

  const openChapter = (courseId: string, chapterId: string) => {
    const course = courses.find((item) => item.id === courseId) ?? null;
    const chapter =
      course?.modules
        .flatMap((module) => module.chapters)
        .find((item) => item.id === chapterId) ?? null;

    currentCourse = course;
    currentChapter = chapter;
    currentView = "chapter";
    if (course && chapter) {
      goToRoute(`/curso/${course.id}/capitulo/${chapter.id}`);
    }
  };

  const markCompleted = (chapterId: string) => {
    completed = { ...completed, [chapterId]: true };
    saveProgress(completed);
  };

  const toggleCompleted = (chapterId: string, value: boolean) => {
    if (value) {
      completed = { ...completed, [chapterId]: true };
    } else {
      const nextCompleted = { ...completed };
      delete nextCompleted[chapterId];
      completed = nextCompleted;
    }
    saveProgress(completed);
  };

  const clearProgress = () => {
    completed = {};
    saveProgress(completed);
  };

  const clearCourseProgress = (courseId: string) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;

    const chapterIds = course.modules.flatMap((module) =>
      module.chapters.map((chapter) => chapter.id),
    );
    const nextCompleted = { ...completed };
    chapterIds.forEach((chapterId) => {
      delete nextCompleted[chapterId];
    });

    completed = nextCompleted;
    saveProgress(completed);
  };

  const navigate = (view: View) => {
    if (view === "home") {
      goToRoute("/");
      return;
    }

    if (view === "courses") {
      goToRoute("/cursos");
      return;
    }

    if (view === "tracks") {
      goToRoute("/trilhas");
      return;
    }

    if (view === "profile") {
      goToRoute("/perfil");
      return;
    }
  };

  const toggleTheme = () => {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    saveTheme(theme);
  };

  onMount(() => {
    completed = readProgress();
    theme = readTheme();
    document.documentElement.setAttribute("data-theme", theme);

    const redirectPath = new URLSearchParams(window.location.search).get(
      "redirect",
    );
    const initialPath = redirectPath ?? window.location.pathname;
    resolveRoute(initialPath);

    window.addEventListener("popstate", () => {
      resolveRoute(window.location.pathname);
    });
  });
</script>

<svelte:head>
  <title>ComputeNow</title>
  <meta
    name="description"
    content="Plataforma gratuita de cursos com trilhas e progresso local"
  />
</svelte:head>

<div class="app-shell">
  <Topbar
    {currentView}
    {theme}
    onNavigate={navigate}
    onToggleTheme={toggleTheme}
  />

  {#if currentView === "home"}
    <HomePage {completed} onNavigate={navigate} onOpenCourse={openChapter} />
  {:else if currentView === "courses"}
    <CoursesPage {completed} onOpenCourse={openChapter} />
  {:else if currentView === "tracks"}
    <TracksPage {completed} onOpenCourse={openChapter} />
  {:else if currentView === "profile"}
    <ProfilePage
      {completed}
      onClearProgress={clearProgress}
      onClearCourseProgress={clearCourseProgress}
    />
  {:else if currentView === "chapter" && currentCourse && currentChapter}
    <ChapterPage
      {currentCourse}
      {currentChapter}
      {completed}
      onOpenChapter={openChapter}
      onMarkCompleted={markCompleted}
      onToggleCompleted={toggleCompleted}
    />
  {/if}

  <Footer />
</div>

<style>
  .app-shell {
    min-height: 100vh;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    max-width: 1440px;
    margin: 0 auto;
  }
</style>
