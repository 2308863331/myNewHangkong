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
          path: '/orders',
          name: 'orders',
          component: () => import('../pages/subpages/Order.vue'),
          meta: { title: '订单管理' },
        },
        {
          path: '/flights',
          name: 'flights',
          component: () => import('../pages/subpages/Flight.vue'),
          meta: { title: '航班管理' },
        },
        {
          path: '/paids',
          name: 'paids',
          component: () => import('../pages/subpages/Paid.vue'),
          meta: { title: '支付管理' },
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
