<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <span class="title">{{ gameName }} - {{ date }}</span>
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
        <span>刷新中...</span>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-card">
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">總下注筆數</div>
            <div class="stat-value">{{ totalCount }}</div>
          </div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="stat-content">
            <div class="stat-label">總輸贏</div>
            <div class="stat-value" :class="totalWin >= 0 ? 'positive' : 'negative'">
              {{ totalWin >= 0 ? '+' : '' }}{{ formatMoney(totalWin) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 列表标题 -->
      <div class="list-header">
        <span class="list-title">投注明細</span>
        <span class="list-count" v-if="dataList.length > 0">{{ dataList.length }} 筆</span>
      </div>

      <!-- 注单列表 -->
      <div class="bet-list" v-if="dataList.length > 0">
        <div class="bet-card" v-for="(item, index) in dataList" :key="item.id">
          <div class="bet-header">
            <div class="period-info">
              <div class="period-num">第 {{ item.turnNum }} 期</div>
              <div class="period-time">{{ item.addTime.split(' ')[1] || '' }}</div>
            </div>
            <div class="result-money" :class="item.resultMoney >= 0 ? 'positive' : 'negative'">
              <span class="label">{{ item.resultMoney >= 0 ? '贏' : '虧' }}</span>
              <span class="value">{{ formatMoney(Math.abs(item.resultMoney)) }}</span>
            </div>
          </div>

          <div class="bet-content">
            <div class="detail-info">
              <div class="play-name">{{ item.playName }}</div>
              <div class="play-detail">
                <span class="odds-badge">@{{ item.odds.toFixed(2) }}</span>
                <span class="bet-info">{{ item.betInfo }}</span>
              </div>
            </div>
            <div class="bet-amount">
              <div class="amount-label">下注金額</div>
              <div class="amount-value">{{ formatMoney(item.money) }}</div>
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
        <div class="empty-text">暫無投注明細</div>
        <div class="empty-hint">該日期該遊戲暫無下注記錄</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrap" v-if="loading && dataList.length === 0">
      <div class="loading-spinner"></div>
      <span class="loading-text">加載中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { betApi, type BetDetailItem } from '@/api/game'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const isRefreshing = ref(false)
const dataList = ref<BetDetailItem[]>([])

const gameId = Number(route.params.gameId)
const date = route.query.date as string || route.params.date as string
const gameName = ref('')

// 下拉刷新相关
let refreshStartY = 0
let isDragging = false
let refreshTimer: number | null = null

// 计算总数
const totalCount = computed(() => {
  if (!dataList.value || dataList.value.length === 0) return 0
  return dataList.value.length
})

const totalWin = computed(() => {
  if (!dataList.value || dataList.value.length === 0) return 0
  return dataList.value.reduce((sum, item) => sum + (item.resultMoney || 0), 0)
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getUserBets(gameId, date)
    if (res.code === 0) {
      // 处理返回的数据格式（可能是数组或对象）
      let apiData: any[] = []
      if (Array.isArray(res.data)) {
        apiData = res.data
      } else if (res.data && typeof res.data === 'object') {
        // 如果是对象，尝试转换为数组
        apiData = Object.values(res.data)
      }
      dataList.value = apiData
      // 获取游戏名称
      if (dataList.value.length > 0) {
        gameName.value = dataList.value[0].playName || ''
      }
    }
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

function formatMoney(money: number): string {
  if (!money) return '0.00'
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
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
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
  display: flex;
  align-items: center;
  margin: 15px;
  padding: 20px;
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
  flex: 1;
  text-align: center;
  position: relative;
  z-index: 1;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin: 0 auto 8px;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
  color: #ffffff;
}

.stat-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 5px;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.stat-value.positive {
  color: #a5f3a7;
}

.stat-value.negative {
  color: #ffcdd2;
}

.stat-divider {
  width: 1px;
  height: 50px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 10px;
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

.period-info {
  flex: 1;
}

.period-num {
  font-size: 15px;
  font-weight: 600;
  color: #fb2351;
  margin-bottom: 3px;
}

.period-time {
  font-size: 11px;
  color: #999;
}

.result-money {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 6px 12px;
  border-radius: 8px;
  min-width: 80px;
}

.result-money.positive {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.result-money.negative {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.result-money .label {
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
}

.result-money.positive .label {
  color: #4caf50;
}

.result-money.negative .label {
  color: #f44336;
}

.result-money .value {
  font-size: 15px;
  font-weight: 600;
}

.result-money.positive .value {
  color: #4caf50;
}

.result-money.negative .value {
  color: #f44336;
}

.bet-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 15px;
}

.detail-info {
  flex: 1;
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

.bet-amount {
  text-align: right;
  min-width: 80px;
  margin-left: 12px;
}

.bet-amount .amount-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.bet-amount .amount-value {
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
  padding: 60px 0;
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
