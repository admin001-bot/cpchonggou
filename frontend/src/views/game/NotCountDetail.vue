<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">←</span>
      <span class="title">{{ gameName }} - 即時注單明細</span>
    </div>

    <div class="table-header">
      <div class="col col-25">期號</div>
      <div class="col col-30">玩法</div>
      <div class="col col-20">金額</div>
      <div class="col col-25">可贏</div>
    </div>

    <div class="table-body" v-if="dataList.length > 0">
      <div class="table-row" v-for="item in dataList" :key="item.id">
        <div class="col col-25 text-left">{{ item.turnNum }}</div>
        <div class="col col-30 text-left">
          <div>{{ item.playName }}</div>
          <div class="sub-info">@{{ item.odds.toFixed(2) }}</div>
        </div>
        <div class="col col-20 text-center">{{ formatMoney(item.money) }}</div>
        <div class="col col-25 text-center green">{{ formatMoney(item.resultMoney) }}</div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { betApi, type BetDetailItem } from '@/api/game'

const route = useRoute()
const loading = ref(false)
const dataList = ref<BetDetailItem[]>([])
const totalBetMoney = ref(0)
const gameId = Number(route.params.gameId)
const gameName = route.query.name as string || ''

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getNotCountDetail(gameId)
    if (res.code === 0) {
      dataList.value = res.data || []
      totalBetMoney.value = res.otherData?.totalBetMoney || 0
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
  font-size: 13px;
  color: #333;
}

.col {
  text-align: center;
}

.col-20 {
  flex: 0 0 20%;
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

.green {
  color: #4caf50;
}

.sub-info {
  font-size: 12px;
  color: #999;
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
</style>
