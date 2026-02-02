import { describe, expect, it } from 'vitest'
import { ref, type Ref } from 'vue'
import {
  useNoteValidation,
  type ValidationRules,
} from '@/composables/useNoteValidation'

function setup({
  title = '',
  description = '',
  rules,
}: {
  title?: string
  description?: string
  rules?: ValidationRules
} = {}) {
  const titleRef = ref(title) as Ref<string>
  const descriptionRef = ref(description) as Ref<string>

  return {
    titleRef,
    descriptionRef,
    validation: useNoteValidation(titleRef, descriptionRef, rules),
  }
}

describe('useNoteValidation', () => {
  it('starts with pristine fields, hidden errors, and invalid state', () => {
    const { validation } = setup()

    expect(validation.isDirtyTitle.value).toBe(false)
    expect(validation.isDirtyDescription.value).toBe(false)

    expect(validation.titleError.value).toBe('')
    expect(validation.descriptionError.value).toBe('')
    expect(validation.errors.value).toEqual({})

    expect(validation.isValid.value).toBe(false)
    expect(validation.titleCharactersRemaining.value).toBe(100)
    expect(validation.descriptionCharactersRemaining.value).toBe(500)
  })

  it('exposes errors only after fields are marked dirty', () => {
    const { validation } = setup()

    expect(validation.titleError.value).toBe('')
    expect(validation.descriptionError.value).toBe('')
    expect(validation.errors.value).toEqual({})

    validation.setDirtyTitle()
    expect(validation.titleError.value).toBe('Title is required')
    expect(validation.descriptionError.value).toBe('')
    expect(validation.errors.value).toEqual({ title: 'Title is required' })

    validation.setDirtyDescription()
    expect(validation.descriptionError.value).toBe('Description is required')
    expect(validation.errors.value).toEqual({
      title: 'Title is required',
      description: 'Description is required',
    })
  })

  it('validates title required using trimmed content', () => {
    const { titleRef, validation } = setup({ title: '   ' })

    validation.setDirtyTitle()
    expect(validation.titleError.value).toBe('Title is required')

    titleRef.value = 'Valid'
    expect(validation.titleError.value).toBe('')
  })

  it('validates title min and max length', () => {
    const { titleRef, validation } = setup({ title: 'aa', description: 'x'.repeat(10) })

    validation.setDirtyTitle()
    expect(validation.titleError.value).toBe('Title must be at least 3 characters')
    expect(validation.isValid.value).toBe(false)

    titleRef.value = 'a'.repeat(101)
    expect(validation.titleError.value).toBe('Title must be less than 100 characters')

    titleRef.value = 'abc'
    expect(validation.titleError.value).toBe('')
    expect(validation.isValid.value).toBe(true)
  })

  it('validates description min and max length', () => {
    const { descriptionRef, validation } = setup({
      title: 'abc',
      description: 'short',
    })

    validation.setDirtyDescription()
    expect(validation.descriptionError.value).toBe(
      'Description must be at least 10 characters',
    )
    expect(validation.isValid.value).toBe(false)

    descriptionRef.value = 'x'.repeat(501)
    expect(validation.descriptionError.value).toBe(
      'Description must be less than 500 characters',
    )

    descriptionRef.value = 'x'.repeat(10)
    expect(validation.descriptionError.value).toBe('')
    expect(validation.isValid.value).toBe(true)
  })

  it('exposes an empty errors object when all displayed errors are empty', () => {
    const { validation } = setup({
      title: 'Valid title',
      description: 'x'.repeat(10),
    })

    validation.setDirtyAll()
    expect(validation.titleError.value).toBe('')
    expect(validation.descriptionError.value).toBe('')
    expect(validation.errors.value).toEqual({})
  })

  it('tracks and resets dirty flags', () => {
    const { validation } = setup({
      title: 'Valid title',
      description: 'x'.repeat(10),
    })

    validation.setDirtyAll()
    expect(validation.isDirtyTitle.value).toBe(true)
    expect(validation.isDirtyDescription.value).toBe(true)

    validation.resetDirtyAll()
    expect(validation.isDirtyTitle.value).toBe(false)
    expect(validation.isDirtyDescription.value).toBe(false)
  })

  it('supports custom rules and character-remaining counters', () => {
    const rules: ValidationRules = {
      titleMaxLength: 5,
      titleMinLength: 2,
      descriptionMaxLength: 12,
      descriptionMinLength: 4,
    }

    const { titleRef, descriptionRef, validation } = setup({
      title: 'ab',
      description: 'abcd',
      rules,
    })

    expect(validation.rules).toBe(rules)
    expect(validation.isValid.value).toBe(true)
    expect(validation.titleCharactersRemaining.value).toBe(3)
    expect(validation.descriptionCharactersRemaining.value).toBe(8)

    titleRef.value = 'abcdef'
    descriptionRef.value = 'abcdefghijklmn'
    expect(validation.isValid.value).toBe(false)

    validation.setDirtyAll()
    expect(validation.errors.value).toEqual({
      title: 'Title must be less than 5 characters',
      description: 'Description must be less than 12 characters',
    })
  })
})
