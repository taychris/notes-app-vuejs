<script setup lang="ts">
import { ref, watch } from 'vue'
import { Loader2, TrashIcon, XIcon } from 'lucide-vue-next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useDeleteNote } from '@/composables/useDeleteNote'

interface Props {
  noteId: string | null
  noteTitle?: string
}

const props = defineProps<Props>()

const isOpen = defineModel<boolean>('open', { default: false })

const { isDeleting, deleteNote } = useDeleteNote()

// Store the noteId when dialog opens to prevent issues if prop changes
const pendingNoteId = ref<string | null>(null)

watch(isOpen, (open) => {
  if (open && props.noteId) {
    pendingNoteId.value = props.noteId
  }
})

async function handleConfirmDelete() {
  if (!pendingNoteId.value) return

  const success = await deleteNote(pendingNoteId.value)
  if (success) {
    isOpen.value = false
    pendingNoteId.value = null
  }
}

function handleCancel() {
  isOpen.value = false
  pendingNoteId.value = null
}
</script>

<template>
  <AlertDialog v-model:open="isOpen">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete note</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete
          <span v-if="noteTitle" class="font-medium">"{{ noteTitle }}"</span>
          <span v-else>this note</span>?
          This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isDeleting" @click="handleCancel">
          <XIcon class="size-4" />
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          class="bg-red-500 text-white hover:bg-destructive/90"
          :disabled="isDeleting"
          @click.prevent="handleConfirmDelete"
        >
          <Loader2 v-if="isDeleting" class="size-4 animate-spin" />
          <TrashIcon v-if="!isDeleting" class="size-4" />
          {{ isDeleting ? 'Deleting...' : 'Delete' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
