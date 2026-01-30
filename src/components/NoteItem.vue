<script setup lang="ts">
import type { Note } from '@/types'

interface Props {
  note: Note
}

interface Emits {
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleEdit() {
}

function handleDelete() {
}
</script>

<template>
  <div class="note-item">
    <div class="note-header">
      <h3 class="note-title">{{ note.title }}</h3>
    </div>

    <p class="note-description">{{ note.description }}</p>

    <div class="note-footer">
      <div class="note-actions">
      </div>
    </div>
  </div>
</template>

<style scoped>
.note-item {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.note-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.note-title {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
  flex: 1;
}

.note-description {
  color: #5a6c7d;
  line-height: 1.6;
  margin: 0 0 1rem 0;
}

.note-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.note-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
