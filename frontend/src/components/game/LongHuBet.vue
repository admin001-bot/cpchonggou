<template>
  <div class="bet-view">
    <!-- 龙虎对阵 -->
    <div
      v-for="match in matchups"
      :key="match.id"
      class="bet-section"
    >
      <div class="section-title">{{ match.title }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(match.dragonId) }"
          @click="handleToggle(match.dragonId)"
        >
          <span class="bet-content">{{ t('game.dragon') }}</span>
          <span class="bet-odds">{{ getOdds(match.dragonId).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(match.tigerId) }"
          @click="handleToggle(match.tigerId)"
        >
          <span class="bet-content">{{ t('game.tiger') }}</span>
          <span class="bet-odds">{{ getOdds(match.tigerId).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(match.drawId) }"
          @click="handleToggle(match.drawId)"
        >
          <span class="bet-content">{{ t('ssc.draw') }}</span>
          <span class="bet-odds">{{ getOdds(match.drawId).toFixed(3) }}</span>
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

// 龙虎对阵配置（10组）
// PlayID 从 122906 开始，每组3个连续ID（龙、虎、和）
const baseId = props.gameId * 1000 + 906

const matchups = [
  { id: 1, title: t('ssc.ball1') + ' VS ' + t('ssc.ball2'), dragonId: baseId, tigerId: baseId + 1, drawId: baseId + 2 },
  { id: 2, title: t('ssc.ball1') + ' VS ' + t('ssc.ball3'), dragonId: baseId + 3, tigerId: baseId + 4, drawId: baseId + 5 },
  { id: 3, title: t('ssc.ball1') + ' VS ' + t('ssc.ball4'), dragonId: baseId + 6, tigerId: baseId + 7, drawId: baseId + 8 },
  { id: 4, title: t('ssc.ball1') + ' VS ' + t('ssc.ball5'), dragonId: baseId + 9, tigerId: baseId + 10, drawId: baseId + 11 },
  { id: 5, title: t('ssc.ball2') + ' VS ' + t('ssc.ball3'), dragonId: baseId + 12, tigerId: baseId + 13, drawId: baseId + 14 },
  { id: 6, title: t('ssc.ball2') + ' VS ' + t('ssc.ball4'), dragonId: baseId + 15, tigerId: baseId + 16, drawId: baseId + 17 },
  { id: 7, title: t('ssc.ball2') + ' VS ' + t('ssc.ball5'), dragonId: baseId + 18, tigerId: baseId + 19, drawId: baseId + 20 },
  { id: 8, title: t('ssc.ball3') + ' VS ' + t('ssc.ball4'), dragonId: baseId + 21, tigerId: baseId + 22, drawId: baseId + 23 },
  { id: 9, title: t('ssc.ball3') + ' VS ' + t('ssc.ball5'), dragonId: baseId + 24, tigerId: baseId + 25, drawId: baseId + 26 },
  { id: 10, title: t('ssc.ball4') + ' VS ' + t('ssc.ball5'), dragonId: baseId + 27, tigerId: baseId + 28, drawId: baseId + 29 }
]

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['LONGHU'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number) {
  emit('toggle-bet', playId, 'LONGHU')
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

.bet-row {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
}

.bet-row:last-child {
  border-bottom: none;
}

.bet-item {
  flex: 1;
  padding: 12px 5px;
  text-align: center;
  border-right: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
}

.bet-item:last-child {
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
  font-size: 16px;
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
