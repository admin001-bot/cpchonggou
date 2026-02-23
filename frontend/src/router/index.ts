import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: '首页' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/user/center.vue'),
    meta: { title: '个人中心', requiresAuth: true },
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    component: () => import('@/views/user/login.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/user/register',
    name: 'UserRegister',
    component: () => import('@/views/user/register.vue'),
    meta: { title: '注册' },
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('@/views/game/index.vue'),
    meta: { title: '游戏' },
  },
  {
    path: '/game/history/:gameId',
    name: 'GameHistory',
    component: () => import('@/views/game/index.vue'),
    meta: { title: '开奖结果' },
  },
  {
    path: '/notcount',
    name: 'NotCount',
    component: () => import('@/views/game/NotCount.vue'),
    meta: { title: '即時注單', requiresAuth: true },
  },
  {
    path: '/notcount/:gameId',
    name: 'NotCountDetail',
    component: () => import('@/views/game/NotCountDetail.vue'),
    meta: { title: '注單明細', requiresAuth: true },
  },
  {
    path: '/settled',
    name: 'Settled',
    component: () => import('@/views/game/Settled.vue'),
    meta: { title: '今日已結', requiresAuth: true },
  },
  {
    path: '/week',
    name: 'WeekRecord',
    component: () => import('@/views/game/WeekRecord.vue'),
    meta: { title: '下注紀錄', requiresAuth: true },
  },
  {
    path: '/day/:date',
    name: 'DayRecord',
    component: () => import('@/views/game/DayRecord.vue'),
    meta: { title: '日期詳情', requiresAuth: true },
  },
  {
    path: '/day/:date/:gameId',
    name: 'DayDetail',
    component: () => import('@/views/game/DayRecord.vue'),
    meta: { title: '遊戲詳情', requiresAuth: true },
  },
  {
    path: '/bank',
    component: () => import('@/views/bank/index.vue'),
    meta: { title: '資金管理', requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/bank/deposit',
      },
      {
        path: 'deposit',
        name: 'Deposit',
        component: () => import('@/views/bank/Deposit.vue'),
        meta: { title: '存款' },
      },
      {
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('@/views/bank/Withdraw.vue'),
        meta: { title: '提款' },
      },
      {
        path: 'records/:type',
        name: 'Records',
        component: () => import('@/views/bank/Records.vue'),
        meta: { title: '記錄' },
      },
      {
        path: 'alipay',
        name: 'AlipayDeposit',
        component: () => import('@/views/bank/AlipayDeposit.vue'),
        meta: { title: '支付寶轉帳' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = (to.meta.title as string) || '彩票系统'

  // 检查是否需要登录
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }

  next()
})

export default router
