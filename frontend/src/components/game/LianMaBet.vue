<template>
  <div class="lianma-bet">
    <!-- 子玩法切换 -->
    <div class="sub-tabs">
      <div
        v-for="(sub, index) in subPlays"
        :key="sub.id"
        class="tab"
        :class="{ active: currentSubPlay === sub.id }"
        @click="selectSubPlay(sub.id)"
      >
        {{ sub.name }}
      </div>
    </div>

    <!-- 提示信息 -->
    <div class="tip-bar">
      {{ currentTip }}
    </div>

    <!-- 号码网格 -->
    <div class="bet-section">
      <div class="number-grid">
        <div
          v-for="num in 49"
          :key="num"
          class="bet-box"
          :class="[
            getNumberClass(num),
            { active: selectedBets.includes(num) }
          ]"
          @click="toggleNumber(num)"
        >
          <span class="number">{{ formatNumber(num) }}</span>
          <span class="zodiac">{{ getZodiac(num) }}</span>
        </div>
      </div>
    </div>

    <!-- 已选号码显示 -->
    <div class="selected-numbers" v-if="selectedBets.length > 0">
      <div class="selected-title">已选号码 ({{ selectedBets.length }}/{{ maxSelect }})</div>
      <div class="selected-list">
        <span
          v-for="num in selectedBets"
          :key="num"
          class="selected-tag"
          :class="getNumberClass(num)"
        >
          {{ formatNumber(num) }}
          <i @click.stop="toggleNumber(num)"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { t } from '@/locales'

const props = defineProps<{
  selectedBets: number[]
}>()

const emit = defineEmits<{
  (e: 'toggle-bet', playId: number): void
}>()

// 子玩法定义
const subPlays = [
  { id: 'szq', name: '三全中', min: 3, max: 10 },
  { id: 'sze', name: '三中二', min: 3, max: 7 },
  { id: 'eqz', name: '二全中', min: 2, max: 7 },
  { id: 'ezt', name: '二中特', min: 2, max: 7 },
  { id: 'tc', name: '特串', min: 2, max: 7 },
  { id: 'sqz', name: '四全中', min: 4, max: 4 }
]

const currentSubPlay = ref('szq')

// 当前选择的号码
const selectedBets = ref<number[]>([])

// 获取当前子玩法的配置
const currentConfig = computed(() => {
  return subPlays.find(p => p.id === currentSubPlay.value) || subPlays[0]
})

const minSelect = computed(() => currentConfig.value.min)
const maxSelect = computed(() => currentConfig.value.max)

// 提示信息
const currentTip = computed(() => {
  const config = currentConfig.value
  const tips: Record<string, string> = {
    'szq': `选择 ${config.min}-${config.max} 个号码，全部选中即中奖`,
    'sze': `选择 ${config.min}-${config.max} 个号码，选中 2 个或以上即中奖`,
    'eqz': `选择 ${config.min}-${config.max} 个号码，全部选中即中奖`,
    'ezt': `选择 ${config.min}-${config.max} 个号码，选中特码即中奖`,
    'tc': `选择 ${config.min}-${config.max} 个号码（1 个正码 +1 个特码）`,
    'sqz': `选择 ${config.min} 个号码，全部选中即中奖`
  }
  return tips[config.id] || ''
})

// 选择子玩法
const selectSubPlay = (id: string) => {
  // 切换子玩法时清空已选号码
  selectedBets.value = []
  currentSubPlay.value = id
}

// 切换号码选择
const toggleNumber = (num: number) => {
  const index = selectedBets.value.indexOf(num)
  if (index > -1) {
    // 取消选择
    selectedBets.value.splice(index, 1)
  } else {
    // 检查是否超出最大选择数
    if (selectedBets.value.length >= maxSelect.value) {
      alert(`最多选择 ${maxSelect.value} 个号码`)
      return
    }
    selectedBets.value.push(num)
  }
}

// 格式化号码为两位数
const formatNumber = (num: number) => {
  return num.toString().padStart(2, '0')
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

// 获取生肖
const getZodiac = (num: number) => {
  const zodiacMap: Record<number, string> = {
    1: '羊', 13: '羊', 25: '羊', 37: '羊', 49: '羊',
    12: '猴', 24: '猴', 36: '猴', 48: '猴',
    11: '雞', 23: '雞', 35: '雞', 47: '雞',
    10: '狗', 22: '狗', 34: '狗', 46: '狗',
    9: '豬', 21: '豬', 33: '豬', 45: '豬',
    8: '鼠', 20: '鼠', 32: '鼠', 44: '鼠',
    7: '牛', 19: '牛', 31: '牛', 43: '牛',
    6: '虎', 18: '虎', 30: '虎', 42: '虎',
    5: '兔', 17: '兔', 29: '兔', 41: '兔',
    4: '龍', 16: '龍', 28: '龍', 40: '龍',
    3: '蛇', 15: '蛇', 27: '蛇', 39: '蛇',
    2: '馬', 14: '馬', 26: '馬', 38: '馬'
  }
  return zodiacMap[num] || ''
}

// 监听 selectedBets 变化，通知父组件
watch(selectedBets, (newVal) => {
  // 连码玩法的 playId 发送逻辑较为复杂，这里仅传递选中的号码
  // 实际的 playId 计算由父组件根据子玩法和号码组合来决定
  // 这里我们发送一个特殊标记，父组件需要自行处理
  if (newVal.length > 0) {
    // 对于简化的前端实现，我们直接发送第一个号码作为标记
    // 实际后端需要接收组合投注数据
    emit('toggle-bet', -1) // -1 表示需要特殊处理的连码投注
  }
}, { deep: true })
</script>

<style scoped>
.lianma-bet {
  padding: 15px;
  background: #f5f5f5;
}

.sub-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.sub-tabs .tab {
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.sub-tabs .tab.active {
  background: #fb2351;
  color: #fff;
  border-color: #fb2351;
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
  margin-bottom: 10px;
}

.number-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 6px;
}

.bet-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 4px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.bet-box:active {
  transform: scale(0.95);
}

.bet-box.active {
  border-color: #fb2351;
  background: #fff5f5;
}

.bet-box.active::after {
  content: '✓';
  position: absolute;
  top: 2px;
  right: 2px;
  width: 16px;
  height: 16px;
  background: #fb2351;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
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
  margin-bottom: 2px;
}

.zodiac {
  font-size: 10px;
  color: #666;
}

.selected-numbers {
  background: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-top: 10px;
}

.selected-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #333;
  cursor: pointer;
}

.selected-tag.red {
  background: linear-gradient(135deg, #ffe0e0, #ffc0c0);
}

.selected-tag.blue {
  background: linear-gradient(135deg, #e0e0ff, #c0c0ff);
}

.selected-tag.green {
  background: linear-gradient(135deg, #e0ffe0, #c0ffc0);
}

.selected-tag i {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: #999;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpath d='M18 6L6 18M6 6l12 12'/%3E%3C/svg%3E") no-repeat center;
}

.selected-tag i:hover {
  background: #fb2351;
}
</style>
