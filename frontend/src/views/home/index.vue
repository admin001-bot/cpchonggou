<template>
  <div class="m-index" :class="'skin_' + skin">
    <!-- 顶部导航栏 -->
    <header class="bar bar-header bar-positive">
      <div class="nav-left-wrap">
        <a class="logo" @click.prevent="router.push('/home')">
          <img src="/images/logo-2.png" alt="logo" />
        </a>
      </div>

      <div class="title"></div>

      <div class="nav-right-wrap">
        <!-- 已登录状态 -->
        <template v-if="isLogin">
          <a class="user-button" @click.prevent="router.push('/user')">
            <span class="span-user">{{ username }}</span>
          </a>
          <a class="button ry-button" style="margin-top: 5px; margin-right: 5px" href="javascript:void(0)" @click="confirmLogout">
            退出
          </a>

          <!-- 语言切换 -->
          <div class="buttons ry-buttons" onclick="changeLanguage()">
            <img style="width: 20px; padding-top: 3px; text-align: center" src="/ims/earth1.png" />
            <ul id="language_list" data-status="0" style="display: none">
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://en.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/uk.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://sj.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/hk.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://jp.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/jp.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://hp.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/hg.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://de.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/dg.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://yi.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/yi.png" />
                </a>
              </li>
              <li style="margin-top: 5px">
                <a class="button ry-button" href="https://es.lisb-tc.cfd/user/login">
                  <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/es.png" />
                </a>
              </li>
            </ul>
          </div>
        </template>

        <!-- 未登录状态 -->
        <template v-else>
          <a class="button ry-button mr-5" @click.prevent="router.push('/login')">登入</a>
          <a class="button ry-button mr-5" @click.prevent="router.push('/register')">註冊</a>
          <a class="button ry-button" href="javascript:void(0)" @click="guestLogin">試玩</a>
        </template>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 轮播图 -->
      <div class="slider">
        <div class="slide-slides">
          <div class="slide-slide" v-for="(url, index) in slideList" :key="index">
            <img :src="url" alt="slide" />
          </div>
        </div>
        <div class="slider-pager">
          <span
            v-for="(_, index) in slideList"
            :key="index"
            class="slider-pager-page"
            :class="{ active: currentSlide === index }"
          ></span>
        </div>
      </div>

      <!-- 功能菜单 -->
      <div class="index-menu">
        <ul>
          <li>
            <a @click.prevent="router.push('/bank/deposit')">
              <img src="/images/icon01.png" />
              <p style="color: #ef4a42">存/取款</p>
            </a>
          </li>
          <li>
            <a @click.prevent="router.push('/week')">
              <img src="/images/icon02.png" />
              <p style="color: #ffa421">投註記錄</p>
            </a>
          </li>
          <li>
            <a href="https://bz.ancha-gro.cfd/">
              <img src="/images/help.png" />
              <p style="color: #86c40e">幫助中心</p>
            </a>
          </li>
          <li>
            <a href="/chatlink.html" target="_blank">
              <img src="/images/icon04.png" />
              <p style="color: #3cadf9">在線客服</p>
            </a>
          </li>
        </ul>
      </div>

      <!-- 游戏列表 -->
      <div class="gamelist">
        <div class="row">
          <div v-for="game in games" :key="game.id" class="col col-33">
            <div class="gamebox">
              <a @click.prevent="goToGame(game.id)">
                <img :src="game.image" />
                <p>{{ game.name }}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底部导航栏 -->
    <footer class="bar bar-footer max">
      <div class="tabs tabs-light">
        <a class="tab-item" :class="{ active: route.path === '/home' || route.path === '/' }" @click.prevent="router.push('/home')">
          <img src="/images/icons/home.svg" class="tab-icon" />
          <span>首頁</span>
        </a>
        <a class="tab-item" :class="{ active: route.path.startsWith('/game') }" @click.prevent="router.push('/game/55')">
          <img src="/images/icons/game.svg" class="tab-icon" />
          <span>遊戲</span>
        </a>
        <a class="tab-item" href="/chatlink.html" target="_blank">
          <img src="/images/icons/service.svg" class="tab-icon" />
          <span>客服</span>
        </a>
        <a class="tab-item" :class="{ active: route.path === '/user' }" @click.prevent="router.push('/user')">
          <img src="/images/icons/user.svg" class="tab-icon" />
          <span>我的</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const skin = ref('blue')

// 计算属性
const isLogin = computed(() => userStore.isLoggedIn)
const username = computed(() => userStore.userInfo?.username || '')

// 轮播图列表
const slideList = ref(['/images/slide/zc/24218.jpg'])
const currentSlide = ref(0)
let slideTimer: number | null = null

// 游戏列表
const games = ref([
  { id: 55, name: '幸運飛艇', image: '/images/index/jsft.png' },
  { id: 50, name: '北京賽車', image: '/images/index/g-bjpk10.png' },
  { id: 122, name: '五分時時彩', image: '/images/index/amssc.png' },
  { id: 52, name: '極速飛艇', image: '/images/index/msft.png' },
  { id: 66, name: 'PC 蛋蛋', image: '/images/index/pcdd.png' },
  { id: 100, name: '極速分分彩', image: '/images/index/jsffc.png' },
  { id: 72, name: '極速賽車', image: '/images/index/jssc.png' },
  { id: 113, name: '極速六合彩', image: '/images/index/mspk10.png' },
])

// 退出登录
const confirmLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    router.push('/home')
  }
}

// 跳转游戏
const goToGame = (gameId: number) => {
  router.push('/game/' + gameId)
}

// 试玩登录
const guestLogin = () => {
  alert('試玩功能開發中')
}

// 轮播图自动播放
const startSlideShow = () => {
  slideTimer = window.setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slideList.value.length
  }, 3000)
}

// 页面加载时初始化
onMounted(async () => {
  // 加载 PHP 主 CSS（仅首页使用）
  if (!document.getElementById('main-css')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/css/main.pack.min.css'
    link.id = 'main-css'
    document.head.appendChild(link)
  }

  // 登录后从 localStorage 恢复用户信息
  const token = localStorage.getItem('token')
  const userInfoStr = localStorage.getItem('userInfo')
  if (token) {
    userStore.setToken(token)
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr)
        userStore.setUserInfo(userInfo)
      } catch (e) {
        console.error('解析用户信息失败:', e)
      }
    }
  }

  // 绑定语言切换函数
  ;(window as any).changeLanguage = function () {
    const el = document.getElementById('language_list')
    if (el) {
      const status = el.getAttribute('data-status')
      if (status == '0') {
        el.style.display = 'block'
        el.setAttribute('data-status', '1')
      } else {
        el.style.display = 'none'
        el.setAttribute('data-status', '0')
      }
    }
  }

  // 手机端触摸反馈效果
  const handleTouchStart = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    if (link) {
      link.classList.add('touch-active')
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    const target = e.target as HTMLElement
    const link = target.closest('a')
    if (link) {
      setTimeout(() => {
        link.classList.remove('touch-active')
      }, 150)
    }
  }

  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })

  // 启动轮播图
  startSlideShow()
})

onUnmounted(() => {
  if (slideTimer) {
    clearInterval(slideTimer)
  }
  // 移除 PHP CSS 文件，避免影响其他页面样式
  const mainCss = document.getElementById('main-css')
  if (mainCss) {
    mainCss.remove()
  }
})
</script>

<style scoped>
/* 全局样式 */
.m-index {
  min-height: 100vh;
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  padding-bottom: 55px;
  max-width: 640px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 去掉手机端点击蓝色遮罩 */
.m-index a, .m-index button, .m-index .tab-item {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

/* 顶部导航栏 */
.m-index .bar.bar-header {
  height: 45px;
  color: #fff;
  font-size: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.m-index .bar-header .nav-left-wrap {
  display: flex;
  align-items: center;
}

.m-index .bar-header .logo {
  display: inline-block;
  margin-top: -2px;
}

.m-index .bar-header .logo img {
  display: block;
  height: 40px;
}

.m-index .bar-header .title {
  flex: 1;
}

.m-index .bar-header .nav-right-wrap {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 用户按钮 */
.m-index .user-button {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
}

.m-index .span-user {
  color: #ffd700;
}

/* 按钮样式 */
.m-index .button.ry-button {
  background-color: #fff;
  padding: 3px 5px;
  border: solid 1px rgba(0, 0, 0, 0.1);
  box-shadow: inset 1px 1px 0 rgba(250, 250, 250, 0.22%);
  color: #cb4e3f;
  min-height: 0;
  line-height: 0.9rem;
  font-size: 0.75rem;
  border-radius: 0.7em;
  text-decoration: none;
  display: inline-block;
}

.m-index .mr-5 {
  margin-right: 5px;
}

/* 语言切换按钮 */
.m-index .buttons.ry-buttons {
  background-color: #fff;
  padding: 3px 5px;
  border: solid 1px rgba(0, 0, 0, 0.1);
  box-shadow: inset 1px 1px 0 rgba(250, 250, 250, 0.22%);
  color: #cb4e3f;
  min-height: 0;
  line-height: 0.9rem;
  font-size: 0.75rem;
  margin: auto 0;
  border-radius: 0.7em;
  position: relative;
  display: inline-block;
  cursor: pointer;
}

.m-index .buttons.ry-buttons ul {
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 5px;
  z-index: 100;
  list-style: none;
  margin: 0;
}

/* 轮播图 */
.m-index .slider {
  background: rgba(255, 255, 255, 0.5);
  min-height: 125px;
  position: relative;
  overflow: hidden;
}

.m-index .slide-slides {
  display: flex;
  transition: transform 0.3s ease;
}

.m-index .slide-slide {
  min-width: 100%;
}

.m-index .slide-slide img {
  width: 100%;
  height: 129px;
  object-fit: cover;
}

.m-index .slider-pager {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  text-align: center;
}

.m-index .slider-pager-page {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  margin: 0 3px;
}

.m-index .slider-pager-page.active {
  background: #cb4e3f;
}

/* 功能菜单 */
.m-index .index-menu {
  background: #fff;
  border-bottom: 1px solid #eee;
}

.m-index .index-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.m-index .index-menu ul li {
  width: 25%;
  float: left;
  text-align: center;
  height: 3.5em;
}

.m-index .index-menu ul li a {
  display: block;
  padding-top: 0.3em;
  text-decoration: none;
  height: 100%;
  transition: all 0.2s ease;
}

.m-index .index-menu ul li a:active,
.m-index .index-menu ul li a:hover {
  background: rgba(0, 0, 0, 0.05);
  transform: scale(0.95);
}

.m-index .index-menu ul li img {
  width: 1.5em;
  height: 1.5em;
}

.m-index .index-menu ul li p {
  margin: 3px 0 0;
  font-size: 11px;
}

/* 游戏列表 */
.m-index .gamelist {
  padding: 10px;
  background: #f5f5f5;
}

.m-index .gamelist .row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -2px;
}

.m-index .gamelist .col {
  flex: 0 0 33.333%;
  max-width: 33.333%;
  padding: 2px;
}

.m-index .gamelist .gamebox {
  text-align: center;
  font-size: 16px;
  padding: 10px 4px;
  border: 1px solid #fff;
  border-radius: 10px;
  background: #fff;
}

.m-index .gamelist .gamebox a {
  display: block;
  text-decoration: none;
  color: #333;
  transition: all 0.2s ease;
}

.m-index .gamelist .gamebox a:active,
.m-index .gamelist .gamebox a:hover {
  transform: scale(0.95);
  opacity: 0.8;
}

.m-index .gamelist .gamebox a img {
  width: 60px;
  height: 60px;
  border-radius: 10px;
}

.m-index .gamelist .gamebox a p {
  margin: 8px 0 0;
  font-size: 14px;
  color: #333;
}

/* 底部导航栏 */
.m-index .bar.bar-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55px;
  background: #fff;
  border-top: 1px solid #ddd;
  max-width: 640px;
  margin: 0 auto;
  z-index: 100;
}

.m-index .tabs {
  display: flex;
  height: 100%;
}

.m-index .tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #666;
  font-size: 12px;
  transition: all 0.2s ease;
}

.m-index .tab-item:active,
.m-index .tab-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.m-index .tab-item .tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.m-index .tab-item.active {
  color: #cb4e3f;
}

.m-index .tab-item.active .tab-icon {
  filter: invert(0.5) sepia(1) saturate(5) hue-rotate(-30deg);
}

/* 手机端触摸反馈 */
@keyframes shake {
  0%, 100% { transform: scale(0.95); }
  25% { transform: scale(0.95) rotate(-1deg); }
  75% { transform: scale(0.95) rotate(1deg); }
}

.m-index a.touch-active {
  animation: shake 0.15s ease-in-out;
}

.m-index .index-menu ul li a.touch-active {
  animation: shake 0.15s ease-in-out;
}

.m-index .gamelist .gamebox a.touch-active {
  animation: shake 0.15s ease-in-out;
}

.m-index .tab-item.touch-active {
  animation: shake 0.15s ease-in-out;
}
</style>
