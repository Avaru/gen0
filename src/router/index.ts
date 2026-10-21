import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { normalizeGeneratorSettings, settingsPath, settingsQuery } from '@/generator/settings'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/GeneratorView.vue') },
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  {
    path: '/chars/cbrpnk',
    meta: { setting: 'cyberpunk', flavor: 'cyberpunk' },
    component: () => import('@/views/CharacterView.vue'),
  },
  {
    path: '/settings/:setting/:flavor/:category/about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/settings/:setting/:flavor?/:category?',
    component: () => import('@/views/GeneratorView.vue'),
  },
  {
    path: '/:flavor/:category/about',
    redirect: (route) => {
      const selection = normalizeGeneratorSettings({
        ...route.query,
        flavor: route.params.flavor,
        category: route.params.category,
      })
      return {
        path: settingsPath(selection) + '/about',
        query: settingsQuery(selection),
        hash: route.hash,
      }
    },
  },
  { path: '/:flavor/:category?', component: () => import('@/views/GeneratorView.vue') },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
