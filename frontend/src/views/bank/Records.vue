<template>
  <div class="records-page">
    <!-- 表头 -->
    <div class="table-header">
      <div class="col col-40">{{ t('bank.time') }}</div>
      <div class="col col-30">{{ t('bank.amount') }}</div>
      <div class="col col-30">{{ t('bank.status') }}</div>
    </div>

    <!-- 列表 -->
    <div class="table-body">
      <div
        v-for="item in records"
        :key="item.id"
        class="table-row"
        @click="showDetail(item)"
      >
        <div class="col col-40">{{ formatDate(item.time) }}</div>
        <div class="col col-30">{{ item.amount }}</div>
        <div class="col col-30" :class="getStatusClass(item.status)">
          {{ getStatusText(item.status) }}
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="records.length === 0 && !loading" class="empty-tip">
        {{ t('bank.noData') }}
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="loading-tip">
        {{ t('common.loading') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '@/locales'

const route = useRoute()

interface Record {
  id: number
  time: string
  amount: number
  status: number
  orderNo?: string
  type?: string
  bankName?: string
  bankCard?: string
}

const type = ref(1) // 1=存款记录, 2=提款记录
const records = ref<Record[]>([])
const loading = ref(false)

// 状态映射
const depositStatusMap: Record<number, string> = {
  0: t('bank.statusPending'),
  1: t('bank.statusSuccess'),
  2: t('bank.statusFailed'),
}

const withdrawStatusMap: Record<number, string> = {
  0: t('bank.statusPending'),
  1: t('bank.statusSuccess'),
  2: t('bank.statusFailed'),
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`
}

const getStatusText = (status: number) => {
  const map = type.value === 1 ? depositStatusMap : withdrawStatusMap
  return map[status] || status
}

const getStatusClass = (status: number) => {
  if (status === 1) return 'status-success'
  if (status === 2) return 'status-failed'
  return 'status-pending'
}

const showDetail = (item: Record) => {
  // TODO: 显示详情弹窗
  console.log('show detail', item)
}

const loadData = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取数据
    // 模拟数据
    await new Promise((resolve) => setTimeout(resolve, 500))
    records.value = [
      { id: 1, time: '2026-02-23 12:30:00', amount: 100, status: 1 },
      { id: 2, time: '2026-02-22 10:15:00', amount: 500, status: 1 },
      { id: 3, time: '2026-02-21 08:45:00', amount: 200, status: 0 },
    ]
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.type,
  (newType) => {
    type.value = parseInt(newType as string) || 1
    loadData()
  },
  { immediate: true }
)

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.records-page {
  background: #fff;
}

.table-header {
  display: flex;
  background: #f5f5f5;
  padding: 12px 10px;
  font-size: 13px;
  color: #666;
}

.table-body {
  max-height: 400px;
  overflow-y: auto;
}

.table-row {
  display: flex;
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
  font-size: 13px;
  color: #333;
}

.table-row:active {
  background: #f9f9f9;
}

.col {
  text-align: center;
}

.col-40 {
  width: 40%;
}

.col-30 {
  width: 30%;
}

/* 状态颜色 */
.status-success {
  color: #52c41a;
}

.status-failed {
  color: #ff4d4f;
}

.status-pending {
  color: #faad14;
}

/* 空状态 */
.empty-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}

.loading-tip {
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
}
</style>
