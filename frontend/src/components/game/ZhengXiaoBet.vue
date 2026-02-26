<template>
  <div class="zhengxiao-bet">
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

    <!-- 提示信息 -->
    <div class="tip-bar">
      选择生肖进行投注，该位置号码与生肖对应即中奖
    </div>

    <!-- 生肖网格 -->
    <div class="bet-section">
      <div class="zodiac-grid">
        <div
          v-for="zodiac in zodiacList"
          :key="zodiac.id"
          class="zodiac-box"
          :class="{ active: isSelected(getPlayId(zodiac.id)) }"
          @click="toggleBet(getPlayId(zodiac.id))"
        >
          <span class="zodiac-name">{{ zodiac.name }}</span>
          <span class="zodiac-numbers">{{ zodiac.numbers }}</span>
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

const posNames = ['正 1 肖', '正 2 肖', '正 3 肖', '正 4 肖', '正 5 肖', '正 6 肖']
const currentPos = ref(0)

// 生肖列表 (playId 基础：11393001-11393012，每个位置偏移 12)
const zodiacList = [
  { id: 1, name: '鼠', numbers: '08,20,32,44' },
  { id: 2, name: '牛', numbers: '07,19,31,43' },
  { id: 3, name: '虎', numbers: '06,18,30,42' },
  { id: 4, name: '兔', numbers: '05,17,29,41' },
  { id: 5, name: '龍', numbers: '04,16,28,40' },
  { id: 6, name: '蛇', numbers: '03,15,27,39' },
  { id: 7, name: '馬', numbers: '02,14,26,38' },
  { id: 8, name: '羊', numbers: '01,13,25,37,49' },
  { id: 9, name: '猴', numbers: '12,24,36,48' },
  { id: 10, name: '雞', numbers: '11,23,35,47' },
  { id: 11, name: '狗', numbers: '10,22,34,46' },
  { id: 12, name: '豬', numbers: '09,21,33,45' }
]

// 获取基础偏移量
const getBaseOffset = () => {
  return currentPos.value * 12
}

// 获取 playId
const getPlayId = (zodiacId: number) => {
  return 11393000 + zodiacId + getBaseOffset()
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds || 1.982
}
</script>

<style scoped>
.zhengxiao-bet {
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

.tip-bar {
  background: #fff3cd;
  color: #856404;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 13px;
  margin-bottom: 15px;
  border-left: 3px solid #ffc107;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.zodiac-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.zodiac-box:active {
  transform: scale(0.95);
}

.zodiac-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.zodiac-name {
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
}

.zodiac-numbers {
  font-size: 10px;
  color: #999;
  text-align: center;
}
</style>
