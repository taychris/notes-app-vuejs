<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCreateNote } from '@/composables/useCreateNote'
import type { NoteFormValues } from '@/schemas/noteSchema'
import NoteFormCustomValidation from '@/components/NoteFormCustomValidation.vue'

const router = useRouter()

const { isCreating, createNote } = useCreateNote()

async function handleSubmit(data: NoteFormValues, helpers: { reset: () => void }) {
  const success = await createNote(data)
  if (success) helpers.reset()
}

function handleCancel() {
  router.push('/')
}
</script>

<template>
  <div>
    <NoteFormCustomValidation mode="create" :is-loading="isCreating" @submit="handleSubmit" @cancel="handleCancel" />
  </div>
</template>
