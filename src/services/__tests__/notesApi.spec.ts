import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notesApi } from '@/services/notesApi'
import { Category, type CreateNoteDto, type Note, type UpdateNoteDto } from '@/types'

const API_BASE_URL = 'http://localhost:3001'

function mockFetchResponse<T>(data: T, ok = true) {
  return {
    ok,
    json: vi.fn(async () => data),
  } satisfies Pick<Response, 'ok' | 'json'>
}

describe('notesApi', () => {
  const fixedNow = new Date('2024-01-02T03:04:05.000Z')

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(fixedNow)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  describe('fetchNotes', () => {
    it('fetches notes from the API', async () => {
      const apiNotes: Note[] = [
        {
          id: 'n1',
          title: 'T1',
          description: 'D1',
          category: Category.PERSONAL,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ]

      const response = mockFetchResponse(apiNotes, true)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.fetchNotes()).resolves.toEqual(apiNotes)
      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/notes`)
    })

    it('returns an empty array when the API returns a non-ok response', async () => {
      const response = mockFetchResponse({ message: 'nope' }, false)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.fetchNotes()).resolves.toEqual([])
      expect(console.error).toHaveBeenCalled()
    })

    it('returns an empty array when the fetch call throws', async () => {
      const fetchMock = vi.fn(async () => {
        throw new Error('Network down')
      })
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.fetchNotes()).resolves.toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('createNote', () => {
    const noteData: CreateNoteDto = {
      title: 'New',
      description: 'Desc',
      category: Category.WORK,
    }

    it('creates a note via the API and returns the server response', async () => {
      const cryptoMock = {
        randomUUID: vi.fn(() => 'uuid-1'),
      }
      vi.stubGlobal('crypto', cryptoMock)

      const serverNote: Note = {
        id: 'server-id',
        title: noteData.title,
        description: noteData.description,
        category: noteData.category,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }

      const response = mockFetchResponse(serverNote, true)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.createNote(noteData)).resolves.toEqual(serverNote)

      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noteData,
          id: 'uuid-1',
          createdAt: fixedNow.toISOString(),
          updatedAt: fixedNow.toISOString(),
        }),
      })
    })

    it('falls back to a locally-created note when the API returns a non-ok response', async () => {
      const cryptoMock = {
        randomUUID: vi.fn().mockReturnValueOnce('uuid-try').mockReturnValueOnce('uuid-fallback'),
      }
      vi.stubGlobal('crypto', cryptoMock)

      const response = mockFetchResponse({ message: 'nope' }, false)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.createNote(noteData)).resolves.toEqual({
        ...noteData,
        id: 'uuid-fallback',
        createdAt: fixedNow.toISOString(),
        updatedAt: fixedNow.toISOString(),
      })

      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noteData,
          id: 'uuid-try',
          createdAt: fixedNow.toISOString(),
          updatedAt: fixedNow.toISOString(),
        }),
      })
      expect(console.error).toHaveBeenCalled()
    })

    it('falls back to a locally-created note when the fetch call throws', async () => {
      const cryptoMock = {
        randomUUID: vi.fn().mockReturnValueOnce('uuid-try').mockReturnValueOnce('uuid-fallback'),
      }
      vi.stubGlobal('crypto', cryptoMock)

      const fetchMock = vi.fn(async () => {
        throw new Error('Network down')
      })
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.createNote(noteData)).resolves.toEqual({
        ...noteData,
        id: 'uuid-fallback',
        createdAt: fixedNow.toISOString(),
        updatedAt: fixedNow.toISOString(),
      })
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('updateNote', () => {
    const noteData: UpdateNoteDto = {
      id: 'n1',
      title: 'Updated',
      description: 'Updated Desc',
      category: Category.IDEAS,
    }

    it('updates a note via the API and returns the server response', async () => {
      const serverNote: Note = {
        ...noteData,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
      }

      const response = mockFetchResponse(serverNote, true)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.updateNote(noteData)).resolves.toEqual(serverNote)
      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/notes/${noteData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...noteData,
          updatedAt: fixedNow.toISOString(),
        }),
      })
    })

    it('throws when the API returns a non-ok response', async () => {
      const response = mockFetchResponse({ message: 'nope' }, false)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.updateNote(noteData)).rejects.toThrow('Failed to update note')
      expect(console.error).toHaveBeenCalled()
    })

    it('throws when the fetch call throws', async () => {
      const fetchMock = vi.fn(async () => {
        throw new Error('Network down')
      })
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.updateNote(noteData)).rejects.toThrow('Network down')
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('deleteNote', () => {
    it('deletes a note via the API', async () => {
      const response = mockFetchResponse(null, true)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.deleteNote('n1')).resolves.toBeUndefined()
      expect(fetchMock).toHaveBeenCalledWith(`${API_BASE_URL}/notes/n1`, { method: 'DELETE' })
    })

    it('throws when the API returns a non-ok response', async () => {
      const response = mockFetchResponse(null, false)
      const fetchMock = vi.fn(async () => response)
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.deleteNote('n1')).rejects.toThrow('Failed to delete note')
      expect(console.error).toHaveBeenCalled()
    })

    it('throws when the fetch call throws', async () => {
      const fetchMock = vi.fn(async () => {
        throw new Error('Network down')
      })
      vi.stubGlobal('fetch', fetchMock)

      await expect(notesApi.deleteNote('n1')).rejects.toThrow('Network down')
      expect(console.error).toHaveBeenCalled()
    })
  })
})
