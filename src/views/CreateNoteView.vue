<script setup lang="ts">
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import { useNotesStore } from '@/stores/notesStore'
import type { NoteFormValues } from '@/schemas/noteSchema'
import NoteForm from '@/components/NoteForm.vue'

const router = useRouter()
const notesStore = useNotesStore()

async function handleSubmit(data: NoteFormValues) {
  try {
    await notesStore.addNote(data)
    toast.success('Note created successfully')
  } catch {
    toast.error('Failed to create note')
  }
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <NoteForm mode="create" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>
