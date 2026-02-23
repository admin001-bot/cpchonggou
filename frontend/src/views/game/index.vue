<template>
  <div class="lottery-page">
    <!-- 顶部导航栏 -->
    <header class="lottery-header">
      <div class="header-left">
        <a href="/home" class="back-btn">
          <span class="game-name">{{ gameName }}-{{ t('common.home') }}</span>
        </a>
      </div>
      <div class="header-right">
        <span class="member-balance">USDT:{{ userBalance }}</span>
        <a class="refresh-btn" @click="refreshBalance">
          <img src="/images/icon-refresh.png" alt="refresh" />
        </a>
        <button class="menu-btn" @click="toggleSidebar">
          <span class="menu-icon"></span>
        </button>
      </div>
    </header>

    <!-- 侧边菜单 -->
    <transition name="slide">
      <div v-if="sidebarVisible" class="sidebar-overlay" @click="closeSidebar">
        <div class="sidebar-menu" @click.stop>
          <div class="sidebar-header">
            <h3>{{ t('game.systemMenu') }}</h3>
          </div>
          <ul class="sidebar-list">
            <li><a href="/home">{{ t('game.returnLobby') }}</a></li>
            <li v-for="game in gameList" :key="game.id">
              <a :href="'/game/' + game.id">{{ game.name }}</a>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- 主内容区 -->
    <div class="lottery-content">
      <!-- 期号显示区域 -->
      <div class="period-section">
        <div class="period-info">
          <div class="current-period">
            <span class="period-label">{{ t('game.currentPeriod') }}</span>
            <span class="period-number">{{ currentPeriod }}</span>
            <span class="period-suffix">{{ t('game.period') }}</span>
          </div>
          <div class="countdown">
            <span class="countdown-label">{{ t('game.closeTime') }}</span>
            <span class="countdown-time">{{ formatCountdown }}</span>
          </div>
        </div>
        <!-- 开奖号码显示 -->
        <div class="lottery-numbers" v-if="lastNumbers.length > 0">
          <span
            v-for="(num, index) in lastNumbers"
            :key="index"
            class="lottery-ball round-6"
            :class="'data-' + num"
          >{{ num }}</span>
        </div>
        <!-- 开奖结果计算显示 -->
        <div class="result-wrap" v-if="lotteryResults.length > 0">
          <span
            v-for="(result, index) in lotteryResults"
            :key="index"
            class="result-data"
          >{{ result }}</span>
        </div>
      </div>

      <!-- 玩法菜单 -->
      <div class="play-tabs">
        <div class="tabs-scroll">
          <div
            v-for="pane in panes"
            :key="pane.code"
            class="tab-item"
            :class="{ active: currentPane?.code === pane.code }"
            @click="selectPane(pane)"
          >
            {{ pane.name }}
            <span v-if="getBetCount(pane.code) > 0" class="tab-badge"></span>
          </div>
        </div>
      </div>

      <!-- 投注面板 -->
      <div class="bet-panel">
        <!-- 两面玩法 -->
        <template v-if="currentPane?.code === 'LM'">
          <LiangMianBet
            :game-id="gameId"
            :bet-data="betData"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 冠亚和玩法 -->
        <template v-else-if="currentPane?.code === 'HE'">
          <GuanYaHeBet
            :game-id="gameId"
            :bet-data="betData"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 1-5名玩法 -->
        <template v-else-if="currentPane?.code === '1-5'">
          <RankBet
            :game-id="gameId"
            :bet-data="betData"
            :ranks="[1, 2, 3, 4, 5]"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 6-10名玩法 -->
        <template v-else-if="currentPane?.code === '6-10'">
          <RankBet
            :game-id="gameId"
            :bet-data="betData"
            :ranks="[6, 7, 8, 9, 10]"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 默认投注面板 -->
        <template v-else>
          <div class="bet-view">
            <div class="coming-soon">{{ t('game.comingSoon') }}</div>
          </div>
        </template>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <footer class="lottery-footer">
      <!-- 封盘状态遮罩 -->
      <div v-if="lotteryState === 0" class="close-overlay">
        <div class="close-tip">{{ t('game.closed') }}</div>
      </div>
      <div v-if="lotteryState === -1" class="close-overlay">
        <div class="close-tip">{{ t('game.notOpen') }}</div>
      </div>

      <!-- 筹码选择 -->
      <div class="chips-wrap" v-if="showChips">
        <span class="chip-item" @click="addAmount(10)">10</span>
        <span class="chip-item" @click="addAmount(100)">100</span>
        <span class="chip-item" @click="addAmount(1000)">1000</span>
        <span class="chip-item" @click="addAmount(10000)">10000</span>
        <span class="chip-item clear" @click="clearAmount">C</span>
      </div>

      <div class="footer-row">
        <div class="bet-input-section">
          <div class="bet-count">
            {{ t('game.selectedBets') }}<span class="text-yellow">{{ totalBetCount }}</span>{{ t('game.betsUnit') }}
          </div>
          <div class="input-wrap">
            <input
              type="tel"
              v-model="betAmount"
              class="amount-input"
              :placeholder="t('game.enterAmount')"
            />
          </div>
        </div>
        <div class="bet-buttons">
          <button class="btn btn-bet" @click="placeBet">{{ t('game.bet') }}</button>
          <button class="btn btn-reset" @click="resetBets">{{ t('game.reset') }}</button>
        </div>
      </div>
    </footer>

    <!-- 下注确认弹窗 -->
    <transition name="fade">
      <div v-if="showConfirmModal" class="modal-overlay" @click="closeConfirmModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ t('game.betList') }}</h3>
          </div>
          <div class="modal-body">
            <div class="bet-list">
              <div v-for="(item, index) in confirmBetList" :key="index" class="bet-item">
                <span class="bet-name">{{ item.name }}</span>
                <span class="bet-odds">@{{ item.odds }}</span>
                <span class="bet-amount">x {{ betAmount }}</span>
              </div>
            </div>
            <div class="bet-summary">
              <span>{{ t('game.totalBets') }}: <em>{{ totalBetCount }}</em></span>
              <span>{{ t('game.totalAmount') }}: <em>{{ totalBetCount * (parseInt(betAmount) || 0) }}</em></span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-cancel" @click="closeConfirmModal">{{ t('game.cancel') }}</button>
            <button class="btn btn-confirm" @click="confirmBet">{{ t('game.confirm') }}</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/locales'
import { getGameConfig, getGamePanes, getGameList, type GroupPane } from '@/config/games'
import { gameApi, type NextIssueData } from '@/api/game'
import LiangMianBet from '@/components/game/LiangMianBet.vue'
import GuanYaHeBet from '@/components/game/GuanYaHeBet.vue'
import RankBet from '@/components/game/RankBet.vue'

const route = useRoute()
const userStore = useUserStore()

// 游戏ID
const gameId = computed(() => parseInt(route.params.id as string) || 55)

// 游戏配置
const gameConfig = computed(() => getGameConfig(gameId.value))
const gameName = computed(() => gameConfig.value?.name || t(`game.${gameId.value}`) || '遊戲')
const panes = computed(() => getGamePanes(gameId.value))

// 游戏列表
const gameList = computed(() => getGameList().slice(0, 8))

// 用户余额
const userBalance = computed(() => userStore.userInfo?.balance?.toFixed(2) || '0.00')

// 侧边栏
const sidebarVisible = ref(false)

// 当前玩法
const currentPane = ref<GroupPane | null>(null)

// 投注数据
const betData = ref<Record<string, number[]>>({})

// 投注金额
const betAmount = ref<string>('')

// 显示筹码
const showChips = ref(false)

// 期号相关
const currentPeriod = ref('')
const prePeriod = ref('')
const countdown = ref(0)
const lastNumbers = ref<number[]>([])
const lotteryState = ref(1)

// 确认弹窗
const showConfirmModal = ref(false)
const confirmBetList = ref<Array<{ name: string; odds: number; playId: number }>>([])

// 计时器
let countdownTimer: number | null = null
let refreshTimer: number | null = null

// 格式化倒计时
const formatCountdown = computed(() => {
  const seconds = Math.max(0, countdown.value)
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
})

// 总注数
const totalBetCount = computed(() => {
  let count = 0
  for (const key in betData.value) {
    count += betData.value[key].length
  }
  return count
})

// 开奖结果计算（PK10游戏）
const lotteryResults = computed(() => {
  const nums = lastNumbers.value
  if (!nums || nums.length < 10) return []

  const results: (number | string)[] = []

  // 冠亚和
  const sum = nums[0] + nums[1]
  results.push(sum)

  // 冠亚大小
  results.push(sum > 11 ? '大' : '小')

  // 冠亚单双
  results.push(sum % 2 === 1 ? '單' : '雙')

  // 龙虎：1vs10, 2vs9, 3vs8, 4vs7, 5vs6
  results.push(nums[0] > nums[9] ? '龍' : '虎')
  results.push(nums[1] > nums[8] ? '龍' : '虎')
  results.push(nums[2] > nums[7] ? '龍' : '虎')
  results.push(nums[3] > nums[6] ? '龍' : '虎')
  results.push(nums[4] > nums[5] ? '龍' : '虎')

  return results
})

// 获取某玩法的注数
function getBetCount(paneCode: string): number {
  return betData.value[paneCode]?.length || 0
}

// 切换侧边栏
function toggleSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

function closeSidebar() {
  sidebarVisible.value = false
}

// 选择玩法
function selectPane(pane: GroupPane) {
  if (currentPane.value?.multiple === false || pane.multiple === false) {
    resetBets()
  }
  currentPane.value = pane
}

// 切换投注
function toggleBet(playId: number, paneCode?: string) {
  const code = paneCode || currentPane.value?.code
  if (!code) return

  const list = betData.value[code] || []
  const index = list.indexOf(playId)

  if (index > -1) {
    list.splice(index, 1)
  } else {
    list.push(playId)
  }

  betData.value[code] = [...list]
}

// 添加金额
function addAmount(amount: number) {
  const current = parseInt(betAmount.value) || 0
  betAmount.value = String(current + amount)
}

// 清除金额
function clearAmount() {
  betAmount.value = ''
}

// 刷新余额
function refreshBalance() {
  alert('刷新餘額功能開發中')
}

// 下注
function placeBet() {
  if (lotteryState.value !== 1) {
    alert(t('game.closed'))
    return
  }

  if (!betAmount.value || parseInt(betAmount.value) <= 0) {
    alert(t('game.enterAmount'))
    return
  }

  if (totalBetCount.value === 0) {
    alert(t('game.selectPlay'))
    return
  }

  confirmBetList.value = []
  for (const paneCode in betData.value) {
    const playIds = betData.value[paneCode]
    for (const playId of playIds) {
      confirmBetList.value.push({
        name: `玩法${playId}`,
        odds: 9.85,
        playId
      })
    }
  }

  showConfirmModal.value = true
}

// 关闭确认弹窗
function closeConfirmModal() {
  showConfirmModal.value = false
}

// 确认下注
async function confirmBet() {
  try {
    const result = await gameApi.placeBet({
      gameId: gameId.value,
      issue: currentPeriod.value,
      betData: betData.value,
      totalNum: totalBetCount.value,
      totalMoney: totalBetCount.value * (parseInt(betAmount.value) || 0)
    })
    if (result.code === 0) {
      alert('下注成功！')
      showConfirmModal.value = false
      resetBets()
    } else {
      alert(result.message || '下注失敗')
    }
  } catch (error) {
    alert('下注失敗，請重試')
  }
}

// 重置投注
function resetBets() {
  betData.value = {}
  betAmount.value = ''
}

// 解析时间字符串为时间戳
function parseTime(timeStr: string): number {
  return new Date(timeStr).getTime() / 1000
}

// 获取期号数据
async function fetchIssueData() {
  try {
    const result = await gameApi.getNextIssue(gameId.value)
    if (result.code === 0 && result.data) {
      const data: NextIssueData = result.data

      currentPeriod.value = data.issue
      prePeriod.value = data.preIssue

      // 解析时间并计算倒计时
      const serverTime = parseTime(data.serverTime)
      const endTime = parseTime(data.endtime)
      const lotteryTime = parseTime(data.lotteryTime)

      const endDiff = endTime - serverTime
      const lotteryDiff = lotteryTime - serverTime

      countdown.value = Math.max(0, Math.floor(endDiff))

      // 判断状态
      if (endDiff < -30 * 60) {
        lotteryState.value = -1 // 未开盘
      } else if (endDiff > 20 * 60 && gameId.value !== 70) {
        lotteryState.value = 0 // 距离封盘太远
      } else if (endDiff <= 0) {
        lotteryState.value = 0 // 已封盘
      } else {
        lotteryState.value = 1 // 正常
      }

      // 解析上期开奖号码
      if (data.preNum) {
        const nums = data.preNum.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
        lastNumbers.value = nums
      }
    }
  } catch (error) {
    console.error('获取期号数据失败:', error)
  }
}

// 启动倒计时
function startCountdown() {
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    }

    // 当倒计时为0时，更新状态并刷新数据
    if (countdown.value <= 0 && lotteryState.value === 1) {
      lotteryState.value = 0
      // 2秒后刷新数据
      setTimeout(() => fetchIssueData(), 2000)
    }
  }, 1000)

  // 每30秒刷新一次期号数据
  refreshTimer = window.setInterval(() => {
    fetchIssueData()
  }, 30000)
}

// 监听游戏ID变化
watch(gameId, () => {
  fetchIssueData()
})

onMounted(() => {
  if (panes.value.length > 0) {
    currentPane.value = panes.value[0]
  }

  fetchIssueData()
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
/* 页面容器 */
.lottery-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

/* 顶部导航栏 */
.lottery-header {
  height: 44px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-left .back-btn {
  color: #fff;
  text-decoration: none;
}

.header-left .game-name {
  font-size: 16px;
  font-weight: 500;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.member-balance {
  color: #ffd700;
  font-size: 14px;
}

.refresh-btn {
  cursor: pointer;
}

.refresh-btn img {
  width: 18px;
  height: 18px;
}

.menu-btn {
  background: none;
  border: none;
  padding: 5px;
  cursor: pointer;
}

.menu-icon {
  display: block;
  width: 20px;
  height: 2px;
  background: #fff;
  position: relative;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: #fff;
  left: 0;
}

.menu-icon::before {
  top: -6px;
}

.menu-icon::after {
  top: 6px;
}

/* 侧边菜单 */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.sidebar-menu {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 180px;
  background: #fff;
  transform: translateX(0);
}

.sidebar-header {
  height: 44px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #ddd;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.sidebar-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.sidebar-list li {
  border-bottom: 1px solid #eee;
}

.sidebar-list li a {
  display: block;
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  font-size: 14px;
}

.sidebar-list li a:active {
  background: #f5f5f5;
}

/* 期号显示区域 */
.period-section {
  background: #fff;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.period-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.current-period {
  font-size: 14px;
}

.period-label {
  color: #666;
}

.period-number {
  color: #fb2351;
  font-weight: bold;
  font-size: 16px;
  margin: 0 3px;
}

.period-suffix {
  color: #666;
}

.countdown {
  display: flex;
  align-items: center;
  gap: 5px;
}

.countdown-label {
  color: #666;
  font-size: 12px;
}

.countdown-time {
  color: #fb2351;
  font-weight: bold;
  font-size: 16px;
}

/* 开奖号码 */
.lottery-numbers {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}

.lottery-ball {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
}

/* PK10开奖号码图片样式 */
.lottery-ball.round-6 {
  width: 28px;
  height: 28px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  color: transparent;
}

.lottery-ball.data-1 { background-image: url('/images/ball/1.png'); }
.lottery-ball.data-2 { background-image: url('/images/ball/2.png'); }
.lottery-ball.data-3 { background-image: url('/images/ball/3.png'); }
.lottery-ball.data-4 { background-image: url('/images/ball/4.png'); }
.lottery-ball.data-5 { background-image: url('/images/ball/5.png'); }
.lottery-ball.data-6 { background-image: url('/images/ball/6.png'); }
.lottery-ball.data-7 { background-image: url('/images/ball/7.png'); }
.lottery-ball.data-8 { background-image: url('/images/ball/8.png'); }
.lottery-ball.data-9 { background-image: url('/images/ball/9.png'); }
.lottery-ball.data-10 { background-image: url('/images/ball/10.png'); }

/* 开奖结果计算 */
.result-wrap {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #eee;
}

.result-data {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 6px;
  background: linear-gradient(180deg, #fff, #f5f5f5);
  border: 1px solid #ddd;
  border-radius: 3px;
  font-size: 12px;
  color: #333;
}

.result-data:first-child {
  background: linear-gradient(180deg, #fb2351, #e91e63);
  border-color: #fb2351;
  color: #fff;
  font-weight: bold;
}

/* 玩法菜单 */
.play-tabs {
  background: #fff;
  border-bottom: 1px solid #eee;
}

.tabs-scroll {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.tabs-scroll::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
}

.tab-item.active {
  color: #fb2351;
  font-weight: 500;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: #fb2351;
}

.tab-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 8px;
  height: 8px;
  background: #fb2351;
  border-radius: 50%;
}

/* 投注面板 */
.bet-panel {
  flex: 1;
  overflow-y: auto;
  background: #fff;
}

.bet-view {
  padding: 10px;
}

.coming-soon {
  text-align: center;
  padding: 50px 20px;
  color: #999;
}

/* 底部操作栏 */
.lottery-footer {
  position: sticky;
  bottom: 0;
  background: #fff;
  border-top: 1px solid #ddd;
  padding: 10px;
  z-index: 100;
}

/* 封盘遮罩 */
.close-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.close-tip {
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 18px;
}

/* 筹码选择 */
.chips-wrap {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  padding: 5px 0;
}

.chip-item {
  flex: 1;
  height: 35px;
  background: linear-gradient(180deg, #fff, #f0f0f0);
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #333;
  cursor: pointer;
}

.chip-item.clear {
  background: linear-gradient(180deg, #fb2351, #e91e63);
  color: #fff;
  border-color: #fb2351;
}

/* 底部操作行 */
.footer-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.bet-input-section {
  flex: 1;
}

.bet-count {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.text-yellow {
  color: #f5a623;
  font-weight: bold;
  margin: 0 3px;
}

.input-wrap {
  position: relative;
}

.amount-input {
  width: 100%;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 0 10px;
  font-size: 14px;
  box-sizing: border-box;
}

.amount-input:focus {
  outline: none;
  border-color: #fb2351;
}

.bet-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  height: 36px;
  padding: 0 15px;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn:active {
  transform: scale(0.95);
}

.btn-bet {
  background: linear-gradient(180deg, #fb2351, #e91e63);
  color: #fff;
}

.btn-reset {
  background: linear-gradient(180deg, #fff, #f0f0f0);
  color: #333;
  border: 1px solid #ddd;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 300;
}

.modal-content {
  width: 90%;
  max-width: 320px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
}

.modal-header {
  padding: 15px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 16px;
}

.modal-body {
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.bet-list {
  margin-bottom: 15px;
}

.bet-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.bet-name {
  color: #333;
}

.bet-odds {
  color: #fb2351;
}

.bet-amount {
  color: #666;
}

.bet-summary {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 5px;
  font-size: 14px;
}

.bet-summary em {
  color: #fb2351;
  font-style: normal;
  font-weight: bold;
}

.modal-footer {
  display: flex;
  border-top: 1px solid #eee;
}

.modal-footer .btn {
  flex: 1;
  border-radius: 0;
  height: 44px;
}

.btn-cancel {
  background: #fff;
  color: #666;
  border-right: 1px solid #eee;
}

.btn-confirm {
  background: #fb2351;
  color: #fff;
}

/* 动画 */
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.3s ease;
}

.slide-enter-active .sidebar-menu,
.slide-leave-active .sidebar-menu {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
}

.slide-enter-from .sidebar-menu,
.slide-leave-to .sidebar-menu {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
