<template>
  <div class="profile-page">
    <!-- 顶部导航 -->
    <header class="profile-header">
      <span class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('user.fundPassword') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 用户信息卡片 -->
    <div class="profile-card">
      <div class="avatar-section">
        <div class="avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="vip-badge" v-if="userInfoData.grade > 1">
          <span>VIP{{ userInfoData.grade }}</span>
        </div>
      </div>
      <div class="user-name">{{ userInfoData.username }}</div>
      <div class="user-type">
        <span class="type-tag">{{ userTypeText }}</span>
        <span class="fan-dian" v-if="userInfoData.fanDian > 0">{{ userInfoData.fanDian }}% {{ t('user.fanDian') }}</span>
      </div>
    </div>

    <!-- 账户信息 -->
    <div class="info-section">
      <div class="section-title">{{ t('user.accountInfo') }}</div>
      <div class="info-list">
        <div class="info-item">
          <span class="info-label">{{ t('user.userId') }}</span>
          <span class="info-value">{{ userInfoData.uid }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ t('user.regTime') }}</span>
          <span class="info-value">{{ userInfoData.regTime || '-' }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ t('user.balance') }}</span>
          <span class="info-value balance">{{ (userInfoData.balance || 0).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 提款密码 -->
    <div class="form-section">
      <div class="section-title">{{ t('user.fundPassword') }}</div>

      <div class="form-item" @click="showCoinPwdModal = true">
        <div class="form-label">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          {{ hasFundPwd ? t('user.changeCoinPwd') : t('user.setFundPwd') }}
        </div>
        <div class="form-value">
          <span :class="{ placeholder: !hasFundPwd }">
            {{ hasFundPwd ? t('user.passwordSet') : t('user.passwordNotSet') }}
          </span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 设置/修改提款密码弹窗 -->
    <div class="edit-modal" v-if="showCoinPwdModal">
      <div class="modal-mask" @click="showCoinPwdModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ hasFundPwd ? t('user.changeCoinPwd') : t('user.setFundPwd') }}</h3>
          <span class="modal-close" @click="showCoinPwdModal = false">×</span>
        </div>
        <div class="modal-body">
          <input
            v-if="hasFundPwd"
            type="password"
            v-model="coinPwdForm.oldPwd"
            :placeholder="t('user.enterOldCoinPwd')"
            class="modal-input"
          />
          <input
            type="password"
            v-model="coinPwdForm.newPwd"
            :placeholder="t('user.enterNewCoinPwd')"
            class="modal-input"
          />
          <input
            type="password"
            v-model="coinPwdForm.confirmPwd"
            :placeholder="t('user.confirmNewCoinPwd')"
            class="modal-input"
          />
          <input
            v-if="!hasFundPwd"
            type="password"
            v-model="coinPwdForm.loginPwd"
            :placeholder="t('user.enterLoginPwd')"
            class="modal-input"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showCoinPwdModal = false">{{ t('common.cancel') }}</button>
          <button class="btn-confirm" @click="handleSetCoinPwd" :disabled="!coinPwdForm.newPwd || !coinPwdForm.confirmPwd || loading">
            {{ loading ? t('common.loading') : t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { userApi } from '@/api/user'
import { ElMessage } from 'element-plus'
import { t } from '@/locales'
import MD5 from 'crypto-js/md5'

const router = useRouter()
const userStore = useUserStore()

interface UserInfoData {
  uid: number
  username: string
  nickname: string
  name: string
  balance: number
  phone: string
  email: string
  userType: number
  type: number
  grade: number
  fanDian: number
  regTime: string
}

const userInfoData = reactive<UserInfoData>({
  uid: 0,
  username: '',
  nickname: '',
  name: '',
  balance: 0,
  phone: '',
  email: '',
  userType: 0,
  type: 0,
  grade: 1,
  fanDian: 0,
  regTime: ''
})

const userTypeText = computed(() => {
  const types = ['', t('user.agent'), t('user.zd'), t('user.gd')]
  return types[userInfoData.type] || t('user.member')
})

const showCoinPwdModal = ref(false)
const loading = ref(false)
const hasFundPwd = ref(false)

const coinPwdForm = reactive({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
  loginPwd: ''
})

const goBack = () => {
  router.back()
}

// 加载用户信息
const loadUserInfo = async () => {
  try {
    const result = await userApi.getUserInfo()
    if (result.code === 0 && result.data) {
      Object.assign(userInfoData, result.data)
    }
    // 检查是否已设置提款密码
    const bankResult = await userApi.getUserBank()
    if (bankResult.code === 0 && bankResult.data) {
      hasFundPwd.value = !!bankResult.data.coinPassword
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
  }
}

onMounted(() => {
  loadUserInfo()
})

// 设置/修改提款密码
const handleSetCoinPwd = async () => {
  if (!coinPwdForm.newPwd || !coinPwdForm.confirmPwd) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }

  if (hasFundPwd.value && !coinPwdForm.oldPwd) {
    ElMessage.warning(t('user.enterOldCoinPwd'))
    return
  }

  if (!hasFundPwd.value && !coinPwdForm.loginPwd) {
    ElMessage.warning(t('user.enterLoginPwd'))
    return
  }

  if (coinPwdForm.newPwd.length < 6) {
    ElMessage.warning(t('user.pwdMinLength'))
    return
  }

  if (coinPwdForm.newPwd !== coinPwdForm.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  loading.value = true
  try {
    const res = await userApi.setCoinPassword({
      oldPwd: coinPwdForm.oldPwd ? MD5(coinPwdForm.oldPwd).toString() : '',
      newPwd: MD5(coinPwdForm.newPwd).toString(),
      loginPwd: coinPwdForm.loginPwd ? MD5(coinPwdForm.loginPwd).toString() : ''
    })
    if (res.code === 0) {
      ElMessage.success(hasFundPwd.value ? t('user.changeCoinPwdSuccess') : t('user.setFundPwdSuccess'))
      showCoinPwdModal.value = false
      coinPwdForm.oldPwd = ''
      coinPwdForm.newPwd = ''
      coinPwdForm.confirmPwd = ''
      coinPwdForm.loginPwd = ''
      hasFundPwd.value = true
    } else {
      // PHP 错误消息映射到多语言
      const msgMap: Record<string, string> = {
        '原提款密碼不能為空': t('user.oldCoinPwdEmpty'),
        '原提款密碼至少 6 位': t('user.oldCoinPwdMinLength'),
        '提款密碼不能為空': t('user.newCoinPwdEmpty'),
        '提領密碼至少 6 位': t('user.pwdMinLength'),
        '提款密碼與登入密碼不能一樣': t('user.pwdSame'),
        '修改提款密碼失敗': t('user.changeCoinPwdFailed'),
        '原密碼不正確': t('user.oldPwdIncorrect'),
      }
      const translatedMsg = msgMap[res.message] || res.message || t('user.changeCoinPwdFailed')
      ElMessage.error(translatedMsg)
    }
  } catch (error: any) {
    ElMessage.error(error.message || t('user.changeCoinPwdFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 30px;
}

.profile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.back-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.icon {
  width: 24px;
  height: 24px;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.profile-card {
  background: #fff;
  margin: 15px;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}

.avatar svg {
  width: 40px;
  height: 40px;
  color: #fff;
}

.vip-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: linear-gradient(135deg, #ffd700, #ffed4e);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  color: #8b4513;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.user-type {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.type-tag {
  background: #f0f0f0;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #666;
}

.fan-dian {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 12px;
  color: #fff;
}

.info-section {
  background: #fff;
  margin: 0 15px 15px;
  padding: 15px 20px;
  border-radius: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  padding-left: 3px solid #fb2351;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.info-value.balance {
  color: #fb2351;
  font-weight: 600;
}

.form-section {
  background: #fff;
  margin: 0 15px 15px;
  padding: 15px 20px;
  border-radius: 12px;
}

.form-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.form-item:last-child {
  border-bottom: none;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  color: #333;
}

.label-icon {
  width: 20px;
  height: 20px;
  color: #fb2351;
}

.form-value {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #999;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  color: #ccc;
}

.placeholder {
  color: #999;
}

/* 弹窗样式 */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 40px);
  max-width: 360px;
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  font-size: 17px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.modal-close {
  width: 24px;
  height: 24px;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px;
}

.modal-input {
  width: 100%;
  padding: 14px;
  margin-bottom: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
}

.modal-input:focus {
  outline: none;
  border-color: #fb2351;
}

.modal-footer {
  display: flex;
  padding: 15px 20px 30px;
  gap: 15px;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  padding: 14px;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  border: none;
  color: #666;
}

.btn-cancel:active {
  background: #eee;
}

.btn-confirm {
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  border: none;
  color: #fff;
}

.btn-confirm:active {
  opacity: 0.9;
  transform: scale(0.98);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
