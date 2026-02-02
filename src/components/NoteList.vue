<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import NoteItem from './NoteItem.vue'
import DeleteNoteDialog from './DeleteNoteDialog.vue'
import Button from './ui/button/Button.vue'
import { PlusIcon } from 'lucide-vue-next'
import Searchbar from './Searchbar.vue'
import ExportDropdown from './ExportDropdown.vue'
import RefreshNotes from './RefreshNotes.vue'

const router = useRouter()
const notesStore = useNotesStore()

const isDeleteDialogOpen = ref(false)
const noteToDelete = ref<{ id: string; title: string } | null>(null)

function handleRefresh() {
  notesStore.fetchNotes(true)
}

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
    <div class="flex items-center justify-between mb-4">
      <h2 id="notes-list-title" tabindex="-1" class="font-medium text-xl w-max">My notes</h2>
      <div class="flex items-center gap-2">
        <RefreshNotes @click="handleRefresh" :is-loading="notesStore.isLoading" />
        <ExportDropdown :selected-category="notesStore.selectedCategory" :filtered-notes="notesStore.filteredNotes"
          :search-query="notesStore.searchQuery" />
        <Button @click="handleCreateNote" title="Create new note">
          <PlusIcon aria-hidden="true" focusable="false" class="h-4 w-4" />
          New
        </Button>
      </div>
    </div>
    <Searchbar />

    <div v-if="notesStore.error" role="alert"
      class="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3">
      <p class="font-medium text-center">Failed to load notes</p>
      <p class="mt-1 text-sm text-muted-foreground">{{ notesStore.error }}</p>
      <div class="mt-3 mx-auto w-max space-x-2">
        <Button size="sm" :disabled="notesStore.isLoading" @click="handleRefresh">Try
          again</Button>
        <Button variant="ghost" size="sm" :disabled="notesStore.isLoading" @click="notesStore.clearError">
          Dismiss
        </Button>
      </div>
    </div>

    <TransitionGroup name="note" tag="ul" class="relative mt-6 grid gap-4">
      <li v-if="notesStore.filteredNotes.length === 0 && !notesStore.isLoading && !notesStore.error" key="empty"
        class="list-none">
        <p class="text-center text-muted-foreground mt-4 font-light">No notes found.</p>
      </li>
      <li v-if="notesStore.isLoading" key="loading" class="list-none">
        <p class="text-center text-muted-foreground mt-4 font-light animate-pulse">Loading notes...</p>
      </li>
      <li v-if="!notesStore.isLoading" v-for="note in notesStore.filteredNotes" :key="note.id" class="list-none">
        <NoteItem :note="note" @edit="handleEdit" @delete="handleDelete" />
      </li>
    </TransitionGroup>

    <DeleteNoteDialog v-model:open="isDeleteDialogOpen" :note-id="noteToDelete?.id ?? null"
      :note-title="noteToDelete?.title" />
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
