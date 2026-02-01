<script setup lang="ts">
import { useNotesStore } from '@/stores/notesStore'
import CategorySelector from '@/components/CategorySelector.vue'

const notesStore = useNotesStore()
</script>

<template>
  <div class="flex flex-col gap-3 mb-6">
    <h3 class="font-medium text-xl">Filter by category</h3>
    <CategorySelector v-model="notesStore.selectedCategory" include-all />
  </div>
</template>
