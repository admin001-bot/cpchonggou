<template>
  <div class="theme-blue">
    <div id="app">
      <div class="wrap-router">
        <div class="wrap-content router-view no-tab">
          <form @submit.prevent="handleLogin">
            <div class="l-wrap">
              <div class="uc-navs">
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-weibiao45128"></i>
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="form.username"
                      class="username"
                      placeholder="請輸入用戶名"
                      autocomplete="off"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-lock"></i>
                  </div>
                  <div class="col">
                    <input
                      type="password"
                      v-model="form.password"
                      class="password"
                      placeholder="請輸入密碼"
                      @contextmenu.prevent
                      @paste.prevent
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="login-btn">
              <button type="submit" class="FormBtn" :disabled="loading">
                {{ loading ? '登錄中...' : '登錄' }}
              </button>
            </div>
          </form>

          <div class="l-bottom-wrap">
            <div class="uc-navs">
              <div class="row">
                <div class="col"></div>
              </div>
              <div class="row" style="margin-top: 1em">
                <span class="text-center">
                  <a href="#">《用戶協議》</a>
                </span>
              </div>

              <div class="row options" style="margin-top: 2em">
                <router-link to="/register" class="col">
                  <img src="/ims/dew_1.png" />
                  <p><span>馬上註冊</span></p>
                </router-link>

                <a href="javascript:void(0);" @click="guestLogin" class="col">
                  <img src="/ims/dew_2.png" />
                  <p><span>免費試玩</span></p>
                </a>

                <a href="/chatlink.html" class="col">
                  <img src="/ims/aaa.png" />
                  <p><span>在線客服</span></p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 顶部导航 -->
      <header class="nav v-transfer-dom">
        <div class="nav-item">
          <div class="nav-left-wrap">
            <div class="back">
              <a href="/">
                <span class="back-btn">首頁</span>
              </a>
            </div>
            <div class="left-slot"></div>
          </div>
        </div>

        <div class="title">登錄</div>

        <div class="nav-item">
          <div class="right-slot">
            <div class="button ry-button mr-5">
              <img
                style="width: 20px; padding-top: 3px; text-align: center"
                src="/ims/earth1.png"
                @click="toggleLanguage"
              />
              <ul id="language_list" :style="{ display: showLanguage ? 'block' : 'none' }">
                <li style="margin-top: 5px">
                  <a class="button ry-button" href="#">
                    <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/uk.png" />
                  </a>
                </li>
                <li style="margin-top: 5px">
                  <a class="button ry-button" href="#">
                    <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/hk.png" />
                  </a>
                </li>
                <li style="margin-top: 5px">
                  <a class="button ry-button" href="#">
                    <img style="width: 30px; padding-top: 1px; text-align: center" src="/ims/jp.png" />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const showLanguage = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  if (!form.username || !form.password) {
    alert('請輸入用戶名和密碼')
    return
  }

  loading.value = true
  try {
    const res = await userApi.login({
      username: form.username,
      password: form.password,
    })

    if (res.code === 0 && res.data) {
      // 保存token
      userStore.setToken(res.data.token)
      // 保存用户信息
      const userInfo = {
        uid: res.data.uid,
        username: res.data.username,
        nickname: res.data.nickname || res.data.username,
        name: res.data.name || '',
        balance: parseFloat(res.data.coin) || 0,
        phone: res.data.phone || '',
        email: res.data.email || '',
        userType: res.data.type || 0,
      }
      userStore.setUserInfo(userInfo)
      // 保存到localStorage
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      router.push('/')
    } else {
      alert(res.message || '登錄失敗')
    }
  } catch (error: any) {
    console.error('登錄失敗:', error)
    alert(error.response?.data?.message || '登錄失敗，請稍後重試')
  } finally {
    loading.value = false
  }
}

const guestLogin = () => {
  alert('免費試玩功能開發中')
}

const toggleLanguage = () => {
  showLanguage.value = !showLanguage.value
}
</script>

<style>
/* 引入登录页面样式 */
@import '/css/login.css';
</style>
