<template>
  <div class="bet-view">
    <!-- 特码两面 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.specialCode') }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138601) }"
          @click="handleToggle(1138601)"
        >
          <span class="bet-content">{{ t('lhc.teDa') }}</span>
          <span class="bet-odds">{{ getOdds(1138601).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138602) }"
          @click="handleToggle(1138602)"
        >
          <span class="bet-content">{{ t('lhc.teXiao') }}</span>
          <span class="bet-odds">{{ getOdds(1138602).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138603) }"
          @click="handleToggle(1138603)"
        >
          <span class="bet-content">{{ t('lhc.teDan') }}</span>
          <span class="bet-odds">{{ getOdds(1138603).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138604) }"
          @click="handleToggle(1138604)"
        >
          <span class="bet-content">{{ t('lhc.teShuang') }}</span>
          <span class="bet-odds">{{ getOdds(1138604).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138605) }"
          @click="handleToggle(1138605)"
        >
          <span class="bet-content">{{ t('lhc.teHeDa') }}</span>
          <span class="bet-odds">{{ getOdds(1138605).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138606) }"
          @click="handleToggle(1138606)"
        >
          <span class="bet-content">{{ t('lhc.teHeXiao') }}</span>
          <span class="bet-odds">{{ getOdds(1138606).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138607) }"
          @click="handleToggle(1138607)"
        >
          <span class="bet-content">{{ t('lhc.teHeDan') }}</span>
          <span class="bet-odds">{{ getOdds(1138607).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138608) }"
          @click="handleToggle(1138608)"
        >
          <span class="bet-content">{{ t('lhc.teHeShuang') }}</span>
          <span class="bet-odds">{{ getOdds(1138608).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138609) }"
          @click="handleToggle(1138609)"
        >
          <span class="bet-content">{{ t('lhc.teWeiDa') }}</span>
          <span class="bet-odds">{{ getOdds(1138609).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138610) }"
          @click="handleToggle(1138610)"
        >
          <span class="bet-content">{{ t('lhc.teWeiXiao') }}</span>
          <span class="bet-odds">{{ getOdds(1138610).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138611) }"
          @click="handleToggle(1138611)"
        >
          <span class="bet-content">{{ t('lhc.teDaDan') }}</span>
          <span class="bet-odds">{{ getOdds(1138611).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138612) }"
          @click="handleToggle(1138612)"
        >
          <span class="bet-content">{{ t('lhc.teDaShuang') }}</span>
          <span class="bet-odds">{{ getOdds(1138612).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138613) }"
          @click="handleToggle(1138613)"
        >
          <span class="bet-content">{{ t('lhc.teXiaoDan') }}</span>
          <span class="bet-odds">{{ getOdds(1138613).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138614) }"
          @click="handleToggle(1138614)"
        >
          <span class="bet-content">{{ t('lhc.teXiaoShuang') }}</span>
          <span class="bet-odds">{{ getOdds(1138614).toFixed(3) }}</span>
        </div>
      </div>
    </div>

    <!-- 总和两面 -->
    <div class="bet-section">
      <div class="section-title">{{ t('lhc.totalBig') }}</div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138623) }"
          @click="handleToggle(1138623)"
        >
          <span class="bet-content">{{ t('lhc.totalBig') }}</span>
          <span class="bet-odds">{{ getOdds(1138623).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138624) }"
          @click="handleToggle(1138624)"
        >
          <span class="bet-content">{{ t('lhc.totalSmall') }}</span>
          <span class="bet-odds">{{ getOdds(1138624).toFixed(3) }}</span>
        </div>
      </div>
      <div class="bet-row">
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138621) }"
          @click="handleToggle(1138621)"
        >
          <span class="bet-content">{{ t('lhc.totalSingle') }}</span>
          <span class="bet-odds">{{ getOdds(1138621).toFixed(3) }}</span>
        </div>
        <div
          class="bet-item"
          :class="{ selected: isSelected(1138622) }"
          @click="handleToggle(1138622)"
        >
          <span class="bet-content">{{ t('lhc.totalDouble') }}</span>
          <span class="bet-odds">{{ getOdds(1138622).toFixed(3) }}</span>
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
  gameGroup?: string
  betData: Record<string, number[]>
  playsData: Record<string, PlayInfo>
  getOdds: (playId: number) => number
}

const props = withDefaults(defineProps<Props>(), {
  gameGroup: 'group7'
})

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number, paneCode?: string): void
}>()

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
