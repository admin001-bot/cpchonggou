<template>
  <div class="zhongma-bet">
    <!-- 正码号码 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.zhengCode') }}</div>
      <div class="number-grid">
        <div
          v-for="num in 49"
          :key="num"
          class="bet-box"
          :class="[
            getNumberClass(num),
            { active: isSelected(getPlayId(num)) }
          ]"
          @click="toggleBet(getPlayId(num))"
        >
          <span class="number">{{ formatNumber(num) }}</span>
          <span class="odds">{{ getOdds(getPlayId(num)) }}</span>
        </div>
      </div>
    </div>

    <!-- 总和两面 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.totalSum') }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138623) }"
          @click="handleToggle(1138623)"
        >
          <span class="bet-content">{{ t('lhc.totalBig') }}</span>
          <span class="bet-odds">{{ getOdds(1138623).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138624) }"
          @click="handleToggle(1138624)"
        >
          <span class="bet-content">{{ t('lhc.totalSmall') }}</span>
          <span class="bet-odds">{{ getOdds(1138624).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138621) }"
          @click="handleToggle(1138621)"
        >
          <span class="bet-content">{{ t('lhc.totalSingle') }}</span>
          <span class="bet-odds">{{ getOdds(1138621).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138622) }"
          @click="handleToggle(1138622)"
        >
          <span class="bet-content">{{ t('lhc.totalDouble') }}</span>
          <span class="bet-odds">{{ getOdds(1138622).toFixed(3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// playId: 1139101-1139149 (对应 1-49 号)
const getPlayId = (num: number) => {
  return 1139100 + num
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

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
}

const handleToggle = (playId: number) => {
  emit('toggle-bet', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds || 1.982
}
</script>

<style scoped>
.zhongma-bet {
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
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
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
  font-size: 13px;
  font-weight: 600;
  color: #333;
  margin-bottom: 3px;
}

.odds {
  font-size: 10px;
  color: #fb2351;
  font-weight: 600;
}

.bet-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.bet-row:last-child {
  margin-bottom: 0;
}

.bet-item {
  flex: 1;
  padding: 10px 5px;
  text-align: center;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  background: #fff;
}

.bet-item:active {
  background: #f5f5f5;
}

.bet-item.selected {
  background: #b3b3b3;
}

.bet-item.selected .bet-content {
  color: #fff;
}

.bet-item.selected .bet-odds {
  color: #ed3f3f;
}

.bet-content {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.bet-odds {
  display: block;
  font-size: 13px;
  font-weight: bold;
  color: #ed3f3f;
}
</style>
