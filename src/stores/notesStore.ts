import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types'
import { Category } from '@/types'
import { notesApi } from '@/services/notesApi'

export const useNotesStore = defineStore('notes', () => {
    const notes = ref<Note[]>([])
    const selectedCategory = ref<Category | 'All'>('All')
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    const filteredNotes = computed(() => {
        return notes.value
    })

    const sortedNotes = computed(() => {
        return filteredNotes.value
    })

    const noteById = computed(() => {
        return (id: string) => {
            return undefined
        }
    })

    const totalNotes = computed(() => {
        return 0
    })

    const notesByCategory = computed(() => {
        const categoryCounts: Record<string, number> = {
            All: 0
        }
        return categoryCounts
    })

    async function fetchNotes() {
    }

    async function addNote(noteData: CreateNoteDto) {
    }

    async function updateNote(noteData: UpdateNoteDto) {
    }

    async function deleteNote(id: string) {
    }

    function setCategory(category: Category | 'All') {
        selectedCategory.value = category
    }

    function clearError() {
    }

    return {
        notes,
        selectedCategory,
        isLoading,
        error,
        filteredNotes,
        sortedNotes,
        noteById,
        totalNotes,
        notesByCategory,
        fetchNotes,
        addNote,
        updateNote,
        deleteNote,
        setCategory,
        clearError
    }
})
