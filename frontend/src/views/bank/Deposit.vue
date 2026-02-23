<template>
  <div class="deposit-page">
    <div class="deposit-list">
      <!-- 在线客服 -->
      <div class="deposit-item" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <a href="/chatlink.html" target="_blank">
          <img src="/images/icon04.png" alt="客服" />
          <div class="item-info">
            <p class="title">{{ t('bank.onlineService') }}</p>
            <span class="desc">{{ t('bank.contactService') }}</span>
          </div>
        </a>
      </div>

      <!-- 支付宝转账 -->
      <div v-if="hasAlipay" class="deposit-item" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <router-link to="/bank/alipay">
          <img src="/images/zfb-icon.png" alt="支付宝" />
          <div class="item-info">
            <p class="title">{{ t('bank.alipayTransfer') }}</p>
            <span class="desc">{{ t('bank.alipayTransfer') }}</span>
          </div>
        </router-link>
      </div>

      <!-- 微信转账 -->
      <div v-if="hasWechat" class="deposit-item" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <router-link to="/bank/wechat">
          <img src="/images/wechat-icon.png" alt="微信" />
          <div class="item-info">
            <p class="title">{{ t('bank.wechatTransfer') }}</p>
            <span class="desc">{{ t('bank.wechatTransfer') }}</span>
          </div>
        </router-link>
      </div>

      <!-- 银行转账 -->
      <div v-if="hasBank" class="deposit-item" @touchstart="onTouchStart" @touchend="onTouchEnd">
        <router-link to="/bank/bankpay">
          <img src="/images/icon04.png" alt="银行" />
          <div class="item-info">
            <p class="title">{{ t('bank.bankTransfer') }}</p>
            <span class="desc">{{ t('bank.bankTransferDesc') }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { t } from '@/locales'

// 支付方式开关
const hasAlipay = ref(true)
const hasWechat = ref(true)
const hasBank = ref(true)

// 触摸反馈
const onTouchStart = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  target.classList.add('touch-active')
}

const onTouchEnd = (e: TouchEvent) => {
  const target = e.currentTarget as HTMLElement
  setTimeout(() => {
    target.classList.remove('touch-active')
  }, 150)
}

onMounted(() => {
  // TODO: 从API获取支付方式配置
})
</script>

<style scoped>
.deposit-page {
  background: #fff;
}

.deposit-list {
  padding: 0;
}

.deposit-item {
  border-bottom: 1px solid #eee;
  transition: background 0.2s;
}

.deposit-item.touch-active {
  background: #f5f5f5;
}

.deposit-item a {
  display: flex;
  align-items: center;
  padding: 15px;
  text-decoration: none;
}

.deposit-item img {
  width: 40px;
  height: 40px;
  margin-right: 15px;
}

.deposit-item .item-info {
  flex: 1;
}

.deposit-item .title {
  margin: 0 0 5px 0;
  font-size: 15px;
  color: #333;
}

.deposit-item .desc {
  font-size: 12px;
  color: #999;
}
</style>
