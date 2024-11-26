import { createWebHistory, createRouter } from 'vue-router'
import Index from '../pages/Index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/index',
      component: Index,
      meta: { title: '首页' },
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('../pages/subpages/Index.vue'),
          meta: { title: '首页' },
        },
        {
          path: '/flights',
          name: 'flights',
          component: () => import('../pages/subpages/Category.vue'),
          meta: { title: '航班管理' },
        },
        {
          path: '/goods',
          name: 'goods',
          component: () => import('../pages/subpages/Goods.vue'),
          meta: { title: '商品管理' },
        },
        {
          path: '/setting',
          name: 'setting',
          component: () => import('../pages/subpages/Setting.vue'),
          meta: { title: '个人中心' },
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/MyLogin.vue'),
      meta: { title: '登录' },
    }
  ]
})
export default router
