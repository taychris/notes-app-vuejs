<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import type { Category, Note } from '@/types'
import { exportNotesToJsonFile, exportNotesToPdfFile } from '@/utils/exportNotes'
import { computed } from 'vue'
import { Button } from '@/components/ui/button'
import { DownloadIcon } from 'lucide-vue-next'

interface Props {
  selectedCategory: Category | 'All'
  filteredNotes: Note[]
  searchQuery?: string
}

const props = defineProps<Props>()

// filename-friendly category name, replaces spaces with hyphens and lowercases
const selectedCategoryFilenamePart = computed(() => {
  return String(props.selectedCategory).toLowerCase().replace(/\s+/g, '-')
})

function exportSelectedCategoryAsJson() {
  exportNotesToJsonFile(props.filteredNotes, `notes-${selectedCategoryFilenamePart.value}`, props.searchQuery)
}

async function exportSelectedCategoryAsPdf() {
  await exportNotesToPdfFile(
    props.filteredNotes,
    `notes-${selectedCategoryFilenamePart.value}`,
    props.searchQuery,
  )
}

</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="outline"
        title="Export options"
        aria-label="Export notes"
        :disabled="props.filteredNotes.length <= 0"
      >
        <DownloadIcon aria-hidden="true" focusable="false" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Export filtered notes</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="exportSelectedCategoryAsJson" title="Click to export" class="justify-end">as JSON
      </DropdownMenuItem>
      <DropdownMenuItem @click="exportSelectedCategoryAsPdf" title="Click to export" class="justify-end">as PDF
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
