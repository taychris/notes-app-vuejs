<script setup lang="ts">
/**
 * NoteFormCustomValidation
 * 
 * A reusable form component that is responsible for creating and editing notes.
 * Supports both "create" and "edit" modes, with custom validation using useNoteValidation composable.
 * 
 * @example
 * ```vue
 * <NoteFormCustomValidation mode="create" :is-loading="isCreating" @submit="handleSubmit" @cancel="handleCancel" />
 * ```
 * 
 * @component
 */

import { ref, watch } from 'vue'
import { Category, type Note } from '@/types'
import { useNoteValidation } from '@/composables/useNoteValidation'
import CategorySelector from './CategorySelector.vue'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { SaveIcon, X, Loader2 } from 'lucide-vue-next'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from './ui/input-group'
import InputGroupInput from './ui/input-group/InputGroupInput.vue'

interface Props {
    mode?: 'create' | 'edit'
    initialData?: Note | null
    isLoading?: boolean
}

interface FormData {
    title: string
    description: string
    category: Category
}

const props = withDefaults(defineProps<Props>(), {
    mode: 'create',
    isLoading: false,
})

const emit = defineEmits<{
    cancel: []
    submit: [
        data: FormData,
        helpers: {
            reset: () => void
        },
    ]
}>()

const title = ref('')
const description = ref('')
const category = ref<Category>(Category.PERSONAL)

const titleHelpId = 'note-title-help'
const titleErrorId = 'note-title-error'
const descriptionHelpId = 'note-description-help'
const descriptionErrorId = 'note-description-error'
const categoryLabelId = 'note-category-label'

const {
    titleError,
    descriptionError,
    isValid,
    rules,
    titleCharactersRemaining,
    descriptionCharactersRemaining,
    setDirtyTitle,
    setDirtyDescription,
    setDirtyAll,
    resetDirtyAll
} = useNoteValidation(title, description)

// populate form when initial data is provided - used in edit mode
watch(
    () => props.initialData,
    (note) => {
        if (note) {
            title.value = note.title
            description.value = note.description
            category.value = note.category
        }
    },
    { immediate: true }
)

function resetForm(categoryValue = Category.PERSONAL) {
    title.value = ''
    description.value = ''
    category.value = categoryValue
    resetDirtyAll()
}

function onSubmit(event: Event) {
    event.preventDefault()

    // Mark all fields as touched to show validation errors
    setDirtyAll()

    if (!isValid.value) {
        return
    }

    const formData: FormData = {
        title: title.value,
        description: description.value,
        category: category.value,
    }

    emit('submit', formData, {
        reset: () => resetForm(category.value),
    })
}

function handleCancel() {
    emit('cancel')
}
</script>

<template>
    <div class="w-full max-w-2xl">
        <h1 data-page-title tabindex="-1" class="text-2xl font-semibold mb-6">
            {{ mode === 'edit' ? 'Edit note' : 'Create new note' }}
        </h1>

        <form class="flex flex-col gap-6" @submit="onSubmit">
            <Field :data-invalid="!!titleError">
                <FieldLabel for="title">
                    Title
                    <span class="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                    <InputGroupInput id="title" v-model="title" placeholder="Enter note title..." required
                        :minlength="rules.titleMinLength" :maxlength="rules.titleMaxLength" :aria-invalid="!!titleError"
                        @blur="setDirtyTitle" />
                    <InputGroupAddon align="inline-end">
                        <InputGroupText :id="titleHelpId" class="tabular-nums font-normal">
                            {{ title.length }}/{{ titleCharactersRemaining + title.length }} characters
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <FieldError :id="titleErrorId" :errors="titleError ? [titleError] : []" />
            </Field>

            <Field>
                <FieldLabel :id="categoryLabelId">
                    Category
                    <span class="text-destructive">*</span>
                </FieldLabel>
                <CategorySelector v-model="category" :aria-labelledby="categoryLabelId" />
            </Field>

            <Field :data-invalid="!!descriptionError">
                <FieldLabel for="description">
                    Description
                    <span class="text-destructive">*</span>
                </FieldLabel>
                <InputGroup>
                    <InputGroupTextarea id="description" v-model="description" placeholder="Enter note description..."
                        required :minlength="rules.descriptionMinLength" :maxlength="rules.descriptionMaxLength"
                        :rows="6" class="min-h-24 resize-none" :aria-invalid="!!descriptionError"
                        @blur="setDirtyDescription" />
                    <InputGroupAddon align="block-end">
                        <InputGroupText :id="descriptionHelpId" class="tabular-nums font-normal">
                            {{ description.length }}/{{ descriptionCharactersRemaining + description.length }}
                            characters
                        </InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
                <FieldError :id="descriptionErrorId" :errors="descriptionError ? [descriptionError] : []" />
            </Field>

            <div class="flex gap-3 justify-end pt-4">
                <Button type="button" variant="outline" :disabled="isLoading" @click="handleCancel">
                    <X aria-hidden="true" focusable="false" />
                    Cancel
                </Button>
                <Button type="submit" :disabled="isLoading || !isValid">
                    <Loader2 v-if="isLoading" aria-hidden="true" focusable="false" class="size-4 animate-spin" />
                    <SaveIcon v-else aria-hidden="true" focusable="false" />
                    {{ isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create' }}
                </Button>
            </div>
        </form>
    </div>
</template>
