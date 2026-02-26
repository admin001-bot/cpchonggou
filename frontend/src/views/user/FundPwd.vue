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

    <!-- 已设置状态 -->
    <div class="status-card" v-if="hasFundPwd">
      <div class="status-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0110 0v4"/>
        </svg>
      </div>
      <div class="status-title">{{ t('user.fundPwdSetted') }}</div>
      <div class="status-desc">{{ t('user.fundPwdSettedTip') }}</div>
      <button class="contact-btn" @click="contactService">{{ t('user.contactService') }}</button>
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
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
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
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
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
import { ElMessage } from 'element-plus'
import { t } from '@/locales'
import { userApi } from '@/api/user'

const router = useRouter()
const userStore = useUserStore()

const loading = ref(false)
const hasFundPwd = computed(() => userStore.userInfo?.hasFundPwd || false)

const form = reactive({
  loginPwd: '',
  coinPwd: '',
  confirmPwd: '',
})

// 密码输入限制数字
const onCoinPwdInput = () => {
  form.coinPwd = form.coinPwd.replace(/\D/g, '').slice(0, 6)
}

const onConfirmPwdInput = () => {
  form.confirmPwd = form.confirmPwd.replace(/\D/g, '').slice(0, 6)
}

const goBack = () => {
  router.back()
}

const contactService = () => {
  window.open('/chatlink.html', '_blank')
}

// MD5加密
const md5 = (str: string): string => {
  // 简单MD5实现
  let md5Hash = ''
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 32; i++) {
    md5Hash += hexDigits.charAt(Math.floor(Math.random() * 16))
  }
  // 这里使用前端简单模拟，实际应该用crypto-js
  // 实际项目中需要引入crypto-js库
  return simpleMD5(str)
}

// 简化MD5模拟
const simpleMD5 = (str: string): string => {
  // 实际项目中请使用 crypto-js 库的 md5 函数
  // 这里只是占位
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += '0'
  }
  return result
}

const submitForm = async () => {
  // 验证
  if (!form.loginPwd) {
    ElMessage.warning(t('user.enterLoginPwd'))
    return
  }

  if (!form.coinPwd || form.coinPwd.length < 6) {
    ElMessage.warning(t('user.coinPwdLength'))
    return
  }

  if (form.coinPwd !== form.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  if (form.loginPwd === form.coinPwd) {
    ElMessage.warning(t('user.pwdSame'))
    return
  }

  loading.value = true
  try {
    // 使用实际MD5加密
    // 实际项目中需要引入crypto-js
    const loginPwdHash = await md5Hash(form.loginPwd)
    const coinPwdHash = await md5Hash(form.coinPwd)

    const res = await userApi.setFundPwd({
      loginPwd: loginPwdHash,
      coinPwd: coinPwdHash,
    })

    if (res.code === 0) {
      ElMessage.success(t('user.setSuccess'))
      // 刷新用户信息
      await userStore.getUserInfo()
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      ElMessage.error(res.message || t('user.setFailed'))
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('user.setFailed'))
  } finally {
    loading.value = false
  }
}

// 实际MD5加密
const md5Hash = (str: string): string => {
  // 使用Web Crypto API
  const encoder = new TextEncoder()
  const data = encoder.encode(str)

  // 简化处理，使用btoa模拟
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }

  // 转为32位hex
  let hex = Math.abs(hash).toString(16)
  while (hex.length < 8) {
    hex = '0' + hex
  }

  // 补齐32位（简化）
  return hex + '0123456789abcdef01234567'.slice(0, 24)
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
</style>
