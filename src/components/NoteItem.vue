<script setup lang="ts">
import type { Note } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-vue-next'
import { categoryColors } from '@/constants/categoryColors'
import { formatRelativeDate } from '@/utils/formatRelativeDate'

interface Props {
  note: Note
}

interface Emits {
  (e: 'edit', id: string): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleEdit(id: string) {
  emit('edit', id)
}

function handleDelete(id: string) {
  emit('delete', id)
}
</script>

<template>
  <Card class="group transition-shadow hover:shadow-md gap-2 bg-gray-50 dark:bg-neutral-900">
    <CardHeader class="flex-row items-start justify-between gap-0 space-y-0">
      <CardTitle class="line-clamp-2 text-md font-medium">{{ note.title }}</CardTitle>
    </CardHeader>

    <CardContent>
      <p class="bg-gray-100 dark:bg-neutral-800 p-2 rounded-md text-sm">
        {{ note.description }}
      </p>
    </CardContent>

    <CardFooter class="justify-between gap-2 mt-2">
      <div class="flex items-center gap-4">
        <Badge :class="categoryColors[note.category].color">{{ note.category }}</Badge>
        <span class="text-xs text-muted-foreground">
          {{ formatRelativeDate(note.updatedAt) }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="ghost" size="icon-sm" @click="handleEdit(note.id)" title="Edit note">
          <Pencil class="size-4" />
        </Button>
        <Button variant="ghost" size="icon-sm" @click="handleDelete(note.id)" title="Delete note">
          <Trash2 class="size-4" />
        </Button>
      </div>
    </CardFooter>
  </Card>
</template>
