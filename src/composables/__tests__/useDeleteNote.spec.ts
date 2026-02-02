import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useNotesStore } from '@/stores/notesStore'
import { useDeleteNote } from '@/composables/useDeleteNote'
import { toast } from 'vue-sonner'

vi.mock('vue-sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('useDeleteNote', () => {
  function deferred<T>() {
    let resolve!: (value: T) => void
    let reject!: (reason?: unknown) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve, reject }
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('exposes a non-deleting initial state', () => {
    const { isDeleting } = useDeleteNote()
    expect(isDeleting.value).toBe(false)
  })

  it('deletes a note, shows a success toast, and returns true', async () => {
    const store = useNotesStore()
    const deleteSpy = vi.spyOn(store, 'deleteNote').mockResolvedValueOnce()

    const { isDeleting, deleteNote } = useDeleteNote()
    await expect(deleteNote('note-1')).resolves.toBe(true)

    expect(deleteSpy).toHaveBeenCalledTimes(1)
    expect(deleteSpy).toHaveBeenCalledWith('note-1')
    expect(toast.success).toHaveBeenCalledWith('Note deleted successfully')
    expect(toast.error).not.toHaveBeenCalled()
    expect(isDeleting.value).toBe(false)
  })

  it('sets isDeleting to true while the deletion is pending and resets it after resolve', async () => {
    const store = useNotesStore()
    const d = deferred<void>()
    vi.spyOn(store, 'deleteNote').mockReturnValueOnce(d.promise)

    const { isDeleting, deleteNote } = useDeleteNote()
    const promise = deleteNote('note-1')

    expect(isDeleting.value).toBe(true)
    expect(toast.success).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()

    d.resolve(undefined)
    await expect(promise).resolves.toBe(true)
    expect(isDeleting.value).toBe(false)
  })

  it('shows an error toast and returns false when the store rejects', async () => {
    const store = useNotesStore()
    vi.spyOn(store, 'deleteNote').mockRejectedValueOnce(new Error('Boom'))

    const { isDeleting, deleteNote } = useDeleteNote()
    await expect(deleteNote('note-1')).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to delete note')
    expect(toast.success).not.toHaveBeenCalled()
    expect(isDeleting.value).toBe(false)
  })

  it('returns false and resets isDeleting even for synchronous throws', async () => {
    const store = useNotesStore()
    vi.spyOn(store, 'deleteNote').mockImplementationOnce(() => {
      throw new Error('Sync boom')
    })

    const { isDeleting, deleteNote } = useDeleteNote()
    await expect(deleteNote('note-1')).resolves.toBe(false)

    expect(toast.error).toHaveBeenCalledWith('Failed to delete note')
    expect(isDeleting.value).toBe(false)
  })

  it('handles non-Error rejections by returning false and showing an error toast', async () => {
    const store = useNotesStore()
    vi.spyOn(store, 'deleteNote').mockRejectedValueOnce('nope')

    const { deleteNote } = useDeleteNote()
    await expect(deleteNote('note-1')).resolves.toBe(false)
    expect(toast.error).toHaveBeenCalledWith('Failed to delete note')
  })
})
