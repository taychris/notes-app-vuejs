<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useFetchNote } from '@/composables/useFetchNote'
import { useUpdateNote } from '@/composables/useUpdateNote'
import type { NoteFormValues } from '@/schemas/noteSchema'
import NoteFormCustomValidation from '@/components/NoteFormCustomValidation.vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const router = useRouter()

const noteId = route.params.id as string
const { note, isLoading, notFound } = useFetchNote(noteId)

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
  <div v-if="isLoading" class="flex flex-col items-center justify-center h-[75vh] text-center">
    <p class="text-muted-foreground">Loading note...</p>
  </div>
  <div v-else-if="notFound" class="flex flex-col items-center justify-center h-[75vh] text-center">
    <h2 class="text-2xl font-medium mb-2">Note not found</h2>
    <p class="text-muted-foreground mb-4">The note you're looking for doesn't exist or has been deleted.</p>
    <Button @click="router.push('/')">Back to Notes</Button>
  </div>
  <NoteFormCustomValidation v-else mode="edit" :initial-data="note" :is-loading="isUpdating" @submit="handleSubmit"
    @cancel="handleCancel" />
</template>
