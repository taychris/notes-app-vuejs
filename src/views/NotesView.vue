<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotesStore } from '@/stores/notesStore'
import CategoryFilter from '@/components/CategoryFilter.vue'
import NoteList from '@/components/NoteList.vue'

const notesStore = useNotesStore()

onMounted(() => {
  notesStore.fetchNotes()
})
</script>

<template>
  <div>
    <CategoryFilter />
    <NoteList />
  </div>
</template>

<style scoped></style>
