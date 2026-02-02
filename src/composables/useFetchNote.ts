import { ref, computed, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notesStore'

/**
 * Composable for fetching a single note by ID.
 * Handles the case where the store is empty (e.g., direct URL access)
 * by fetching notes from the API.
 */
export function useFetchNote(noteId: string) {
  const notesStore = useNotesStore()

  const isLoading = ref(false)
  const notFound = ref(false)

  const note = computed(() => notesStore.noteById(noteId))

  onMounted(async () => {
    if (!note.value) {
      isLoading.value = true
      try {
        await notesStore.fetchNotes(true)
        if (!notesStore.noteById(noteId)) {
          notFound.value = true
        }
      } catch {
        notFound.value = true
      } finally {
        isLoading.value = false
      }
    }
  })

  return {
    note,
    isLoading,
    notFound,
  }
}
