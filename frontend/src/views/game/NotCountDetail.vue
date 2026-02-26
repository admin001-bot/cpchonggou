<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <span class="title">{{ gameName }}</span>
      <span class="header-badge">{{ dataList.length }}</span>
    </div>

    <!-- 下拉刷新区域 -->
    <div
      class="refresh-area"
      :class="{ 'refreshing': isRefreshing }"
      @touchstart="onTouchStartRefresh"
      @touchmove="onTouchMoveRefresh"
      @touchend="onTouchEndRefresh"
    >
      <div class="refresh-indicator" v-if="isRefreshing">
        <span class="loading-spinner"></span>
        <span>{{ t('game.refreshing') }}</span>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">{{ t('game.totalBetAmount') }}</div>
            <div class="stat-value">{{ formatMoney(totalBetMoney) }}</div>
          </div>
        </div>
      </div>

      <!-- 列表标题 -->
      <div class="list-header">
        <span class="list-title">{{ t('game.betDetail') }}</span>
        <span class="list-count" v-if="dataList.length > 0">{{ dataList.length }} {{ t('game.betCountUnit') }}</span>
      </div>

      <!-- 注单列表 -->
      <div class="bet-list" v-if="dataList.length > 0">
        <div class="bet-card" v-for="(item, index) in dataList" :key="item.id">
          <div class="bet-header">
            <div class="period-tag">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
              <span>{{ t('game.period') }} {{ item.turnNum }}</span>
            </div>
            <div class="potential-win">
              <span class="label">{{ t('game.potentialWin') }}</span>
              <span class="value">{{ formatMoney(item.resultMoney) }}</span>
            </div>
          </div>

          <div class="bet-content">
            <div class="play-info">
              <div class="play-name">{{ item.playName }}</div>
              <div class="play-detail">
                <span class="odds-badge">@{{ item.odds.toFixed(2) }}</span>
                <span class="bet-info">{{ item.betInfo }}</span>
              </div>
            </div>
            <div class="bet-money">
              <div class="money-label">{{ t('game.betAmount') }}</div>
              <div class="money-value">{{ formatMoney(item.money) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else-if="!loading">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="empty-text">{{ t('game.noBetData') }}</div>
        <div class="empty-hint">{{ t('game.noBetDetail') }}</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrap" v-if="loading && !isRefreshing">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ t('common.loading') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { betApi, type BetDetailItem } from '@/api/game'
import { t } from '@/locales'

const route = useRoute()
const loading = ref(false)
const isRefreshing = ref(false)
const dataList = ref<BetDetailItem[]>([])
const totalBetMoney = ref(0)
const gameId = ref(Number(route.params.gameId) || 0)
const gameName = ref((route.query.name as string) || '')

// 下拉刷新相关
let refreshStartY = 0
let isDragging = false
let refreshTimer: any = null

// 自动刷新定时器
let autoRefreshTimer: number | null = null

onMounted(() => {
  loadData()
  // 每 30 秒自动刷新一次（注单可能变为已结算）
  autoRefreshTimer = window.setInterval(() => {
    loadData()
  }, 30000)
})

onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
  }
  if (refreshTimer) {
    clearTimeout(refreshTimer)
  }
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getNotCountDetail(gameId)
    if (res.code === 0) {
      // 处理嵌套的响应格式
      const data = res.data as any
      const otherData = data?.otherData || res.otherData || {}
      const list = data?.data || data || []

      // 过滤掉无效数据（money > 0 且 turnNum 是有效的期号格式）
      dataList.value = list.filter((item: any) => {
        if (item.money <= 0) return false
        if (!item.turnNum) return false
        const turnNum = item.turnNum.trim()
        if (turnNum === '') return false
        // 期号应该是数字，不应该是日期格式（如 20260211229）
        return !turnNum.match(/^\d{6}$/)
      })

      totalBetMoney.value = otherData.totalBetMoney || 0
    }
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

function formatMoney(money: number): string {
  return money.toFixed(2)
}

// 下拉刷新
function onTouchStartRefresh(e: TouchEvent) {
  refreshStartY = e.touches[0].clientY
  isDragging = false
}

function onTouchMoveRefresh(e: TouchEvent) {
  if (!isDragging) {
    const currentY = e.touches[0].clientY
    if (currentY - refreshStartY > 80) {
      isDragging = true
    }
  }
}

function onTouchEndRefresh(e: TouchEvent) {
  if (isDragging) {
    doRefresh()
  }
  isDragging = false
}

async function doRefresh() {
  isRefreshing.value = true
  await loadData()
  refreshTimer = window.setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  overflow-y: auto;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  padding-bottom: env(safe-area-inset-bottom);
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(251, 35, 81, 0.3);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
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

.title {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-left: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.header-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

/* 刷新区域 */
.refresh-area {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.refresh-area.refreshing {
  transform: translateY(60px);
  transition: transform 0.3s ease;
}

.refresh-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

/* 统计卡片 */
.stats-card {
  margin: 15px;
  padding: 18px;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(251, 35, 81, 0.35);
  position: relative;
  overflow: hidden;
}

.stats-card::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
}

.stat-item {
  display: flex;
  align-items: center;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin-right: 12px;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
  background: #fff;
}

.list-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.list-count {
  font-size: 11px;
  color: #999;
  background: #f8f8f8;
  padding: 3px 10px;
  border-radius: 10px;
}

/* 注单列表 */
.bet-list {
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bet-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.bet-card:active {
  transform: scale(0.985);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(90deg, rgba(251, 35, 81, 0.06) 0%, rgba(255, 75, 62, 0.06) 100%);
  border-bottom: 1px solid #f0f0f0;
}

.period-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #fb2351;
}

.period-tag .icon {
  width: 16px;
  height: 16px;
  opacity: 0.8;
}

.potential-win {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(76, 175, 80, 0.1);
  padding: 5px 10px;
  border-radius: 6px;
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.potential-win .label {
  font-size: 11px;
  color: #4caf50;
  font-weight: 500;
}

.potential-win .value {
  font-size: 14px;
  font-weight: 600;
  color: #4caf50;
}

.bet-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 15px;
}

.play-info {
  flex: 1;
  min-width: 0;
}

.play-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.play-detail {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.odds-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  background: #f8f8f8;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  border: 1px solid #eee;
}

.bet-info {
  font-size: 12px;
  color: #666;
  background: rgba(251, 35, 81, 0.06);
  padding: 3px 8px;
  border-radius: 4px;
  border: 1px solid rgba(251, 35, 81, 0.15);
  color: #fb2351;
}

.bet-money {
  text-align: right;
  min-width: 80px;
  margin-left: 12px;
}

.money-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.money-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background: #f8f8f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: #ddd;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.empty-hint {
  font-size: 13px;
  color: #999;
  line-height: 1.5;
}

/* 加载状态 */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 12px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top-color: #fb2351;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-text {
  font-size: 13px;
  color: #999;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
