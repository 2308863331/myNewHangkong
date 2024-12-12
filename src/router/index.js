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
          path: '/user',
          name: 'user',
          component: () => import('../pages/subpages/User.vue'),
          meta: { title: '用户管理' },
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
          path: '/seats',
          name: 'seats',
          component: () => import('../pages/subpages/Seat.vue'),
          meta: { title: '机票座位管理' },
        },
        // 新增评论管理路由
        {
          path: '/reviews',
          name: 'reviews',
          component: () => import('../pages/subpages/Review.vue'),
          meta: { title: '评论管理' },
        },
        // 新增优惠券管理路由
        {
          path: '/coupons',
          name: 'coupons',
          component: () => import('../pages/subpages/Coupon.vue'),
          meta: { title: '优惠券管理' },
        },
        // 新增退款管理路由
        {
          path: '/refunds',
          name: 'refunds',
          component: () => import('../pages/subpages/Refund.vue'),
          meta: { title: '退款管理' },
        },
        // 新增用户订单路由
        {
          path: '/userOrder',
          name: 'userOrder',
          component: () => import('../pages/subpages/UserOrder.vue'),
          meta: { title: '用户订单查看' },
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
