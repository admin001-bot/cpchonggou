<template>
  <div class="page-container">
    <div class="page-header">
      <span class="back-btn" @click="$router.back()">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <span class="title">{{ t('game.todaySettled') }}</span>
      <span class="header-badge">{{ dataList.length }}</span>
    </div>

    <!-- 下拉刷新区域 -->
    <div
      class="refresh-area"
      :class="{ 'refreshing': isRefreshing }"
      @touchstart="onTouchStartRefresh"
      @touchmove="onTouchMoveRefresh"
      @touchend="onTouchEndRefresh"
    >
      <div class="refresh-indicator" v-if="isRefreshing">
        <span class="loading-spinner"></span>
        <span>{{ t('game.refreshing') }}</span>
      </div>

      <!-- 列表头部 -->
      <div class="list-header">
        <span class="list-title">{{ t('game.settledList') }}</span>
        <span class="list-count" v-if="dataList.length > 0">{{ dataList.length }} {{ t('game.betCount') }}</span>
      </div>

      <!-- 注单列表 -->
      <div class="bet-list" v-if="dataList.length > 0">
        <div class="bet-card" v-for="(item, index) in dataList" :key="index">
          <div class="bet-header">
            <div class="period-info">
              <div class="period-num">{{ item.turnNum.split('<br>')[0] }}</div>
              <div class="period-no">{{ item.turnNum.split('<br>')[1] || '' }}</div>
            </div>
            <div class="result-money" :class="item.resultMoney >= 0 ? 'positive' : 'negative'">
              <span class="label">{{ item.resultMoney >= 0 ? t('game.win') : t('game.lose') }}</span>
              <span class="value">{{ formatMoney(Math.abs(item.resultMoney)) }}</span>
            </div>
          </div>

          <div class="bet-content">
            <div class="detail-info">
              <!-- 解析 detail 字段：玩法名称<br>@赔率#返点 -->
              <div class="play-name">{{ parseDetail(item.detail).playName }}</div>
              <div class="play-meta">
                <span class="odds-tag">@{{ parseDetail(item.detail).odds }}</span>
                <span class="rebate-tag">#{{ parseDetail(item.detail).rebate }}</span>
              </div>
            </div>
            <div class="bet-info-right">
              <div class="bet-content-display">
                <div class="content-label">{{ t('game.betContent') }}</div>
                <div class="content-value">{{ getFullContent(item) }}</div>
              </div>
              <div class="bet-amount">
                <div class="amount-label">{{ t('game.betAmount') }}</div>
                <div class="amount-value">{{ formatMoney(item.money) }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div class="load-more" v-if="hasMore && !loading">
          <span class="loading-spinner small"></span>
          <span>{{ t('game.loadingMore') }}</span>
        </div>
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else-if="!loading">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
        </div>
        <div class="empty-text">{{ t('game.noData') }}</div>
        <div class="empty-hint">{{ t('game.noSettledToday') }}</div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-wrap" v-if="loading && dataList.length === 0">
      <div class="loading-spinner"></div>
      <span class="loading-text">{{ t('common.loading') }}</span>
    </div>

    <!-- 底部统计 -->
    <div class="page-footer" v-if="dataList.length > 0">
      <div class="footer-item">
        <span class="label">{{ t('game.betAmount') }}：</span>
        <span class="value">{{ formatMoney(totalBetMoney) }}</span>
      </div>
      <div class="footer-item">
        <span class="label">{{ t('game.winLoss') }}：</span>
        <span class="value" :class="totalResultMoney >= 0 ? 'positive' : 'negative'">
          {{ totalResultMoney >= 0 ? '+' : '' }}{{ formatMoney(totalResultMoney) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { betApi, type SettledItem } from '@/api/game'
import { t } from '@/locales'

const loading = ref(false)
const isRefreshing = ref(false)
const dataList = ref<SettledItem[]>([])
const totalBetMoney = ref(0)
const totalResultMoney = ref(0)
const page = ref(1)
const hasMore = ref(true)

// 下拉刷新相关
let refreshStartY = 0
let isDragging = false
let refreshTimer: number | null = null

onMounted(() => {
  loadData()
})

// 解析 detail 字段
function parseDetail(detail: string) {
  // detail 格式：玩法名称<br>@赔率#返点
  const parts = detail.split('<br>')
  const playName = parts[0] || ''
  const meta = parts[1] || ''

  // 解析 @赔率#返点
  let odds = '0.00'
  let rebate = '0.000'

  const oddsMatch = meta.match(/@([\d.]+)/)
  const rebateMatch = meta.match(/#([\d.]+)/)

  if (oddsMatch) odds = oddsMatch[1]
  if (rebateMatch) rebate = rebateMatch[1]

  return { playName, odds, rebate }
}

// 获取完整的下注内容（包含名次信息）
function getFullContent(item: SettledItem): string {
  const playName = parseDetail(item.detail).playName
  const content = item.content || ''

  // 如果 content 已经包含完整信息，直接返回
  if (content.includes('第') && (content.includes('名') || content.includes('球'))) {
    return content
  }

  // 根据玩法名称判断是否需要添加名次前缀
  // PK10 类型游戏（幸运飞艇、北京赛车、极速飞艇、极速赛车）
  const pk10Games = [55, 50, 52, 72] // 游戏 ID
  const currentGameId = getCurrentGameId(item.turnNum)

  if (pk10Games.includes(currentGameId)) {
    // 冠亚和玩法
    if (playName.includes('冠亚和')) {
      return `${playName}${content}`
    }
    // 各名次玩法：玩法名称通常包含 "大"、"小"、"单"、"双"、"龙"、"虎"
    if (['大', '小', '单', '双', '龙', '虎'].includes(content)) {
      // 从玩法名称中提取名次，如 "第一名大" -> 玩法名称可能是 "冠军大" 或类似
      // 如果玩法名称已经包含名次信息，直接使用
      if (playName.match(/(冠军|亚军|第三|第四|第五|第六|第七|第八|第九|第十)/)) {
        return `${playName}`
      }
      // 否则需要添加名次前缀
      return `${content}`
    }
  }

  // 时时彩类型游戏（五分时时彩、极速分分彩）
  const sscGames = [122, 100] // 游戏 ID
  if (sscGames.includes(currentGameId)) {
    // 总和玩法
    if (playName.includes('总和') || playName.includes('总')) {
      return `${playName}${content}`
    }
    // 各球玩法：玩法名称可能包含 "第一球"、"第二球" 等
    if (playName.match(/(第一球|第二球|第三球|第四球|第五球)/)) {
      return `${playName}${content}`
    }
  }

  // PC 蛋蛋类型
  const pcdGames = [66]
  if (pcdGames.includes(currentGameId)) {
    return `${playName}${content}`
  }

  // 默认返回：玩法名称 + 内容
  return `${playName}${content}`
}

// 从期号中获取游戏 ID（通过 turnNum 格式：游戏名称<br>期号）
function getCurrentGameId(turnNum: string): number {
  const parts = turnNum.split('<br>')
  const gameName = parts[0] || ''

  // 根据游戏名称判断游戏 ID
  if (gameName.includes('幸运飞艇')) return 55
  if (gameName.includes('北京赛车')) return 50
  if (gameName.includes('极速飞艇')) return 52
  if (gameName.includes('极速赛车')) return 72
  if (gameName.includes('五分时时彩')) return 122
  if (gameName.includes('极速分分彩')) return 100
  if (gameName.includes('PC 蛋蛋')) return 66
  if (gameName.includes('极速六合')) return 113

  return 55 // 默认
}

async function loadData() {
  if (!hasMore.value) return

  loading.value = true
  try {
    const res = await betApi.getBetBills(page.value, 30)
    if (res.code === 0) {
      const data = res.data as any
      const otherData = data?.otherData || res.otherData || {}
      const list = data?.data || data || []

      if (page.value === 1) {
        dataList.value = list || []
      } else {
        dataList.value.push(...(list || []))
      }
      totalBetMoney.value = otherData.totalBetMoney || 0
      totalResultMoney.value = otherData.totalResultMoney || 0

      // 检查是否还有更多数据
      if (list && list.length < 30) {
        hasMore.value = false
      } else {
        page.value++
      }
    }
  } catch (e) {
    console.error('加载数据失败', e)
  } finally {
    loading.value = false
  }
}

function formatMoney(money: number): string {
  return money.toFixed(2)
}

// 下拉刷新
function onTouchStartRefresh(e: TouchEvent) {
  refreshStartY = e.touches[0].clientY
  isDragging = false
}

function onTouchMoveRefresh(e: TouchEvent) {
  if (!isDragging) {
    const currentY = e.touches[0].clientY
    if (currentY - refreshStartY > 80) {
      isDragging = true
    }
  }
}

function onTouchEndRefresh(e: TouchEvent) {
  if (isDragging) {
    doRefresh()
  }
  isDragging = false
}

async function doRefresh() {
  isRefreshing.value = true
  page.value = 1
  dataList.value = []
  await loadData()
  refreshTimer = window.setTimeout(() => {
    isRefreshing.value = false
  }, 500)
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.page-container {
  overflow-y: auto;
  min-height: 100vh;
  background: #f5f5f5;
  position: relative;
  padding-bottom: 60px;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  padding: 16px 16px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(251, 35, 81, 0.3);
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:active {
  background: rgba(255, 255, 255, 0.35);
  transform: scale(0.92);
}

.back-btn .icon {
  width: 20px;
  height: 20px;
  color: #fff;
}

.title {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-left: 10px;
}

.header-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}

/* 刷新区域 */
.refresh-area {
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

.refresh-area.refreshing {
  transform: translateY(60px);
  transition: transform 0.3s ease;
}

.refresh-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  gap: 8px;
  color: #666;
  font-size: 13px;
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
  background: #fff;
}

.list-title {
  font-size: 13px;
  font-weight: 600;
  color: #666;
}

.list-count {
  font-size: 11px;
  color: #999;
  background: #f8f8f8;
  padding: 3px 10px;
  border-radius: 10px;
}

/* 注单列表 */
.bet-list {
  padding: 0 15px 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.bet-card {
  background: #ffffff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.bet-card:active {
  transform: scale(0.985);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.bet-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  background: linear-gradient(90deg, rgba(251, 35, 81, 0.06) 0%, rgba(255, 75, 62, 0.06) 100%);
  border-bottom: 1px solid #f0f0f0;
}

.period-info {
  flex: 1;
}

.period-num {
  font-size: 15px;
  font-weight: 600;
  color: #fb2351;
  margin-bottom: 3px;
}

.period-no {
  font-size: 12px;
  color: #999;
}

.result-money {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 6px 12px;
  border-radius: 8px;
  min-width: 80px;
}

.result-money.positive {
  background: rgba(76, 175, 80, 0.1);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.result-money.negative {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.2);
}

.result-money .label {
  font-size: 11px;
  font-weight: 500;
  margin-bottom: 2px;
}

.result-money.positive .label {
  color: #4caf50;
}

.result-money.negative .label {
  color: #f44336;
}

.result-money .value {
  font-size: 15px;
  font-weight: 600;
}

.result-money.positive .value {
  color: #4caf50;
}

.result-money.negative .value {
  color: #f44336;
}

.bet-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 15px;
}

.detail-info {
  flex: 1;
}

.play-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.play-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.odds-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  background: #f8f8f8;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #666;
  border: 1px solid #eee;
}

.rebate-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  background: rgba(251, 35, 81, 0.06);
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  color: #fb2351;
  border: 1px solid rgba(251, 35, 81, 0.15);
}

.bet-info-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  min-width: 120px;
  margin-left: 12px;
}

.bet-content-display {
  text-align: right;
}

.content-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.content-value {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  background: rgba(251, 35, 81, 0.08);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(251, 35, 81, 0.15);
}

.bet-amount {
  text-align: right;
}

.bet-amount .amount-label {
  font-size: 10px;
  color: #999;
  margin-bottom: 4px;
}

.bet-amount .amount-value {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* 加载更多 */
.load-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 20px;
  color: #999;
  font-size: 13px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  background: #f8f8f8;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: #ddd;
}

.empty-text {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  margin-bottom: 6px;
}

.empty-hint {
  font-size: 13px;
  color: #999;
  line-height: 1.5;
}

/* 加载状态 */
.loading-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #f0f0f0;
  border-top-color: #fb2351;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner.small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-text {
  font-size: 13px;
  color: #999;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 底部统计 */
.page-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #eee;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  z-index: 99;
}

.footer-item {
  margin-left: 20px;
  display: flex;
  align-items: center;
}

.footer-item .label {
  font-size: 13px;
  color: #666;
  margin-right: 6px;
}

.footer-item .value {
  font-size: 15px;
  font-weight: 600;
  color: #fb2351;
}

.footer-item .value.positive {
  color: #4caf50;
}

.footer-item .value.negative {
  color: #f44336;
}
</style>
