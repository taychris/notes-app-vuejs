import type { Note, CreateNoteDto, UpdateNoteDto } from '@/types'

// Mock API base URL - replace with actual API endpoint
const API_BASE_URL = 'http://localhost:3001'

/**
 * Mock API service for managing notes
 * In a real application, this would connect to a backend API
 * 
 * For testing, candidates can use:
 * - json-server: https://www.npmjs.com/package/json-server
 * - MockAPI: https://mockapi.io/
 * - MSW (Mock Service Worker): https://mswjs.io/
 */

export const notesApi = {
    /**
     * Fetch all notes from the API
     */
    async fetchNotes(): Promise<Note[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/notes`)
            if (!response.ok) {
                throw new Error('Failed to fetch notes')
            }
            return await response.json()
        } catch (error) {
            console.error('Error fetching notes:', error)
            // Return mock data for development when API is not available
            return []
        }
    },

    /**
     * Create a new note
     */
    async createNote(noteData: CreateNoteDto): Promise<Note> {
        try {
            const newNote = {
                ...noteData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const response = await fetch(`${API_BASE_URL}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newNote)
            })

            if (!response.ok) {
                throw new Error('Failed to create note')
            }

            return await response.json()
        } catch (error) {
            console.error('Error creating note:', error)
            // Fallback for development
            return {
                ...noteData,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }
    },

    /**
     * Update an existing note
     */
    async updateNote(noteData: UpdateNoteDto): Promise<Note> {
        try {
            const updatedNote = {
                ...noteData,
                updatedAt: new Date().toISOString()
            }

            const response = await fetch(`${API_BASE_URL}/notes/${noteData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedNote)
            })

            if (!response.ok) {
                throw new Error('Failed to update note')
            }

            return await response.json()
        } catch (error) {
            console.error('Error updating note:', error)
            throw error
        }
    },

    /**
     * Delete a note by ID
     */
    async deleteNote(id: string): Promise<void> {
        try {
            const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
                method: 'DELETE'
            })

            if (!response.ok) {
                throw new Error('Failed to delete note')
            }
        } catch (error) {
            console.error('Error deleting note:', error)
            throw error
        }
    }
}
