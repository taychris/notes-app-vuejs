<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import { useUpdateNote } from '@/composables/useUpdateNote'
import type { NoteFormValues } from '@/schemas/noteSchema'
import NoteForm from '@/components/NoteForm.vue'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()

const noteId = route.params.id as string
const note = computed(() => notesStore.noteById(noteId))

const { isUpdating, updateNote } = useUpdateNote()

async function handleSubmit(data: NoteFormValues) {
  const success = await updateNote({ id: noteId, ...data })
  if (success) {
    router.push('/')
  }
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <NoteForm
      mode="edit"
      :initial-data="note"
      :is-loading="isUpdating"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>
