<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { InputGroup, InputGroupInput, InputGroupAddon } from '@/components/ui/input-group'
import { Search } from 'lucide-vue-next'
import { useNotesStore } from '@/stores/notesStore'

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
    <InputGroupInput v-model="searchInput" placeholder="Search by title or description..." />
    <InputGroupAddon>
      <Search />
    </InputGroupAddon>
  </InputGroup>
</template>
