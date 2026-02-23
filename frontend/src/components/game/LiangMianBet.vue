<template>
  <div class="bet-view">
    <!-- 冠亚和 -->
    <div class="bet-section">
      <div class="section-title">冠亞和</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(501001) }"
          @click="handleToggle(501001, '冠亞大')"
        >
          <span class="bet-content">冠亞大</span>
          <span class="bet-odds">2.2</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(501002) }"
          @click="handleToggle(501002, '冠亞小')"
        >
          <span class="bet-content">冠亞小</span>
          <span class="bet-odds">1.77</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(501003) }"
          @click="handleToggle(501003, '冠亞單')"
        >
          <span class="bet-content">冠亞單</span>
          <span class="bet-odds">1.77</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(501004) }"
          @click="handleToggle(501004, '冠亞雙')"
        >
          <span class="bet-content">冠亞雙</span>
          <span class="bet-odds">2.2</span>
        </div>
      </div>
    </div>

    <!-- 各名次两面 -->
    <template v-for="(rank, index) in ranks" :key="index">
      <div class="bet-section">
        <div class="section-title">{{ rankNames[rank] }}</div>
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

interface Props {
  gameId: number
  betData: Record<string, number[]>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 名次列表
const ranks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

// 名次名称
const rankNames: Record<number, string> = {
  1: '冠軍',
  2: '亞軍',
  3: '第三名',
  4: '第四名',
  5: '第五名',
  6: '第六名',
  7: '第七名',
  8: '第八名',
  9: '第九名',
  10: '第十名',
}

// 获取名次玩法
function getRankPlays(rank: number) {
  const baseId = 501000 + rank * 100
  // 1-5名有龙虎，6-10名没有
  if (rank <= 5) {
    return [
      { id: baseId + 3, name: `${rankNames[rank]}單`, label: '單', odds: '1.982' },
      { id: baseId + 1, name: `${rankNames[rank]}大`, label: '大', odds: '1.982' },
      { id: baseId + 5, name: `${rankNames[rank]}龍`, label: '龍', odds: '1.982' },
      { id: baseId + 4, name: `${rankNames[rank]}雙`, label: '雙', odds: '1.982' },
      { id: baseId + 2, name: `${rankNames[rank]}小`, label: '小', odds: '1.982' },
      { id: baseId + 6, name: `${rankNames[rank]}虎`, label: '虎', odds: '1.982' },
    ]
  } else {
    return [
      { id: baseId + 3, name: `${rankNames[rank]}單`, label: '單', odds: '1.982' },
      { id: baseId + 1, name: `${rankNames[rank]}大`, label: '大', odds: '1.982' },
      { id: baseId + 4, name: `${rankNames[rank]}雙`, label: '雙', odds: '1.982' },
      { id: baseId + 2, name: `${rankNames[rank]}小`, label: '小', odds: '1.982' },
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
  background: #fff5f7;
}

.bet-item.selected .bet-content {
  color: #fb2351;
}

.bet-item.selected .bet-odds {
  color: #fb2351;
}

.bet-content {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.bet-odds {
  display: block;
  font-size: 12px;
  color: #f5a623;
}
</style>
