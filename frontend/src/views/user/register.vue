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
                      :placeholder="t('register.yourUsername')"
                      autocomplete="off"
                    />
                  </div>
                  <div class="col"></div>
                </div>
                <p class="field-tip">*{{ t('register.usernameRule') }}</p>

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
                      :placeholder="t('register.yourPassword')"
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
                <p class="field-tip">*{{ t('register.passwordRule') }}</p>

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
                      :placeholder="t('register.confirmPassword')"
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
                <p class="field-tip">*{{ t('register.confirmPasswordTip') }}</p>

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
                      :placeholder="t('register.realName')"
                    />
                  </div>
                </div>
                <p class="field-tip">*{{ t('register.realName') }}</p>

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
                      :placeholder="t('register.phoneNumber')"
                    />
                  </div>
                </div>
                <p class="field-tip">*{{ t('register.enterPhone') }}</p>

                <!-- 底部按钮区 -->
                <div class="l-bottom-wrap">
                  <div class="btn-wrap">
                    <button type="submit" class="btn" :disabled="loading">
                      {{ loading ? t('register.registering') : t('common.register') }}
                    </button>
                  </div>
                  <div class="uc-navs">
                    <div class="row">
                      <span class="text-center">{{ t('login.alreadyHaveAccount') }} <router-link to="/login">{{ t('common.login') }}</router-link></span>
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
                <span class="back-btn">{{ t('common.login') }}</span>
              </router-link>
            </div>
            <div class="left-slot"></div>
          </div>
        </div>
        <div class="title">{{ t('register.title') }}</div>
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
import { t } from '@/locales'

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
    alert(t('register.usernameRule'))
    return
  }
  if (!form.password || form.password.length < 6 || form.password.length > 20) {
    alert(t('register.passwordRule'))
    return
  }
  if (form.password !== form.cpasswd) {
    alert(t('register.passwordMismatch'))
    return
  }
  if (!form.phone) {
    alert(t('register.enterPhone'))
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
    alert(t('register.success'))
    router.push('/login')
  } catch (error) {
    console.error('Registration failed:', error)
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
