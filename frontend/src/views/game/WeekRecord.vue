<template>
  <div class="week-record">
    <!-- 顶部导航 -->
    <header class="header">
      <span class="back-btn" @click="$router.back()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="title">{{ t('bet.weekRecord') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 表格头部 -->
    <div class="table-header">
      <div class="col col-33">{{ t('bet.time') }}</div>
      <div class="col col-33">{{ t('bet.count') }}</div>
      <div class="col col-33">{{ t('bet.winLoss') }}</div>
    </div>

    <!-- 表格内容 -->
    <div class="table-body">
      <div
        v-if="loading"
        class="loading-wrap"
      >
        <div class="loading-spinner"></div>
      </div>
      <template v-else>
        <div
          v-for="item in dataList"
          :key="item.statDate"
          class="table-row clickable"
          @click="goDetail(item.statDate, item.betCount)"
        >
          <div class="col col-33">
            <div class="date">{{ item.statDate || '-' }}</div>
            <div class="week">{{ item.week || '-' }}</div>
          </div>
          <div class="col col-33 text-center">
            <span class="count">
              {{ item.betCount || 0 }}
            </span>
          </div>
          <div class="col col-33 text-center">
            <span class="amount" :class="getAmountClass(item.rewardRebate)">
              {{ formatMoney(item.rewardRebate) }}
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

    <div class="tips">{{ t('bet.clickToDetail') }}</div>

    <!-- 底部统计 -->
    <div class="footer">
      <div class="footer-item">
        <span class="label">{{ t('bet.totalCount') }}:</span>
        <span class="value">{{ allBetCount }}</span>
      </div>
      <div class="footer-item">
        <span class="label">{{ t('bet.totalWinLoss') }}:</span>
        <span class="value" :class="getAmountClass(allRewardRebate)">
          {{ formatMoney(allRewardRebate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/locales'
import { betApi, type WeekRecordItem } from '@/api/game'

const router = useRouter()
const loading = ref(false)
const dataList = ref<WeekRecordItem[]>([] as WeekRecordItem[])

const allBetCount = computed(() => {
  return dataList.value.reduce((sum, item) => sum + (item.betCount || 0), 0)
})

const allRewardRebate = computed(() => {
  return dataList.value.reduce((sum, item) => sum + (item.rewardRebate || 0), 0)
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getStatBets()
    console.log('API response:', res)
    // 处理响应：res.data 直接是数组
    if (res.code === 0 && res.data) {
      dataList.value = Array.isArray(res.data) ? res.data : []
    } else {
      dataList.value = []
    }
  } catch (e) {
    console.error('加载数据失败', e)
    dataList.value = []
  } finally {
    loading.value = false
  }
}

function formatMoney(money: number | undefined | null): string {
  if (money === undefined || money === null) {
    return '0.00'
  }
  return money.toFixed(2)
}

function getAmountClass(money: number | undefined | null): string {
  if (money === undefined || money === null || money === 0) {
    return ''
  }
  return money >= 0 ? 'red' : 'green'
}

function goDetail(date: string, count: number) {
  console.log('goDetail called:', date, count)
  router.push({ name: 'DayRecord', params: { date } })
}
</script>

<style scoped>
.week-record {
  overflow-y: auto;
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 60px;
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

.table-row.clickable {
  cursor: pointer;
}

.table-row.clickable:active {
  background: #f9f9f9;
}

.table-row .col {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.col-33 {
  flex: 1;
}

.text-center {
  text-align: center;
  align-items: center;
}

.date {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.week {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.count {
  font-size: 15px;
  color: #333;
}

.count.underline {
  text-decoration: underline;
  color: #fb2351;
}

.amount {
  font-size: 15px;
  font-weight: 600;
}

.amount.red {
  color: #fb2351;
}

.amount.green {
  color: #4caf50;
}

/* 提示 */
.tips {
  padding: 12px;
  font-size: 12px;
  color: #999;
  text-align: center;
  background: #fafafa;
}

/* 底部统计 */
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 12px 15px;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer-item {
  margin-left: 20px;
  font-size: 14px;
}

.footer-item .label {
  color: #666;
}

.footer-item .value {
  font-weight: 600;
  margin-left: 4px;
}

.footer-item .value.red {
  color: #fb2351;
}

.footer-item .value.green {
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
