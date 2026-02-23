<template>
  <div class="theme-blue">
    <div id="app">
      <div class="wrap-router">
        <div class="wrap-content router-view no-tab">
          <div class="l-wrap">
            <div class="uc-navs">
              <form @submit.prevent="handleRegister">
                <!-- 用户名 -->
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-weibiao45128"></i>
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="form.username"
                      class="username"
                      placeholder="您的用戶名"
                      autocomplete="off"
                    />
                  </div>
                  <div class="col"></div>
                </div>
                <p class="field-tip">*請使用6-15位英文或數字的組合</p>

                <!-- 密码 -->
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-lock"></i>
                  </div>
                  <div class="col">
                    <input
                      :type="showPassword1 ? 'text' : 'password'"
                      v-model="form.password"
                      class="password"
                      placeholder="你的用戶密碼"
                      @contextmenu.prevent
                      @paste.prevent
                    />
                  </div>
                  <div class="col">
                    <a href="javascript:;" @click="showPassword1 = !showPassword1">
                      <i class="iconfont icon-eye" :class="{ off: !showPassword1 }"></i>
                    </a>
                  </div>
                </div>
                <p class="field-tip">*請使用6-20位字符</p>

                <!-- 确认密码 -->
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-lock"></i>
                  </div>
                  <div class="col">
                    <input
                      :type="showPassword2 ? 'text' : 'password'"
                      v-model="form.cpasswd"
                      class="confirm_password"
                      placeholder="再次輸入密碼"
                      @contextmenu.prevent
                      @paste.prevent
                    />
                  </div>
                  <div class="col">
                    <a href="javascript:;" @click="showPassword2 = !showPassword2">
                      <i class="iconfont icon-eye" :class="{ off: !showPassword2 }"></i>
                    </a>
                  </div>
                </div>
                <p class="field-tip">*請確認密碼</p>

                <!-- 真实姓名 -->
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-account"></i>
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="form.name"
                      class="name"
                      placeholder="真實姓名"
                    />
                  </div>
                </div>
                <p class="field-tip">*真實姓名</p>

                <!-- 手机号码 -->
                <div class="row">
                  <div class="col">
                    <i class="iconfont icon-phone"></i>
                  </div>
                  <div class="col">
                    <input
                      type="text"
                      v-model="form.phone"
                      class="email"
                      placeholder="手機號碼"
                    />
                  </div>
                </div>
                <p class="field-tip">*請輸純數字號碼</p>

                <!-- 底部按钮区 -->
                <div class="l-bottom-wrap">
                  <div class="btn-wrap">
                    <button type="submit" class="btn" :disabled="loading">
                      {{ loading ? '註冊中...' : '註冊' }}
                    </button>
                  </div>
                  <div class="uc-navs">
                    <div class="row">
                      <span class="text-center">已有帳號，請 <router-link to="/login">登錄</router-link></span>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- 顶部导航 -->
      <header class="nav v-transfer-dom">
        <div class="nav-item">
          <div class="nav-left-wrap">
            <div class="back">
              <router-link to="/login">
                <span class="back-btn">登錄</span>
              </router-link>
            </div>
            <div class="left-slot"></div>
          </div>
        </div>
        <div class="title">註冊</div>
        <div class="nav-item">
          <div class="right-slot"></div>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/api/user'

const router = useRouter()
const loading = ref(false)
const showPassword1 = ref(false)
const showPassword2 = ref(false)

const form = reactive({
  username: '',
  password: '',
  cpasswd: '',
  name: '',
  phone: '',
})

const handleRegister = async () => {
  // 验证
  if (!form.username || form.username.length < 6 || form.username.length > 15) {
    alert('請使用6-15位英文或數字的組合')
    return
  }
  if (!form.password || form.password.length < 6 || form.password.length > 20) {
    alert('請使用6-20位字符')
    return
  }
  if (form.password !== form.cpasswd) {
    alert('兩次輸入的密碼不一致')
    return
  }
  if (!form.phone) {
    alert('請輸入手機號碼')
    return
  }

  loading.value = true
  try {
    await userApi.register({
      username: form.username,
      password: form.password,
      phone: form.phone,
      name: form.name || undefined,
    })
    alert('註冊成功')
    router.push('/login')
  } catch (error) {
    console.error('註冊失敗:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style>
@import '/css/login.css';
</style>

<style scoped>
/* 注册页面特有样式 */
.field-tip {
  margin: 0;
  padding: 0 1em;
  font-size: 12px;
  color: #999
}

.btn-wrap {
  margin: 1em
}

.btn {
  width: 100%;
  padding: .8em 0;
  border-radius: 10em;
  border: none;
  text-align: center;
  background: #ff625c;
  color: #fcfcfc;
  font-size: 1em;
  cursor: pointer
}

.btn:disabled {
  background: rgba(55, 71, 82, .5);
  cursor: not-allowed
}

/* 登录链接蓝色 */
.text-center a {
  color: #3a81e5 !important
}

/* 眼睛图标 */
.icon-eye.off {
  opacity: 0.5
}

/* 图标 */
.icon-account:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff625c'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-phone:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ff625c'%3E%3Cpath d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.icon-eye:before {
  content: "";
  display: inline-block;
  width: 20px;
  height: 20px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23999'%3E%3Cpath d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
