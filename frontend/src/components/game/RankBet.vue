<template>
  <div class="bet-view">
    <div class="bet-section" v-for="rank in ranks" :key="rank">
      <div class="section-title">{{ rankNames[rank] }}</div>
      <div class="bet-row" v-for="row in getNumberRows(rank)" :key="row[0]">
        <div
          v-for="num in row"
          :key="num"
          class="bet-item"
          :class="{ selected: isSelected(getPlayId(rank, num)) }"
          @click="handleToggle(getPlayId(rank, num), rankNames[rank] + '-' + num)"
        >
          <span class="bet-number" :class="'data-' + num"></span>
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
  display: inline-block;
  width: 30px;
  height: 30px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  margin-bottom: 4px;
}

/* PK10号码图片 */
.bet-number.data-1 { background-image: url('/images/ball/1.png'); }
.bet-number.data-2 { background-image: url('/images/ball/2.png'); }
.bet-number.data-3 { background-image: url('/images/ball/3.png'); }
.bet-number.data-4 { background-image: url('/images/ball/4.png'); }
.bet-number.data-5 { background-image: url('/images/ball/5.png'); }
.bet-number.data-6 { background-image: url('/images/ball/6.png'); }
.bet-number.data-7 { background-image: url('/images/ball/7.png'); }
.bet-number.data-8 { background-image: url('/images/ball/8.png'); }
.bet-number.data-9 { background-image: url('/images/ball/9.png'); }
.bet-number.data-10 { background-image: url('/images/ball/10.png'); }

.bet-odds {
  display: block;
  font-size: 12px;
  color: #f5a623;
}
</style>
