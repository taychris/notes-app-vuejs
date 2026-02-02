import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotesStore } from '../notesStore'
import { notesApi } from '@/services/notesApi'
import { Category, type CreateNoteDto, type Note, type UpdateNoteDto } from '@/types'

vi.mock('@/services/notesApi', () => ({
  notesApi: {
    fetchNotes: vi.fn(),
    createNote: vi.fn(),
    updateNote: vi.fn(),
    deleteNote: vi.fn(),
  },
}))

describe('Notes Store', () => {
  function deferred<T>() {
    let resolve!: (value: T) => void
    let reject!: (reason?: unknown) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }

  function makeNote(overrides: Partial<Note> & Pick<Note, 'id'>): Note {
    return {
      id: overrides.id,
      title: overrides.title ?? 'T',
      description: overrides.description ?? 'D',
      category: overrides.category ?? Category.PERSONAL,
      createdAt: overrides.createdAt ?? '2024-01-01T00:00:00.000Z',
      updatedAt: overrides.updatedAt ?? '2024-01-01T00:00:00.000Z',
    }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('initializes with default state', () => {
    const store = useNotesStore()
    expect(store.notes).toEqual([])
    expect(store.selectedCategory).toBe('All')
    expect(store.searchQuery).toBe('')
    expect(store.isLoading).toBe(false)
    expect(store.error).toBe(null)
  })

  it('computes filtered notes by category, search query, and updatedAt desc', () => {
    const store = useNotesStore()

    const n1 = makeNote({
      id: 'n1',
      title: 'Alpha',
      description: 'First',
      category: Category.PERSONAL,
      updatedAt: '2024-01-02T00:00:00.000Z',
    })
    const n2 = makeNote({
      id: 'n2',
      title: 'Beta',
      description: 'Second',
      category: Category.WORK,
      updatedAt: '2024-01-03T00:00:00.000Z',
    })
    const n3 = makeNote({
      id: 'n3',
      title: 'Gamma',
      description: 'has alpha inside',
      category: Category.WORK,
      updatedAt: '2024-01-01T00:00:00.000Z',
    })

    store.notes = [n1, n2, n3]
    expect(store.filteredNotes.map((n) => n.id)).toEqual(['n2', 'n1', 'n3'])

    store.setCategory(Category.WORK)
    expect(store.filteredNotes.map((n) => n.id)).toEqual(['n2', 'n3'])

    store.setSearchQuery('  ALPHA ')
    expect(store.filteredNotes.map((n) => n.id)).toEqual(['n3'])
  })

  it('computes note lookups and counts', () => {
    const store = useNotesStore()
    const n1 = makeNote({ id: 'n1', category: Category.PERSONAL })
    const n2 = makeNote({ id: 'n2', category: Category.WORK })
    const n3 = makeNote({ id: 'n3', category: Category.WORK })

    store.notes = [n1, n2, n3]

    expect(store.noteById('n2')).toEqual(n2)
    expect(store.noteById('missing')).toBeUndefined()
    expect(store.totalNotes).toBe(3)
    expect(store.notesByCategory).toEqual({
      All: 3,
      [Category.PERSONAL]: 1,
      [Category.WORK]: 2,
      [Category.IDEAS]: 0,
      [Category.TODO]: 0,
      [Category.OTHER]: 0,
    })
  })

  it('sets category, search query, and clears error', () => {
    const store = useNotesStore()
    store.setCategory(Category.IDEAS)
    store.setSearchQuery('q')
    store.error = 'boom'
    store.clearError()

    expect(store.selectedCategory).toBe(Category.IDEAS)
    expect(store.searchQuery).toBe('q')
    expect(store.error).toBe(null)
  })

  describe('fetchNotes', () => {
    it('fetches notes and updates loading + error state', async () => {
      const store = useNotesStore()
      const d = deferred<Note[]>()
      const apiNotes = [makeNote({ id: 'n1' })]

      vi.mocked(notesApi.fetchNotes).mockReturnValueOnce(d.promise)
      const promise = store.fetchNotes(true)

      expect(store.isLoading).toBe(true)
      expect(store.error).toBe(null)

      d.resolve(apiNotes)
      await expect(promise).resolves.toBeUndefined()
      expect(store.isLoading).toBe(false)
      expect(store.notes).toEqual(apiNotes)
    })

    it('does not refetch when notes already loaded unless forced', async () => {
      const store = useNotesStore()
      store.notes = [makeNote({ id: 'existing' })]

      vi.mocked(notesApi.fetchNotes).mockResolvedValueOnce([makeNote({ id: 'new' })])
      await store.fetchNotes(false)

      expect(notesApi.fetchNotes).not.toHaveBeenCalled()
      expect(store.notes.map((n) => n.id)).toEqual(['existing'])

      await store.fetchNotes(true)
      expect(notesApi.fetchNotes).toHaveBeenCalledTimes(1)
      expect(store.notes.map((n) => n.id)).toEqual(['new'])
    })

    it('avoids overlapping requests', async () => {
      const store = useNotesStore()
      store.isLoading = true

      await store.fetchNotes(true)
      expect(notesApi.fetchNotes).not.toHaveBeenCalled()
      expect(store.isLoading).toBe(true)
    })

    it('sets error and rethrows when the API throws', async () => {
      const store = useNotesStore()
      const d = deferred<Note[]>()

      vi.mocked(notesApi.fetchNotes).mockReturnValueOnce(d.promise)
      const promise = store.fetchNotes(true)

      expect(store.isLoading).toBe(true)
      d.reject(new Error('Boom'))

      await expect(promise).rejects.toThrow('Boom')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Boom')
    })

    it('uses a fallback error message for non-Error throws', async () => {
      const store = useNotesStore()
      const d = deferred<Note[]>()

      vi.mocked(notesApi.fetchNotes).mockReturnValueOnce(d.promise)
      const promise = store.fetchNotes(true)

      d.reject('nope')
      await expect(promise).rejects.toBe('nope')
      expect(store.error).toBe('Failed to fetch notes')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('addNote', () => {
    it('creates a note, appends it, and returns it', async () => {
      const store = useNotesStore()
      const noteData: CreateNoteDto = {
        title: 'New',
        description: 'Desc',
        category: Category.WORK,
      }
      const created = makeNote({
        id: 'created',
        title: noteData.title,
        description: noteData.description,
        category: noteData.category,
      })

      const d = deferred<Note>()
      vi.mocked(notesApi.createNote).mockReturnValueOnce(d.promise)
      const promise = store.addNote(noteData)

      expect(store.isLoading).toBe(true)
      expect(store.error).toBe(null)

      d.resolve(created)
      await expect(promise).resolves.toEqual(created)
      expect(store.isLoading).toBe(false)
      expect(store.notes).toEqual([created])
    })

    it('sets error and rethrows when the API throws', async () => {
      const store = useNotesStore()
      const noteData: CreateNoteDto = { title: 'T', description: 'D', category: Category.WORK }
      const d = deferred<Note>()

      vi.mocked(notesApi.createNote).mockReturnValueOnce(d.promise)
      const promise = store.addNote(noteData)
      d.reject(new Error('Nope'))

      await expect(promise).rejects.toThrow('Nope')
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe('Nope')
    })

    it('uses a fallback error message for non-Error throws', async () => {
      const store = useNotesStore()
      const noteData: CreateNoteDto = { title: 'T', description: 'D', category: Category.WORK }

      vi.mocked(notesApi.createNote).mockRejectedValueOnce('nope')
      await expect(store.addNote(noteData)).rejects.toBe('nope')
      expect(store.error).toBe('Failed to create note')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('updateNote', () => {
    it('updates an existing note in the store and returns the updated note', async () => {
      const store = useNotesStore()
      const existing = makeNote({ id: 'n1', title: 'Old', updatedAt: '2024-01-01T00:00:00.000Z' })
      store.notes = [existing]

      const noteData: UpdateNoteDto = {
        id: 'n1',
        title: 'New',
        description: 'New Desc',
        category: Category.IDEAS,
      }
      const updated = makeNote({
        id: 'n1',
        title: noteData.title,
        description: noteData.description,
        category: noteData.category,
        createdAt: existing.createdAt,
        updatedAt: '2024-01-02T00:00:00.000Z',
      })

      vi.mocked(notesApi.updateNote).mockResolvedValueOnce(updated)
      await expect(store.updateNote(noteData)).resolves.toEqual(updated)
      expect(store.notes).toEqual([updated])
    })

    it('does not add the note if it is missing locally', async () => {
      const store = useNotesStore()
      const noteData: UpdateNoteDto = {
        id: 'missing',
        title: 'New',
        description: 'New Desc',
        category: Category.IDEAS,
      }
      const updated = makeNote({
        id: 'missing',
        title: noteData.title,
        description: noteData.description,
        category: noteData.category,
      })

      vi.mocked(notesApi.updateNote).mockResolvedValueOnce(updated)
      await store.updateNote(noteData)
      expect(store.notes).toEqual([])
    })

    it('sets error and rethrows when the API throws', async () => {
      const store = useNotesStore()
      const noteData: UpdateNoteDto = {
        id: 'n1',
        title: 'New',
        description: 'New Desc',
        category: Category.IDEAS,
      }

      vi.mocked(notesApi.updateNote).mockRejectedValueOnce(new Error('Nope'))
      await expect(store.updateNote(noteData)).rejects.toThrow('Nope')
      expect(store.error).toBe('Nope')
      expect(store.isLoading).toBe(false)
    })

    it('uses a fallback error message for non-Error throws', async () => {
      const store = useNotesStore()
      const noteData: UpdateNoteDto = {
        id: 'n1',
        title: 'New',
        description: 'New Desc',
        category: Category.IDEAS,
      }

      vi.mocked(notesApi.updateNote).mockRejectedValueOnce('nope')
      await expect(store.updateNote(noteData)).rejects.toBe('nope')
      expect(store.error).toBe('Failed to update note')
      expect(store.isLoading).toBe(false)
    })
  })

  describe('deleteNote', () => {
    it('deletes a note and removes it from the store', async () => {
      const store = useNotesStore()
      const n1 = makeNote({ id: 'n1' })
      const n2 = makeNote({ id: 'n2' })
      store.notes = [n1, n2]

      vi.mocked(notesApi.deleteNote).mockResolvedValueOnce(undefined)
      await store.deleteNote('n1')
      expect(store.notes).toEqual([n2])
    })

    it('sets error and rethrows when the API throws', async () => {
      const store = useNotesStore()
      const n1 = makeNote({ id: 'n1' })
      store.notes = [n1]

      vi.mocked(notesApi.deleteNote).mockRejectedValueOnce(new Error('Nope'))
      await expect(store.deleteNote('n1')).rejects.toThrow('Nope')
      expect(store.error).toBe('Nope')
      expect(store.isLoading).toBe(false)
      expect(store.notes).toEqual([n1])
    })

    it('uses a fallback error message for non-Error throws', async () => {
      const store = useNotesStore()
      vi.mocked(notesApi.deleteNote).mockRejectedValueOnce('nope')

      await expect(store.deleteNote('n1')).rejects.toBe('nope')
      expect(store.error).toBe('Failed to delete note')
      expect(store.isLoading).toBe(false)
    })
  })
})
