# Notes App - Submission

This implementation focuses on delivering a polished user experience with attention to accessibility, visual consistency, and intuitive interactions. Equally important was maintaining clean, readable code following best practices for easy maintainability. While there's always room for additional features and improvements, I am pleased with the UI/UX achieved—color-coded categories, subtle animations, keyboard navigation, and thoughtful design decisions. Ultimately, the real value of any application lies in the user's experience while using it.

## Features implemented ✨

### Core functionality

- ✅ **Create Notes**: Users can add new notes with title, description, and category
- ✅ **Edit Notes**: Users can update existing notes
- ✅ **Delete Notes**: Users can remove notes with confirmation
- ✅ **View Notes**: Display all notes sorted by creation date (newest first)
- ✅ **Filter by Category**: Filter notes by category (Personal, Work, Ideas, Todo, Other)
- ✅ **Form Validation**: Implement comprehensive validation with character limits
  - Title: 3-100 characters
  - Description: 10-500 characters
  - Category: Required selection

### Extras added

- ✅ **Dark mode toggle**: Users can switch between dark and light mode
- ✅ **Subtle animations**: Subtle animations have been added throughout the application
- ✅ **Manual refresh**: Users can click refresh button, to reload all notes manually
- ✅ **Searchbar**: Users can search notes based on title or description
- ✅ **Export notes**: Users can export notes based on selected category and/or search query
- ✅ **Local storage support**: Note store state has been persisted locally.

### Project implementation

- ✅ **TypeScript Integration**: Used TypeScript throughout with proper typing
- ✅ **State Management**: Implemented Pinia store for centralized state
- ✅ **Routing**: Used Vue Router for navigation between views
- ✅ **Composables**: Created reusable composition functions
- ✅ **UI Library Integration**: Shadcn UI implemented as a UI library
- ✅ **Component Architecture**: Well-structured, reusable components
- ✅ **Testing**: Written unit tests for store, utils, composables
- ✅ **Error Handling**: Implemented proper error handling and user feedback

## Design choices

### User Experience Optimizations

1. **Persist Selected Category and Search Query**: The selected category filter and search query are persisted in the Pinia store. This ensures that when users navigate between views (for example, creating a note and returning to the list), filter preferences are maintained, reducing friction and improving workflow.

2. **No Redirect After Create**: After creating a note, users remain on the create page without resetting the selected category. This design choice supports bulk note entry scenarios where users want to add multiple notes. This is useful when adding several notes to the same category.

3. **Radio-Styled Category Selection**: Category selection is implemented using radio button-styled components instead of dropdowns/select elements. This provides immediate visual feedback of all available options without requiring additional clicks to open a menu, speeding up the note creation and editing process.

4. **Color-Coded Categories**: Each category is assigned a distinct color (e.g., Personal: cyan, Work: emerald, Ideas: purple, Todo: amber, Other: pink). This visual coding enables users to quickly identify and distinguish between note types at a glance, improving scanability and organization of the notes list.

## UI Library Choice

### shadcn-vue

I chose **shadcn-vue** as the UI library for this Notes App implementation. shadcn-vue is a Vue port of the popular shadcn/ui library, providing a collection of re-usable components built with Radix Vue and styled with Tailwind CSS.

#### Benefits of shadcn-vue:

1. **Ownership & Flexibility**: Unlike traditional component libraries, shadcn copies components directly into your project. This gives you complete control over the code, allowing easy customization.

2. **Accessibility First**: Built on top of Radix Vue primitives, which provide unstyled, accessible components support aria/accessibility out of the box.

3. **Modern Stack**: Integrates with Tailwind CSS for styling, TypeScript for type safety, and modern Vue 3 Composition API patterns.

4. **No Dependency Bloat**: Since components are copied into your codebase, you only include what you use.

5. **Customization**: Every component is fully customizable through Tailwind classes and can be modified directly in your codebase to match your design system perfectly.

6. **Developer Experience**: Excellent TypeScript support, composable utilities, and a consistent API across components make development smooth and predictable.

7. **Beautiful Defaults**: Components come with elegant, modern designs that work well out of the box while remaining easy to customize.

## Styling Approach

### Tailwind CSS

I used **Tailwind CSS** instead of plain CSS for styling the application.

#### Benefits of Tailwind CSS:

1. **Utility-First Approach**: Great developer experience with pre-defined utility classes, reducing context switching between HTML and CSS files.

2. **Consistency**: Built in design system with spacing, colors, and typography scales ensures visual consistency across the application.

3. **Performance**: Tailwind removes unused CSS in production, resulting in minimal bundle sizes.

4. **Responsive Design**: Simple, intuitive syntax for building responsive layouts with mobile first breakpoints.

5. **Maintainability**: Styling is colocated with components, making it easier to understand and modify component appearance.

6. **Dark Mode**: Support for dark mode with simple class based toggling.

7. **No Naming Conflicts**: Eliminates the need to create class names, avoiding CSS naming convention debates and conflicts.

## Shadcn & TailwindCSS core value

The combination of shadcn-vue and Tailwind CSS provided an great foundation for building a polished, accessible, and maintainable Notes App that meets all the requirements while maintaining clean, modern code.

## Accessibility features implemented

- ✅ **ARIA attributes**: `aria-label`, `aria-labelledby`, `aria-checked`, `aria-invalid`, `aria-hidden`, `aria-busy` for screen reader support
- ✅ **Semantic roles**: `role="radiogroup"`, `role="radio"`, `role="alert"`, `role="group"` for proper element semantics
- ✅ **Keyboard navigation**: Arrow keys, Home/End in category selector via custom `useRadioGroupNavigation` composable
- ✅ **Roving tabindex**: Only selected category button in tab order, others use tabindex="-1"
- ✅ **Screen reader text**: `.sr-only` hidden labels for icon-only buttons (theme toggle, export etc.)
- ✅ **Form labels**: All inputs have associated `<label>` elements with `for` attribute
- ✅ **Focus management**: Focus trapping in modals, focus restoration on close, Escape key handling (via Reka-UI)
- ✅ **Visible focus indicators**: `focus-visible` ring styles on all interactive elements
- ✅ **Semantic HTML**: Native `<form>`, `<fieldset>`, proper heading hierarchy, `<ul>` for lists
- ✅ **Form validation feedback**: `role="alert"` for errors, character counts, dirty state tracking, `aria-invalid` styling
- ✅ **Visual accessibility**: Dark mode support, color-coded categories, high-contrast error states

## Future improvements

- **Zod + VeeValidate for form validation**: Replace custom validation logic with Zod schema validation with VeeValidate. This would provide type-safe validation schemas, better error messages, reusable validation rules, and less boilerplate code compared to manual validation logic.
- **Vue Query for data fetching**: Replace Pinia-based API data storage with Vue Query (TanStack Query). Currently, notes fetched from the API are stored in Pinia, which mixes server state with client state. Vue Query would provide automatic caching, background refetching, stale-while-revalidate, and optimistic updates out of the box. Pinia would then be used only for client state (selected category, search query, UI preferences).
- **Infinite scroll or pagination**: Useful for large note lists. This would allow us to prevent loading all notes at once, improving load time and less strain on the server.
- **Optimistic updates**: Update UI immediately before API returns success (snappier UI leads to better UX)
- **Markdown support**: Rich text or markdown editor for note content
- **E2E Tests**: Implementing Playwright or Cypress end to end tests (for example, for create/edit/delete note)
- **Pre-commit hooks**: Husky + lint-staged for code quality
- **Component folder structure**: Reorganize components into subfolders (e.g., `components/notes`, `components/layout`, `components/common`) instead of having all components in a single folder. This would improve maintainability as the project grows.

## Challenges encountered and solutions

1. **Select vs Radio button for category selector**: Initially I was deciding between a dropdown select or radio buttons for category selection. Chose radio styled buttons as they provide immediate visibility of all options without requiring an extra click to open a menu. Additionally, categories are color coded (each category has a distinct background color), which reinforces the decision—colors are immediately visible with radio buttons but would be hidden in a collapsed select dropdown.

2. **Keyboard accessibility for category selector**: After implementing the radio button approach, I realized keyboard navigation support was missing. Solved this by creating a custom `useRadioGroupNavigation` composable that implements accessibility compliant keyboard navigation (arrow keys, Home/End) with roving tabindex.

3. **Form validation approach**: Initially wanted to use Zod for validation since it's the industry standard for schema validation, but decided to implement custom validation logic to drifting away from the assignment requirements. The main challenge was that validation errors (like "required") were displaying immediately on the create form before users had interacted with any fields. Solved this by implementing a dirty state tracking system that only shows validation errors after a field has been touched.

4. **Unit testing the export utility**: Encountered difficulties writing unit tests due to time constraint, especially for `exportNotes.ts` due to mocking browser APIs (Blob, URL.createObjectURL, download triggers). Used AI assistance to help structure the tests with proper mocks and assertions.
