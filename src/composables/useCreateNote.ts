import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useNotesStore } from '@/stores/notesStore'
import type { CreateNoteDto } from '@/types'

/**
 * Composable for handling note creation with loading state and toast notifications.
 */
export function useCreateNote() {
  const notesStore = useNotesStore()
  const isCreating = ref(false)

  async function createNote(noteData: CreateNoteDto): Promise<boolean> {
    isCreating.value = true

    try {
      await notesStore.addNote(noteData)
      toast.success('Note created successfully')
      return true
    } catch {
      toast.error('Failed to create note')
      return false
    } finally {
      isCreating.value = false
    }
  }

  return {
    isCreating,
    createNote,
  }
}
