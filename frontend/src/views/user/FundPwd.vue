<template>
  <div class="fundpwd-page">
    <!-- 顶部导航 -->
    <header class="fundpwd-header">
      <span class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('user.fundPassword') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 已设置状态 - 改为可点击修改 -->
    <div class="status-card" v-if="hasFundPwd && !isEditMode">
      <div class="status-icon success">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
      </div>
      <div class="status-title">{{ t('user.fundPwdSetted') }}</div>
      <div class="status-desc">{{ t('user.fundPwdSettedTip') }}</div>
      <button class="change-btn" @click="handleSetClick">
        {{ t('user.changeCoinPwd') }}
      </button>
    </div>

    <!-- 修改密码模式 -->
    <div class="form-card" v-else-if="isEditMode">
      <div class="form-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <div class="form-title">{{ t('user.changeCoinPwd') }}</div>

      <div class="form-group">
        <!-- 原提款密码 -->
        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.oldPwd"
            :placeholder="t('user.enterOldCoinPwd')"
            class="form-input"
            maxlength="6"
            @input="onOldPwdInput"
          />
        </div>

        <!-- 新提款密码 -->
        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.coinPwd"
            :placeholder="t('user.enterNewCoinPwd')"
            class="form-input"
            maxlength="6"
            @input="onCoinPwdInput"
          />
        </div>

        <!-- 确认新密码 -->
        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.confirmPwd"
            :placeholder="t('user.confirmNewCoinPwd')"
            class="form-input"
            maxlength="6"
            @input="onConfirmPwdInput"
          />
        </div>
      </div>

      <button class="submit-btn" @click="submitEditForm" :disabled="loading">
        {{ loading ? t('common.loading') : t('common.confirm') }}
      </button>

      <button class="back-btn-text" @click="isEditMode = false">
        {{ t('user.backToSet') }}
      </button>
    </div>

    <!-- 未设置 - 表单 -->
    <div class="form-card" v-else>
      <div class="form-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <div class="form-title">{{ t('user.setFundPwd') }}</div>

      <div class="form-group">
        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.loginPwd"
            :placeholder="t('user.enterLoginPwd')"
            class="form-input"
            maxlength="20"
          />
        </div>

        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.coinPwd"
            :placeholder="t('user.enterCoinPwd')"
            class="form-input"
            maxlength="6"
            @input="onCoinPwdInput"
          />
        </div>

        <div class="input-item">
          <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <input
            type="password"
            v-model="form.confirmPwd"
            :placeholder="t('user.confirmCoinPwd')"
            class="form-input"
            maxlength="6"
            @input="onConfirmPwdInput"
          />
        </div>
      </div>

      <div class="form-tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>{{ t('user.fundPwdTip1') }}</span>
      </div>

      <div class="form-tip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>{{ t('user.fundPwdTip2') }}</span>
      </div>

      <button class="submit-btn" @click="submitForm" :disabled="loading">
        {{ loading ? t('common.loading') : t('common.confirm') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import { t } from '@/locales'
import { userApi } from '@/api/user'
import MD5 from 'crypto-js/md5'

const router = useRouter()
const userStore = useUserStore()
const toastStore = useToastStore()

const loading = ref(false)
const isEditMode = ref(false)  // 是否为修改模式
const hasFundPwd = computed(() => userStore.userInfo?.hasFundPwd || false)

const form = reactive({
  loginPwd: '',      // 登录密码（首次设置时使用）
  oldPwd: '',        // 原提款密码（修改时使用）
  coinPwd: '',       // 新提款密码
  confirmPwd: '',    // 确认新密码
})

// 密码输入限制数字
const onCoinPwdInput = () => {
  form.coinPwd = form.coinPwd.replace(/\D/g, '').slice(0, 6)
}

const onConfirmPwdInput = () => {
  form.confirmPwd = form.confirmPwd.replace(/\D/g, '').slice(0, 6)
}

const onOldPwdInput = () => {
  form.oldPwd = form.oldPwd.replace(/\D/g, '').slice(0, 6)
}

const goBack = () => {
  router.back()
}

const contactService = () => {
  window.open('/chatlink.html', '_blank')
}

// 点击已设置状态时的处理
const handleSetClick = () => {
  isEditMode.value = true
}

// 首次设置提交
const submitForm = async () => {
  // 验证
  if (!form.loginPwd) {
    toastStore.show({
      type: 'warning',
      title: '需要登录密码',
      message: t('user.enterLoginPwd')
    })
    return
  }

  if (!form.coinPwd || form.coinPwd.length < 6) {
    toastStore.show({
      type: 'warning',
      title: '密码长度不足',
      message: t('user.coinPwdLength')
    })
    return
  }

  if (form.coinPwd !== form.confirmPwd) {
    toastStore.show({
      type: 'warning',
      title: '密码不匹配',
      message: t('user.pwdNotMatch')
    })
    return
  }

  // 验证密码不能与登录密码相同
  if (form.loginPwd === form.coinPwd) {
    toastStore.show({
      type: 'warning',
      title: '密码不能相同',
      message: t('user.pwdSame')
    })
    return
  }

  loading.value = true
  try {
    const res = await userApi.setCoinPwd({
      oldPwd: '',  // 首次设置为空
      newPwd: MD5(form.coinPwd).toString(),
      loginPwd: MD5(form.loginPwd).toString(),
    })

    if (res.code === 0) {
      toastStore.show({
        type: 'success',
        title: '设置成功',
        message: t('user.setSuccess')
      })
      // 刷新用户信息
      await userStore.getUserInfo()
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      const errorMessage = res.message || res.data?.message || res.msg || res.error || t('user.setFailed')
      toastStore.show({
        type: 'error',
        title: '设置失败',
        message: errorMessage
      })
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message || t('user.setFailed')
    toastStore.show({
      type: 'error',
      title: '设置失败',
      message: errorMsg
    })
  } finally {
    loading.value = false
  }
}

// 修改密码提交
const submitEditForm = async () => {
  // 验证
  if (!form.oldPwd || form.oldPwd.length < 6) {
    toastStore.show({
      type: 'warning',
      title: '需要原密码',
      message: t('user.enterOldCoinPwd')
    })
    return
  }

  if (!form.coinPwd || form.coinPwd.length < 6) {
    toastStore.show({
      type: 'warning',
      title: '密码长度不足',
      message: t('user.coinPwdLength')
    })
    return
  }

  if (form.coinPwd !== form.confirmPwd) {
    toastStore.show({
      type: 'warning',
      title: '密码不匹配',
      message: t('user.pwdNotMatch')
    })
    return
  }

  loading.value = true
  try {
    const res = await userApi.setCoinPwd({
      oldPwd: MD5(form.oldPwd).toString(),
      newPwd: MD5(form.coinPwd).toString(),
    })

    if (res.code === 0) {
      toastStore.show({
        type: 'success',
        title: '修改成功',
        message: t('user.changeSuccess')
      })
      isEditMode.value = false
      // 清空表单
      form.oldPwd = ''
      form.coinPwd = ''
      form.confirmPwd = ''
    } else {
      const errorMessage = res.message || res.data?.message || res.msg || res.error || t('user.changeFailed')
      toastStore.show({
        type: 'error',
        title: '修改失败',
        message: errorMessage
      })
    }
  } catch (error: any) {
    const errorMsg = error.response?.data?.message || error.response?.data?.msg || error.message || t('user.changeFailed')
    toastStore.show({
      type: 'error',
      title: '修改失败',
      message: errorMsg
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.fundpwd-page {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 640px;
  margin: 0 auto;
  overflow-y: auto;
}

/* 顶部导航 */
.fundpwd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  padding: 0 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(251, 35, 81, 0.3);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.92);
}

.back-btn .icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.header-right {
  width: 36px;
}

/* 已设置状态 */
.status-card {
  background: #fff;
  margin: 20px 15px;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
}

.status-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #4ECDC4, #3dbdb5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon.success {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.status-icon svg {
  width: 40px;
  height: 40px;
  color: #fff;
}

.status-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.status-desc {
  font-size: 14px;
  color: #999;
  margin-bottom: 25px;
}

.contact-btn {
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
}

/* 表单卡片 */
.form-card {
  background: #fff;
  margin: 20px 15px;
  border-radius: 16px;
  padding: 30px 20px;
}

.form-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-icon svg {
  width: 32px;
  height: 32px;
  color: #fff;
}

.form-title {
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.input-item {
  position: relative;
  margin-bottom: 15px;
}

.input-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #fb2351;
}

.form-input {
  width: 100%;
  padding: 14px 15px 14px 45px;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: #fb2351;
}

.form-tip {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  font-size: 12px;
  color: #999;
}

.form-tip svg {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  flex-shrink: 0;
  margin-top: 2px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 25px;
  transition: all 0.2s;
}

.submit-btn:active {
  transform: scale(0.98);
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.6;
}

/* 修改按钮 */
.change-btn {
  background: transparent;
  color: #fb2351;
  border: 1px solid #fb2351;
  padding: 12px 40px;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.change-btn:hover,
.change-btn:active {
  background: #fb2351;
  color: #fff;
}

/* 返回按钮 */
.back-btn-text {
  display: block;
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  background: transparent;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}
</style>
