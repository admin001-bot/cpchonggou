<template>
  <div class="profile-page">
    <!-- 顶部导航 -->
    <header class="profile-header">
      <span class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('user.profile') }}</h1>
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

    <!-- 个人资料表单区域 -->
    <div class="form-section">
      <div class="section-title">{{ t('user.personalInfo') }}</div>

      <!-- 真实姓名 - 不可修改 -->
      <div class="form-item">
        <div class="form-label">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          {{ t('user.realname') }}
        </div>
        <div class="form-value readonly">
          <span v-if="profileData.name">{{ profileData.name }}</span>
          <span v-else class="placeholder">{{ t('user.setRealName') }}</span>
          <span class="readonly-tip">{{ t('user.cannotModify') }}</span>
        </div>
      </div>

      <!-- 手机号 -->
      <div class="form-item" @click="editField('phone')">
        <div class="form-label">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
          </svg>
          {{ t('user.phone') }}
        </div>
        <div class="form-value">
          <span v-if="profileData.phone">{{ profileData.phone }}</span>
          <span v-else class="placeholder">{{ t('user.bindPhone') }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- 账户安全区块 -->
    <div class="form-section">
      <div class="section-title">{{ t('user.accountSecurity') }}</div>

      <!-- 登录密码 -->
      <div class="form-item" @click="router.push('/user/change-password')">
        <div class="form-label">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          {{ t('user.loginPassword') }}
        </div>
        <div class="form-value">
          <span class="placeholder">{{ t('user.passwordSet') }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </div>

      <!-- 提款密码 -->
      <div class="form-item" @click="router.push('/user/fund-password')">
        <div class="form-label">
          <svg class="label-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          {{ t('user.fundPassword') }}
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

    

    <!-- 绑定银行卡弹窗 -->
    <div class="edit-modal" v-if="showBankModal">
      <div class="modal-mask" @click="showBankModal = false"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ t('user.bindBankCard') }}</h3>
          <span class="modal-close" @click="showBankModal = false">×</span>
        </div>
        <div class="modal-body">
          <input
            type="text"
            v-model="bankForm.username"
            :placeholder="t('user.cardHolderName')"
            class="modal-input"
          />
          <select v-model="bankForm.bankId" class="modal-input">
            <option value="">{{ t('user.selectBank') }}</option>
            <option v-for="bank in bankList" :key="bank.id" :value="bank.id">{{ bank.name }}</option>
          </select>
          <input
            type="text"
            v-model="bankForm.cardNo"
            :placeholder="t('user.bankCardNo')"
            class="modal-input"
          />
          <input
            type="text"
            v-model="bankForm.subAddress"
            :placeholder="t('user.bankAddress')"
            class="modal-input"
          />
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showBankModal = false">{{ t('common.cancel') }}</button>
          <button class="btn-confirm" @click="handleBindBank" :disabled="!bankForm.username || !bankForm.bankId || !bankForm.cardNo || !bankForm.subAddress || loading">
            {{ loading ? t('common.loading') : t('common.confirm') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 个人资料编辑弹窗（昵称、手机、邮箱、QQ） -->
    <div class="edit-modal" v-if="showModal">
      <div class="modal-mask" @click="closeModal"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editTitle }}</h3>
          <span class="modal-close" @click="closeModal">×</span>
        </div>
        <div class="modal-body">
          <input
            v-if="editingField !== 'name'"
            type="text"
            v-model="editValue"
            :placeholder="editPlaceholder"
            class="modal-input"
            @keyup.enter="saveEdit"
          />
          <div v-else class="realname-tip">
            <p>{{ t('user.realnameTip') }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModal">{{ t('common.cancel') }}</button>
          <button class="btn-confirm" @click="saveEdit" :disabled="!editValue && editingField !== 'name'">
            {{ t('common.confirm') }}
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
import { userApi, type BankInfo } from '@/api/user'
import { ElMessage } from 'element-plus'
import { t } from '@/locales'

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

const profileData = reactive({
  name: '',
  nickname: '',
  phone: '',
  email: '',
  qq: '',
})

// 银行卡数据
const bankData = reactive<BankInfo>({
  username: '',
  bankName: '',
  cardNo: '',
  subAddress: ''
})

const hasFundPwd = ref(false)
const loading = ref(false)

// 弹窗状态
const showModal = ref(false)
const editingField = ref('')
const editValue = ref('')
const showBankModal = ref(false)

// 银行卡表单
const bankForm = reactive({
  username: '',
  bankId: '',
  cardNo: '',
  subAddress: ''
})

// 银行列表
const bankList = ref([
  { id: 1, name: '中国工商银行' },
  { id: 2, name: '中国农业银行' },
  { id: 3, name: '中国建设银行' },
  { id: 4, name: '中国银行' },
  { id: 5, name: '交通银行' },
  { id: 6, name: '招商银行' },
  { id: 7, name: '中国民生银行' },
  { id: 8, name: '中国光大银行' },
  { id: 9, name: '中国浦发银行' },
  { id: 10, name: '北京银行' },
  { id: 11, name: '上海银行' },
  { id: 12, name: '平安银行' },
  { id: 13, name: '华夏银行' },
  { id: 14, name: '农村信用合作社' },
  { id: 15, name: '其他银行' }
])

const editTitles: Record<string, string> = {
  nickname: t('user.nickname'),
  phone: t('user.bindPhone'),
  email: t('user.bindEmail'),
  qq: t('user.bindQQ'),
  name: t('user.realname'),
}

const editPlaceholders: Record<string, string> = {
  nickname: t('user.nickname'),
  phone: t('user.phone'),
  email: t('user.email'),
  qq: 'QQ',
  name: '',
}

const editTitle = computed(() => editTitles[editingField.value] || '')
const editPlaceholder = computed(() => editPlaceholders[editingField.value] || '')

const goBack = () => {
  router.back()
}

const editField = (field: string) => {
  editingField.value = field
  editValue.value = profileData[field as keyof typeof profileData] || ''

  // 真实姓名需要特殊处理
  if (field === 'name') {
    if (profileData.name) {
      ElMessage.warning(t('user.cannotModify'))
      return
    }
  }

  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingField.value = ''
  editValue.value = ''
}

const saveEdit = async () => {
  if (!editValue.value.trim()) return

  loading.value = true
  try {
    const res = await userApi.updateProfile({
      [editingField.value]: editValue.value
    })

    if (res.code === 0) {
      ElMessage.success(t('user.setSuccess'))
      profileData[editingField.value as keyof typeof profileData] = editValue.value
      closeModal()
    } else {
      ElMessage.error(res.message || t('user.setFailed'))
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('user.setFailed'))
  } finally {
    loading.value = false
  }
}

// 修改登录密码
const handleChangePassword = async () => {
  if (!pwdForm.oldPwd || !pwdForm.newPwd || !pwdForm.confirmPwd) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }

  if (pwdForm.oldPwd.length < 6) {
    ElMessage.warning(t('user.oldPwdMinLength'))
    return
  }

  if (pwdForm.newPwd.length < 6) {
    ElMessage.warning(t('user.pwdMinLength'))
    return
  }

  if (pwdForm.newPwd !== pwdForm.confirmPwd) {
    ElMessage.warning(t('user.pwdNotMatch'))
    return
  }

  loading.value = true
  try {
    const res = await userApi.changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    if (res.code === 0) {
      ElMessage.success(t('user.changePwdSuccess'))
      showChangePwdModal.value = false
      pwdForm.oldPwd = ''
      pwdForm.newPwd = ''
      pwdForm.confirmPwd = ''
    } else {
      // PHP 错误消息映射到多语言
      const msgMap: Record<string, string> = {
        '原密碼不能為空': t('user.oldPwdEmpty'),
        '原密碼至少 6 位': t('user.oldPwdMinLength'),
        '密碼不能為空': t('user.newPwdEmpty'),
        '密碼至少 6 位': t('user.pwdMinLength'),
        '原密碼不正確': t('user.oldPwdIncorrect'),
        '修改密碼失敗': t('user.changePwdFailed'),
        '原提款密碼不能為空': t('user.oldCoinPwdEmpty'),
        '原提款密碼至少 6 位': t('user.oldCoinPwdMinLength'),
        '提款密碼不能為空': t('user.newCoinPwdEmpty'),
        '提領密碼至少 6 位': t('user.pwdMinLength'),
        '提款密碼與登入密碼不能一樣': t('user.pwdSame'),
        '修改提款密碼失敗': t('user.changeCoinPwdFailed'),
      }
      const translatedMsg = msgMap[res.message] || res.message || t('user.changePwdFailed')
      ElMessage.error(translatedMsg)
    }
  } catch (error: any) {
    ElMessage.error(error.message || t('user.changePwdFailed'))
  } finally {
    loading.value = false
  }
}

// 绑定银行卡
const handleBindBank = async () => {
  if (!bankForm.username || !bankForm.bankId || !bankForm.cardNo || !bankForm.subAddress) {
    ElMessage.warning(t('user.fillAllFields'))
    return
  }

  loading.value = true
  try {
    const res = await userApi.bindBank(bankForm)
    if (res.code === 0) {
      ElMessage.success(t('user.bindBankSuccess'))
      showBankModal.value = false
      bankData.username = bankForm.username
      bankData.cardNo = bankForm.cardNo
      // 刷新银行信息
      loadBankInfo()
    } else {
      ElMessage.error(res.message || t('user.bindFailed'))
    }
  } catch (error: any) {
    ElMessage.error(error.response?.data?.message || t('user.bindFailed'))
  } finally {
    loading.value = false
  }
}

// 加载银行信息
const loadBankInfo = async () => {
  try {
    const res = await userApi.getUserBank()
    if (res.code === 0 && res.data) {
      bankData.username = res.data.username || ''
      bankData.bankName = res.data.bankName || ''
      bankData.cardNo = res.data.cardNo || res.data.account || ''
      bankData.subAddress = res.data.subAddress || res.data.countname || ''
    }
  } catch (error) {
    console.error('加载银行卡信息失败', error)
  }
}

// 加载用户信息
const loadUserInfo = async () => {
  const info = userStore.userInfo
  if (info) {
    userInfoData.uid = info.uid || 0
    userInfoData.username = info.username || ''
    userInfoData.nickname = info.nickname || ''
    userInfoData.name = info.name || ''
    userInfoData.balance = info.balance || 0
    userInfoData.phone = info.phone || ''
    userInfoData.email = info.email || ''
    userInfoData.type = info.type || 0
    userInfoData.grade = info.grade || 1
    userInfoData.fanDian = info.fanDian || 0

    profileData.name = info.name || ''
    profileData.nickname = info.nickname || ''
    profileData.phone = info.phone || ''
    profileData.email = info.email || ''
    profileData.qq = ''

    hasFundPwd.value = !!(info as any).hasFundPwd || false
  }

  loadBankInfo()
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.profile-page {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 20px;
  overflow-y: auto;
}

/* 顶部导航 */
.profile-header {
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

/* 用户信息卡片 */
.profile-card {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  padding: 30px 20px;
  text-align: center;
}

.avatar-section {
  position: relative;
  display: inline-block;
  margin-bottom: 12px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, 0.4);
}

.avatar svg {
  width: 40px;
  height: 40px;
  color: #fff;
}

.vip-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: #8B4513;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 6px;
}

.user-type {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.type-tag {
  font-size: 12px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 3px 10px;
  border-radius: 12px;
}

.fan-dian {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
}

/* 账户信息 */
.info-section {
  background: #fff;
  margin: 15px 10px;
  border-radius: 12px;
  overflow: hidden;
}

.section-title {
  padding: 12px 15px;
  font-size: 13px;
  font-weight: 600;
  color: #666;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.info-list {
  padding: 0;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 15px;
  border-bottom: 1px solid #f5f5f5;
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

/* 表单区域 */
.form-section {
  background: #fff;
  margin: 0 10px 15px 10px;
  border-radius: 12px;
  overflow: hidden;
}

.form-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.form-item:last-child {
  border-bottom: none;
}

.form-item:active {
  background: #f9f9f9;
}

.form-label {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.label-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  color: #fb2351;
}

.form-value {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
}

.form-value .placeholder {
  color: #999;
}

.form-value.readonly {
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.readonly-tip {
  font-size: 10px;
  color: #fb2351;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #ccc;
  margin-left: 8px;
}

/* 编辑弹窗 */
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
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-radius: 16px 16px 0 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.modal-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.modal-body input {
  margin-bottom: 12px;
}

.modal-input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus {
  border-color: #fb2351;
}

.realname-tip {
  padding: 20px;
  text-align: center;
  color: #fb2351;
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
