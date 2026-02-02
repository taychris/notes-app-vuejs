import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '@/stores/notesStore'
import { useCreateNote } from '@/composables/useCreateNote'
import { toast } from 'vue-sonner'
import { Category, type CreateNoteDto, type Note } from '@/types'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('useCreateNote', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes a non-creating initial state', () => {
    const { isCreating } = useCreateNote()
    expect(isCreating.value).toBe(false)
  })

  it('creates a note, shows a success toast, and returns true', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test title',
      description: 'Test description',
      category: Category.PERSONAL,
    }

    const store = useNotesStore()
    const createdNote: Note = {
      id: 'note-1',
      title: noteData.title,
      description: noteData.description,
      category: noteData.category,
      createdAt: '2026-02-02T00:00:00.000Z',
      updatedAt: '2026-02-02T00:00:00.000Z',
    }
    const addSpy = vi.spyOn(store, 'addNote').mockResolvedValueOnce(createdNote)

    const { isCreating, createNote } = useCreateNote()
    await expect(createNote(noteData)).resolves.toBe(true)

    expect(addSpy).toHaveBeenCalledTimes(1)
    expect(addSpy).toHaveBeenCalledWith(noteData)
    expect(toast.success).toHaveBeenCalledWith('Note created successfully')
    expect(toast.error).not.toHaveBeenCalled()
    expect(isCreating.value).toBe(false)
  })

  it('sets isCreating to true while creation is pending and resets it after resolve', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test title',
      description: 'Test description',
      category: Category.WORK,
    }

    const store = useNotesStore()
    const d = deferred<Note>()
    vi.spyOn(store, 'addNote').mockReturnValueOnce(d.promise)

    const { isCreating, createNote } = useCreateNote()
    const promise = createNote(noteData)

    expect(isCreating.value).toBe(true)
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()

    d.resolve({
      id: 'note-1',
      title: noteData.title,
      description: noteData.description,
      category: noteData.category,
      createdAt: '2026-02-02T00:00:00.000Z',
      updatedAt: '2026-02-02T00:00:00.000Z',
    })
    await expect(promise).resolves.toBe(true)
    expect(isCreating.value).toBe(false)
  })

  it('shows an error toast and returns false when the store rejects', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test title',
      description: 'Test description',
      category: Category.IDEAS,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'addNote').mockRejectedValueOnce(new Error('Boom'))

    const { isCreating, createNote } = useCreateNote()
    await expect(createNote(noteData)).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to create note')
    expect(toast.success).not.toHaveBeenCalled()
    expect(isCreating.value).toBe(false)
  })

  it('returns false and resets isCreating even for synchronous throws', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test title',
      description: 'Test description',
      category: Category.TODO,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'addNote').mockImplementationOnce(() => {
      throw new Error('Sync boom')
    })

    const { isCreating, createNote } = useCreateNote()
    await expect(createNote(noteData)).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to create note')
    expect(isCreating.value).toBe(false)
  })

  it('handles non-Error rejections by returning false and showing an error toast', async () => {
    const noteData: CreateNoteDto = {
      title: 'Test title',
      description: 'Test description',
      category: Category.OTHER,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'addNote').mockRejectedValueOnce('nope')

    const { createNote } = useCreateNote()
    await expect(createNote(noteData)).resolves.toBe(false)
    expect(toast.error).toHaveBeenCalledWith('Failed to create note')
  })
})
