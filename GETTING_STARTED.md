# Getting Started with the Notes App Assessment

This guide will walk you through the process of implementing the Notes App.

## 🎯 Before You Start

1. **Fork the Repository** - Fork this repo to your own GitHub account.
2. **Clone Your Fork** - Clone the repository to your local machine.
3. **Install Dependencies** - Run `npm install`.
4. **Choose a UI Library** - Install your chosen Vue 3 UI library (e.g., Vuetify, PrimeVue, Element Plus).
5. **Start the Dev Server** - Run `npm run dev` to see the app.

## 📚 Phase 1: Exploration

### Step 1: Review Existing Code

Familiarize yourself with the provided structure:

- **Types** (`src/types/`) - Note interface, DTOs, and Category enum.
- **Router** (`src/router/index.ts`) - Route definitions.
- **API Service** (`src/services/notesApi.ts`) - Mock API with fallback.
- **App.vue** - Main layout structure.

### Step 2: Analyze Requirements

Read the `README.md` carefully to understand the functional and technical requirements, especially regarding **accessibility** and **responsive design**.

## 🔨 Phase 2: Implementation

You are expected to implement the following core areas. The files are provided with empty shells or basic structures.

### 1. Data Layer (`src/stores/notesStore.ts`)

Implement the Pinia store to manage the application state.
- **State**: Manage notes list, loading state, error state, and selected filter.
- **Getters**: Implement logic for filtering, sorting (newest first), and derived statistics.
- **Actions**: Implement CRUD operations (`fetch`, `add`, `update`, `delete`) and state modifiers.

### 2. Validation Logic (`src/composables/useNoteValidation.ts`)

Implement a reusable composable for form validation.
- Validates title, description, and category based on defined rules.
- Provides reactive error messages and character counts.
- Updates validity state in real-time.

### 3. Components

Implement the logic and template for the following components using your chosen **UI Library**. Ensure they are accessible and responsive.

- **NoteItem.vue**: Display a single note with actions (edit, delete).
- **NoteList.vue**: Render the list of notes, handling loading/error/empty states.
- **CategoryFilter.vue**: UI for filtering notes by category.
- **NoteForm.vue**: A form for creating and updating notes, integrating validation and error handling.

## 🎨 Phase 3: UI & Accessibility

- **Responsive Design**: Ensure the layout adapts to mobile, tablet, and desktop screens.
- **Accessibility**: Verify that your app is usable via keyboard and screen readers (ARIA labels, focus management).
- **Styling**: Use your UI library's theming or custom CSS to create a polished look.

## 🧪 Phase 4: Testing

Write unit tests to verify your logic.
- **Store**: Test actions and getters.
- **Composables**: Test validation rules.
- **Components**: Test rendering and interactions (optional but recommended).

Run tests with `npm run test:unit`.

## ✅ Phase 5: Verification

### Manual Testing
- Create, edit, and delete notes.
- Filter by category.
- verify sorting.
- Test form validation boundaries.
- Verify responsive behavior on different viewport sizes.

### Code Quality
- Run `npm run lint` to check for style issues.
- Run `npm run type-check` to verify TypeScript types.
- Run `npm run build` to ensure the app builds for production.

## 📤 Submission

1. **Commit** your changes to your forked repository.
2. **Push** to GitHub.
3. Review your **SUBMISSION.md** (create this file) to document your design decisions, especially compliance with accessibility standards and UI library choice.

Good luck!
