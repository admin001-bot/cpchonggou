<template>
  <div class="zongxiao-bet">
    <!-- 总肖选项 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.zongXiao') }}</div>
      <div class="bet-row">
        <div
          v-for="count in 12"
          :key="count"
          class="bet-box"
          :class="{ active: isSelected(getPlayId(count)) }"
          @click="toggleBet(getPlayId(count))"
        >
          <span class="bet-name">{{ count }}肖</span>
          <span class="odds">{{ getOdds(getPlayId(count)) }}</span>
        </div>
      </div>
    </div>

    <!-- 选择生肖区域 -->
    <div class="bet-section">
      <div class="section-title">选择生肖</div>
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
      <div class="selected-title">已选生肖 ({{ selectedZodiacs.length }}肖)</div>
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
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// 已选生肖
const selectedZodiacs = ref<number[]>([])

// 生肖列表
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

// 总肖 playId: 11397001-11397012 (对应 1-12 肖)
const getPlayId = (count: number) => {
  return 11397000 + count
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(3) || '1.982'
}

// 切换生肖选择
const toggleZodiac = (id: number) => {
  const index = selectedZodiacs.value.indexOf(id)
  if (index > -1) {
    selectedZodiacs.value.splice(index, 1)
  } else {
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

// 监听生肖选择变化
watch(selectedZodiacs, (newVal) => {
  // 总肖玩法根据选择的生肖数量自动选择对应的 playId
  if (newVal.length > 0) {
    const playId = getPlayId(newVal.length)
    // 先取消其他选项，再选择当前选项
    emit('toggle-bet', playId)
  }
}, { deep: true })
</script>

<style scoped>
.zongxiao-bet {
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

.bet-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 15px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 70px;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-name {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 12px;
  color: #fb2351;
  font-weight: 600;
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
