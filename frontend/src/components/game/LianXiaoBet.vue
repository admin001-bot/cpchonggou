<template>
  <div class="lianxiao-bet">
    <!-- 子玩法切换 -->
    <div class="sub-tabs">
      <div
        v-for="count in [2, 3, 4]"
        :key="count"
        class="tab"
        :class="{ active: currentCount === count }"
        @click="selectCount(count)"
      >
        {{ count }}连肖
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-bar">
      选择 {{ currentCount }} 个生肖，全部选中即中奖
    </div>

    <!-- 生肖网格 -->
    <div class="bet-section">
      <div class="zodiac-grid">
        <div
          v-for="zodiac in zodiacList"
          :key="zodiac.id"
          class="zodiac-box"
          :class="{ active: selectedZodiacs.includes(zodiac.id) }"
          @click="toggleZodiac(zodiac.id)"
        >
          <span class="zodiac-name">{{ zodiac.name }}</span>
          <span class="zodiac-numbers">{{ zodiac.numbers }}</span>
        </div>
      </div>
    </div>

    <!-- 已选生肖显示 -->
    <div class="selected-zodiacs" v-if="selectedZodiacs.length > 0">
      <div class="selected-title">已选生肖 ({{ selectedZodiacs.length }}/{{ currentCount }})</div>
      <div class="selected-list">
        <span
          v-for="id in selectedZodiacs"
          :key="id"
          class="selected-tag"
        >
          {{ getZodiacName(id) }}
          <i @click.stop="removeZodiac(id)"></i>
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

// 已选生肖
const selectedZodiacs = ref<number[]>([])

// 生肖列表 (playId: 1138801-1138812)
const zodiacList = [
  { id: 1, name: '鼠', numbers: '08,20,32,44' },
  { id: 2, name: '牛', numbers: '07,19,31,43' },
  { id: 3, name: '虎', numbers: '06,18,30,42' },
  { id: 4, name: '兔', numbers: '05,17,29,41' },
  { id: 5, name: '龍', numbers: '04,16,28,40' },
  { id: 6, name: '蛇', numbers: '03,15,27,39' },
  { id: 7, name: '馬', numbers: '02,14,26,38' },
  { id: 8, name: '羊', numbers: '01,13,25,37,49' },
  { id: 9, name: '猴', numbers: '12,24,36,48' },
  { id: 10, name: '雞', numbers: '11,23,35,47' },
  { id: 11, name: '狗', numbers: '10,22,34,46' },
  { id: 12, name: '豬', numbers: '09,21,33,45' }
]

// 选择连肖数量
const selectCount = (count: number) => {
  currentCount.value = count
  selectedZodiacs.value = []
}

// 切换生肖选择
const toggleZodiac = (id: number) => {
  const index = selectedZodiacs.value.indexOf(id)
  if (index > -1) {
    selectedZodiacs.value.splice(index, 1)
  } else {
    if (selectedZodiacs.value.length >= currentCount.value) {
      alert(`最多选择 ${currentCount.value} 个生肖`)
      return
    }
    selectedZodiacs.value.push(id)
  }
}

// 移除生肖
const removeZodiac = (id: number) => {
  const index = selectedZodiacs.value.indexOf(id)
  if (index > -1) {
    selectedZodiacs.value.splice(index, 1)
  }
}

// 获取生肖名称
const getZodiacName = (id: number) => {
  const zodiac = zodiacList.find(z => z.id === id)
  return zodiac?.name || ''
}

// 监听选择变化，通知父组件
watch(selectedZodiacs, (newVal) => {
  if (newVal.length === currentCount.value) {
    // 连肖的 playId 计算较为复杂，这里传递选中的生肖 ID
    // 父组件需要根据生肖组合计算 playId
    emit('toggle-bet', -1)
  }
}, { deep: true })
</script>

<style scoped>
.lianxiao-bet {
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

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.zodiac-box {
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

.zodiac-box:active {
  transform: scale(0.95);
}

.zodiac-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.zodiac-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.zodiac-numbers {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.selected-zodiacs {
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
