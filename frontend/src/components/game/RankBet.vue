<template>
  <div class="bet-view">
    <div class="bet-section" v-for="rank in ranks" :key="rank">
      <div class="section-title">{{ rankNames[rank] }}</div>
      <div class="bet-row" v-for="row in getNumberRows(rank)" :key="row[0]">
        <div
          v-for="num in row"
          :key="num"
          class="bet-item"
          :class="['ball-' + num, { selected: isSelected(getPlayId(rank, num)) }]"
          @click="handleToggle(getPlayId(rank, num), rankNames[rank] + '-' + num)"
        >
          <span class="bet-number">{{ num }}</span>
          <span class="bet-odds">9.85</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  gameId: number
  betData: Record<string, number[]>
  ranks: number[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

// 名次名称
const rankNames: Record<number, string> = {
  1: '第一名',
  2: '第二名',
  3: '第三名',
  4: '第四名',
  5: '第五名',
  6: '第六名',
  7: '第七名',
  8: '第八名',
  9: '第九名',
  10: '第十名',
}

// 获取数字行
function getNumberRows(rank: number) {
  const rows = []
  for (let i = 1; i <= 10; i += 2) {
    rows.push([i, i + 1])
  }
  return rows
}

// 获取玩法ID
function getPlayId(rank: number, num: number): number {
  // 格式: 501(名次)(号码)
  // 例如: 第一名的1号 = 501101, 第六名的1号 = 501601
  return 501000 + rank * 100 + num + 6
}

// 是否选中
function isSelected(playId: number): boolean {
  const paneCode = props.ranks[0] <= 5 ? '1-5' : '6-10'
  const list = props.betData[paneCode] || []
  return list.includes(playId)
}

// 切换投注
function handleToggle(playId: number, _name: string) {
  const paneCode = props.ranks[0] <= 5 ? '1-5' : '6-10'
  emit('toggle-bet', playId, paneCode)
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
  display: flex;
  flex-direction: column;
  align-items: center;
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

.bet-item.selected .bet-number {
  box-shadow: 0 0 0 2px #fb2351;
}

.bet-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 4px;
}

/* 不同号码不同颜色 */
.bet-item.ball-1 .bet-number { background: #e6a23c; }
.bet-item.ball-2 .bet-number { background: #409eff; }
.bet-item.ball-3 .bet-number { background: #67c23a; }
.bet-item.ball-4 .bet-number { background: #f56c6c; }
.bet-item.ball-5 .bet-number { background: #909399; }
.bet-item.ball-6 .bet-number { background: #e6a23c; }
.bet-item.ball-7 .bet-number { background: #409eff; }
.bet-item.ball-8 .bet-number { background: #67c23a; }
.bet-item.ball-9 .bet-number { background: #f56c6c; }
.bet-item.ball-10 .bet-number { background: #909399; }

.bet-odds {
  display: block;
  font-size: 12px;
  color: #f5a623;
}
</style>
