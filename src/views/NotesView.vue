<script setup lang="ts">
import CategoryFilter from '@/components/CategoryFilter.vue'
import NoteList from '@/components/NoteList.vue'

</script>

<template>
  <div class="notes-view">
    <CategoryFilter />
    <NoteList />
  </div>
</template>

<style scoped>
.notes-view {
  width: 100%;
}
</style>
