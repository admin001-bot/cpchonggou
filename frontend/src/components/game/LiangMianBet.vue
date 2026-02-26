<template>
  <div class="bet-view">
    <!-- 时时彩类型两面玩法 -->
    <template v-if="gameGroup === 'group2'">
      <!-- 总和大小单双 -->
      <div class="bet-section">
        <div class="section-title">{{ t('ssc.totalSum') }}</div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(1, 'big')) }"
            @click="handleToggle(getSSCPlayId(1, 'big'))"
          >
            <span class="bet-content">{{ t('ssc.totalBig') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(1, 'big')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(1, 'small')) }"
            @click="handleToggle(getSSCPlayId(1, 'small'))"
          >
            <span class="bet-content">{{ t('ssc.totalSmall') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(1, 'small')).toFixed(3) }}</span>
          </div>
        </div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(1, 'odd')) }"
            @click="handleToggle(getSSCPlayId(1, 'odd'))"
          >
            <span class="bet-content">{{ t('ssc.totalSingle') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(1, 'odd')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(1, 'even')) }"
            @click="handleToggle(getSSCPlayId(1, 'even'))"
          >
            <span class="bet-content">{{ t('ssc.totalDouble') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(1, 'even')).toFixed(3) }}</span>
          </div>
        </div>
      </div>

      <!-- 各球两面 -->
      <div
        v-for="ball in sscBalls"
        :key="ball.position"
        class="bet-section"
      >
        <div class="section-title">{{ t(`ssc.ball${ball.position}`) }}</div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(ball.position + 1, 'big')) }"
            @click="handleToggle(getSSCPlayId(ball.position + 1, 'big'))"
          >
            <span class="bet-content">{{ t('game.big') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(ball.position + 1, 'big')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(ball.position + 1, 'small')) }"
            @click="handleToggle(getSSCPlayId(ball.position + 1, 'small'))"
          >
            <span class="bet-content">{{ t('game.small') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(ball.position + 1, 'small')).toFixed(3) }}</span>
          </div>
        </div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(ball.position + 1, 'odd')) }"
            @click="handleToggle(getSSCPlayId(ball.position + 1, 'odd'))"
          >
            <span class="bet-content">{{ t('game.odd') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(ball.position + 1, 'odd')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getSSCPlayId(ball.position + 1, 'even')) }"
            @click="handleToggle(getSSCPlayId(ball.position + 1, 'even'))"
          >
            <span class="bet-content">{{ t('game.even') }}</span>
            <span class="bet-odds">{{ getOdds(getSSCPlayId(ball.position + 1, 'even')).toFixed(3) }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- PK10类型两面玩法 -->
    <template v-else>
      <!-- 冠亚和大小单双 -->
      <div class="bet-section">
        <div class="section-title">{{ t('rank.topSum') }}</div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getPK10PlayId(0, 'big')) }"
            @click="handleToggle(getPK10PlayId(0, 'big'))"
          >
            <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.big') }}</span>
            <span class="bet-odds">{{ getOdds(getPK10PlayId(0, 'big')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getPK10PlayId(0, 'small')) }"
            @click="handleToggle(getPK10PlayId(0, 'small'))"
          >
            <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.small') }}</span>
            <span class="bet-odds">{{ getOdds(getPK10PlayId(0, 'small')).toFixed(3) }}</span>
          </div>
        </div>
        <div class="bet-row">
          <div
            class="bet-item"
            :class="{ selected: isSelected(getPK10PlayId(0, 'odd')) }"
            @click="handleToggle(getPK10PlayId(0, 'odd'))"
          >
            <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.odd') }}</span>
            <span class="bet-odds">{{ getOdds(getPK10PlayId(0, 'odd')).toFixed(3) }}</span>
          </div>
          <div
            class="bet-item"
            :class="{ selected: isSelected(getPK10PlayId(0, 'even')) }"
            @click="handleToggle(getPK10PlayId(0, 'even'))"
          >
            <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.even') }}</span>
            <span class="bet-odds">{{ getOdds(getPK10PlayId(0, 'even')).toFixed(3) }}</span>
          </div>
        </div>
      </div>

      <!-- 各名次两面 -->
      <template v-for="(rank, index) in ranks" :key="index">
        <div class="bet-section">
          <div class="section-title">{{ getRankName(rank) }}</div>
          <div class="bet-row">
            <div
              v-for="play in getRankPlays(rank).slice(0, 3)"
              :key="play.id"
              class="bet-item"
              :class="{ selected: isSelected(play.id) }"
              @click="handleToggle(play.id)"
            >
              <div class="bet-content">{{ play.label }}</div>
              <div class="bet-odds">{{ play.odds }}</div>
            </div>
          </div>
          <div class="bet-row">
            <div
              v-for="play in getRankPlays(rank).slice(3, 6)"
              :key="play.id"
              class="bet-item"
              :class="{ selected: isSelected(play.id) }"
              @click="handleToggle(play.id)"
            >
              <div class="bet-content">{{ play.label }}</div>
              <div class="bet-odds">{{ play.odds }}</div>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import type { PlayInfo } from '@/api/game'

interface Props {
  gameId: number
  gameGroup?: string
  betData: Record<string, number[]>
  playsData: Record<string, PlayInfo>
  getOdds: (playId: number) => number
}

const props = withDefaults(defineProps<Props>(), {
  gameGroup: 'group1'
})
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 时时时彩球位列表
const sscBalls = [
  { position: 1, name: '第一球' },
  { position: 2, name: '第二球' },
  { position: 3, name: '第三球' },
  { position: 4, name: '第四球' },
  { position: 5, name: '第五球' }
]

// PK10名次列表
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

/**
 * 时时彩 PlayID 计算
 * playId = gameId * 10000 + categoryId * 100 + sequence
 * categoryId: 总和=1, 第一球=2, 第二球=3, 第三球=4, 第四球=5, 第五球=6
 * sequence: 大=10, 小=11, 单=12, 双=13
 */
function getSSCPlayId(categoryId: number, type: 'big' | 'small' | 'odd' | 'even'): number {
  let sequence: number
  switch (type) {
    case 'big': sequence = 10; break
    case 'small': sequence = 11; break
    case 'odd': sequence = 12; break
    case 'even': sequence = 13; break
    default: sequence = 10
  }
  return props.gameId * 10000 + categoryId * 100 + sequence
}

/**
 * PK10 PlayID 计算
 * playId = gameId * 100000 + categoryId * 100 + sequence
 * 冠亚和(categoryId=101): 大=01, 小=02, 单=03, 双=04
 * 各名次(categoryId=102-111): 大=11, 小=12, 单=13, 双=14, 龙=15, 虎=16
 */
function getPK10PlayId(rank: number, type: 'big' | 'small' | 'odd' | 'even' | 'dragon' | 'tiger'): number {
  let categoryId: number
  let sequence: number

  if (rank === 0) {
    categoryId = 101
    switch (type) {
      case 'big': sequence = 1; break
      case 'small': sequence = 2; break
      case 'odd': sequence = 3; break
      case 'even': sequence = 4; break
      default: sequence = 1
    }
  } else {
    categoryId = 101 + rank
    switch (type) {
      case 'big': sequence = 11; break
      case 'small': sequence = 12; break
      case 'odd': sequence = 13; break
      case 'even': sequence = 14; break
      case 'dragon': sequence = 15; break
      case 'tiger': sequence = 16; break
      default: sequence = 11
    }
  }

  return props.gameId * 100000 + categoryId * 100 + sequence
}

// 获取名次名称
function getRankName(rank: number): string {
  return t(`rank.${rank}`)
}

// 获取名次玩法
function getRankPlays(rank: number) {
  const rankName = getRankName(rank)
  if (rank <= 5) {
    return [
      { id: getPK10PlayId(rank, 'odd'), name: `${rankName}${t('game.odd')}`, label: t('game.odd'), odds: props.getOdds(getPK10PlayId(rank, 'odd')).toFixed(3) },
      { id: getPK10PlayId(rank, 'big'), name: `${rankName}${t('game.big')}`, label: t('game.big'), odds: props.getOdds(getPK10PlayId(rank, 'big')).toFixed(3) },
      { id: getPK10PlayId(rank, 'dragon'), name: `${rankName}${t('game.dragon')}`, label: t('game.dragon'), odds: props.getOdds(getPK10PlayId(rank, 'dragon')).toFixed(3) },
      { id: getPK10PlayId(rank, 'even'), name: `${rankName}${t('game.even')}`, label: t('game.even'), odds: props.getOdds(getPK10PlayId(rank, 'even')).toFixed(3) },
      { id: getPK10PlayId(rank, 'small'), name: `${rankName}${t('game.small')}`, label: t('game.small'), odds: props.getOdds(getPK10PlayId(rank, 'small')).toFixed(3) },
      { id: getPK10PlayId(rank, 'tiger'), name: `${rankName}${t('game.tiger')}`, label: t('game.tiger'), odds: props.getOdds(getPK10PlayId(rank, 'tiger')).toFixed(3) },
    ]
  } else {
    return [
      { id: getPK10PlayId(rank, 'odd'), name: `${rankName}${t('game.odd')}`, label: t('game.odd'), odds: props.getOdds(getPK10PlayId(rank, 'odd')).toFixed(3) },
      { id: getPK10PlayId(rank, 'big'), name: `${rankName}${t('game.big')}`, label: t('game.big'), odds: props.getOdds(getPK10PlayId(rank, 'big')).toFixed(3) },
      { id: getPK10PlayId(rank, 'even'), name: `${rankName}${t('game.even')}`, label: t('game.even'), odds: props.getOdds(getPK10PlayId(rank, 'even')).toFixed(3) },
      { id: getPK10PlayId(rank, 'small'), name: `${rankName}${t('game.small')}`, label: t('game.small'), odds: props.getOdds(getPK10PlayId(rank, 'small')).toFixed(3) },
    ]
  }
}

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['LM'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number) {
  emit('toggle-bet', playId, 'LM')
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
  padding: 10px 5px;
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
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.bet-odds {
  display: block;
  font-size: 15px;
  font-weight: bold;
  color: #ed3f3f;
}
</style>
