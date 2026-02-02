<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { Search } from 'lucide-vue-next'
import { useNotesStore } from '@/stores/notesStore'
import Label from '@/components/ui/label/Label.vue'

const notesStore = useNotesStore()
const searchInput = ref(notesStore.searchQuery)

const updateSearch = useDebounceFn((value: string) => {
  notesStore.setSearchQuery(value)
}, 300)

watch(searchInput, (value) => {
  updateSearch(value)
})
</script>

<template>
  <InputGroup>
    <Label for="notes-search" class="sr-only">Search notes</Label>
    <InputGroupInput
      id="notes-search"
      v-model="searchInput"
      type="search"
      autocomplete="off"
      placeholder="Search by title or description..."
    />
    <InputGroupAddon>
      <Search aria-hidden="true" focusable="false" />
    </InputGroupAddon>
  </InputGroup>
</template>
