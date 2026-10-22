import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { neverMidnightEnabled } from '@/generator/settingRegistry'

export const routes: RouteRecordRaw[] = [
  { path: '/', component: () => import('@/views/GeneratorView.vue') },
  ...(neverMidnightEnabled
    ? [
        {
          path: '/chars/never-midnight',
          meta: { setting: 'never-midnight', characterSheet: true },
          component: () => import('@/views/NeverMidnightCharacterView.vue'),
        },
        {
          path: '/never-midnight/:category/about',
          meta: { setting: 'never-midnight' },
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: '/never-midnight/:category?',
          meta: { setting: 'never-midnight' },
          component: () => import('@/views/GeneratorView.vue'),
        },
      ]
    : []),
  { path: '/about', component: () => import('@/views/AboutView.vue') },
  {
    path: '/chars/cbrpnk',
    meta: { setting: 'cyberpunk', flavor: 'cyberpunk', characterSheet: true },
    component: () => import('@/views/CharacterView.vue'),
  },
  {
    path: '/cyberpunk/:flavor(generic|shadowrun|cp77)/:category/about',
    meta: { setting: 'cyberpunk' },
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/cyberpunk/:flavor(generic|shadowrun|cp77)?/:category?',
    meta: { setting: 'cyberpunk' },
    component: () => import('@/views/GeneratorView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
