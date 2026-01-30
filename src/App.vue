<script setup lang="ts">
import { RouterView } from 'vue-router'
import DarkModeToggle from './components/DarkModeToggle.vue';
import Button from './components/ui/button/Button.vue';
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
</script>

<template>
  <div class="app relative">
    <header class="flex items-center justify-between px-4 md:px-10 py-2 sticky top-0 left-0 bg-background w-screen z-10">
      <Button as-child variant="ghost" class="px-0 hover:bg-background hover:opacity-70">
        <router-link to="/" class="font-medium text-lg">📝 Notes App</router-link>
      </Button>
      <DarkModeToggle />
    </header>

    <main class="min-h-screen pt-10 px-5 md:px-10">
      <div class="max-w-xl mx-auto">
        <RouterView />
      </div>
    </main>

    <footer class="py-10">
      <div class="text-center font-light text-sm">
        <p>Built with Vue 3 + TypeScript + Pinia</p>
      </div>
    </footer>
    <Toaster />
  </div>
</template>

<style></style>

<style scoped></style>
