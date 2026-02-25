<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <span class="title">即時注單</span>
      <span class="header-right"></span>
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
          <div class="stat-value">{{ totalBets }}</div>
          <div class="stat-label">總注單</div>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <div class="stat-value">{{ formatMoney(totalMoney) }}</div>
          <div class="stat-label">總金額</div>
        </div>
      </div>

      <!-- 列表标题 -->
      <div class="list-header">
        <span class="list-title">遊戲列表</span>
        <span class="list-count" v-if="dataList.length > 0">{{ dataList.length }} 個遊戲</span>
      </div>

      <!-- 游戏列表 -->
      <div class="game-list" v-if="dataList.length > 0">
        <div
          class="game-card"
          v-for="item in dataList"
          :key="item.gameId"
          @click="goDetail(item.gameId, item.name, item.count)"
          :class="{ 'no-bets': item.count === 0 }"
        >
          <div class="game-info">
            <div class="game-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="game-details">
              <div class="game-name">{{ item.name }}</div>
              <div class="game-meta">
                <span class="bet-count">{{ item.count }} 注</span>
              </div>
            </div>
          </div>
          <div class="game-amount">
            <div class="amount-label">下注金額</div>
            <div class="amount-value">{{ formatMoney(item.money) }}</div>
          </div>
          <div class="card-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18l6-6-6-6"/>
            </svg>
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
        <div class="empty-text">暫無注單數據</div>
        <div class="empty-hint">下注後會在此處顯示未結算的注單</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrap" v-if="loading && !isRefreshing">
      <div class="loading-spinner"></div>
      <span class="loading-text">加載中...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { betApi, type NotCountItem } from '@/api/game'

const router = useRouter()
const loading = ref(false)
const isRefreshing = ref(false)
const dataList = ref<NotCountItem[]>([])

// 计算总数
const totalBets = computed(() => {
  return dataList.value.reduce((sum, item) => sum + item.count, 0)
})

const totalMoney = computed(() => {
  return dataList.value.reduce((sum, item) => sum + item.money, 0)
})

// 下拉刷新相关
let refreshStartY = 0
let isDragging = false
let refreshTimer: number | null = null

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
    const res = await betApi.getNotCount()
    if (res.code === 0) {
      // 处理嵌套的响应格式
      const data = res.data as any
      dataList.value = (data?.data || data || [])
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

function goDetail(gameId: number, name: string, count: number) {
  if (count > 0) {
    router.push(`/notcount/${gameId}?name=${encodeURIComponent(name)}`)
  }
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
  padding-bottom: env(safe-area-inset-bottom);
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-right {
  width: 36px;
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

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 5px;
}

.stat-divider {
  width: 1px;
  height: 45px;
  background: rgba(255, 255, 255, 0.4);
  margin: 0 15px;
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

/* 游戏列表 */
.game-list {
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.game-card {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.game-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: linear-gradient(180deg, #fb2351, #ff4b3e);
  opacity: 0;
  transition: opacity 0.2s;
}

.game-card:active {
  background: #fafafa;
  transform: scale(0.985);
}

.game-card.no-bets {
  opacity: 0.6;
}

.game-card:not(.no-bets):active::before {
  opacity: 1;
}

.game-info {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.game-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(251, 35, 81, 0.08), rgba(255, 75, 62, 0.08));
  margin-right: 12px;
  flex-shrink: 0;
  border: 1px solid rgba(251, 35, 81, 0.15);
}

.game-icon svg {
  width: 24px;
  height: 24px;
  color: #fb2351;
}

.game-details {
  flex: 1;
  min-width: 0;
}

.game-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.game-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
}

.bet-count {
  font-size: 11px;
  color: #fb2351;
  background: rgba(251, 35, 81, 0.08);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.game-amount {
  text-align: right;
  margin-right: 12px;
}

.amount-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 3px;
}

.amount-value {
  font-size: 16px;
  font-weight: 600;
  color: #fb2351;
}

.card-arrow {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.card-arrow svg {
  width: 100%;
  height: 100%;
  color: #ccc;
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
