import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useNoteValidation } from '../useNoteValidation'
import { Category } from '@/types'

describe('useNoteValidation', () => {
    it('should provide validation interface', () => {
        const title = ref('Test')
        const description = ref('Description')
        const category = ref(Category.PERSONAL)

        const validation = useNoteValidation(title, description, category)

        expect(validation).toHaveProperty('isValid')
        expect(validation).toHaveProperty('titleError')
        expect(validation).toHaveProperty('descriptionError')
    })
})
