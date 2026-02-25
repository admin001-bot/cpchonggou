<template>
  <div class="records-page">
    <!-- 表头 -->
    <div class="table-header">
      <div class="col col-40">{{ t('bank.time') }}</div>
      <div class="col col-30">{{ t('bank.amount') }}</div>
      <div class="col col-30">{{ t('bank.status') }}</div>
    </div>

    <!-- 列表 -->
    <div class="table-body" ref="listRef">
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

      <!-- 加载更多 -->
      <div v-if="hasMore && !loading" class="load-more" @click="loadMore">
        {{ t('bank.loadMore') }}
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="detail-modal" @click="showDetailModal = false">
      <div class="detail-content" @click.stop>
        <div class="detail-title">{{ type === 1 ? t('bank.depositDetail') : t('bank.withdrawDetail') }}</div>
        <div class="detail-body">
          <div class="detail-row">
            <span class="label">{{ t('bank.orderNo') }}：</span>
            <span>{{ selectedItem?.orderNo }}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ t('bank.time') }}：</span>
            <span>{{ selectedItem?.time }}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ t('bank.amount') }}：</span>
            <span class="amount">{{ selectedItem?.amount }}</span>
          </div>
          <div class="detail-row">
            <span class="label">{{ t('bank.status') }}：</span>
            <span :class="getStatusClass(selectedItem?.status || 0)">{{ getStatusText(selectedItem?.status || 0) }}</span>
          </div>
          <template v-if="type === 1">
            <div class="detail-row">
              <span class="label">{{ t('bank.depositMethod') }}：</span>
              <span>{{ selectedItem?.methodName }}</span>
            </div>
          </template>
          <template v-else>
            <div class="detail-row">
              <span class="label">{{ t('bank.bankName') }}：</span>
              <span>{{ selectedItem?.bankName }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('bank.bankCard') }}：</span>
              <span>{{ selectedItem?.bankCard }}</span>
            </div>
            <div class="detail-row">
              <span class="label">{{ t('bank.bankAccount') }}：</span>
              <span>{{ selectedItem?.bankAccount }}</span>
            </div>
          </template>
        </div>
        <button class="detail-close" @click="showDetailModal = false">{{ t('game.confirm') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { t } from '@/locales'
import { getWithdrawRecords, getDepositRecords, type WithdrawRecord, type DepositRecord } from '@/api/bank'

const route = useRoute()

interface Record {
  id: number
  orderNo: string
  time: string
  amount: number
  status: number
  methodName?: string
  bankName?: string
  bankCard?: string
  bankAccount?: string
}

const type = ref(1) // 1=存款记录，2=提款记录
const records = ref<Record[]>([])
const loading = ref(false)
const hasMore = ref(false)
const page = ref(1)
const pageSize = ref(20)
const showDetailModal = ref(false)
const selectedItem = ref<Record | null>(null)
const totalCount = ref(0)

// 状态映射
const depositStatusMap: Record<number, string> = {
  0: t('bank.statusPending'),
  1: t('bank.statusSuccess'),
  2: t('bank.statusSuccess'),
  3: t('bank.statusFailed'),
  9: t('bank.statusSuccess'),
}

const withdrawStatusMap: Record<number, string> = {
  0: t('bank.statusPending'),    // 已到帐
  1: t('bank.statusPending'),    // 申请中
  2: t('bank.statusFailed'),     // 已取消
  3: t('bank.statusSuccess'),    // 已支付
  4: t('bank.statusFailed'),     // 提现失败
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  // 处理 "2006-01-02 15:04:05" 格式
  const date = new Date(dateStr.replace(/-/g, '/'))
  if (isNaN(date.getTime())) return dateStr
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${month}/${day} ${hours}:${minutes}`
}

const getStatusText = (status: number) => {
  const map = type.value === 1 ? depositStatusMap : withdrawStatusMap
  return map[status] || String(status)
}

const getStatusClass = (status: number) => {
  // 存款状态：0 申请，1 手动到账，2 自动到账，3 充值失败，9 管理员充值
  if (type.value === 1) {
    if (status === 1 || status === 2 || status === 9) return 'status-success'
    if (status === 3) return 'status-failed'
    return 'status-pending'
  } else {
    // 提款状态：0 已到帐，1 申请中，2 已取消，3 已支付，4 已失败
    if (status === 0 || status === 3) return 'status-success'
    if (status === 2 || status === 4) return 'status-failed'
    return 'status-pending'
  }
}

const showDetail = (item: Record) => {
  selectedItem.value = item
  showDetailModal.value = true
}

const loadData = async (isLoadMore = false) => {
  if (loading.value) return

  loading.value = true
  try {
    if (type.value === 1) {
      // 存款记录
      const response = await getDepositRecords({
        page: page.value,
        rows: pageSize.value
      })

      if (response.data) {
        const depositData = response.data.data as DepositRecord[]
        const newRecords = depositData.map((item: DepositRecord) => ({
          id: item.id,
          orderNo: item.orderNo,
          time: item.addTime,
          amount: item.rechMoney,
          status: item.status,
          methodName: item.rechName
        }))

        if (isLoadMore) {
          records.value = [...records.value, ...newRecords]
        } else {
          records.value = newRecords
        }
        totalCount.value = response.data.totalCount
        hasMore.value = records.value.length < totalCount.value
      }
    } else {
      // 提款记录
      const response = await getWithdrawRecords({
        page: page.value,
        rows: pageSize.value
      })

      if (response.data && response.data.data) {
        const withdrawData = response.data.data as WithdrawRecord[]
        const newRecords = withdrawData.map((item: WithdrawRecord) => ({
          id: item.id,
          orderNo: item.orderNo,
          time: item.applyTime,
          amount: item.applyMoney,
          status: item.checkStatus,
          bankName: item.bankName,
          bankCard: item.bankCard,
          bankAccount: item.bankAccount
        }))

        if (isLoadMore) {
          records.value = [...records.value, ...newRecords]
        } else {
          records.value = newRecords
        }
        totalCount.value = response.data.totalCount
        hasMore.value = records.value.length < totalCount.value
      }
    }
  } catch (error) {
    console.error('加载记录失败:', error)
    records.value = []
  } finally {
    loading.value = false
  }
}

const loadMore = () => {
  page.value++
  loadData(true)
}

watch(
  () => route.params.type,
  (newType) => {
    type.value = parseInt(newType as string) || 1
    page.value = 1
    records.value = []
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

.load-more {
  text-align: center;
  padding: 15px 0;
  color: #fb2351;
  font-size: 14px;
  cursor: pointer;
}

/* 详情弹窗 */
.detail-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-content {
  background: #fff;
  border-radius: 10px;
  width: 85%;
  max-width: 320px;
  overflow: hidden;
}

.detail-title {
  padding: 15px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.detail-body {
  padding: 15px;
}

.detail-row {
  display: flex;
  margin-bottom: 12px;
  font-size: 14px;
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row .label {
  color: #999;
  width: 80px;
  flex-shrink: 0;
}

.detail-row .amount {
  color: #fb2351;
  font-weight: 500;
}

.detail-close {
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  font-size: 15px;
  cursor: pointer;
}
</style>
