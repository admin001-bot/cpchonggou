<template>
  <div class="sebo-bet">
    <!-- 七色波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.qiSeBo') }}</div>
      <div class="bet-row four-col">
        <div class="bet-box red" :class="{ active: isSelected(1139601) }" @click="toggleBet(1139601)">
          <span>{{ t('lhc.redWave') }}</span>
          <span class="odds">{{ getOdds(1139601) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1139602) }" @click="toggleBet(1139602)">
          <span>{{ t('lhc.blueWave') }}</span>
          <span class="odds">{{ getOdds(1139602) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1139603) }" @click="toggleBet(1139603)">
          <span>{{ t('lhc.greenWave') }}</span>
          <span class="odds">{{ getOdds(1139603) }}</span>
        </div>
        <div class="bet-box" :class="{ active: isSelected(1139604) }" @click="toggleBet(1139604)">
          <span>{{ t('lhc.draw') }}</span>
          <span class="odds">{{ getOdds(1139604) }}</span>
        </div>
      </div>
    </div>

    <!-- 红球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.redBall') }}</div>
      <div class="bet-row">
        <div class="bet-box red" :class="{ active: isSelected(1138704) }" @click="toggleBet(1138704)">
          <span>{{ t('lhc.redOdd') }}</span>
          <span class="odds">{{ getOdds(1138704) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138705) }" @click="toggleBet(1138705)">
          <span>{{ t('lhc.redEven') }}</span>
          <span class="odds">{{ getOdds(1138705) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138706) }" @click="toggleBet(1138706)">
          <span>{{ t('lhc.redBig') }}</span>
          <span class="odds">{{ getOdds(1138706) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138707) }" @click="toggleBet(1138707)">
          <span>{{ t('lhc.redSmall') }}</span>
          <span class="odds">{{ getOdds(1138707) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box red" :class="{ active: isSelected(1138716) }" @click="toggleBet(1138716)">
          <span>{{ t('lhc.redBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138716) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138717) }" @click="toggleBet(1138717)">
          <span>{{ t('lhc.redBigEven') }}</span>
          <span class="odds">{{ getOdds(1138717) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138718) }" @click="toggleBet(1138718)">
          <span>{{ t('lhc.redSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138718) }}</span>
        </div>
        <div class="bet-box red" :class="{ active: isSelected(1138719) }" @click="toggleBet(1138719)">
          <span>{{ t('lhc.redSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138719) }}</span>
        </div>
      </div>
    </div>

    <!-- 蓝球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.blueBall') }}</div>
      <div class="bet-row">
        <div class="bet-box blue" :class="{ active: isSelected(1138708) }" @click="toggleBet(1138708)">
          <span>{{ t('lhc.blueOdd') }}</span>
          <span class="odds">{{ getOdds(1138708) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138709) }" @click="toggleBet(1138709)">
          <span>{{ t('lhc.blueEven') }}</span>
          <span class="odds">{{ getOdds(1138709) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138710) }" @click="toggleBet(1138710)">
          <span>{{ t('lhc.blueBig') }}</span>
          <span class="odds">{{ getOdds(1138710) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138711) }" @click="toggleBet(1138711)">
          <span>{{ t('lhc.blueSmall') }}</span>
          <span class="odds">{{ getOdds(1138711) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box blue" :class="{ active: isSelected(1138720) }" @click="toggleBet(1138720)">
          <span>{{ t('lhc.blueBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138720) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138721) }" @click="toggleBet(1138721)">
          <span>{{ t('lhc.blueBigEven') }}</span>
          <span class="odds">{{ getOdds(1138721) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138722) }" @click="toggleBet(1138722)">
          <span>{{ t('lhc.blueSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138722) }}</span>
        </div>
        <div class="bet-box blue" :class="{ active: isSelected(1138723) }" @click="toggleBet(1138723)">
          <span>{{ t('lhc.blueSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138723) }}</span>
        </div>
      </div>
    </div>

    <!-- 绿球半波 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.greenBall') }}</div>
      <div class="bet-row">
        <div class="bet-box green" :class="{ active: isSelected(1138712) }" @click="toggleBet(1138712)">
          <span>{{ t('lhc.greenOdd') }}</span>
          <span class="odds">{{ getOdds(1138712) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138713) }" @click="toggleBet(1138713)">
          <span>{{ t('lhc.greenEven') }}</span>
          <span class="odds">{{ getOdds(1138713) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138714) }" @click="toggleBet(1138714)">
          <span>{{ t('lhc.greenBig') }}</span>
          <span class="odds">{{ getOdds(1138714) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138715) }" @click="toggleBet(1138715)">
          <span>{{ t('lhc.greenSmall') }}</span>
          <span class="odds">{{ getOdds(1138715) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div class="bet-box green" :class="{ active: isSelected(1138724) }" @click="toggleBet(1138724)">
          <span>{{ t('lhc.greenBigOdd') }}</span>
          <span class="odds">{{ getOdds(1138724) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138725) }" @click="toggleBet(1138725)">
          <span>{{ t('lhc.greenBigEven') }}</span>
          <span class="odds">{{ getOdds(1138725) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138726) }" @click="toggleBet(1138726)">
          <span>{{ t('lhc.greenSmallOdd') }}</span>
          <span class="odds">{{ getOdds(1138726) }}</span>
        </div>
        <div class="bet-box green" :class="{ active: isSelected(1138727) }" @click="toggleBet(1138727)">
          <span>{{ t('lhc.greenSmallEven') }}</span>
          <span class="odds">{{ getOdds(1138727) }}</span>
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
.sebo-bet {
  padding: 15px;
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

.bet-row.four-col .bet-box {
  flex: 1;
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

.bet-box span:first-child {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.odds {
  font-size: 11px;
  color: #fb2351;
  font-weight: 600;
}
</style>
