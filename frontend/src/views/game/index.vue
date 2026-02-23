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
            class="lottery-ball"
            :class="'ball-' + num"
          >{{ num }}</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t, getCurrentLocale } from '@/locales'
import { getGameConfig, getGamePanes, getGameList, type GroupPane } from '@/config/games'
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

// 投注数据 - 存储每个玩法选中的投注ID
const betData = ref<Record<string, number[]>>({})

// 投注金额
const betAmount = ref<string>('')

// 显示筹码
const showChips = ref(false)

// 期号相关
const currentPeriod = ref('20260223001')
const countdown = ref(120) // 秒
const lastNumbers = ref<number[]>([5, 8, 3, 10, 1, 7, 2, 9, 4, 6])
const lotteryState = ref(1) // 1: 正常, 0: 封盘, -1: 未开盘

// 确认弹窗
const showConfirmModal = ref(false)
const confirmBetList = ref<Array<{ name: string; odds: number; playId: number }>>([])

// 计时器
let countdownTimer: number | null = null

// 格式化倒计时
const formatCountdown = computed(() => {
  const minutes = Math.floor(countdown.value / 60)
  const seconds = countdown.value % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 总注数
const totalBetCount = computed(() => {
  let count = 0
  for (const key in betData.value) {
    count += betData.value[key].length
  }
  return count
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
  // 如果当前玩法不支持多选或切换到不支持多选的玩法，先重置
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
  // TODO: 调用API刷新余额
  alert('刷新餘額功能開發中')
}

// 下注
function placeBet() {
  if (!betAmount.value || parseInt(betAmount.value) <= 0) {
    alert(t('game.enterAmount'))
    return
  }

  if (totalBetCount.value === 0) {
    alert(t('game.selectPlay'))
    return
  }

  // 构建确认列表
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
function confirmBet() {
  // TODO: 调用API下注
  alert('下注成功！')
  showConfirmModal.value = false
  resetBets()
}

// 重置投注
function resetBets() {
  betData.value = {}
  betAmount.value = ''
}

// 启动倒计时
function startCountdown() {
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      // 模拟新期号
      const periodNum = parseInt(currentPeriod.value.slice(-3)) + 1
      currentPeriod.value = currentPeriod.value.slice(0, -3) + periodNum.toString().padStart(3, '0')
      countdown.value = 120

      // 模拟新开奖号码
      lastNumbers.value = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    }
  }, 1000)
}

// 洗牌算法
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

onMounted(() => {
  // 设置默认玩法
  if (panes.value.length > 0) {
    currentPane.value = panes.value[0]
  }

  // 启动倒计时
  startCountdown()

  // 加载PHP CSS
  if (!document.getElementById('main-css')) {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '/css/main.pack.min.css'
    link.id = 'main-css'
    document.head.appendChild(link)
  }
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
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

.lottery-ball.ball-1 { background: #e6a23c; }
.lottery-ball.ball-2 { background: #409eff; }
.lottery-ball.ball-3 { background: #67c23a; }
.lottery-ball.ball-4 { background: #f56c6c; }
.lottery-ball.ball-5 { background: #909399; }
.lottery-ball.ball-6 { background: #e6a23c; }
.lottery-ball.ball-7 { background: #409eff; }
.lottery-ball.ball-8 { background: #67c23a; }
.lottery-ball.ball-9 { background: #f56c6c; }
.lottery-ball.ball-10 { background: #909399; }

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
