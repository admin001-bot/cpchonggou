<template>
  <div class="lottery-page">
    <!-- 顶部导航栏 -->
    <header class="lottery-header">
      <div class="header-left">
        <a @click.prevent="router.push('/home')" class="back-btn">
          <span class="game-name">{{ gameName }}</span>
        </a>
      </div>
      <div class="header-right">
        <span class="member-balance">USDT:{{ userBalance }}</span>
        <!-- 历史开奖按钮 -->
        <button class="history-btn" @click="toggleHistoryDrawer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          <span class="history-text">{{ t('game.history') }}</span>
        </button>
        <button class="menu-btn" @click="toggleSidebar">
          <span class="menu-icon"></span>
        </button>
      </div>
    </header>

    <!-- 历史开奖抽屉 -->
    <transition name="drawer">
      <div v-if="historyDrawerVisible" class="history-drawer-overlay" @click="closeHistoryDrawer">
        <div class="history-drawer" @click.stop>
          <div class="drawer-header">
            <h3>{{ t('game.historyLottery') }}</h3>
            <button class="close-btn" @click="closeHistoryDrawer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <div class="drawer-content">
            <!-- 期号列表 -->
            <div class="period-list">
              <div
                v-for="item in historyList"
                :key="item.actionNo"
                class="period-item"
                :class="{ active: selectedPeriod === item.actionNo }"
                @click="selectPeriod(item)"
              >
                <div class="period-number">{{ item.actionNo }}</div>
                <div class="period-numbers">
                  <span
                    v-for="(num, idx) in item.numbers"
                    :key="idx"
                    class="lottery-ball mini"
                    :class="'data-' + num"
                  >{{ num }}</span>
                </div>
                <div class="period-time">{{ formatTime(item.actionTime) }}</div>
              </div>
            </div>
            <!-- 加载更多 -->
            <div class="load-more-area" v-if="hasMoreHistory">
              <button class="load-more-btn" @click="loadMoreHistory" :disabled="loadingMore">
                {{ loadingMore ? t('common.loading') : t('common.loadMore') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 侧边菜单 -->
    <transition name="slide">
      <div v-if="sidebarVisible" class="sidebar-overlay" @click="closeSidebar">
        <div class="sidebar-menu" @click.stop>
          <div class="sidebar-header">
            <h3>{{ t('game.systemMenu') }}</h3>
          </div>
          <ul class="sidebar-list">
            <li><a @click.prevent="router.push('/home')">{{ t('game.returnLobby') }}</a></li>
            <li v-for="game in gameList" :key="game.id">
              <a @click.prevent="router.push('/game/' + game.id)">{{ t(`game.${game.id}`) }}</a>
            </li>
          </ul>
        </div>
      </div>
    </transition>

    <!-- 主内容区 -->
    <div class="lottery-content">
      <!-- 期号显示区域 -->
      <div class="period-section">
        <!-- 上期开奖号码和结果 -->
        <div class="last-lottery">
          <div class="last-period-label">{{ t('game.issue') }} {{ prePeriod }} {{ t('game.period') }}</div>
          <div class="lottery-numbers">
            <span
              v-for="(num, index) in displayNumbers"
              :key="index"
              class="lottery-ball round-6"
              :class="['data-' + num, { 'running': isLotteryRunning && !settledIndexes.includes(index) }]"
            >{{ num }}</span>
          </div>
          <div class="result-wrap" v-if="lotteryResults.length > 0 && !isLotteryRunning">
            <span
              v-for="(result, index) in lotteryResults"
              :key="index"
              class="result-data"
            >{{ translateResult(result) }}</span>
          </div>
        </div>
      </div>

      <!-- 当前期号显示 -->
      <div class="current-issue-bar">
        <span class="issue-text">{{ t('game.issue') }} <strong>{{ currentPeriod }}</strong> {{ t('game.period') }}</span>
        <span class="countdown-text" :class="{ 'lottery-ing': countdown <= 0 }">
          {{ countdown > 0 ? formatCountdown : t('game.lotteryIng') }}
        </span>
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
            {{ t(`play.${pane.code}`) }}
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
            :plays-data="playsData"
            :get-odds="getOdds"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 冠亚和玩法 -->
        <template v-else-if="currentPane?.code === 'HE'">
          <GuanYaHeBet
            :game-id="gameId"
            :bet-data="betData"
            :plays-data="playsData"
            :get-odds="getOdds"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 1-5名玩法 -->
        <template v-else-if="currentPane?.code === '1-5'">
          <RankBet
            :game-id="gameId"
            :bet-data="betData"
            :plays-data="playsData"
            :get-odds="getOdds"
            :ranks="[1, 2, 3, 4, 5]"
            @toggle-bet="toggleBet"
          />
        </template>

        <!-- 6-10名玩法 -->
        <template v-else-if="currentPane?.code === '6-10'">
          <RankBet
            :game-id="gameId"
            :bet-data="betData"
            :plays-data="playsData"
            :get-odds="getOdds"
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

    <!-- 功能弹出菜单 -->
    <GamePopover
      :visible="popoverVisible"
      :game-id="gameId"
      @close="closePopover"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { t } from '@/locales'
import { getGameConfig, getGamePanes, getGameList, type GroupPane } from '@/config/games'
import { gameApi, type NextIssueData, type PlayInfo } from '@/api/game'
import LiangMianBet from '@/components/game/LiangMianBet.vue'
import GuanYaHeBet from '@/components/game/GuanYaHeBet.vue'
import RankBet from '@/components/game/RankBet.vue'
import GamePopover from '@/components/game/GamePopover.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 游戏ID
const gameId = computed(() => parseInt(route.params.id as string) || 55)

// 游戏配置
const gameConfig = computed(() => getGameConfig(gameId.value))
const gameName = computed(() => t(`game.${gameId.value}`) || t('game.defaultName'))
const panes = computed(() => getGamePanes(gameId.value))

// 游戏列表
const gameList = computed(() => getGameList().slice(0, 8))

// 用户余额
const userBalance = computed(() => userStore.userInfo?.balance?.toFixed(2) || '0.00')

// 侧边栏
const sidebarVisible = ref(false)

// 历史开奖抽屉
const historyDrawerVisible = ref(false)
const historyList = ref<Array<{ actionNo: string; numbers: number[]; actionTime: number }>>([])
const selectedPeriod = ref('')
const hasMoreHistory = ref(true)
const loadingMore = ref(false)
const historyPage = ref(1)

// 弹出菜单
const popoverVisible = ref(false)

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

// 开奖跑动相关
const displayNumbers = ref<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const isLotteryRunning = ref(false)
const settledIndexes = ref<number[]>([])
let lotteryRunTimer: number | null = null
let settleTimer: number | null = null

// 玩法赔率数据
const playsData = ref<Record<string, PlayInfo>>({})

// 获取玩法赔率
function getOdds(playId: number): number {
  const play = playsData.value[playId.toString()]
  return play?.odds || 9.85
}

// 确认弹窗
const showConfirmModal = ref(false)
const confirmBetList = ref<Array<{ name: string; odds: number; playId: number }>>([])

// 计时器
let countdownTimer: number | null = null
let refreshTimer: number | null = null
let balanceRefreshTimer: number | null = null

// 开始开奖跑动
function startLotteryRun() {
  isLotteryRunning.value = true
  settledIndexes.value = []

  // 每100ms随机变换号码
  lotteryRunTimer = window.setInterval(() => {
    const newNumbers = [...displayNumbers.value]
    for (let i = 0; i < 10; i++) {
      if (!settledIndexes.value.includes(i)) {
        newNumbers[i] = Math.floor(Math.random() * 10) + 1
      }
    }
    displayNumbers.value = newNumbers
  }, 100)
}

// 停止跑动并依次定格
function stopLotteryRun(finalNumbers: number[]) {
  // 先停止跑动定时器
  if (lotteryRunTimer) {
    clearInterval(lotteryRunTimer)
    lotteryRunTimer = null
  }

  // 依次定格每个号码，间隔200ms
  let currentIndex = 0
  settleTimer = window.setInterval(() => {
    if (currentIndex < 10) {
      settledIndexes.value.push(currentIndex)
      displayNumbers.value[currentIndex] = finalNumbers[currentIndex]
      currentIndex++
    } else {
      // 全部定格完成
      clearInterval(settleTimer!)
      settleTimer = null
      isLotteryRunning.value = false
      lastNumbers.value = [...finalNumbers]
    }
  }, 200)
}

// 停止所有开奖动画
function stopAllLotteryAnimations() {
  if (lotteryRunTimer) {
    clearInterval(lotteryRunTimer)
    lotteryRunTimer = null
  }
  if (settleTimer) {
    clearInterval(settleTimer)
    settleTimer = null
  }
  isLotteryRunning.value = false
  settledIndexes.value = []
}

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

// 翻译开奖结果
function translateResult(result: number | string): string {
  if (typeof result === 'number') return String(result)
  switch (result) {
    case '大': return t('game.big')
    case '小': return t('game.small')
    case '單': return t('game.odd')
    case '雙': return t('game.even')
    case '龍': return t('game.dragon')
    case '虎': return t('game.tiger')
    default: return result
  }
}

// 切换侧边栏
function toggleSidebar() {
  popoverVisible.value = true
}

// 关闭弹出菜单
function closePopover() {
  popoverVisible.value = false
}

function closeSidebar() {
  sidebarVisible.value = false
}

// 历史开奖抽屉
function toggleHistoryDrawer() {
  historyDrawerVisible.value = !historyDrawerVisible.value
  if (historyDrawerVisible.value) {
    loadHistoryList()
  }
}

function closeHistoryDrawer() {
  historyDrawerVisible.value = false
}

async function loadHistoryList(page = 1) {
  try {
    loadingMore.value = true
    // 使用 getHistory API 获取开奖历史
    const res = await gameApi.getHistory(gameId.value)

    if (res.code === 0 && res.data) {
      const newList = res.data.map((item: any) => ({
        actionNo: item.issue,
        numbers: item.numbers,
        actionTime: item.time
      }))

      if (page === 1) {
        historyList.value = newList
      } else {
        historyList.value = [...historyList.value, ...newList]
      }

      hasMoreHistory.value = false // 历史数据一次性加载
      historyPage.value = page
    }
  } catch (error) {
    console.error('加载历史开奖失败:', error)
  } finally {
    loadingMore.value = false
  }
}

function loadMoreHistory() {
  if (!loadingMore.value) {
    loadHistoryList(historyPage.value + 1)
  }
}

function selectPeriod(item: { actionNo: string; numbers: number[]; actionTime: number }) {
  selectedPeriod.value = item.actionNo
  // 可以在这里做更多操作，比如显示该期详细数据
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  if (isToday) {
    return `今天 ${hours}:${minutes}:${seconds}`
  }
  return `${date.getMonth() + 1}/${date.getDate()} ${hours}:${minutes}`
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
async function refreshBalance() {
  const token = localStorage.getItem('token')
  if (!token) return

  try {
    const res = await fetch('/api/user/info', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json()
    if (data.code === 0 && data.data) {
      userStore.setUserInfo(data.data)
    }
  } catch (error) {
    console.error('刷新余额失败:', error)
  }
}

// 根据玩法ID获取玩法名称
// playId格式: gameId(55) + categoryId(101-111) + sequence(01-XX)
function getPlayName(playId: number): string {
  const id = playId
  const gameId = Math.floor(id / 100000)
  const categoryId = Math.floor((id % 100000) / 100)
  const sequence = id % 100

  // 冠亚和 (categoryId = 101)
  if (categoryId === 101) {
    if (sequence === 1) return `${t('rank.topSum')}${t('game.big')}`
    if (sequence === 2) return `${t('rank.topSum')}${t('game.small')}`
    if (sequence === 3) return `${t('rank.topSum')}${t('game.odd')}`
    if (sequence === 4) return `${t('rank.topSum')}${t('game.even')}`
    // 冠亚和数字 (sequence 5-21 对应数字 3-19)
    if (sequence >= 5 && sequence <= 21) {
      return `${t('rank.topSum')} ${sequence - 2}`
    }
  }

  // 各名次 (categoryId = 102-111 对应 第1-10名)
  if (categoryId >= 102 && categoryId <= 111) {
    const rank = categoryId - 101 // categoryId 102 = 第1名
    const rankName = t(`rank.${rank}`)

    // 号码投注 (sequence 1-10)
    if (sequence >= 1 && sequence <= 10) {
      return `${rankName} ${sequence}${t('rank.number')}`
    }

    // 两面玩法 (sequence 11-16)
    if (sequence === 11) return `${rankName}${t('game.big')}`
    if (sequence === 12) return `${rankName}${t('game.small')}`
    if (sequence === 13) return `${rankName}${t('game.odd')}`
    if (sequence === 14) return `${rankName}${t('game.even')}`
    if (sequence === 15) return `${rankName}${t('game.dragon')}`
    if (sequence === 16) return `${rankName}${t('game.tiger')}`
  }

  return `玩法${playId}`
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
        name: getPlayName(playId),
        odds: getOdds(playId),
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

// 翻译下注消息
function translateBetMsg(msgKey: string, msgArgs?: string[]): string {
  if (!msgKey) return ''
  let msg = t(msgKey)
  // 替换参数 {0}, {1}, {2}, {3}
  if (msgArgs) {
    for (let i = 0; i < msgArgs.length && i < 4; i++) {
      msg = msg.replace(`{${i}}`, msgArgs[i])
    }
  }
  return msg
}

// 确认下注
async function confirmBet() {
  try {
    // 将 betData 转换为 PHP 格式的 betBean
    const betBean: Array<{ playId: number; money: number }> = []
    for (const paneCode in betData.value) {
      const playIds = betData.value[paneCode]
      for (const playId of playIds) {
        betBean.push({
          playId: playId,
          money: parseInt(betAmount.value) || 0
        })
      }
    }

    const result = await gameApi.placeBet({
      gameId: gameId.value,
      turnNum: currentPeriod.value,
      betBean: betBean,
      totalNums: totalBetCount.value,
      totalMoney: totalBetCount.value * (parseInt(betAmount.value) || 0),
      ftime: 0
    })

    // 后端返回格式: { success, msg, msgKey, msgArgs, code }
    const data = result as any
    if (data.success) {
      alert(translateBetMsg(data.msgKey) || t('game.betSuccess'))
      showConfirmModal.value = false
      resetBets()
      refreshBalance()
    } else {
      alert(translateBetMsg(data.msgKey, data.msgArgs) || data.msg || t('game.betFailed'))
    }
  } catch (error) {
    alert(t('game.betFailedRetry'))
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
    console.log('[游戏页面] 开始获取期号数据，游戏 ID:', gameId.value)
    const result = await gameApi.getNextIssue(gameId.value)
    console.log('[游戏页面] 期号数据响应:', result)
    if (result.code === 0 && result.data) {
      const data: NextIssueData = result.data

      // 检查是否有新的开奖号码
      const newPreNum = data.preNum
      const oldPreNum = lastNumbers.value.join(',')

      currentPeriod.value = data.issue
      prePeriod.value = data.preIssue

      // 解析时间并计算倒计时
      const serverTime = parseTime(data.serverTime)
      const endTime = parseTime(data.endtime)
      const lotteryTime = parseTime(data.lotteryTime)

      const endDiff = endTime - serverTime

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
      if (newPreNum) {
        const nums = newPreNum.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))

        // 如果正在跑动且收到了新的开奖号码，依次定格
        if (isLotteryRunning.value && nums.length === 10 && newPreNum !== oldPreNum) {
          stopLotteryRun(nums)
        } else if (!isLotteryRunning.value) {
          // 不在跑动状态，直接显示号码
          lastNumbers.value = nums
          displayNumbers.value = [...nums]
        }
      }
    }
  } catch (error) {
    console.error('[游戏页面] 获取期号数据失败:', error, '游戏 ID:', gameId.value)
  }
}

// 获取玩法赔率数据
async function fetchPlaysData() {
  try {
    // 使用盘口2 (ssc_played2表)
    const result = await gameApi.getPlays(gameId.value, 2)
    if (result.code === 0 && result.data) {
      playsData.value = result.data
    }
  } catch (error) {
    console.error('获取玩法赔率失败:', error)
  }
}

// 启动倒计时
function startCountdown() {
  countdownTimer = window.setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    }

    // 当倒计时为0时，开始开奖跑动
    if (countdown.value <= 0 && lotteryState.value === 1) {
      lotteryState.value = 0
      // 开始跑动动画
      if (!isLotteryRunning.value) {
        startLotteryRun()
      }
    }
  }, 1000)

  // 每30秒刷新一次期号数据
  refreshTimer = window.setInterval(() => {
    fetchIssueData()
  }, 30000)

  // 每30秒刷新一次余额
  balanceRefreshTimer = window.setInterval(() => {
    refreshBalance()
  }, 30000)
}

// 监听游戏ID变化
watch(gameId, (newId, oldId) => {
  console.log('[游戏页面] 游戏 ID 变化:', oldId, '->', newId)
  // 切换游戏时，重置定时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (balanceRefreshTimer) {
    clearInterval(balanceRefreshTimer)
  }
  fetchIssueData()
  startCountdown()
})

onMounted(() => {
  if (panes.value.length > 0) {
    currentPane.value = panes.value[0]
  }

  fetchIssueData()
  fetchPlaysData()
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
  if (balanceRefreshTimer) {
    clearInterval(balanceRefreshTimer)
  }
  stopAllLotteryAnimations()
})
</script>

<style scoped>
/* 历史开奖按钮 */
.history-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 20px;
  padding: 6px 12px;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.history-btn:active {
  background: rgba(255, 255, 255, 0.3);
}

.history-btn svg {
  width: 18px;
  height: 18px;
}

.history-text {
  font-size: 12px;
}

/* 历史开奖抽屉 */
.history-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.history-drawer {
  width: 100%;
  max-width: 400px;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
}

.drawer-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
}

/* 期号列表 */
.period-list {
  padding: 12px;
}

.period-item {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.period-item:active {
  transform: scale(0.98);
}

.period-item.active {
  border-color: #fb2351;
  background: #fff5f6;
}

.period-number {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.period-numbers {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

/* 历史开奖中的号码球使用图片背景 */
.period-numbers .lottery-ball {
  width: 28px;
  height: 28px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  color: transparent;
  border-radius: 50%;
}

.period-numbers .lottery-ball.data-1 { background-image: url('/images/ball/1.png'); }
.period-numbers .lottery-ball.data-2 { background-image: url('/images/ball/2.png'); }
.period-numbers .lottery-ball.data-3 { background-image: url('/images/ball/3.png'); }
.period-numbers .lottery-ball.data-4 { background-image: url('/images/ball/4.png'); }
.period-numbers .lottery-ball.data-5 { background-image: url('/images/ball/5.png'); }
.period-numbers .lottery-ball.data-6 { background-image: url('/images/ball/6.png'); }
.period-numbers .lottery-ball.data-7 { background-image: url('/images/ball/7.png'); }
.period-numbers .lottery-ball.data-8 { background-image: url('/images/ball/8.png'); }
.period-numbers .lottery-ball.data-9 { background-image: url('/images/ball/9.png'); }
.period-numbers .lottery-ball.data-10 { background-image: url('/images/ball/10.png'); }

.period-time {
  font-size: 12px;
  color: #999;
  text-align: right;
}

/* 加载更多 */
.load-more-area {
  padding: 16px;
  text-align: center;
}

.load-more-btn {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 8px 24px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 抽屉动画 */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .history-drawer,
.drawer-leave-active .history-drawer {
  transition: transform 0.3s;
}

.drawer-enter-from .history-drawer,
.drawer-leave-to .history-drawer {
  transform: translateX(100%);
}

/* 页面容器 */
.lottery-page {
  min-height: 100vh;
  background: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
  border-bottom: 1px solid #eee;
}

.last-lottery {
  padding: 10px;
}

.last-period-label {
  text-align: center;
  font-size: 12px;
  color: #999;
  margin-bottom: 6px;
}

/* 当前期号显示条 */
.current-issue-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 15px;
  background: linear-gradient(135deg, #e3bac7 0%, #ed3f3f 100%);
  background-size: 200% 200%;
  color: #fff;
  animation: gradientScroll 3s ease infinite;
  position: relative;
  overflow: hidden;
}

@keyframes gradientScroll {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.issue-text {
  font-size: 14px;
}

.issue-text strong {
  font-size: 18px;
  margin: 0 4px;
}

.countdown-text {
  font-size: 16px;
  font-weight: bold;
}

.countdown-text.lottery-ing {
  color: #ffd700;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* 开奖号码 */
.lottery-numbers {
  display: flex;
  justify-content: center;
  gap: 5px;
  flex-wrap: wrap;
}

.lottery-ball {
  display: inline-block;
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

/* 开奖跑动动画 */
.lottery-ball.running {
  animation: ballRun 0.1s ease-in-out infinite;
}

@keyframes ballRun {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

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
