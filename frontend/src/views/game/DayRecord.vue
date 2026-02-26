<template>
  <div class="day-record">
    <!-- 顶部导航 -->
    <header class="header">
      <span class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="title">{{ statDate }} {{ t('bet.dayRecord') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 表格头部 -->
    <div class="table-header">
      <div class="col col-25">{{ t('bet.game') }}</div>
      <div class="col col-25">{{ t('bet.count') }}</div>
      <div class="col col-25">{{ t('bet.amount') }}</div>
      <div class="col col-25">{{ t('bet.winLoss') }}</div>
    </div>

    <!-- 表格内容 -->
    <div class="table-body">
      <div v-if="loading" class="loading-wrap">
        <div class="loading-spinner"></div>
      </div>
      <template v-else>
        <div
          v-for="item in dataList"
          :key="item.gameId"
          class="table-row"
          @click="goDetail(item.gameId, item.count)"
        >
          <div class="col col-25">
            <span class="game-name">{{ t(`game.${item.gameId}`) }}</span>
          </div>
          <div class="col col-25 text-center">
            <span class="count">{{ item.count || 0 }}</span>
          </div>
          <div class="col col-25 text-center">
            <span class="money">{{ formatMoney(item.money) }}</span>
          </div>
          <div class="col col-25 text-center">
            <span class="amount" :class="getAmountClass(item.win)">
              {{ formatMoney(item.win) }}
            </span>
          </div>
        </div>

        <div v-if="dataList.length === 0" class="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <p>{{ t('bet.noData') }}</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { t } from '@/locales'
import { betApi, type DayRecordItem } from '@/api/game'

const route = useRoute()
const router = useRouter()
const loading = ref(false)
const rawData = ref<DayRecordItem[]>([])
const statDate = route.params.date as string

// 首页显示的游戏ID列表
const homeGameIds = [55, 50, 122, 52, 66, 100, 72, 113]

// 过滤后的数据列表
const dataList = computed(() => {
  return rawData.value.filter(item => homeGameIds.includes(item.gameId))
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getTotalStatBets(statDate)
    console.log('DayRecord API response:', res)
    if (res.code === 0 && res.data) {
      if (Array.isArray(res.data)) {
        rawData.value = res.data
      } else if (res.data.data && Array.isArray(res.data.data)) {
        rawData.value = res.data.data
      } else {
        rawData.value = []
      }
    } else {
      rawData.value = []
    }
  } catch (e) {
    console.error('加载数据失败', e)
    rawData.value = []
  } finally {
    loading.value = false
  }
}

function formatMoney(money: number | undefined | null): string {
  if (money === undefined || money === null) return '0.00'
  return money.toFixed(2)
}

function getAmountClass(money: number | undefined | null): string {
  if (money === undefined || money === null || money === 0) return ''
  return money > 0 ? 'red' : 'green'
}

function goDetail(gameId: number, count: number) {
  router.push({
    name: 'DayDetail',
    params: { gameId },
    query: { date: statDate }
  })
}
</script>

<style scoped>
.day-record {
  overflow-y: auto;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 20px;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  padding: 0 12px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  position: sticky;
  top: 0;
  z-index: 100;
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
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.92);
}

.back-btn svg {
  width: 20px;
  height: 20px;
  color: #fff;
}

.title {
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

/* 表格头部 */
.table-header {
  display: flex;
  padding: 12px 15px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.table-header .col {
  text-align: center;
}

/* 表格内容 */
.table-body {
  background: #fff;
}

.table-row {
  display: flex;
  padding: 14px 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.table-row:active {
  background: #f9f9f9;
}

.table-row .col {
  display: flex;
  align-items: center;
  justify-content: center;
}

.col-25 {
  flex: 1;
}

.text-center {
  text-align: center;
}

.game-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.count {
  font-size: 14px;
  color: #333;
}

.money {
  font-size: 14px;
  color: #666;
}

.amount {
  font-size: 14px;
  font-weight: 600;
}

.amount.red {
  color: #fb2351;
}

.amount.green {
  color: #4caf50;
}

/* 加载中 */
.loading-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #fb2351;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 空状态 */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  color: #999;
}

.empty svg {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty p {
  margin: 0;
  font-size: 14px;
}
</style>
