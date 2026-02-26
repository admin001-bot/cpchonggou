<template>
  <div class="lianwei-bet">
    <!-- 子玩法切换 -->
    <div class="sub-tabs">
      <div
        v-for="count in [2, 3, 4]"
        :key="count"
        class="tab"
        :class="{ active: currentCount === count }"
        @click="selectCount(count)"
      >
        {{ count }}连尾
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-bar">
      选择 {{ currentCount }} 个尾数，全部选中即中奖
    </div>

    <!-- 尾数网格 -->
    <div class="bet-section">
      <div class="wei-grid">
        <div
          v-for="wei in weiList"
          :key="wei.id"
          class="wei-box"
          :class="{ active: selectedWei.includes(wei.id) }"
          @click="toggleWei(wei.id)"
        >
          <span class="wei-name">{{ wei.name }}尾</span>
          <span class="wei-numbers">{{ wei.numbers }}</span>
        </div>
      </div>
    </div>

    <!-- 已选尾数显示 -->
    <div class="selected-wei" v-if="selectedWei.length > 0">
      <div class="selected-title">已选尾数 ({{ selectedWei.length }}/{{ currentCount }})</div>
      <div class="selected-list">
        <span
          v-for="id in selectedWei"
          :key="id"
          class="selected-tag"
        >
          {{ id }}尾
          <i @click.stop="removeWei(id)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { t } from '@/locales'

const props = defineProps<{
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

const currentCount = ref(2)

// 已选尾数
const selectedWei = ref<number[]>([])

// 尾数列表 (0-9)
const weiList = [
  { id: 0, name: '0', numbers: '10,20,30,40' },
  { id: 1, name: '1', numbers: '01,11,21,31,41' },
  { id: 2, name: '2', numbers: '02,12,22,32,42' },
  { id: 3, name: '3', numbers: '03,13,23,33,43' },
  { id: 4, name: '4', numbers: '04,14,24,34,44' },
  { id: 5, name: '5', numbers: '05,15,25,35,45' },
  { id: 6, name: '6', numbers: '06,16,26,36,46' },
  { id: 7, name: '7', numbers: '07,17,27,37,47' },
  { id: 8, name: '8', numbers: '08,18,28,38,48' },
  { id: 9, name: '9', numbers: '09,19,29,39,49' }
]

// 选择连尾数量
const selectCount = (count: number) => {
  currentCount.value = count
  selectedWei.value = []
}

// 切换尾数选择
const toggleWei = (id: number) => {
  const index = selectedWei.value.indexOf(id)
  if (index > -1) {
    selectedWei.value.splice(index, 1)
  } else {
    if (selectedWei.value.length >= currentCount.value) {
      alert(`最多选择 ${currentCount.value} 个尾数`)
      return
    }
    selectedWei.value.push(id)
  }
}

// 移除尾数
const removeWei = (id: number) => {
  const index = selectedWei.value.indexOf(id)
  if (index > -1) {
    selectedWei.value.splice(index, 1)
  }
}

// 监听选择变化，通知父组件
watch(selectedWei, (newVal) => {
  if (newVal.length === currentCount.value) {
    emit('toggle-bet', -1)
  }
}, { deep: true })
</script>

<style scoped>
.lianwei-bet {
  padding: 15px;
  background: #f5f5f5;
}

.sub-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
}

.sub-tabs .tab {
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tabs .tab.active {
  background: #fb2351;
  color: #fff;
  border-color: #fb2351;
}

.tip-bar {
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 15px;
  border-left: 3px solid #ffc107;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.wei-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.wei-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.wei-box:active {
  transform: scale(0.95);
}

.wei-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.wei-name {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.wei-numbers {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.selected-wei {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.selected-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.selected-tag i {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #999;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
}

.selected-tag i:hover {
  background: #fb2351;
}
</style>
