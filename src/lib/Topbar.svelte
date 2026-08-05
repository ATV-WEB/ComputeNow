<script lang="ts">
  import type { View } from "../types";

  export let currentView: View;
  export let theme: "light" | "dark";
  export let onNavigate: (view: View) => void;
  export let onToggleTheme: () => void;
</script>

<header class="topbar">
  <nav class="nav-links">
    <button
      class:active={currentView === "home"}
      on:click={() => onNavigate("home")}>Início</button
    >
    <button
      class:active={currentView === "courses"}
      on:click={() => onNavigate("courses")}>Cursos</button
    >
    <button
      class:active={currentView === "tracks"}
      on:click={() => onNavigate("tracks")}>Trilhas</button
    >
  </nav>
  <div class="topbar-actions">
    <button
      class="theme-toggle"
      on:click={onToggleTheme}
      aria-label="Alternar tema"
    >
      {#if theme === "light"}
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path
            class="icon-stroke"
            d="M12 3v2.5M12 18.5V21M4.5 12H3m18 0h-1.5M6.1 6.1l-1.06-1.06M19.96 19.96l-1.06-1.06M6.1 17.9l-1.06 1.06M19.96 4.04l-1.06 1.06M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z"
          />
        </svg>
      {:else}
        <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
          <path
            class="icon-stroke"
            d="M20 15.5A8 8 0 1 1 8.5 4a6.5 6.5 0 1 0 11.5 11.5Z"
          />
        </svg>
      {/if}
    </button>
    <button
      class="profile-badge"
      on:click={() => onNavigate("profile")}
      aria-label="Perfil e progresso"
    >
      <svg viewBox="0 0 24 24" class="icon" aria-hidden="true">
        <path
          class="icon-stroke"
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 1 1 14 0"
        />
      </svg>
    </button>
  </div>
</header>

<style>
  .topbar {
    position: sticky;
    top: 0;
    z-index: 20;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    height: var(--header-height);
  }

  .nav-links,
  .topbar-actions {
    display: flex;
    gap: 0.75rem;
  }

  .theme-toggle,
  .profile-badge {
    padding: 0.7rem;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
    cursor: pointer;
  }

  .icon {
    width: 1.1rem;
    height: 1.1rem;
  }

  .nav-links button {
    padding: 0.7rem 0.95rem;
    border-radius: 999px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--text);
    cursor: pointer;
    font-weight: 700;
  }

  .nav-links button.active {
    background: var(--accent-soft);
    border-color: var(--border);
    color: var(--accent-3);
  }

  @media (max-width: 800px) {
    .topbar {
      flex-wrap: wrap;
      gap: 0.75rem;
    }
  }
</style>
