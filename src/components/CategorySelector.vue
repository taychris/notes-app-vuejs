<script setup lang="ts">/**
 * CategorySelector
 * 
 * A reusable category selection component that displays category buttons with visual feedback.
 * Supports single selection and optional "All" category (implemented for form usage).
 * 
 * @example
 * ```vue
 * <CategorySelector v-model="selectedCategory" :include-all="true" />
 * ```
 * 
 * @component
 */

import { computed } from 'vue'
import { Category } from '@/types'
import { Button } from '@/components/ui/button'
import { categoryColors } from '@/constants/categoryColors'
import { CheckIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

/**
 * Component props
 * @property {boolean} includeAll - Whether to include an "All" option in the category list
 */
interface Props {
  includeAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  includeAll: false
})

const selectedCategory = defineModel<Category | 'All'>({ required: true })

const adjustedCategories = computed<Array<Category | 'All'>>(() => {
  const categories = Object.values(Category) as Category[]
  return props.includeAll ? ['All' as const, ...categories] : categories
})
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li v-for="category in adjustedCategories" :key="category">
      <Button type="button" size="sm" :title="'Select ' + category"
        :class="cn(categoryColors[category].color, 'gap-0 text-background group')"
        @click="selectedCategory = category">
        {{ category }}
        <span class="inline-flex overflow-hidden transition-all duration-200 ease-out"
          :class="selectedCategory === category ? 'ml-2 w-4 opacity-100' : 'w-0 opacity-0'">
          <CheckIcon class="size-4 shrink-0" />
        </span>
      </Button>
    </li>
  </ul>
</template>
