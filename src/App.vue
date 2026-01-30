<script setup lang="ts">
import { RouterView } from 'vue-router'

</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="container">
        <h1 class="app-title">📝 Notes App</h1>
        <p class="app-subtitle">Your personal note-taking companion</p>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <RouterView />
      </div>
    </main>

    <footer class="app-footer">
      <div class="container">
        <p>Built with Vue 3 + TypeScript + Pinia</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem 0;
}

.app-title {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.app-subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
}

.app-main {
  flex: 1;
  padding: 3rem 0;
}

.app-footer {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  padding: 1.5rem 0;
  text-align: center;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .app-header {
    padding: 1.5rem 0;
  }

  .app-title {
    font-size: 1.75rem;
  }

  .app-subtitle {
    font-size: 1rem;
  }

  .app-main {
    padding: 2rem 0;
  }
}
</style>
