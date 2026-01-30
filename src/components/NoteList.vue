<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import NoteItem from './NoteItem.vue'

const router = useRouter()
const notesStore = useNotesStore()

onMounted(() => {})

function handleEdit(id: string) {}

async function handleDelete(id: string) {}

function handleCreateNote() {}
</script>

<template>
  <ul>
    <li>
      <h2>My Notes</h2>
      <button @click="handleCreateNote">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Note
      </button>
    </li>
  </ul>
</template>

<style scoped></style>
