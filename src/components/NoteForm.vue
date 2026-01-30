<script setup lang="ts">
import { Category } from '@/types'
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { noteSchema, type NoteFormValues } from '@/schemas/noteSchema'
import CategorySelector from './CategorySelector.vue'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Props {
  noteId?: string
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
})

const emit = defineEmits<{
  cancel: []
  submit: [data: NoteFormValues]
}>()

const validationSchema = toTypedSchema(noteSchema)

const { handleSubmit, resetForm } = useForm({
  validationSchema,
  initialValues: {
    title: '',
    description: '',
    category: Category.PERSONAL,
  },
})

const onSubmit = handleSubmit((data) => {
  //only reset form if in create mode
  //and keep selected category
  if (props.mode === 'create') resetForm({
    values: {
      title: '',
      description: '',
      category: data.category,
    },
  })
  emit('submit', data)
})

function handleCancel() {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <div class="w-full max-w-2xl">
    <h2 class="text-2xl font-semibold mb-6">
      {{ mode === 'edit' ? 'Edit Note' : 'Create New Note' }}
    </h2>

    <form class="flex flex-col gap-6" @submit="onSubmit">
      <VeeField v-slot="{ field, errors }" name="title">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="title">
            Title
            <span class="text-destructive">*</span>
          </FieldLabel>
          <Input id="title" v-bind="field" type="text" placeholder="Enter note title..."
            :aria-invalid="!!errors.length" />
          <FieldError :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors, setValue }" name="category">
        <Field :data-invalid="!!errors.length">
          <FieldLabel>
            Category
            <span class="text-destructive">*</span>
          </FieldLabel>
          <CategorySelector :model-value="field.value ?? Category.PERSONAL" @update:model-value="setValue" />
          <FieldError :errors="errors" />
        </Field>
      </VeeField>

      <VeeField v-slot="{ field, errors }" name="description">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="description">
            Description
            <span class="text-destructive">*</span>
          </FieldLabel>
          <textarea id="description" v-bind="field" placeholder="Enter note description..." rows="6"
            :aria-invalid="!!errors.length"
            class="placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive resize-none" />
          <FieldError :errors="errors" />
        </Field>
      </VeeField>

      <div class="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" @click="handleCancel">
          Cancel
        </Button>
        <Button type="submit">
          {{ mode === 'edit' ? 'Update Note' : 'Create Note' }}
        </Button>
      </div>
    </form>
  </div>
</template>
