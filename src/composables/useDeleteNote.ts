import { ref } from 'vue'
import { toast } from 'vue-sonner'
import { useNotesStore } from '@/stores/notesStore'

/**
 * Composable for handling note deletion with loading state and toast notifications.
 */
export function useDeleteNote() {
  const notesStore = useNotesStore()
  const isDeleting = ref(false)

  async function deleteNote(noteId: string): Promise<boolean> {
    isDeleting.value = true

    try {
      await notesStore.deleteNote(noteId)
      toast.success('Note deleted successfully')
      return true
    } catch {
      toast.error('Failed to delete note')
      return false
    } finally {
      isDeleting.value = false
    }
  }

  return {
    isDeleting,
    deleteNote,
  }
}
