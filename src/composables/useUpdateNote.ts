import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useNotesStore } from '@/stores/notesStore'
import type { UpdateNoteDto } from '@/types'

/**
 * Composable for handling note updates with loading state and toast notifications.
 */
export function useUpdateNote() {
  const notesStore = useNotesStore()
  const isUpdating = ref(false)

  async function updateNote(noteData: UpdateNoteDto): Promise<boolean> {
    isUpdating.value = true

    try {
      await notesStore.updateNote(noteData)
      toast.success('Note updated successfully')
      return true
    } catch {
      toast.error('Failed to update note')
      return false
    } finally {
      isUpdating.value = false
    }
  }

  return {
    isUpdating,
    updateNote,
  }
}
