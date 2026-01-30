<script setup lang="ts">
import type { Note } from '@/types'

interface Props {
  note: Note
}

interface Emits {
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleEdit() {
}

function handleDelete() {
}
</script>

<template>
  <div>
    <div>
      <h3>{{ note.title }}</h3>
    </div>

    <p>{{ note.description }}</p>

    <!-- note footer -->
    <div class="note-footer">
      <!-- note actions -->
      <div class="note-actions">
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
