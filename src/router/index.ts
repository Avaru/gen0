import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: () => import('@/views/GeneratorView.vue') },
    { path: '/about', component: () => import('@/views/AboutView.vue') },
    { path: '/:flavor/:category/about', component: () => import('@/views/AboutView.vue') },
    { path: '/:flavor/:category?', component: () => import('@/views/GeneratorView.vue') },
  ],
})

export default router
