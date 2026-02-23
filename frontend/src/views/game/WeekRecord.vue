<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">←</span>
      <span class="title">下注紀錄</span>
    </div>

    <div class="table-header">
      <div class="col col-33">時間</div>
      <div class="col col-33">筆數</div>
      <div class="col col-33">輸贏</div>
    </div>

    <div class="table-body">
      <div
        class="table-row"
        v-for="item in dataList"
        :key="item.statDate"
        @click="goDetail(item.statDate, item.betCount)"
      >
        <div class="col col-33 text-left">
          {{ item.statDate }}<br>
          <span class="week">{{ item.week }}</span>
        </div>
        <div class="col col-33 text-center" :class="{ underline: item.betCount > 0 }">
          {{ item.betCount }}
        </div>
        <div class="col col-33 text-center">
          <strong :class="item.rewardRebate > 0 ? 'red' : 'green'">
            {{ formatMoney(item.rewardRebate) }}
          </strong>
        </div>
      </div>
    </div>

    <div class="tips">點擊日期可查看下注詳情</div>

    <div class="page-footer">
      <div class="footer-item">
        <span>總筆數：</span>
        <span class="value green">{{ allBetCount }}</span>
      </div>
      <div class="footer-item">
        <span>總輸贏：</span>
        <span class="value green">{{ formatMoney(allRewardRebate) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { betApi, type WeekRecordItem } from '@/api/game'

const router = useRouter()
const loading = ref(false)
const dataList = ref<WeekRecordItem[]>([])

const allBetCount = computed(() => {
  return dataList.value.reduce((sum, item) => sum + item.betCount, 0)
})

const allRewardRebate = computed(() => {
  return dataList.value.reduce((sum, item) => sum + item.rewardRebate, 0)
})

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getStatBets()
    if (res.code === 0) {
      dataList.value = res.data || []
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

function goDetail(date: string, count: number) {
  if (count > 0) {
    router.push({ name: 'DayRecord', params: { date } })
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
  padding-bottom: 50px;
}

.page-header {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.back-btn {
  font-size: 18px;
  color: #666;
  margin-right: 10px;
  cursor: pointer;
}

.title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.table-header {
  display: flex;
  padding: 10px 15px;
  background: #fafafa;
  font-size: 13px;
  color: #666;
}

.table-body {
  background: #fff;
}

.table-row {
  display: flex;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
  color: #333;
}

.table-row:active {
  background: #f5f5f5;
}

.col {
  text-align: center;
}

.col-33 {
  flex: 1;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.week {
  font-size: 12px;
  color: #999;
}

.underline {
  text-decoration: underline;
  color: #2196f3;
}

.red {
  color: #f44336;
}

.green {
  color: #4caf50;
}

.tips {
  padding: 15px;
  font-size: 12px;
  color: #999;
  text-align: center;
}

.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 12px 15px;
  background: #fff;
  border-top: 1px solid #eee;
  font-size: 14px;
}

.footer-item {
  margin-left: 20px;
}

.footer-item .value {
  color: #4caf50;
}
</style>
