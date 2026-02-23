<template>
  <div class="bet-view">
    <!-- 冠亚和大小单双 -->
    <div class="bet-section">
      <div class="section-title">{{ t('rank.topSum') }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(0, 'big')) }"
          @click="handleToggle(getPlayId(0, 'big'), '冠亞大')"
        >
          <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.big') }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(0, 'big')).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(0, 'small')) }"
          @click="handleToggle(getPlayId(0, 'small'), '冠亞小')"
        >
          <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.small') }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(0, 'small')).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(0, 'odd')) }"
          @click="handleToggle(getPlayId(0, 'odd'), '冠亞單')"
        >
          <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.odd') }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(0, 'odd')).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(0, 'even')) }"
          @click="handleToggle(getPlayId(0, 'even'), '冠亞雙')"
        >
          <span class="bet-content">{{ t('rank.topSum') }}{{ t('game.even') }}</span>
          <span class="bet-odds">{{ getOdds(getPlayId(0, 'even')).toFixed(3) }}</span>
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
            @click="handleToggle(play.id, play.name)"
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
            @click="handleToggle(play.id, play.name)"
          >
            <div class="bet-content">{{ play.label }}</div>
            <div class="bet-odds">{{ play.odds }}</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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

// 名次列表
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 获取玩法ID
// playId格式: gameId(55) + categoryId(101-111) + sequence(01-XX)
// 冠亚和(categoryId=101): 大=01, 小=02, 单=03, 双=04
// 各名次(categoryId=102-111): 大=11, 小=12, 单=13, 双=14, 龙=15, 虎=16
function getPlayId(rank: number, type: 'big' | 'small' | 'odd' | 'even' | 'dragon' | 'tiger'): number {
  const gameId = props.gameId
  let categoryId: number
  let sequence: number

  if (rank === 0) {
    // 冠亚和 (categoryId = 101)
    categoryId = 101
    switch (type) {
      case 'big': sequence = 1; break
      case 'small': sequence = 2; break
      case 'odd': sequence = 3; break
      case 'even': sequence = 4; break
      default: sequence = 1
    }
  } else {
    // 各名次 (categoryId = 101 + rank)
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

  return gameId * 100000 + categoryId * 100 + sequence
}

// 获取名次名称
function getRankName(rank: number): string {
  return t(`rank.${rank}`)
}

// 获取名次玩法
function getRankPlays(rank: number) {
  const rankName = getRankName(rank)
  // 1-5名有龙虎，6-10名没有
  if (rank <= 5) {
    return [
      { id: getPlayId(rank, 'odd'), name: `${rankName}${t('game.odd')}`, label: t('game.odd'), odds: props.getOdds(getPlayId(rank, 'odd')).toFixed(3) },
      { id: getPlayId(rank, 'big'), name: `${rankName}${t('game.big')}`, label: t('game.big'), odds: props.getOdds(getPlayId(rank, 'big')).toFixed(3) },
      { id: getPlayId(rank, 'dragon'), name: `${rankName}${t('game.dragon')}`, label: t('game.dragon'), odds: props.getOdds(getPlayId(rank, 'dragon')).toFixed(3) },
      { id: getPlayId(rank, 'even'), name: `${rankName}${t('game.even')}`, label: t('game.even'), odds: props.getOdds(getPlayId(rank, 'even')).toFixed(3) },
      { id: getPlayId(rank, 'small'), name: `${rankName}${t('game.small')}`, label: t('game.small'), odds: props.getOdds(getPlayId(rank, 'small')).toFixed(3) },
      { id: getPlayId(rank, 'tiger'), name: `${rankName}${t('game.tiger')}`, label: t('game.tiger'), odds: props.getOdds(getPlayId(rank, 'tiger')).toFixed(3) },
    ]
  } else {
    return [
      { id: getPlayId(rank, 'odd'), name: `${rankName}${t('game.odd')}`, label: t('game.odd'), odds: props.getOdds(getPlayId(rank, 'odd')).toFixed(3) },
      { id: getPlayId(rank, 'big'), name: `${rankName}${t('game.big')}`, label: t('game.big'), odds: props.getOdds(getPlayId(rank, 'big')).toFixed(3) },
      { id: getPlayId(rank, 'even'), name: `${rankName}${t('game.even')}`, label: t('game.even'), odds: props.getOdds(getPlayId(rank, 'even')).toFixed(3) },
      { id: getPlayId(rank, 'small'), name: `${rankName}${t('game.small')}`, label: t('game.small'), odds: props.getOdds(getPlayId(rank, 'small')).toFixed(3) },
    ]
  }
}

// 是否选中
function isSelected(playId: number): boolean {
  const list = props.betData['LM'] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number, _name: string) {
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
