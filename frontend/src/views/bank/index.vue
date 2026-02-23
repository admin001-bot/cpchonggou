<template>
  <div class="m-bank">
    <!-- 顶部导航 -->
    <header class="bank-header">
      <a class="back-btn" href="javascript:void(0)" @click="goBack">
        <img src="/images/backarrow.png" />
      </a>
      <h1 class="header-title">{{ t('bank.fundManage') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 顶部用户信息 -->
    <div class="cash-top">
      <div class="user-header">
        <img class="avatar" src="/images/avatar.png" />
        <div class="user-info">
          <h5>{{ username }}</h5>
          <p>
            {{ t('bank.balance') }}：<span class="money">{{ balance }}</span
            >USDT
            <a class="refresh" href="javascript:void(0)" @click="refreshBalance">
              <img src="/images/icon-refresh.png" />
            </a>
          </p>
        </div>
      </div>
      <!-- Tab导航 -->
      <div class="tabs-nav">
        <router-link class="tab-item" to="/bank/deposit">{{ t('bank.deposit') }}</router-link>
        <router-link class="tab-item" to="/bank/withdraw">{{ t('bank.withdraw') }}</router-link>
        <router-link class="tab-item" to="/bank/records/1">{{ t('bank.depositRecord') }}</router-link>
        <router-link class="tab-item" to="/bank/records/2">{{ t('bank.withdrawRecord') }}</router-link>
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
  router.back()
}

const refreshBalance = () => {
  // TODO: 调用API刷新余额
  console.log('refresh balance')
}

onMounted(() => {
  // 页面加载时可以刷新用户信息
})
</script>

<style scoped>
.m-bank {
  min-height: 100vh;
  background: #f5f5f5;
  max-width: 640px;
  margin: 0 auto;
}

/* 顶部导航 */
.bank-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  padding: 0 10px;
}

.back-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn img {
  width: 24px;
  height: 24px;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin: 0;
}

.header-right {
  width: 40px;
}

/* 顶部区域 */
.cash-top {
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  padding-top: 0;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 15px;
  color: #fff;
}

.user-header .avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.5);
  margin-right: 15px;
}

.user-header .user-info {
  flex: 1;
}

.user-header .user-info h5 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
}

.user-header .user-info p {
  margin: 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
}

.user-header .user-info .money {
  font-size: 18px;
  font-weight: 700;
  color: #ffd700;
}

.user-header .user-info .refresh {
  display: inline-block;
  margin-left: 8px;
  vertical-align: middle;
}

.user-header .user-info .refresh img {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

/* Tab导航 */
.tabs-nav {
  display: flex;
  background: rgba(0, 0, 0, 0.1);
}

.tabs-nav .tab-item {
  flex: 1;
  text-align: center;
  padding: 12px 0;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tabs-nav .tab-item.router-link-active {
  color: #fff;
  border-bottom-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* 内容区 */
.bank-content {
  padding-bottom: 20px;
}
</style>
