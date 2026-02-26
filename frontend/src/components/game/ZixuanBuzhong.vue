<template>
  <div class="zixuan-buzhong-bet">
    <!-- 子玩法切换 -->
    <div class="sub-tabs">
      <div
        v-for="count in [5, 6, 7, 8, 9, 10, 11, 12]"
        :key="count"
        class="tab"
        :class="{ active: currentCount === count }"
        @click="selectCount(count)"
      >
        选{{ count }}不中
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-bar">
      选择 {{ currentCount }} 个号码，开奖号码全部不在所选号码中即中奖
    </div>

    <!-- 号码网格 -->
    <div class="bet-section">
      <div class="number-grid">
        <div
          v-for="num in 49"
          :key="num"
          class="bet-box"
          :class="[
            getNumberClass(num),
            { active: selectedBets.includes(num) }
          ]"
          @click="toggleNumber(num)"
        >
          <span class="number">{{ formatNumber(num) }}</span>
          <span class="zodiac">{{ getZodiac(num) }}</span>
        </div>
      </div>
    </div>

    <!-- 已选号码显示 -->
    <div class="selected-numbers" v-if="selectedBets.length > 0">
      <div class="selected-title">已选号码 ({{ selectedBets.length }}/{{ currentCount }})</div>
      <div class="selected-list">
        <span
          v-for="num in selectedBets"
          :key="num"
          class="selected-tag"
          :class="getNumberClass(num)"
        >
          {{ formatNumber(num) }}
          <i @click.stop="toggleNumber(num)"></i>
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

const currentCount = ref(5)

// 已选号码
const selectedNumbers = ref<number[]>([])

// 选择数量
const selectCount = (count: number) => {
  currentCount.value = count
  selectedNumbers.value = []
}

// 切换号码选择
const toggleNumber = (num: number) => {
  const index = selectedNumbers.value.indexOf(num)
  if (index > -1) {
    selectedNumbers.value.splice(index, 1)
  } else {
    if (selectedNumbers.value.length >= currentCount.value) {
      alert(`最多选择 ${currentCount.value} 个号码`)
      return
    }
    selectedNumbers.value.push(num)
  }
}

// 格式化号码为两位数
const formatNumber = (num: number) => {
  return num.toString().padStart(2, '0')
}

// 根据号码获取颜色样式
const getNumberClass = (num: number) => {
  const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
  const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
  const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

  if (redWave.includes(num)) return 'red'
  if (blueWave.includes(num)) return 'blue'
  if (greenWave.includes(num)) return 'green'
  return ''
}

// 获取生肖
const getZodiac = (num: number) => {
  const zodiacMap: Record<number, string> = {
    1: '羊', 13: '羊', 25: '羊', 37: '羊', 49: '羊',
    12: '猴', 24: '猴', 36: '猴', 48: '猴',
    11: '雞', 23: '雞', 35: '雞', 47: '雞',
    10: '狗', 22: '狗', 34: '狗', 46: '狗',
    9: '豬', 21: '豬', 33: '豬', 45: '豬',
    8: '鼠', 20: '鼠', 32: '鼠', 44: '鼠',
    7: '牛', 19: '牛', 31: '牛', 43: '牛',
    6: '虎', 18: '虎', 30: '虎', 42: '虎',
    5: '兔', 17: '兔', 29: '兔', 41: '兔',
    4: '龍', 16: '龍', 28: '龍', 40: '龍',
    3: '蛇', 15: '蛇', 27: '蛇', 39: '蛇',
    2: '馬', 14: '馬', 26: '馬', 38: '馬'
  }
  return zodiacMap[num] || ''
}

// 监听选择变化，通知父组件
watch(selectedNumbers, (newVal) => {
  if (newVal.length === currentCount.value) {
    emit('toggle-bet', -1)
  }
}, { deep: true })
</script>

<style scoped>
.zixuan-buzhong-bet {
  padding: 15px;
  background: #f5f5f5;
}

.sub-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 15px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.sub-tabs .tab {
  flex-shrink: 0;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tabs .tab.active {
  background: #fb2351;
  color: #fff;
  border-color: #fb2351;
}

.tip-bar {
  background: #e8f5e9;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 15px;
  border-left: 3px solid #4caf50;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-box.active::after {
  content: '✓';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #fb2351;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bet-box.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.bet-box.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.bet-box.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 2px;
}

.zodiac {
  font-size: 10px;
  color: #666;
}

.selected-numbers {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
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
  gap: 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.selected-tag.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.selected-tag.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.selected-tag.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
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
