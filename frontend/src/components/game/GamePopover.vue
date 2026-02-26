<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="visible" class="popover-overlay" @click="$emit('close')">
        <Transition name="slide">
          <div v-if="visible" class="popover-content" @click.stop>
            <div class="popover-header">
              <span>{{ t('game.menu') }}</span>
              <span class="close-btn" @click="$emit('close')">&times;</span>
            </div>
            <div class="popover-body">
              <div class="menu-item" @click="goTo('notcount')">
                <span class="menu-text">{{ t('game.pendingBets') }}</span>
                <span class="menu-value" v-if="loading">
                  <span class="loading-spinner"></span>
                </span>
                <span class="menu-value orange" v-else>({{ formatMoney(lotteryData.unbalancedMoney) }})</span>
              </div>
              <div class="menu-item" @click="goTo('settled')">
                <span class="menu-text">{{ t('game.settledToday') }}</span>
              </div>
              <div class="menu-item" @click="goTo('week')">
                <span class="menu-text">{{ t('game.betRecord') }}</span>
              </div>
              <div class="menu-item" @click="goTo('history')">
                <span class="menu-text">{{ t('game.lotteryResult') }}</span>
              </div>
              <div class="menu-item" @click="goTo('rule')">
                <span class="menu-text">{{ t('game.rules') }}</span>
              </div>
              <div class="menu-item gray" @click="goTo('settled')">
                <span class="menu-text blue">{{ t('game.todayWinLoss') }}</span>
                <span class="menu-value" v-if="loading">
                  <span class="loading-spinner"></span>
                </span>
                <span class="menu-value orange" v-else>({{ formatMoney(lotteryData.totalTotalMoney) }})</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { betApi } from '@/api/game'
import { t } from '@/locales'

interface Props {
  visible: boolean
  gameId: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const router = useRouter()
const loading = ref(false)
const lotteryData = ref({
  balance: 0,
  unbalancedMoney: 0,
  totalTotalMoney: 0
})

// 监听显示状态，加载数据
watch(() => props.visible, (newVal) => {
  if (newVal) {
    loadLotteryData()
  }
})

// 加载游戏数据
async function loadLotteryData() {
  const token = localStorage.getItem('token')
  if (!token) {
    // 未登录，显示为0
    lotteryData.value = {
      balance: 0,
      unbalancedMoney: 0,
      totalTotalMoney: 0
    }
    return
  }

  loading.value = true
  try {
    const res = await betApi.getLotteryData(props.gameId)
    if (res.code === 0 && res.data) {
      lotteryData.value = res.data
      console.log('lotteryData:', lotteryData.value)
    }
  } catch (e) {
    console.error('加载游戏数据失败', e)
    // 加载失败时显示为0
    lotteryData.value = {
      balance: 0,
      unbalancedMoney: 0,
      totalTotalMoney: 0
    }
  } finally {
    loading.value = false
  }
}

// 格式化金额
function formatMoney(money: number): string {
  if (money >= 0) {
    return money.toFixed(2)
  }
  return money.toFixed(2)
}

// 跳转页面
function goTo(page: string) {
  emit('close')
  switch (page) {
    case 'notcount':
      router.push({ name: 'NotCount' })
      break
    case 'settled':
      router.push({ name: 'Settled' })
      break
    case 'week':
      router.push({ name: 'WeekRecord' })
      break
    case 'history':
      router.push({ name: 'GameHistory', params: { gameId: props.gameId } })
      break
    case 'rule':
      // TODO: 显示游戏规则弹窗
      break
  }
}
</script>

<style scoped>
.popover-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}

.popover-content {
  position: absolute;
  top: 50px;
  right: 10px;
  width: 200px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: #f5f5f5;
  border-bottom: 1px solid #eee;
  font-size: 14px;
  color: #333;
}

.close-btn {
  font-size: 20px;
  color: #999;
  cursor: pointer;
}

.popover-body {
  padding: 0;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: #f5f5f5;
}

.menu-item.gray {
  background: #fafafa;
}

.menu-text {
  font-size: 14px;
  color: #333;
}

.menu-text.blue {
  color: #2196f3;
}

.menu-value {
  font-size: 13px;
  color: #999;
}

.menu-value.orange {
  color: #ff9800;
}

.loading-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #f0f0f0;
  border-top-color: #ff9800;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
