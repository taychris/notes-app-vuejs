<script setup lang="ts">
import NoteForm from '@/components/NoteForm.vue'

</script>

<template>
  <div class="create-note-view">
    <NoteForm mode="create" />
  </div>
</template>

<style scoped>
.create-note-view {
  width: 100%;
}
</style>
