<template>
  <div class="bet-view">
    <!-- 第一球到第五球 -->
    <div
      v-for="ball in balls"
      :key="ball.position"
      class="bet-section"
    >
      <div class="section-title">{{ t(`ssc.ball${ball.position}`) }}</div>
      <div class="number-grid">
        <div
          v-for="num in 10"
          :key="num - 1"
          class="bet-item"
          :class="{ selected: isSelected(ball.position, num - 1) }"
          @click="handleToggle(ball.position, num - 1)"
        >
          <span class="bet-number">{{ num - 1 }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(ball.position, num - 1)).toFixed(2) }}</span>
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

// 球位配置
const balls = [
  { position: 1, name: '第一球' },
  { position: 2, name: '第二球' },
  { position: 3, name: '第三球' },
  { position: 4, name: '第四球' },
  { position: 5, name: '第五球' }
]

/**
 * 计算玩法ID
 * playId = gameId * 1000 + ballPosition * 100 + number
 * ballPosition: 第一球=2, 第二球=3, 第三球=4, 第四球=5, 第五球=6
 * number: 0-9
 */
function getPlayId(ballPosition: number, number: number): number {
  // ballPosition 1-5 对应 categoryId 2-6
  const categoryId = ballPosition + 1
  return props.gameId * 1000 + categoryId * 100 + number
}

// 是否选中
function isSelected(ballPosition: number, number: number): boolean {
  const list = props.betData['ALL'] || []
  return list.includes(getPlayId(ballPosition, number))
}

// 切换投注
function handleToggle(ballPosition: number, number: number) {
  emit('toggle-bet', getPlayId(ballPosition, number), 'ALL')
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

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1px;
  background: #f0f0f0;
}

.bet-item {
  padding: 12px 5px;
  text-align: center;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bet-item:active {
  background: #f5f5f5;
}

.bet-item.selected {
  background: #b3b3b3;
}

.bet-item.selected .bet-number {
  color: #fff;
}

.bet-item.selected .bet-odds {
  color: #ed3f3f;
}

.bet-number {
  display: block;
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.bet-odds {
  display: block;
  font-size: 12px;
  color: #ed3f3f;
}
</style>
