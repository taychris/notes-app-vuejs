import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '../notesStore'

describe('Notes Store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    it('should initialize with empty notes', () => {
        const store = useNotesStore()
        expect(store.notes).toEqual([])
        expect(store.selectedCategory).toBe('All')
        expect(store.isLoading).toBe(false)
        expect(store.error).toBe(null)
    })
})
