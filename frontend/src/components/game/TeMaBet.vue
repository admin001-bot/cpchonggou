<template>
  <div class="tema-bet">
    <!-- 特码 A/B 切换 -->
    <div class="sub-tabs">
      <div
        class="tab"
        :class="{ active: subType === 'A' }"
        @click="subType = 'A'"
      >{{ t('lhc.teMaA') }}</div>
      <div
        class="tab"
        :class="{ active: subType === 'B' }"
        @click="subType = 'B'"
      >{{ t('lhc.teMaB') }}</div>
    </div>

    <!-- 号码网格 -->
    <div class="number-grid">
      <div
        v-for="num in 49"
        :key="num"
        class="bet-box"
        :class="[
          getNumberClass(num),
          { active: isSelected(getPlayId(num)) }
        ]"
        @click="toggleBet(getPlayId(num))"
      >
        <span class="number">{{ num }}</span>
        <span class="odds">{{ getOdds(getPlayId(num)) }}</span>
      </div>
    </div>

    <!-- 两面 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.liangMian') }}</div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138601) }" @click="toggleBet(1138601)">
          <span>{{ t('lhc.teDa') }}</span>
          <span class="odds">{{ getOdds(1138601) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138602) }" @click="toggleBet(1138602)">
          <span>{{ t('lhc.teXiao') }}</span>
          <span class="odds">{{ getOdds(1138602) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138603) }" @click="toggleBet(1138603)">
          <span>{{ t('lhc.teDan') }}</span>
          <span class="odds">{{ getOdds(1138603) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138604) }" @click="toggleBet(1138604)">
          <span>{{ t('lhc.teShuang') }}</span>
          <span class="odds">{{ getOdds(1138604) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138605) }" @click="toggleBet(1138605)">
          <span>{{ t('lhc.teHeDa') }}</span>
          <span class="odds">{{ getOdds(1138605) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138606) }" @click="toggleBet(1138606)">
          <span>{{ t('lhc.teHeXiao') }}</span>
          <span class="odds">{{ getOdds(1138606) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138607) }" @click="toggleBet(1138607)">
          <span>{{ t('lhc.teHeDan') }}</span>
          <span class="odds">{{ getOdds(1138607) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138608) }" @click="toggleBet(1138608)">
          <span>{{ t('lhc.teHeShuang') }}</span>
          <span class="odds">{{ getOdds(1138608) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138609) }" @click="toggleBet(1138609)">
          <span>{{ t('lhc.teWeiDa') }}</span>
          <span class="odds">{{ getOdds(1138609) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138610) }" @click="toggleBet(1138610)">
          <span>{{ t('lhc.teWeiXiao') }}</span>
          <span class="odds">{{ getOdds(1138610) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138611) }" @click="toggleBet(1138611)">
          <span>{{ t('lhc.teDaDan') }}</span>
          <span class="odds">{{ getOdds(1138611) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138612) }" @click="toggleBet(1138612)">
          <span>{{ t('lhc.teDaShuang') }}</span>
          <span class="odds">{{ getOdds(1138612) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138613) }" @click="toggleBet(1138613)">
          <span>{{ t('lhc.teXiaoDan') }}</span>
          <span class="odds">{{ getOdds(1138613) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138614) }" @click="toggleBet(1138614)">
          <span>{{ t('lhc.teXiaoShuang') }}</span>
          <span class="odds">{{ getOdds(1138614) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138621) }" @click="toggleBet(1138621)">
          <span>{{ t('lhc.totalSingle') }}</span>
          <span class="odds">{{ getOdds(1138621) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138622) }" @click="toggleBet(1138622)">
          <span>{{ t('lhc.totalDouble') }}</span>
          <span class="odds">{{ getOdds(1138622) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box" :class="{ active: isSelected(1138623) }" @click="toggleBet(1138623)">
          <span>{{ t('lhc.totalBig') }}</span>
          <span class="odds">{{ getOdds(1138623) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1138624) }" @click="toggleBet(1138624)">
          <span>{{ t('lhc.totalSmall') }}</span>
          <span class="odds">{{ getOdds(1138624) }}</span>
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

const subType = ref<'A' | 'B'>('A')

// playId: A=1138501-1138549, B=1138550-1138598
const getPlayId = (num: number) => {
  const base = subType.value === 'A' ? 1138500 : 1138550
  return base + num
}

// 根据号码获取颜色样式
const getNumberClass = (num: number) => {
  const redWave = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
  const blueWave = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
  const greenWave = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

  if (redWave.includes(num)) return 'red'
  if (blueWave.includes(num)) return 'blue'
  if (greenWave.includes(num)) return 'green'
  return ''
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
.tema-bet {
  padding: 15px;
}

.sub-tabs {
  display: flex;
  margin-bottom: 15px;
  border-radius: 8px;
  overflow: hidden;
}

.sub-tabs .tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  background: #f5f5f5;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tabs .tab.active {
  background: #fb2351;
  color: #fff;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  margin-bottom: 20px;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 5px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
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

.bet-box.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.bet-box.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.bet-box.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 11px;
  color: #fb2351;
  font-weight: 600;
}

.bet-section {
  margin-bottom: 20px;
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

.bet-row .bet-box {
  flex: 1;
}
</style>
