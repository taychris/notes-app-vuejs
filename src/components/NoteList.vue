<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notesStore'
import NoteItem from './NoteItem.vue'
import Button from './ui/button/Button.vue'
import { PlusIcon } from 'lucide-vue-next'

const router = useRouter()
const notesStore = useNotesStore()

function handleEdit(id: string) {
  router.push(`/edit/${id}`)
}

async function handleDelete(id: string) { }

function handleCreateNote() {
  router.push('/create')
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <h2 class="font-medium text-xl w-max">My Notes</h2>
      <Button @click="handleCreateNote">
        <PlusIcon class="h-4 w-4" />
        New Note
      </Button>
    </div>
    <ul>
      <li></li>
    </ul>
  </div>
</template>

<style scoped></style>
