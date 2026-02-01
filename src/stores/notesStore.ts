import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types'
import { Category } from '@/types'
import { notesApi } from '@/services/notesApi'

export const useNotesStore = defineStore(
  'notes',
  () => {
    const notes = ref<Note[]>([])
    const selectedCategory = ref<Category | 'All'>('All')
    const searchQuery = ref('')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    // Returns notes filtered by category and search query, sorted by most recent
    const filteredNotes = computed(() => {
      const query = searchQuery.value.toLowerCase().trim()

      const filtered = notes.value.filter((note) => {
        // Check if note matches the selected category (or 'All' is selected)
        const matchesCategory =
          selectedCategory.value === 'All' || note.category === selectedCategory.value

        // Check if note title or description contains the search query
        const matchesSearch =
          query === '' ||
          note.title.toLowerCase().includes(query) ||
          note.description.toLowerCase().includes(query)

        return matchesCategory && matchesSearch
      })

      // Sort by updatedAt descending (most recent first)
      return filtered.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      )
    })

    const noteById = computed(() => {
      return (id: string) => notes.value.find((note) => note.id === id)
    })

    const totalNotes = computed(() => notes.value.length)

    const notesByCategory = computed(() => {
      const categoryCounts: Record<string, number> = {
        All: notes.value.length,
      }
      for (const category of Object.values(Category)) {
        categoryCounts[category] = notes.value.filter((note) => note.category === category).length
      }
      return categoryCounts
    })

    async function fetchNotes(force = false) {
      // avoid overlapping requests
      if (isLoading.value) return

      // avoid fetching if notes are already loaded unless forced
      if (notes.value.length > 0 && !force) return

      isLoading.value = true
      error.value = null
      try {
        notes.value = await notesApi.fetchNotes()
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to fetch notes'
        throw e
      } finally {
        isLoading.value = false
      }
    }

    async function addNote(noteData: CreateNoteDto) {
      isLoading.value = true
      error.value = null
      try {
        const newNote = await notesApi.createNote(noteData)
        notes.value.push(newNote)
        return newNote
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to create note'
        throw e
      } finally {
        isLoading.value = false
      }
    }

    async function updateNote(noteData: UpdateNoteDto) {
      isLoading.value = true
      error.value = null
      try {
        const updatedNote = await notesApi.updateNote(noteData)
        const index = notes.value.findIndex((note) => note.id === noteData.id)
        if (index !== -1) {
          notes.value[index] = updatedNote
        }
        return updatedNote
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to update note'
        throw e
      } finally {
        isLoading.value = false
      }
    }

    async function deleteNote(id: string) {
      isLoading.value = true
      error.value = null
      try {
        await notesApi.deleteNote(id)
        notes.value = notes.value.filter((note) => note.id !== id)
      } catch (e) {
        error.value = e instanceof Error ? e.message : 'Failed to delete note'
        throw e
      } finally {
        isLoading.value = false
      }
    }

    function setCategory(category: Category | 'All') {
      selectedCategory.value = category
    }

    function setSearchQuery(query: string) {
      searchQuery.value = query
    }

    function clearError() {
      error.value = null
    }

    return {
      notes,
      selectedCategory,
      searchQuery,
      isLoading,
      error,
      filteredNotes,
      noteById,
      totalNotes,
      notesByCategory,
      fetchNotes,
      addNote,
      updateNote,
      deleteNote,
      setCategory,
      setSearchQuery,
      clearError,
    }
  },
  {
    persist: {
      key: 'notesStore',
      pick: ['notes', 'selectedCategory', 'searchQuery'],
    },
  },
)
