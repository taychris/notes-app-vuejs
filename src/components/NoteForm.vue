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
  mode: 'create',
})

const router = useRouter()
const notesStore = useNotesStore()

const title = ref('')
const description = ref('')
const category = ref<Category>(Category.PERSONAL)
const isSubmitting = ref(false)
const submitError = ref('')

const categories = Object.values(Category)

async function handleSubmit() {}

function handleCancel() {}
</script>

<template>
  <div>
    <h2>{{ mode === 'edit' ? 'Edit Note' : 'Create New Note' }}</h2>

    <form @submit.prevent="handleSubmit">
      <div>
        <label for="title">
          Title
          <span class="required">*</span>
        </label>
        <input id="title" type="text" placeholder="Enter note title..." />
      </div>

      <div>
        <label for="category">
          Category
          <span class="required">*</span>
        </label>
        <select id="category"></select>
      </div>

      <div>
        <label for="description">
          Description
          <span class="required">*</span>
        </label>
        <textarea id="description" placeholder="Enter note description..." rows="6" />
      </div>

      <div>
        <button type="button" @click="handleCancel">Cancel</button>
        <button type="submit">
          {{ mode === 'edit' ? 'Update Note' : 'Create Note' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
