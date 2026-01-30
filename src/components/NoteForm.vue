<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Category, type CreateNoteDto, type UpdateNoteDto } from '@/types'
import { useNotesStore } from '@/stores/notesStore'
import { useNoteValidation } from '@/composables/useNoteValidation'

interface Props {
  noteId?: string
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const router = useRouter()
const notesStore = useNotesStore()

const title = ref('')
const description = ref('')
const category = ref<Category>(Category.PERSONAL)
const isSubmitting = ref(false)
const submitError = ref('')

const categories = Object.values(Category)

async function handleSubmit() {
}

function handleCancel() {
}
</script>

<template>
  <div class="note-form">
    <h2 class="form-title">{{ mode === 'edit' ? 'Edit Note' : 'Create New Note' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="title" class="form-label">
          Title
          <span class="required">*</span>
        </label>
        <input
          id="title"
          type="text"
          class="form-input"
          placeholder="Enter note title..."
        />
      </div>

      <div class="form-group">
        <label for="category" class="form-label">
          Category
          <span class="required">*</span>
        </label>
        <select id="category" class="form-select">
        </select>
      </div>

      <div class="form-group">
        <label for="description" class="form-label">
          Description
          <span class="required">*</span>
        </label>
        <textarea
          id="description"
          class="form-textarea"
          placeholder="Enter note description..."
          rows="6"
        />
      </div>

      <div class="form-actions">
        <button
          type="button"
          class="btn btn-secondary"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
        >
          {{ mode === 'edit' ? 'Update Note' : 'Create Note' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.note-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #42b983;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #359268;
}

.btn-secondary {
  background-color: #e0e0e0;
  color: #2c3e50;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #bdbdbd;
}
</style>
