<template>
  <div class="wuxing-bet">
    <!-- 五行选项 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.wuXing') }}</div>
      <div class="bet-row">
        <div
          class="bet-box wu-xing-jin"
          :class="{ active: isSelected(getPlayId(1)) }"
          @click="toggleBet(getPlayId(1))"
        >
          <span class="element-name">金</span>
          <span class="element-numbers">03,04,11,12,19,20,27,28,35,36,43,44</span>
          <span class="odds">{{ getOdds(getPlayId(1)) }}</span>
        </div>
        <div
          class="bet-box wu-xing-mu"
          :class="{ active: isSelected(getPlayId(2)) }"
          @click="toggleBet(getPlayId(2))"
        >
          <span class="element-name">木</span>
          <span class="element-numbers">07,08,15,16,23,24,31,32,39,40,47,48</span>
          <span class="odds">{{ getOdds(getPlayId(2)) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-box wu-xing-shui"
          :class="{ active: isSelected(getPlayId(3)) }"
          @click="toggleBet(getPlayId(3))"
        >
          <span class="element-name">水</span>
          <span class="element-numbers">01,02,09,10,17,18,25,26,33,34,41,42,49</span>
          <span class="odds">{{ getOdds(getPlayId(3)) }}</span>
        </div>
        <div
          class="bet-box wu-xing-huo"
          :class="{ active: isSelected(getPlayId(4)) }"
          @click="toggleBet(getPlayId(4))"
        >
          <span class="element-name">火</span>
          <span class="element-numbers">05,06,13,14,21,22,29,30,37,38,45,46</span>
          <span class="odds">{{ getOdds(getPlayId(4)) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-box wu-xing-tu"
          :class="{ active: isSelected(getPlayId(5)) }"
          @click="toggleBet(getPlayId(5))"
        >
          <span class="element-name">土</span>
          <span class="element-numbers">11,12,19,20,27,28,35,36,43,44</span>
          <span class="odds">{{ getOdds(getPlayId(5)) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'
import { type PlayInfo } from '@/api/game'

const props = defineProps<{
  playsData: Record<string, PlayInfo>
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// 五行 playId: 11394001-11394005
const getPlayId = (elementId: number) => {
  return 11394000 + elementId
}

const isSelected = (playId: number) => {
  return props.selectedBets.includes(playId)
}

const toggleBet = (playId: number) => {
  emit('toggle-bet', playId)
}

const getOdds = (playId: number) => {
  const play = props.playsData[playId.toString()]
  return play?.odds?.toFixed(3) || '1.982'
}
</script>

<style scoped>
.wuxing-bet {
  padding: 15px;
  background: #f5f5f5;
}

.bet-section {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  padding-left: 8px;
  border-left: 3px solid #fb2351;
}

.bet-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.bet-row:last-child {
  margin-bottom: 0;
}

.bet-row .bet-box {
  flex: 1;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 10px;
  background: #f9f9f9;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.wu-xing-jin.active {
  background: linear-gradient(135deg, #fff9e6, #fff0cc);
}

.wu-xing-mu.active {
  background: linear-gradient(135deg, #e6ffe6, #ccffcc);
}

.wu-xing-shui.active {
  background: linear-gradient(135deg, #e6f0ff, #ccddff);
}

.wu-xing-huo.active {
  background: linear-gradient(135deg, #ffe6e6, #ffcccc);
}

.wu-xing-tu.active {
  background: linear-gradient(135deg, #fff5e6, #ffe6cc);
}

.element-name {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.element-numbers {
  font-size: 10px;
  color: #999;
  text-align: center;
  margin-bottom: 6px;
}

.odds {
  font-size: 13px;
  color: #fb2351;
  font-weight: 600;
}
</style>
