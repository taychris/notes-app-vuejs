import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '@/stores/notesStore'
import { useUpdateNote } from '@/composables/useUpdateNote'
import { toast } from 'vue-sonner'
import { Category, type Note, type UpdateNoteDto } from '@/types'

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

describe('useUpdateNote', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes a non-updating initial state', () => {
    const { isUpdating } = useUpdateNote()
    expect(isUpdating.value).toBe(false)
  })

  it('updates a note, shows a success toast, and returns true', async () => {
    const noteData: UpdateNoteDto = {
      id: 'note-1',
      title: 'Updated title',
      description: 'Updated description',
      category: Category.WORK,
    }

    const store = useNotesStore()
    const updatedNote: Note = {
      id: noteData.id,
      title: noteData.title,
      description: noteData.description,
      category: noteData.category,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-02-02T00:00:00.000Z',
    }
    const updateSpy = vi.spyOn(store, 'updateNote').mockResolvedValueOnce(updatedNote)

    const { isUpdating, updateNote } = useUpdateNote()
    await expect(updateNote(noteData)).resolves.toBe(true)

    expect(updateSpy).toHaveBeenCalledTimes(1)
    expect(updateSpy).toHaveBeenCalledWith(noteData)
    expect(toast.success).toHaveBeenCalledWith('Note updated successfully')
    expect(toast.error).not.toHaveBeenCalled()
    expect(isUpdating.value).toBe(false)
  })

  it('sets isUpdating to true while update is pending and resets it after resolve', async () => {
    const noteData: UpdateNoteDto = {
      id: 'note-1',
      title: 'Updated title',
      description: 'Updated description',
      category: Category.IDEAS,
    }

    const store = useNotesStore()
    const d = deferred<Note>()
    vi.spyOn(store, 'updateNote').mockReturnValueOnce(d.promise)

    const { isUpdating, updateNote } = useUpdateNote()
    const promise = updateNote(noteData)

    expect(isUpdating.value).toBe(true)
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()

    d.resolve({
      id: noteData.id,
      title: noteData.title,
      description: noteData.description,
      category: noteData.category,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-02-02T00:00:00.000Z',
    })
    await expect(promise).resolves.toBe(true)
    expect(isUpdating.value).toBe(false)
  })

  it('shows an error toast and returns false when the store rejects', async () => {
    const noteData: UpdateNoteDto = {
      id: 'note-1',
      title: 'Updated title',
      description: 'Updated description',
      category: Category.PERSONAL,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'updateNote').mockRejectedValueOnce(new Error('Boom'))

    const { isUpdating, updateNote } = useUpdateNote()
    await expect(updateNote(noteData)).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to update note')
    expect(toast.success).not.toHaveBeenCalled()
    expect(isUpdating.value).toBe(false)
  })

  it('returns false and resets isUpdating even for synchronous throws', async () => {
    const noteData: UpdateNoteDto = {
      id: 'note-1',
      title: 'Updated title',
      description: 'Updated description',
      category: Category.TODO,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'updateNote').mockImplementationOnce(() => {
      throw new Error('Sync boom')
    })

    const { isUpdating, updateNote } = useUpdateNote()
    await expect(updateNote(noteData)).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to update note')
    expect(isUpdating.value).toBe(false)
  })

  it('handles non-Error rejections by returning false and showing an error toast', async () => {
    const noteData: UpdateNoteDto = {
      id: 'note-1',
      title: 'Updated title',
      description: 'Updated description',
      category: Category.OTHER,
    }

    const store = useNotesStore()
    vi.spyOn(store, 'updateNote').mockRejectedValueOnce('nope')

    const { updateNote } = useUpdateNote()
    await expect(updateNote(noteData)).resolves.toBe(false)
    expect(toast.error).toHaveBeenCalledWith('Failed to update note')
  })
})
