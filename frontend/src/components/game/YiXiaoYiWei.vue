<template>
  <div class="yixiaoyiwei-bet">
    <!-- 生肖选择 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.teXiao') }}</div>
      <div class="zodiac-grid">
        <div
          v-for="zodiac in zodiacList"
          :key="zodiac.id"
          class="zodiac-box"
          :class="{ active: selectedZodiac === zodiac.id }"
          @click="selectZodiac(zodiac.id)"
        >
          <span class="zodiac-name">{{ zodiac.name }}</span>
          <span class="zodiac-numbers">{{ zodiac.numbers }}</span>
        </div>
      </div>
    </div>

    <!-- 尾数选择 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.weiShu') }}</div>
      <div class="wei-grid">
        <div
          v-for="wei in weiList"
          :key="wei.id"
          class="wei-box"
          :class="{ active: selectedWei === wei.id }"
          @click="selectWei(wei.id)"
        >
          <span class="wei-name">{{ wei.name }}尾</span>
          <span class="wei-numbers">{{ wei.numbers }}</span>
        </div>
      </div>
    </div>

    <!-- 已选组合显示 -->
    <div class="selected-combo" v-if="selectedZodiac && selectedWei !== null">
      <div class="selected-title">已选组合</div>
      <div class="selected-content">
        <span class="selected-zodiac">{{ getZodiacName(selectedZodiac) }}</span>
        <span class="selected-operator">+</span>
        <span class="selected-wei">{{ selectedWei }}尾</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// 已选生肖和尾数
const selectedZodiac = ref<number | null>(null)
const selectedWei = ref<number | null>(null)

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

// 选择生肖
const selectZodiac = (id: number) => {
  selectedZodiac.value = id
}

// 选择尾数
const selectWei = (id: number) => {
  selectedWei.value = id
}

// 获取生肖名称
const getZodiacName = (id: number) => {
  const zodiac = zodiacList.find(z => z.id === id)
  return zodiac?.name || ''
}

// 计算一肖一尾的 playId
// playId = 11398000 + (生肖 id-1) * 10 + 尾数 id + 1
const getPlayId = () => {
  if (selectedZodiac.value === null || selectedWei.value === null) return null
  return 11398000 + (selectedZodiac.value - 1) * 10 + selectedWei.value + 1
}

// 监听选择变化，通知父组件
watch([selectedZodiac, selectedWei], ([newZodiac, newWei]) => {
  if (newZodiac !== null && newWei !== null) {
    const playId = getPlayId()
    if (playId) {
      emit('toggle-bet', playId)
    }
  }
}, { deep: true })
</script>

<style scoped>
.yixiaoyiwei-bet {
  padding: 15px;
  background: #f5f5f5;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #fb2351;
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
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.wei-numbers {
  font-size: 10px;
  color: #999;
  text-align: center;
}

.selected-combo {
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

.selected-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-zodiac {
  flex: 1;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.selected-operator {
  font-size: 18px;
  color: #fb2351;
  font-weight: bold;
}

.selected-wei {
  flex: 1;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}
</style>
