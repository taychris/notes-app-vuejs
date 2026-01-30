<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header>
      <div>
        <h1>📝 Notes App</h1>
        <p>Your personal note-taking companion</p>
      </div>
    </header>

    <main>
      <div>
        <RouterView />
      </div>
    </main>

    <footer>
      <div>
        <p>Built with Vue 3 + TypeScript + Pinia</p>
      </div>
    </footer>
  </div>
</template>

<style></style>

<style scoped></style>
