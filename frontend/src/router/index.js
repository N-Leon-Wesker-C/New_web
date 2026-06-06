import { createRouter, createWebHistory } from 'vue-router'
import { getToken } from '../api/client.js'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    { path: '/', name: 'home', component: () => import('../views/Home.vue') },
    { path: '/about', name: 'about', component: () => import('../views/About.vue') },
    {
      path: '/career/:section',
      name: 'career-section',
      component: () => import('../views/SectionList.vue'),
      props: (route) => ({ group: 'career', section: route.params.section }),
    },
    {
      path: '/life/:section',
      name: 'life-section',
      component: () => import('../views/SectionList.vue'),
      props: (route) => ({ group: 'life', section: route.params.section }),
    },
    {
      path: '/career/:section/:slug',
      name: 'career-article',
      component: () => import('../views/ArticleDetail.vue'),
      props: (route) => ({ group: 'career', section: route.params.section, slug: route.params.slug }),
    },
    {
      path: '/life/:section/:slug',
      name: 'life-article',
      component: () => import('../views/ArticleDetail.vue'),
      props: (route) => ({ group: 'life', section: route.params.section, slug: route.params.slug }),
    },
    { path: '/admin/login', name: 'admin-login', component: () => import('../views/admin/Login.vue') },
    {
      path: '/admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: '/admin/articles' },
        { path: 'articles', component: () => import('../views/admin/Articles.vue') },
        { path: 'articles/new', component: () => import('../views/admin/ArticleEdit.vue') },
        { path: 'articles/:id/edit', component: () => import('../views/admin/ArticleEdit.vue') },
        { path: 'comments', component: () => import('../views/admin/Comments.vue') },
      ],
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !getToken()) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }
})

export default router
