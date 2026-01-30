<script setup lang="ts">
import { useRoute } from 'vue-router'
import NoteForm from '@/components/NoteForm.vue'

const route = useRoute()
const noteId = route.params.id as string
</script>

<template>
  <div class="edit-note-view">
    <NoteForm mode="edit" :note-id="noteId" />
  </div>
</template>

<style scoped>
.edit-note-view {
  width: 100%;
}
</style>
