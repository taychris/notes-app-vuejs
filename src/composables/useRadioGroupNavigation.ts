import { nextTick } from 'vue'

interface UseRadioGroupNavigationOptions<T> {
  items: T[]
  selectedItem: { value: T }
  getItemId: (item: T) => string
}

/**
 * Composable for providing keyboard navigation to radio button groups.
 *
 * Automatically handles focus management and looping to end or start, depending on direction.
 *
 * @param items - Array of items to navigate through
 * @param selectedItem - Reactive reference to the currently selected item
 * @param getItemId - Function that returns the DOM element ID for each item
 * @returns Object with `selectItem` and `handleKeydown` functions
 *
 * @example
 * ```ts
 * const { selectItem, handleKeydown } = useRadioGroupNavigation({
 *   items: ['Red', 'Blue', 'Green'],
 *   selectedItem: ref('Red'),
 *   getItemId: (color) => `color-${color}`
 * })
 * ```
 */
export function useRadioGroupNavigation<T>({
  items,
  selectedItem,
  getItemId,
}: UseRadioGroupNavigationOptions<T>) {
  function focusItem(item: T) {
    // esnure DOM is updated and element exists before focusing
    nextTick(() => {
      document.getElementById(getItemId(item))?.focus()
    })
  }

  function selectItem(item: T) {
    selectedItem.value = item
    focusItem(item)
  }

  function handleKeydown(event: KeyboardEvent, currentItem: T) {
    const currentIndex = items.indexOf(currentItem)
    // if current item is not found, do nothing
    if (currentIndex === -1) return

    const lastIndex = items.length - 1
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        // get back to start if at end
        nextIndex = currentIndex === lastIndex ? 0 : currentIndex + 1
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        // get to end if at start
        nextIndex = currentIndex === 0 ? lastIndex : currentIndex - 1
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = lastIndex
        break
      default:
        return
    }

    event.preventDefault()
    const nextItem = items[nextIndex]
    if (nextItem) {
      selectItem(nextItem)
    }
  }

  return {
    selectItem,
    handleKeydown,
  }
}
