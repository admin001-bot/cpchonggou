import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { t, getCurrentLocale } from '@/locales'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/home/index.vue'),
    meta: { title: 'common.home' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/user/login.vue'),
    meta: { title: 'common.login' },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/user/register.vue'),
    meta: { title: 'common.register' },
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/views/user/center.vue'),
    meta: { title: 'home.mine', requiresAuth: true },
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: () => import('@/views/user/Profile.vue'),
    meta: { title: 'user.profile', requiresAuth: true },
  },
  {
    path: '/user/change-password',
    name: 'UserChangePassword',
    component: () => import('@/views/user/ChangePassword.vue'),
    meta: { title: 'user.changePassword', requiresAuth: true },
  },
  {
    path: '/user/fund-password',
    name: 'UserFundPassword',
    component: () => import('@/views/user/FundPassword.vue'),
    meta: { title: 'user.fundPassword', requiresAuth: true },
  },
  {
    path: '/user/fundpwd',
    name: 'UserFundPwd',
    component: () => import('@/views/user/FundPwd.vue'),
    meta: { title: 'user.fundPassword', requiresAuth: true },
  },
  {
    path: '/user/login',
    name: 'UserLogin',
    component: () => import('@/views/user/login.vue'),
    meta: { title: 'common.login' },
  },
  {
    path: '/user/register',
    name: 'UserRegister',
    component: () => import('@/views/user/register.vue'),
    meta: { title: 'common.register' },
  },
  {
    path: '/user/help',
    name: 'Help',
    component: () => import('@/views/user/Help.vue'),
    meta: { title: 'home.help', requiresAuth: true },
  },
  {
    path: '/game/:id',
    name: 'Game',
    component: () => import('@/views/game/index.vue'),
    meta: { title: 'common.game' },
  },
  {
    path: '/game/history/:gameId',
    name: 'GameHistory',
    component: () => import('@/views/game/index.vue'),
    meta: { title: 'game.lotteryResult' },
  },
  {
    path: '/notcount',
    name: 'NotCount',
    component: () => import('@/views/game/NotCount.vue'),
    meta: { title: 'game.notCountTitle', requiresAuth: true },
  },
  {
    path: '/notcount/:gameId',
    name: 'NotCountDetail',
    component: () => import('@/views/game/NotCountDetail.vue'),
    meta: { title: 'game.betDetail', requiresAuth: true },
  },
  {
    path: '/settled',
    name: 'Settled',
    component: () => import('@/views/game/Settled.vue'),
    meta: { title: 'game.todaySettled', requiresAuth: true },
  },
  {
    path: '/week',
    name: 'WeekRecord',
    component: () => import('@/views/game/WeekRecord.vue'),
    meta: { title: 'bet.weekRecordTitle', requiresAuth: true },
  },
  {
    path: '/day/:date',
    name: 'DayRecord',
    component: () => import('@/views/game/DayRecord.vue'),
    meta: { title: 'bet.dayRecordTitle', requiresAuth: true },
  },
  {
    path: '/day/:date/:gameId',
    name: 'DayDetail',
    component: () => import('@/views/game/DayDetail.vue'),
    meta: { title: 'game.betDetail', requiresAuth: true },
  },
  {
    path: '/bank',
    component: () => import('@/views/bank/index.vue'),
    meta: { title: 'bank.fundManage', requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/bank/deposit',
      },
      {
        path: 'deposit',
        name: 'Deposit',
        component: () => import('@/views/bank/Deposit.vue'),
        meta: { title: 'bank.deposit' },
      },
      {
        path: 'withdraw',
        name: 'Withdraw',
        component: () => import('@/views/bank/Withdraw.vue'),
        meta: { title: 'bank.withdraw' },
      },
      {
        path: 'records/:type',
        name: 'Records',
        component: () => import('@/views/bank/Records.vue'),
        meta: { title: 'bank.record' },
      },
      {
        path: 'alipay',
        name: 'AlipayDeposit',
        component: () => import('@/views/bank/AlipayDeposit.vue'),
        meta: { title: 'bank.alipayTransfer' },
      },
      {
        path: 'bind-address',
        name: 'BindAddress',
        component: () => import('@/views/bank/BindAddress.vue'),
        meta: { title: 'bank.bindAddress', requiresAuth: true },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 禁用默认滚动行为，让动画更流畅
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0 }
  },
})

// 路由动画控制
let historyStack: string[] = []

router.afterEach((to) => {
  // 记录访问历史
  if (!historyStack.includes(to.path)) {
    historyStack.push(to.path)
    if (historyStack.length > 10) {
      historyStack = historyStack.slice(-10)
    }
  }

  // 设置transition名称
  const fromPath = historyStack[historyStack.length - 2]
  if (fromPath && to.path === fromPath) {
    // 后退
    (router as any).transitionName = 'router-view-back'
  } else {
    // 前进
    (router as any).transitionName = 'router-view'
  }
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  const titleKey = to.meta.title as string
  // 如果标题是翻译key则翻译，否则直接使用
  if (titleKey && titleKey.startsWith('bet.') || titleKey && titleKey.startsWith('home.') || titleKey && titleKey.startsWith('common.') || titleKey && titleKey.startsWith('bank.')) {
    document.title = t(titleKey)
  } else {
    document.title = titleKey || '彩票系统'
  }

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
