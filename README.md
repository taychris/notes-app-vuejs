# 📝 Notes App - Vue.js Frontend Developer Assessment

A starter template for evaluating Vue.js developer candidates. Build a feature-rich notes application using Vue 3, TypeScript, Pinia, and modern development practices.

> **⚠️ This is a TEMPLATE project.** Most features are NOT implemented. Your task is to implement them following the requirements below.

## 🎯 Project Overview

Build a fully functional notes application that demonstrates your proficiency in:
- Vue 3 Composition API
- TypeScript
- Pinia state management
- UI component library integration
- Form validation
- Component architecture
- Unit testing

## 🛠️ Technology Stack

### Required
- **Vue 3** - Modern progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Pinia** - Official state management library for Vue
- **Vue Router** - Official routing solution for Vue.js
- **UI Component Library** - Choose one (e.g., Vuetify, PrimeVue, Element Plus, Naive UI)
- **Vite** - Next-generation frontend build tool
- **Vitest** - Blazing fast unit test framework
- **ESLint + Prettier** - Code quality and formatting tools

### UI Library Selection

You must integrate a Vue 3 compatible UI library. Popular options:
- **Vuetify** - Material Design components
- **PrimeVue** - Rich set of UI components
- **Element Plus** - Desktop-oriented component library
- **Naive UI** - TypeScript-friendly component library
- **Quasar** - Full-featured framework with components

Document your choice and rationale in your submission.

## ✨ Features to Implement

### Core Functionality
- ⬜ **Create Notes**: Users can add new notes with title, description, and category
- ⬜ **Edit Notes**: Users can update existing notes
- ⬜ **Delete Notes**: Users can remove notes with confirmation
- ⬜ **View Notes**: Display all notes sorted by creation date (newest first)
- ⬜ **Filter by Category**: Filter notes by category (Personal, Work, Ideas, Todo, Other)
- ⬜ **Form Validation**: Implement comprehensive validation with character limits
  - Title: 3-100 characters
  - Description: 10-500 characters
  - Category: Required selection

### Technical Requirements
- ⬜ **TypeScript Integration**: Use TypeScript throughout with proper typing
- ⬜ **State Management**: Implement Pinia store for centralized state
- ⬜ **Routing**: Use Vue Router for navigation between views
- ⬜ **Composables**: Create reusable composition functions
- ⬜ **UI Library Integration**: Use your chosen UI library components
- ⬜ **Component Architecture**: Well-structured, reusable components
- ⬜ **Testing**: Write unit tests for store, composables, and components
- ⬜ **Error Handling**: Implement proper error handling and user feedback

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm or yarn package manager
- Git

### Installation

```bash
# Fork this repository to your GitHub account first
# Then clone your fork
git clone <your-forked-repo-url>
cd notes-app-vuejs

# Install dependencies
npm install

# Start the local mock server
json-server --watch db.json --port 3001

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Run unit tests
npm run test:unit

# Run tests in watch mode
npm run test:unit -- --watch

# Run linting
npm run lint

# Format code
npm run format

# Type checking
npm run type-check

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets
├── components/       # Vue components (NEEDS IMPLEMENTATION)
│   ├── CategoryFilter.vue
│   ├── NoteForm.vue
│   ├── NoteItem.vue
│   └── NoteList.vue
├── composables/      # Reusable composables (NEEDS IMPLEMENTATION)
│   └── useNoteValidation.ts
├── router/           # Vue Router configuration (COMPLETE)
│   └── index.ts
├── services/         # API service layer (COMPLETE)
│   └── notesApi.ts
├── stores/           # Pinia stores (NEEDS IMPLEMENTATION)
│   └── notesStore.ts
├── types/            # TypeScript types (COMPLETE)
│   ├── Note.ts
│   └── index.ts
├── views/            # Route-level components (COMPLETE)
│   ├── NotesView.vue
│   ├── CreateNoteView.vue
│   └── EditNoteView.vue
├── App.vue           # Root component (COMPLETE)
└── main.ts           # Application entry point (UPDATE for UI library)
```

## 🧪 Testing Guidelines

Write comprehensive tests for:

1. **Pinia Store** (`stores/__tests__/notesStore.spec.ts`)
   - State initialization
   - Getters functionality (filtering, sorting)
   - Actions (CRUD operations)
   - Error handling

2. **Composables** (`composables/__tests__/useNoteValidation.spec.ts`)
   - Validation logic for all fields
   - Character counting
   - Error messages
   - Edge cases

3. **Components** (recommended)
   - Props validation
   - Event emissions
   - User interactions
   - Rendering logic

### Running Tests
```bash
# Run all tests
npm run test:unit

# Run tests in watch mode during development
npm run test:unit -- --watch
```

## 🔌 Mock API Setup

The application includes a mock API service layer (`src/services/notesApi.ts`) that falls back to in-memory storage when no backend is available.

### Option 1: JSON Server (Recommended for Testing)
```bash
# Install json-server globally
npm install -g json-server

# db.json is already in project root
# Start JSON server
json-server --watch db.json --port 3001
```

### Option 2: Use In-Memory Fallback
The API service automatically falls back to in-memory storage for development.



## 📋 Assessment Checklist

Before submitting, ensure:

- [ ] All required features are implemented
- [ ] UI library is properly integrated and configured
- [ ] TypeScript used throughout with proper types (no `any` types)
- [ ] Pinia store manages application state correctly
- [ ] Form validation works with character limits
- [ ] Category filtering functions correctly
- [ ] Notes sorted by date (newest first)
- [ ] Unit tests written and passing
- [ ] Code follows ESLint rules (`npm run lint`)
- [ ] Application runs without errors (`npm run dev`)
- [ ] Application builds successfully (`npm run build`)
- [ ] No console errors in browser
- [ ] Code is well-documented

## 📤 Submission Guidelines

### What to Submit
1. **Forked Repository**: Your completed implementation in your forked repository
2. **Documentation** (`SUBMISSION.md`):
   - UI library choice and rationale
   - Design decisions made
   - Challenges encountered and solutions
   - Accessibility features implemented
   - Future improvements
3. **README Updates**: Document any setup steps specific to your implementation

### Repository Requirements
- Keep commit history clean and meaningful
- Include a proper .gitignore
- Ensure node_modules is not committed
- Provide clear setup instructions

### Optional Enhancements (Bonus Points)
- Dark mode support
- Advanced animations and transitions
- Search functionality
- Export notes (JSON, PDF, etc.)
- Note tags/labels
- Drag and drop reordering
- Local storage persistence
- PWA features

## 🎓 Resources

- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vitest Documentation](https://vitest.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [Vue.js Style Guide](https://vuejs.org/style-guide/)

## 📄 License

This project is for assessment purposes only.

---

**Good luck with your implementation!** We're looking for clean, maintainable code that demonstrates your understanding of Vue.js best practices, accessibility, and modern frontend development patterns.
