<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import NoteItem from './NoteItem.vue'

const router = useRouter()
const notesStore = useNotesStore()

onMounted(() => {
})

function handleEdit(id: string) {
}

async function handleDelete(id: string) {
}

function handleCreateNote() {
}
</script>

<template>
  <div class="note-list">
    <div class="list-header">
      <h2 class="list-title">My Notes</h2>
      <button class="btn-create" @click="handleCreateNote">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        New Note
      </button>
    </div>
  </div>
</template>

<style scoped>
.note-list {
  width: 100%;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.list-title {
  font-size: 1.75rem;
  color: #2c3e50;
  margin: 0;
}

.btn-create {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-create:hover {
  background-color: #359268;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(66, 185, 131, 0.3);
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>
