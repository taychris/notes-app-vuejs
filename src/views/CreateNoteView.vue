<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCreateNote } from '@/composables/useCreateNote'
import type { NoteFormValues } from '@/schemas/noteSchema'
import NoteForm from '@/components/NoteForm.vue'

const router = useRouter()

const { isCreating, createNote } = useCreateNote()

async function handleSubmit(data: NoteFormValues) {
  await createNote(data)
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <NoteForm mode="create" :is-loading="isCreating" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>
