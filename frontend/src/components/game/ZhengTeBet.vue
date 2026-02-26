<template>
  <div class="zhengte-bet">
    <!-- 位置切换 -->
    <div class="pos-tabs">
      <div
        v-for="(name, index) in posNames"
        :key="index"
        class="tab"
        :class="{ active: currentPos === index }"
        @click="currentPos = index"
      >{{ name }}</div>
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
            { active: isSelected(getPlayId(num)) }
          ]"
          @click="toggleBet(getPlayId(num))"
        >
          <span class="number">{{ formatNumber(num) }}</span>
          <span class="odds">{{ getOdds(getPlayId(num)) }}</span>
        </div>
      </div>
    </div>

    <!-- 两面选项 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.liangMian') }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getBigPlayId()) }"
          @click="handleToggle(getBigPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teDa') }}</span>
          <span class="bet-odds">{{ getOdds(getBigPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getSmallPlayId()) }"
          @click="handleToggle(getSmallPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teXiao') }}</span>
          <span class="bet-odds">{{ getOdds(getSmallPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getOddPlayId()) }"
          @click="handleToggle(getOddPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teDan') }}</span>
          <span class="bet-odds">{{ getOdds(getOddPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getEvenPlayId()) }"
          @click="handleToggle(getEvenPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teShuang') }}</span>
          <span class="bet-odds">{{ getOdds(getEvenPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getHeDaPlayId()) }"
          @click="handleToggle(getHeDaPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teHeDa') }}</span>
          <span class="bet-odds">{{ getOdds(getHeDaPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getHeXiaoPlayId()) }"
          @click="handleToggle(getHeXiaoPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teHeXiao') }}</span>
          <span class="bet-odds">{{ getOdds(getHeXiaoPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getHeOddPlayId()) }"
          @click="handleToggle(getHeOddPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teHeDan') }}</span>
          <span class="bet-odds">{{ getOdds(getHeOddPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getHeEvenPlayId()) }"
          @click="handleToggle(getHeEvenPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teHeShuang') }}</span>
          <span class="bet-odds">{{ getOdds(getHeEvenPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getWeiDaPlayId()) }"
          @click="handleToggle(getWeiDaPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teWeiDa') }}</span>
          <span class="bet-odds">{{ getOdds(getWeiDaPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getWeiXiaoPlayId()) }"
          @click="handleToggle(getWeiXiaoPlayId())"
        >
          <span class="bet-content">{{ t('lhc.teWeiXiao') }}</span>
          <span class="bet-odds">{{ getOdds(getWeiXiaoPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getRedWavePlayId()) }"
          @click="handleToggle(getRedWavePlayId())"
        >
          <span class="bet-content">{{ t('lhc.redWave') }}</span>
          <span class="bet-odds">{{ getOdds(getRedWavePlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getBlueWavePlayId()) }"
          @click="handleToggle(getBlueWavePlayId())"
        >
          <span class="bet-content">{{ t('lhc.blueWave') }}</span>
          <span class="bet-odds">{{ getOdds(getBlueWavePlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getGreenWavePlayId()) }"
          @click="handleToggle(getGreenWavePlayId())"
        >
          <span class="bet-content">{{ t('lhc.greenWave') }}</span>
          <span class="bet-odds">{{ getOdds(getGreenWavePlayId()).toFixed(3) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

const posNames = ['正 1 特', '正 2 特', '正 3 特', '正 4 特', '正 5 特', '正 6 特']
const currentPos = ref(0)

// playId 规律（基于 PHP 模板）：
// 正 1 特：号码 11392001-11392049, 两面 11392050-11392062
// 每个位置偏移 62

// 基础 ID 偏移量
const getBaseOffset = () => {
  return currentPos.value * 62
}

// 号码 playId: 基础 + num
const getPlayId = (num: number) => {
  return 11392000 + num + getBaseOffset()
}

// 两面 playId
const getBigPlayId = () => 11392052 + getBaseOffset()
const getSmallPlayId = () => 11392053 + getBaseOffset()
const getOddPlayId = () => 11392050 + getBaseOffset()
const getEvenPlayId = () => 11392051 + getBaseOffset()
const getHeDaPlayId = () => 11392056 + getBaseOffset()
const getHeXiaoPlayId = () => 11392057 + getBaseOffset()
const getHeOddPlayId = () => 11392054 + getBaseOffset()
const getHeEvenPlayId = () => 11392055 + getBaseOffset()
const getWeiDaPlayId = () => 11392061 + getBaseOffset()
const getWeiXiaoPlayId = () => 11392062 + getBaseOffset()
const getRedWavePlayId = () => 11392058 + getBaseOffset()
const getBlueWavePlayId = () => 11392059 + getBaseOffset()
const getGreenWavePlayId = () => 11392060 + getBaseOffset()

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
.zhengte-bet {
  padding: 15px;
  background: #f5f5f5;
}

.pos-tabs {
  display: flex;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.pos-tabs .tab {
  flex: 1;
  padding: 10px 5px;
  text-align: center;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
}

.pos-tabs .tab.active {
  background: #fb2351;
  color: #fff;
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

.bet-row .bet-item:nth-child(3) {
  flex: 1;
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
