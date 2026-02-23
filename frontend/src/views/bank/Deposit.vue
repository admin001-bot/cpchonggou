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
    </div>
  </div>
</template>

<script setup lang="ts">
import { t } from '@/locales'

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
