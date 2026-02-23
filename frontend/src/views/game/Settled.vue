<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">←</span>
      <span class="title">今日已結</span>
    </div>

    <div class="table-header">
      <div class="col col-30">期號</div>
      <div class="col col-25">下註明細</div>
      <div class="col col-22">下注金額</div>
      <div class="col col-23">輸贏金額</div>
    </div>

    <div class="table-body" v-if="dataList.length > 0">
      <div class="table-row" v-for="(item, index) in dataList" :key="index">
        <div class="col col-30 text-left" v-html="item.turnNum"></div>
        <div class="col col-25 text-left" v-html="item.detail"></div>
        <div class="col col-22 text-center">{{ formatMoney(item.money) }}</div>
        <div class="col col-23 text-center">
          <span :class="item.resultMoney > 0 ? 'red' : 'green'">
            {{ formatMoney(item.resultMoney) }}
          </span>
        </div>
      </div>
    </div>

    <div class="empty-tip" v-else-if="!loading">
      暫無數據
    </div>

    <div class="loading-wrap" v-if="loading">
      <span class="loading-spinner"></span>
    </div>

    <div class="page-footer" v-if="dataList.length > 0">
      <div class="footer-item">
        <span>下注金額：</span>
        <span class="value">{{ formatMoney(totalBetMoney) }}</span>
      </div>
      <div class="footer-item">
        <span>輸贏金額：</span>
        <span class="value" :class="totalResultMoney > 0 ? 'red' : 'green'">
          {{ formatMoney(totalResultMoney) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { betApi, type SettledItem } from '@/api/game'

const loading = ref(false)
const dataList = ref<SettledItem[]>([])
const totalBetMoney = ref(0)
const totalResultMoney = ref(0)
const page = ref(1)
const hasMore = ref(true)

onMounted(() => {
  loadData()
})

async function loadData() {
  if (!hasMore.value) return

  loading.value = true
  try {
    const res = await betApi.getBetBills(page.value, 30)
    if (res.code === 0) {
      if (page.value === 1) {
        dataList.value = res.data || []
      } else {
        dataList.value.push(...(res.data || []))
      }
      totalBetMoney.value = res.otherData?.totalBetMoney || 0
      totalResultMoney.value = res.otherData?.totalResultMoney || 0

      // 检查是否还有更多数据
      if (res.data && res.data.length < 30) {
        hasMore.value = false
      } else {
        page.value++
      }
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
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 12px;
  color: #333;
}

.col {
  text-align: center;
}

.col-22 {
  flex: 0 0 22%;
}

.col-23 {
  flex: 0 0 23%;
}

.col-25 {
  flex: 0 0 25%;
}

.col-30 {
  flex: 0 0 30%;
}

.text-left {
  text-align: left;
}

.text-center {
  text-align: center;
}

.red {
  color: #f44336;
}

.green {
  color: #4caf50;
}

.empty-tip {
  text-align: center;
  padding: 50px 0;
  color: #999;
  font-size: 14px;
}

.loading-wrap {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

.loading-spinner {
  display: inline-block;
  width: 24px;
  height: 24px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff9800;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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
  color: #ff9800;
}

.footer-item .value.red {
  color: #f44336;
}

.footer-item .value.green {
  color: #4caf50;
}
</style>
