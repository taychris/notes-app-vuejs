<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import NoteItem from './NoteItem.vue'
import DeleteNoteDialog from './DeleteNoteDialog.vue'
import Button from './ui/button/Button.vue'
import { PlusIcon } from 'lucide-vue-next'

const router = useRouter()
const notesStore = useNotesStore()

const isDeleteDialogOpen = ref(false)
const noteToDelete = ref<{ id: string; title: string } | null>(null)

function handleEdit(id: string) {
  router.push(`/edit/${id}`)
}

function handleDelete(id: string) {
  const note = notesStore.noteById(id)
  if (note) {
    noteToDelete.value = { id: note.id, title: note.title }
    isDeleteDialogOpen.value = true
  }
}

function handleCreateNote() {
  router.push('/create')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="font-medium text-xl w-max">My Notes</h2>
      <Button @click="handleCreateNote" title="Create new note">
        <PlusIcon class="h-4 w-4" />
        New Note
      </Button>
    </div>
    <TransitionGroup name="note" tag="ul" class="relative mt-4 grid gap-4">
      <li v-for="note in notesStore.filteredNotes" :key="note.id" class="list-none">
        <NoteItem
          :note="note"
          @edit="handleEdit(note.id)"
          @delete="handleDelete(note.id)"
        />
      </li>
    </TransitionGroup>

    <DeleteNoteDialog
      v-model:open="isDeleteDialogOpen"
      :note-id="noteToDelete?.id ?? null"
      :note-title="noteToDelete?.title"
    />
  </div>
</template>

<style scoped>
.note-enter-active,
.note-leave-active {
  transition: all 0.3s ease;
}

.note-leave-active {
  position: absolute;
  left: 0;
  right: 0;
}

.note-enter-from,
.note-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.note-move {
  transition: transform 0.3s ease;
}
</style>
