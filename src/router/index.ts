import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'notes',
      component: () => import('../views/NotesView.vue')
    },
    {
      path: '/create',
      name: 'create-note',
      component: () => import('../views/CreateNoteView.vue')
    },
    {
      path: '/edit/:id',
      name: 'edit-note',
      component: () => import('../views/EditNoteView.vue')
    }
  ]
})

export default router

