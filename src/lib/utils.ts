import { courses } from '../data/content';

export const storageKey = 'computenow-progress';
export const themeKey = 'computenow-theme';

export const readProgress = () => {
  if (typeof window === 'undefined') return {};
  const saved = window.localStorage.getItem(storageKey);
  return saved ? JSON.parse(saved) : {};
};

export const saveProgress = (completed: Record<string, boolean>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, JSON.stringify(completed));
  }
};

export const readTheme = () => {
  if (typeof window === 'undefined') return 'light' as const;
  return (window.localStorage.getItem(themeKey) as 'light' | 'dark' | null) ?? 'light';
};

export const saveTheme = (theme: 'light' | 'dark') => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(themeKey, theme);
  }
};

export const getCourseProgress = (courseId: string, completed: Record<string, boolean>) => {
  const course = courses.find((item) => item.id === courseId);
  if (!course) return 0;
  const allChapters = course.modules.flatMap((module) => module.chapters);
  const completedCount = allChapters.filter((chapter) => completed[chapter.id]).length;
  return Math.round((completedCount / allChapters.length) * 100);
};

export const getModuleCompletion = (
  module: (typeof courses)[number]['modules'][number],
  completed: Record<string, boolean>,
) => {
  const chapterIds = module.chapters.map((chapter) => chapter.id);
  const completedCount = chapterIds.filter((id) => completed[id]).length;
  return {
    completed: completedCount === chapterIds.length && chapterIds.length > 0,
    completedCount,
    total: chapterIds.length,
  };
};

export const getAllChapterEntries = () =>
  courses.flatMap((course) =>
    course.modules.flatMap((module) =>
      module.chapters.map((chapter) => ({
        courseId: course.id,
        chapterId: chapter.id,
      })),
    ),
  );
