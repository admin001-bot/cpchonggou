<template>
  <div class="m-center">
    <!-- 顶部导航 -->
    <header class="center-header">
      <span class="back-btn" @click="goHome">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('user.personalCenter') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 顶部用户信息卡片 -->
    <div class="user-card">
      <div class="card-bg"></div>
      <div class="card-content">
        <div class="user-main">
          <div class="user-left">
            <div class="user-avatar-wrap">
              <div class="user-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <div class="vip-badge" v-if="userInfo.grade > 1">
                <span>VIP{{ userInfo.grade }}</span>
              </div>
            </div>
            <div class="user-info">
              <h3 class="username">{{ username }}</h3>
              <p class="user-level">
                <span class="level-tag">{{ userTypeText }}</span>
                <span class="fan-dian" v-if="userInfo.fanDian > 0">{{ userInfo.fanDian }}%</span>
              </p>
            </div>
          </div>
          <div class="user-right">
            <div class="balance-item">
              <span class="balance-label">{{ t('user.balance') }}</span>
              <span class="balance-value">
                <span class="money">{{ formatMoney(userInfo.balance) }}</span>
                <span class="refresh-btn" @click="refreshBalance">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6"/>
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
                  </svg>
                </span>
              </span>
            </div>
            <div class="profit-item" v-if="userInfo.todayWin">
              <span class="profit-label">{{ t('user.todayWin') }}</span>
              <span class="profit-value" :class="{ positive: parseFloat(userInfo.todayWin) > 0 }">
                {{ userInfo.todayWin }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <div class="action-item" @click="goDeposit">
        <div class="action-icon deposit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        </div>
        <span class="action-text">{{ t('user.deposit') }}</span>
      </div>
      <div class="action-item" @click="goWithdraw">
        <div class="action-icon withdraw">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
        </div>
        <span class="action-text">{{ t('user.withdraw') }}</span>
      </div>
      <div class="action-item" @click="goBankCard">
        <div class="action-icon bankcard">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
        </div>
        <span class="action-text">{{ t('user.bankCard') }}</span>
      </div>
      <div class="action-item" @click="goBetRecord">
        <div class="action-icon record">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
        </div>
        <span class="action-text">{{ t('user.betRecord') }}</span>
      </div>
    </div>

    <!-- 功能列表 -->
    <div class="menu-section">
      <div class="section-title">{{ t('user.accountManage') }}</div>
      <div class="menu-list">
        <div class="menu-item" @click="goProfile">
          <div class="menu-left">
            <div class="menu-icon profile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.profile') }}</span>
          </div>
          <div class="menu-right">
            <span class="menu-value" v-if="userInfo.name">{{ userInfo.name }}</span>
            <span class="menu-tip" v-else>{{ t('user.setProfile') }}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goFundPassword">
          <div class="menu-left">
            <div class="menu-icon security">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.fundPassword') }}</span>
          </div>
          <div class="menu-right">
            <span class="menu-value" :class="{ 'text-success': userInfo.hasFundPwd }">
              {{ userInfo.hasFundPwd ? t('user.setted') : t('user.notSet') }}
            </span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goChangePassword">
          <div class="menu-left">
            <div class="menu-icon password">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.changePassword') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ t('user.gameManage') }}</div>
      <div class="menu-list">
        <div class="menu-item" @click="goWeekRecord">
          <div class="menu-left">
            <div class="menu-icon week">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.weekRecord') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goDayRecord">
          <div class="menu-left">
            <div class="menu-icon day">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.dayRecord') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goNotCount">
          <div class="menu-left">
            <div class="menu-icon pending">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.pendingBets') }}</span>
          </div>
          <div class="menu-right">
            <span class="badge" v-if="pendingCount > 0">{{ pendingCount }}</span>
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <div class="section-title">{{ t('user.otherManage') }}</div>
      <div class="menu-list">
        <div class="menu-item" @click="goTeam">
          <div class="menu-left">
            <div class="menu-icon team">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                <path d="M16 3.13a4 4 0 010 7.75"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.myTeam') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goHelp">
          <div class="menu-left">
            <div class="menu-icon help">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.helpCenter') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>

        <div class="menu-item" @click="goService">
          <div class="menu-left">
            <div class="menu-icon service">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <span class="menu-text">{{ t('user.customerService') }}</span>
          </div>
          <div class="menu-right">
            <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- 退出登录 -->
    <div class="logout-section">
      <button class="logout-btn" @click="confirmLogout">
        {{ t('user.logout') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'
import { t } from '@/locales'
import { gameApi } from '@/api/game'

const router = useRouter()
const userStore = useUserStore()

const pendingCount = ref(0)

const username = computed(() => userStore.userInfo?.username || '')
const userInfo = computed(() => {
  const info = userStore.userInfo
  if (!info) {
    return {
      balance: 0,
      grade: 1,
      fanDian: 0,
      name: '',
      hasFundPwd: false,
      type: 0,
      todayWin: '0.00'
    }
  }
  return {
    balance: info.balance || 0,
    grade: info.grade || 1,
    fanDian: info.fanDian || 0,
    name: info.name || '',
    hasFundPwd: info.hasFundPwd || false,
    type: info.type || 0,
    todayWin: '0.00'
  }
})

const userTypeText = computed(() => {
  const types = ['', t('user.agent'), t('user.zd'), t('user.gd')]
  return types[userInfo.value.type] || t('user.member')
})

const formatMoney = (n: number) => {
  return (n || 0).toFixed(2)
}

const refreshBalance = async () => {
  await userStore.getUserInfo()
}

const goHome = () => {
  router.push('/home')
}

const goDeposit = () => {
  router.push('/bank/deposit')
}

const goWithdraw = () => {
  router.push('/bank/withdraw')
}

const goBankCard = () => {
  router.push('/bank/bind-address')
}

const goBetRecord = () => {
  router.push('/week')
}

const goProfile = () => {
  // TODO: 完善个人信息
  ElMessageBox.alert(t('user.profileEdit'), t('user.prompt'), {
    confirmButtonText: t('common.confirm')
  })
}

const goFundPassword = () => {
  // TODO: 资金密码设置
  ElMessageBox.alert(t('user.fundPasswordSet'), t('user.prompt'), {
    confirmButtonText: t('common.confirm')
  })
}

const goChangePassword = () => {
  // TODO: 修改密码
  ElMessageBox.alert(t('user.passwordEdit'), t('user.prompt'), {
    confirmButtonText: t('common.confirm')
  })
}

const goWeekRecord = () => {
  router.push('/week')
}

const goDayRecord = () => {
  router.push('/day/' + getTodayDate())
}

const goNotCount = () => {
  router.push('/notcount')
}

const goTeam = () => {
  ElMessageBox.alert(t('user.teamManage'), t('user.prompt'), {
    confirmButtonText: t('common.confirm')
  })
}

const goHelp = () => {
  router.push('/user/help')
}

const goService = () => {
  window.open('/chatlink.html', '_blank')
}

const getTodayDate = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

const confirmLogout = () => {
  ElMessageBox.confirm(
    t('user.logoutConfirm'),
    t('user.prompt'),
    {
      confirmButtonText: t('common.confirm'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    }
  ).then(() => {
    userStore.logout()
    router.push('/home')
  }).catch(() => {})
}

// 获取即时注单数量
const fetchPendingCount = async () => {
  try {
    const res = await gameApi.getLotteryData()
    if (res.code === 0 && res.data) {
      pendingCount.value = res.data.notCount || 0
    }
  } catch (error) {
    console.error('获取即时注单失败', error)
  }
}

onMounted(() => {
  fetchPendingCount()
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.m-center {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 30px;
  overflow-y: auto;
}

/* 顶部导航 */
.center-header {
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
  letter-spacing: 0.5px;
}

.header-right {
  width: 36px;
}

/* 用户卡片 */
.user-card {
  position: relative;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  padding: 18px 15px;
  overflow: hidden;
}

.card-bg {
  position: absolute;
  top: -30%;
  right: -10%;
  width: 160px;
  height: 160px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 50%;
}

.card-content {
  position: relative;
  z-index: 1;
}

.user-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-left {
  display: flex;
  align-items: center;
}

.user-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.4);
}

.user-avatar svg {
  width: 30px;
  height: 30px;
  color: #fff;
}

.vip-badge {
  position: absolute;
  bottom: -2px;
  right: -2px;
  background: linear-gradient(135deg, #ffd700, #ffaa00);
  color: #8B4513;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 5px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.user-info {
  margin-left: 12px;
}

.username {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.user-level {
  margin: 4px 0 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.level-tag {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 2px 6px;
  border-radius: 8px;
}

.fan-dian {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.8);
}

.user-right {
  text-align: right;
}

.balance-item {
  margin-bottom: 6px;
}

.balance-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 6px;
}

.balance-value {
  display: inline-flex;
  align-items: center;
}

.money {
  font-size: 18px;
  font-weight: 700;
  color: #ffd700;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.9);
}

.refresh-btn svg {
  width: 12px;
  height: 12px;
  color: #fff;
}

.profit-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.profit-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-right: 6px;
}

.profit-value {
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.profit-value.positive {
  color: #4CAF50;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  background: #fff;
  border-radius: 12px;
  margin: -15px 10px 0;
  padding: 15px 5px;
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.action-item {
  flex: 1;
  text-align: center;
  cursor: pointer;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
}

.action-icon svg {
  width: 22px;
  height: 22px;
}

.action-icon.deposit {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.action-icon.deposit svg {
  color: #fff;
}

.action-icon.withdraw {
  background: linear-gradient(135deg, #FF9800, #f57c00);
}

.action-icon.withdraw svg {
  color: #fff;
}

.action-icon.bankcard {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.action-icon.bankcard svg {
  color: #fff;
}

.action-icon.record {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
}

.action-icon.record svg {
  color: #fff;
}

.action-text {
  font-size: 12px;
  color: #333;
}

/* 功能菜单 */
.menu-section {
  margin: 15px 10px 0;
}

.section-title {
  font-size: 13px;
  color: #999;
  padding: 0 5px;
  margin-bottom: 8px;
}

.menu-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f9f9f9;
}

.menu-left {
  display: flex;
  align-items: center;
}

.menu-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.menu-icon svg {
  width: 18px;
  height: 18px;
}

.menu-icon.profile {
  background: linear-gradient(135deg, #FF6B6B, #ee5a5a);
}

.menu-icon.profile svg {
  color: #fff;
}

.menu-icon.security {
  background: linear-gradient(135deg, #4ECDC4, #3dbdb5);
}

.menu-icon.security svg {
  color: #fff;
}

.menu-icon.password {
  background: linear-gradient(135deg, #45B7D1, #3aa8c0);
}

.menu-icon.password svg {
  color: #fff;
}

.menu-icon.week {
  background: linear-gradient(135deg, #96CEB4, #85bea3);
}

.menu-icon.week svg {
  color: #fff;
}

.menu-icon.day {
  background: linear-gradient(135deg, #FFEAA7, #f7dc8f);
}

.menu-icon.day svg {
  color: #d68910;
}

.menu-icon.pending {
  background: linear-gradient(135deg, #DFE6E9, #ced6dd);
}

.menu-icon.pending svg {
  color: #636e72;
}

.menu-icon.team {
  background: linear-gradient(135deg, #A29BFE, #918cf1);
}

.menu-icon.team svg {
  color: #fff;
}

.menu-icon.help {
  background: linear-gradient(135deg, #FDCB6E, #f0bc5e);
}

.menu-icon.help svg {
  color: #d68910;
}

.menu-icon.service {
  background: linear-gradient(135deg, #00CEC9, #00b5b1);
}

.menu-icon.service svg {
  color: #fff;
}

.menu-text {
  font-size: 14px;
  color: #333;
}

.menu-right {
  display: flex;
  align-items: center;
}

.menu-value {
  font-size: 13px;
  color: #999;
  margin-right: 8px;
}

.menu-value.text-success {
  color: #4CAF50;
}

.menu-tip {
  font-size: 12px;
  color: #fb2351;
  margin-right: 8px;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  color: #ccc;
}

.badge {
  background: #fb2351;
  color: #fff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-right: 8px;
}

/* 退出登录 */
.logout-section {
  margin: 25px 10px 0;
  padding: 0 15px;
}

.logout-btn {
  width: 100%;
  padding: 14px;
  background: #fff;
  border: 1px solid #fb2351;
  border-radius: 25px;
  color: #fb2351;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:active {
  background: #fff5f5;
}
</style>
