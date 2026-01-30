<script setup lang="ts">
import { ref } from 'vue'
import { Category } from '@/types'
import { useNotesStore } from '@/stores/notesStore'

const notesStore = useNotesStore()

const categories = ref<Array<Category | 'All'>>(['All', ...Object.values(Category)])
</script>

<template>
  <div>
    <h3>Filter by Category</h3>
    <div></div>
  </div>
</template>

<style scoped>
</style>
