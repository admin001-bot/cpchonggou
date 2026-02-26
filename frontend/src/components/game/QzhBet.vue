<template>
  <div class="bet-view">
    <!-- 前三 -->
    <div class="bet-section">
      <div class="section-title">{{ t('ssc.frontThree') }}</div>
      <div class="bet-grid">
        <div
          v-for="play in qzhPlays"
          :key="play.id"
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(7, play.id)) }"
          @click="handleToggle(getPlayId(7, play.id))"
        >
          <span class="bet-content">{{ play.name }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(7, play.id)).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 中三 -->
    <div class="bet-section">
      <div class="section-title">{{ t('ssc.middleThree') }}</div>
      <div class="bet-grid">
        <div
          v-for="play in qzhPlays"
          :key="play.id"
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(8, play.id)) }"
          @click="handleToggle(getPlayId(8, play.id))"
        >
          <span class="bet-content">{{ play.name }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(8, play.id)).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <!-- 后三 -->
    <div class="bet-section">
      <div class="section-title">{{ t('ssc.backThree') }}</div>
      <div class="bet-grid">
        <div
          v-for="play in qzhPlays"
          :key="play.id"
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(9, play.id)) }"
          @click="handleToggle(getPlayId(9, play.id))"
        >
          <span class="bet-content">{{ play.name }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(9, play.id)).toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import type { PlayInfo } from '@/api/game'

interface Props {
  gameId: number
  betData: Record<string, number[]>
  playsData: Record<string, PlayInfo>
  getOdds: (playId: number) => number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 前中后玩法配置
const qzhPlays = [
  { id: 1, name: t('ssc.leopard') },    // 豹子
  { id: 2, name: t('ssc.straight') },   // 顺子
  { id: 3, name: t('ssc.pair') },       // 对子
  { id: 4, name: t('ssc.halfStraight') }, // 半顺
  { id: 5, name: t('ssc.mixed') }       // 杂六
]

/**
 * 计算玩法ID
 * 前三: categoryId = 7, playId = gameId * 1000 + 7 * 100 + sequence
 * 中三: categoryId = 8
 * 后三: categoryId = 9
 * sequence: 豹子=1, 顺子=2, 对子=3, 半顺=4, 杂六=5
 */
function getPlayId(categoryId: number, sequence: number): number {
  return props.gameId * 1000 + categoryId * 100 + sequence
}

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['QZH'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number) {
  emit('toggle-bet', playId, 'QZH')
}
</script>

<style scoped>
.bet-view {
  padding: 10px;
  background: #f5f5f5;
}

.bet-section {
  background: #fff;
  margin-bottom: 10px;
  border-radius: 8px;
  overflow: hidden;
}

.section-title {
  background: #fafafa;
  padding: 8px 10px;
  text-align: center;
  font-size: 14px;
  color: #333;
  font-weight: 500;
  border-bottom: 1px solid #eee;
}

.bet-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
}

.bet-item {
  padding: 12px 5px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.bet-item:nth-child(5n) {
  border-right: none;
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
  font-size: 14px;
  font-weight: bold;
  color: #ed3f3f;
}
</style>
