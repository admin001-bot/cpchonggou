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

// 资源加载检测
let stylesLoaded = false
let domReady = false

// 检测样式加载
const checkStylesLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      const sheets = document.styleSheets
      let allLoaded = true

      if (sheets && sheets.length > 0) {
        for (let i = 0; i < sheets.length; i++) {
          const sheet = sheets[i]
          // 检查外部样式表是否加载完成
          if (sheet.href) {
            try {
              // 尝试访问 cssRules，如果未加载会抛出错误
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              const rules = sheet.cssRules || sheet.rules
            } catch (e) {
              // 样式未加载完成
              allLoaded = false
              break
            }
          }
        }
      }

      if (allLoaded) {
        clearInterval(checkInterval)
        stylesLoaded = true
        resolve()
      }
    }, 50)

    // 最多等待 5 秒
    setTimeout(() => {
      clearInterval(checkInterval)
      stylesLoaded = true
      resolve()
    }, 5000)
  })
}

// 检测 DOM 和组件渲染完成
const checkDomReady = (): Promise<void> => {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      domReady = true
      resolve()
      return
    }

    const onReady = () => {
      domReady = true
      resolve()
    }

    window.addEventListener('load', onReady, { once: true })

    // 备用方案：超时后强制标记为就绪
    setTimeout(() => {
      window.removeEventListener('load', onReady)
      domReady = true
      resolve()
    }, 5000)
  })
}

router.afterEach((to) => {
  // 记录访问历史
  if (!historyStack.includes(to.path)) {
    historyStack.push(to.path)
    if (historyStack.length > 10) {
      historyStack = historyStack.slice(-10)
    }
  }

  // 设置 transition 名称
  const fromPath = historyStack[historyStack.length - 2]
  if (fromPath && to.path === fromPath) {
    // 后退
    (router as any).transitionName = 'router-view-back'
  } else {
    // 前进
    (router as any).transitionName = 'router-view'
  }
})

// 路由守卫 - 显示加载动画并检测资源加载
router.beforeEach(async (to, _from, next) => {
  // 显示加载动画
  const loadingStore = (router as any).__loadingStore
  if (loadingStore) {
    loadingStore.show()
    // 重置加载状态
    stylesLoaded = false
    domReady = false
  }

  // 设置页面标题
  const titleKey = to.meta.title as string
  // 如果标题是翻译 key 则翻译，否则直接使用
  if (titleKey && (titleKey.startsWith('bet.') || titleKey.startsWith('home.') || titleKey.startsWith('common.') || titleKey.startsWith('bank.'))) {
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

  // 等待资源和样式加载完成
  if (loadingStore) {
    await Promise.all([
      checkStylesLoaded(),
      checkDomReady(),
    ])
  }

  next()
})

// 路由结束后隐藏加载动画
router.afterEach(() => {
  const loadingStore = (router as any).__loadingStore
  if (loadingStore) {
    // 确保资源和样式都加载完成后再隐藏
    setTimeout(() => {
      loadingStore.hide()
    }, 150)
  }
})

export default router
