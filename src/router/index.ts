import { createRouter, createWebHistory } from 'vue-router'
import NotesView from '../views/NotesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'notes',
      component: NotesView
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

