<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">←</span>
      <span class="title">即時注單</span>
    </div>

    <div class="table-header">
      <div class="col col-33">彩種</div>
      <div class="col col-33">註單筆數</div>
      <div class="col col-33">下注金額</div>
    </div>

    <div class="table-body" v-if="dataList.length > 0">
      <div
        class="table-row"
        v-for="item in dataList"
        :key="item.gameId"
        @click="goDetail(item.gameId, item.name, item.count)"
      >
        <div class="col col-33 text-left">{{ item.name }}</div>
        <div class="col col-33 text-center underline">{{ item.count }}</div>
        <div class="col col-33 text-center">{{ formatMoney(item.money) }}</div>
      </div>
    </div>

    <div class="empty-tip" v-else-if="!loading">
      暫無數據
    </div>

    <div class="loading-wrap" v-if="loading">
      <span class="loading-spinner"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { betApi, type NotCountItem } from '@/api/game'

const router = useRouter()
const loading = ref(false)
const dataList = ref<NotCountItem[]>([])

onMounted(() => {
  loadData()
})

async function loadData() {
  loading.value = true
  try {
    const res = await betApi.getNotCount()
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

function goDetail(gameId: number, name: string, count: number) {
  if (count > 0) {
    router.push({ name: 'NotCountDetail', params: { gameId }, query: { name } })
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: #f5f5f5;
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

.underline {
  text-decoration: underline;
  color: #2196f3;
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
</style>
