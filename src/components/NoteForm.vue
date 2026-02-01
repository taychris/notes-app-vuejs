<script setup lang="ts">
import { watch } from 'vue'
import { Category, type Note } from '@/types'
import { useForm, Field as VeeField } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { noteSchema, type NoteFormValues } from '@/schemas/noteSchema'
import CategorySelector from './CategorySelector.vue'
import { Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SaveIcon, X, Loader2 } from 'lucide-vue-next'
import { Textarea } from './ui/textarea'
import { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea } from './ui/input-group'

interface Props {
  mode?: 'create' | 'edit'
  initialData?: Note | null
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  isLoading: false,
})

const emit = defineEmits<{
  cancel: []
  submit: [data: NoteFormValues]
}>()

const validationSchema = toTypedSchema(noteSchema)

const { handleSubmit, resetForm, setValues } = useForm({
  validationSchema,
  initialValues: {
    title: '',
    description: '',
    category: Category.PERSONAL,
  },
})

// Populate form when initial data is provided (edit mode)
watch(
  () => props.initialData,
  (note) => {
    if (note) {
      setValues({
        title: note.title,
        description: note.description,
        category: note.category,
      })
    }
  },
  { immediate: true }
)

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
      {{ mode === 'edit' ? 'Edit note' : 'Create new note' }}
    </h2>

    <form class="flex flex-col gap-6" @submit="onSubmit">
      <VeeField v-slot="{ value, handleChange, errors }" name="title">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="title">
            Title
            <span class="text-destructive">*</span>
          </FieldLabel>
          <Input id="title" type="text" placeholder="Enter note title..." :model-value="value"
            :aria-invalid="!!errors.length" @update:model-value="handleChange" />
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

      <VeeField v-slot="{ value, handleChange, errors }" name="description">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="description">
            Description
            <span class="text-destructive">*</span>
          </FieldLabel>
          <InputGroup>
            <InputGroupTextarea id="form-vee-demo-description" :model-value="value"
              placeholder="I'm having an issue with the login button on mobile." :rows="6" class="min-h-24 resize-none"
              :aria-invalid="!!errors.length" @update:model-value="handleChange" />
            <InputGroupAddon align="block-end">
              <InputGroupText class="tabular-nums font-normal">
                {{ value?.length || 0 }}/500 characters
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldError :errors="errors" />
        </Field>
      </VeeField>

      <div class="flex gap-3 justify-end pt-4">
        <Button type="button" variant="outline" :disabled="isLoading" @click="handleCancel">
          <X />
          Cancel
        </Button>
        <Button type="submit" :disabled="isLoading">
          <Loader2 v-if="isLoading" class="size-4 animate-spin" />
          <SaveIcon v-else />
          {{ isLoading ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create' }}
        </Button>
      </div>
    </form>
  </div>
</template>
