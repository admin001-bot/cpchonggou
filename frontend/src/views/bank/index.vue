<template>
  <div class="m-bank">
    <!-- 顶部导航 -->
    <header class="bank-header">
      <span class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('bank.fundManage') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 顶部用户信息 -->
    <div class="cash-top">
      <div class="user-header">
        <div class="user-avatar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div class="user-info">
          <h5>{{ username }}</h5>
          <p class="balance-text">
            <span class="label">{{ t('bank.balance') }}：</span>
            <span class="money">{{ balance }}</span>
            <span class="currency">USDT</span>
            <span class="refresh-btn" @click="refreshBalance">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M23 4v6h-6"/>
                <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
              </svg>
            </span>
          </p>
        </div>
      </div>

      <!-- Tab 导航 -->
      <div class="tabs-nav">
        <router-link class="tab-item" to="/bank/deposit">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <span>{{ t('bank.deposit') }}</span>
        </router-link>
        <router-link class="tab-item" to="/bank/withdraw">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          <span>{{ t('bank.withdraw') }}</span>
        </router-link>
        <router-link class="tab-item" to="/bank/records/1">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <span>{{ t('bank.depositRecord') }}</span>
        </router-link>
        <router-link class="tab-item" to="/bank/records/2">
          <svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
          </svg>
          <span>{{ t('bank.withdrawRecord') }}</span>
        </router-link>
      </div>
    </div>

    <!-- 内容区 -->
    <div class="bank-content">
      <router-view @balance-updated="refreshBalance" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/locales'

const router = useRouter()
const userStore = useUserStore()

const username = computed(() => userStore.userInfo?.username || '')
const balance = computed(() => (userStore.userInfo?.balance || 0).toFixed(2))

const goBack = () => {
  router.push('/')
}

const refreshBalance = async () => {
  try {
    await userStore.getUserInfo()
    console.log('余额已刷新')
  } catch (error) {
    console.error('刷新余额失败:', error)
  }
}

onMounted(() => {
  // 页面加载时可以刷新用户信息
})
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.m-bank {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 640px;
  margin: 0 auto;
  padding-bottom: 20px;
}

/* 顶部导航 */
.bank-header {
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

/* 顶部区域 */
.cash-top {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  padding: 0 15px 15px;
  box-shadow: 0 4px 15px rgba(251, 35, 81, 0.3);
}

.user-header {
  display: flex;
  align-items: center;
  padding: 20px 0 15px;
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-avatar svg {
  width: 32px;
  height: 32px;
  color: #fff;
}

.user-header .user-info {
  flex: 1;
}

.user-header .user-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.user-header .user-info .balance-text {
  margin: 0;
  font-size: 13px;
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.9);
}

.user-header .user-info .label {
  opacity: 0.8;
}

.user-header .user-info .money {
  font-size: 20px;
  font-weight: 700;
  color: #ffd700;
  letter-spacing: 0.5px;
}

.user-header .user-info .currency {
  font-size: 12px;
  margin-left: 2px;
}

.user-header .user-info .refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.user-header .user-info .refresh-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.92);
}

.user-header .user-info .refresh-btn svg {
  width: 14px;
  height: 14px;
  color: #fff;
}

/* Tab 导航 */
.tabs-nav {
  display: flex;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 10px;
  padding: 4px;
  margin-top: 10px;
}

.tabs-nav .tab-item {
  flex: 1;
  text-decoration: none;
  padding: 10px 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  transition: all 0.2s;
}

.tabs-nav .tab-item .tab-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.7);
  transition: all 0.2s;
}

.tabs-nav .tab-item span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
  transition: all 0.2s;
}

.tabs-nav .tab-item.router-link-active {
  background: rgba(255, 255, 255, 0.25);
}

.tabs-nav .tab-item.router-link-active .tab-icon,
.tabs-nav .tab-item.router-link-active span {
  color: #fff;
}

/* 内容区 */
.bank-content {
  padding: 15px 10px 0;
}
</style>
