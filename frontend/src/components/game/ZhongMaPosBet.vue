<template>
  <div class="zhongma-pos-bet">
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

    <!-- 两面选项 -->
    <div class="bet-section">
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getBigPlayId()) }"
          @click="handleToggle(getBigPlayId())"
        >
          <span class="bet-content">{{ t('game.big') }}</span>
          <span class="bet-odds">{{ getOdds(getBigPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getSmallPlayId()) }"
          @click="handleToggle(getSmallPlayId())"
        >
          <span class="bet-content">{{ t('game.small') }}</span>
          <span class="bet-odds">{{ getOdds(getSmallPlayId()).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getOddPlayId()) }"
          @click="handleToggle(getOddPlayId())"
        >
          <span class="bet-content">{{ t('game.odd') }}</span>
          <span class="bet-odds">{{ getOdds(getOddPlayId()).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getEvenPlayId()) }"
          @click="handleToggle(getEvenPlayId())"
        >
          <span class="bet-content">{{ t('game.even') }}</span>
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

const posNames = ['正碼一', '正碼二', '正碼三', '正碼四', '正碼五', '正碼六']
const currentPos = ref(0)

// playId 规律（基于 PHP 模板）：
// 正碼一：大 (11392052), 小 (11392053), 單 (11392050), 雙 (11392051), 合大 (11392056), 合小 (11392057), 合單 (11392054), 合雙 (11392055), 尾大 (11392061), 尾小 (11392062), 红波 (11392058), 蓝波 (11392059), 绿波 (11392060)
// 每个位置偏移 62

// 基础 ID 偏移量
const getBaseOffset = () => {
  return currentPos.value * 62
}

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

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
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
.zhongma-pos-bet {
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
  font-size: 13px;
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
