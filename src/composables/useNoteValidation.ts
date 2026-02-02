import { computed, ref, type Ref } from 'vue'

export interface ValidationRules {
  titleMaxLength: number
  titleMinLength: number
  descriptionMaxLength: number
  descriptionMinLength: number
}

const DEFAULT_RULES: ValidationRules = {
  titleMaxLength: 100,
  titleMinLength: 3,
  descriptionMaxLength: 500,
  descriptionMinLength: 10,
}

export interface ValidationErrors {
  title?: string
  description?: string
}

/**
 * Composable for handling form validation.
 */
export function useNoteValidation(
  title: Ref<string>,
  description: Ref<string>,
  rules: ValidationRules = DEFAULT_RULES,
) {
  // Dirty tracking state
  const isDirtyTitle = ref(false)
  const isDirtyDescription = ref(false)

  // Raw validation errors (always computed)
  const titleValidationError = computed(() => {
    if (!title.value || title.value.trim().length === 0) {
      return 'Title is required'
    }
    if (title.value.length < rules.titleMinLength) {
      return `Title must be at least ${rules.titleMinLength} characters`
    }
    if (title.value.length > rules.titleMaxLength) {
      return `Title must be less than ${rules.titleMaxLength} characters`
    }
    return ''
  })

  const descriptionValidationError = computed(() => {
    if (!description.value || description.value.trim().length === 0) {
      return 'Description is required'
    }
    if (description.value.length < rules.descriptionMinLength) {
      return `Description must be at least ${rules.descriptionMinLength} characters`
    }
    if (description.value.length > rules.descriptionMaxLength) {
      return `Description must be less than ${rules.descriptionMaxLength} characters`
    }
    return ''
  })

  // Displayed errors (only show if field is dirty)
  const titleError = computed(() => {
    return isDirtyTitle.value ? titleValidationError.value : ''
  })

  const descriptionError = computed(() => {
    return isDirtyDescription.value ? descriptionValidationError.value : ''
  })

  const isValid = computed(() => {
    return !titleValidationError.value && !descriptionValidationError.value
  })

  const errors = computed<ValidationErrors>(() => ({
    ...(titleError.value && { title: titleError.value }),
    ...(descriptionError.value && { description: descriptionError.value }),
  }))

  const titleCharactersRemaining = computed(() => {
    return rules.titleMaxLength - title.value.length
  })

  const descriptionCharactersRemaining = computed(() => {
    return rules.descriptionMaxLength - description.value.length
  })

  // Dirty tracking functions
  function setDirtyTitle() {
    isDirtyTitle.value = true
  }

  function setDirtyDescription() {
    isDirtyDescription.value = true
  }

  function setDirtyAll() {
    isDirtyTitle.value = true
    isDirtyDescription.value = true
  }

  function resetDirtyAll() {
    isDirtyTitle.value = false
    isDirtyDescription.value = false
  }

  return {
    titleError,
    descriptionError,
    isValid,
    errors,
    titleCharactersRemaining,
    descriptionCharactersRemaining,
    rules,
    isDirtyTitle,
    isDirtyDescription,
    setDirtyTitle,
    setDirtyDescription,
    setDirtyAll,
    resetDirtyAll,
  }
}
