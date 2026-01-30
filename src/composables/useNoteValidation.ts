import { computed, type Ref } from 'vue'

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
    descriptionMinLength: 10
}

export interface ValidationErrors {
    title?: string
    description?: string
    category?: string
}

export function useNoteValidation(
    title: Ref<string>,
    description: Ref<string>,
    category: Ref<string>,
    rules: ValidationRules = DEFAULT_RULES
) {
    const titleError = computed(() => {
        return ''
    })

    const descriptionError = computed(() => {
        return ''
    })

    const categoryError = computed(() => {
        return ''
    })

    const isValid = computed(() => {
        return false
    })

    const errors = computed<ValidationErrors>(() => ({
    }))

    const titleCharactersRemaining = computed(() => {
        return rules.titleMaxLength
    })

    const descriptionCharactersRemaining = computed(() => {
        return rules.descriptionMaxLength
    })

    return {
        titleError,
        descriptionError,
        categoryError,
        isValid,
        errors,
        titleCharactersRemaining,
        descriptionCharactersRemaining,
        rules
    }
}
