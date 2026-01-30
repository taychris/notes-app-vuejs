<script setup lang="ts">
import { ref } from 'vue'
import { Category } from '@/types'
import { useNotesStore } from '@/stores/notesStore'

const notesStore = useNotesStore()

const categories = ref<Array<Category | 'All'>>([
  'All',
  ...Object.values(Category)
])
</script>

<template>
  <div class="category-filter">
    <h3 class="filter-title">Filter by Category</h3>
    <div class="filter-buttons">
    </div>
  </div>
</template>

<style scoped>
.category-filter {
  margin-bottom: 2rem;
}

.filter-title {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
</style>
