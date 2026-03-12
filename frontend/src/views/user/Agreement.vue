<template>
  <div class="agreement-page">
    <!-- 顶部导航 -->
    <header class="agreement-header">
      <span class="back-btn" @click="goBack">
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </span>
      <h1 class="header-title">{{ t('agreement.title') }}</h1>
      <span class="header-right"></span>
    </header>

    <!-- 装饰背景 -->
    <div class="decorative-bg">
      <div class="pattern-dots"></div>
      <div class="pattern-lines"></div>
    </div>

    <!-- 内容区域 -->
    <div class="agreement-content">
      <!-- Logo区域 -->
      <div class="logo-section">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 12l2 2 4-4"/>
            <path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9z"/>
          </svg>
        </div>
        <h2 class="logo-title">{{ t('agreement.welcomeTitle') }}</h2>
        <p class="logo-subtitle">{{ t('agreement.welcomeSubtitle') }}</p>
      </div>

      <!-- 条款列表 -->
      <div class="terms-container">
        <div
          v-for="(term, index) in terms"
          :key="index"
          class="term-card"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <div class="term-number">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
          </div>
          <div class="term-content">
            <p>{{ term }}</p>
          </div>
        </div>
      </div>

      <!-- 底部声明 -->
      <div class="footer-notice">
        <div class="notice-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4"/>
            <path d="M12 8h.01"/>
          </svg>
        </div>
        <p>{{ t('agreement.footerNotice') }}</p>
      </div>

      <!-- 确认按钮 -->
      <button class="confirm-btn" @click="goBack">
        {{ t('common.confirm') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { t } from '@/locales'

const router = useRouter()

const terms = computed(() => [
  t('agreement.term1'),
  t('agreement.term2'),
  t('agreement.term3'),
  t('agreement.term4'),
  t('agreement.term5'),
  t('agreement.term6'),
  t('agreement.term7'),
  t('agreement.term8'),
  t('agreement.term9'),
  t('agreement.term10'),
])

const goBack = () => {
  router.back()
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.agreement-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fff5f5 0%, #ffffff 100%);
  max-width: 640px;
  margin: 0 auto;
  position: relative;
  overflow-x: hidden;
}

/* 装饰背景 */
.decorative-bg {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}

.pattern-dots {
  position: absolute;
  top: 100px;
  right: -50px;
  width: 200px;
  height: 200px;
  background-image: radial-gradient(#fb2351 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.pattern-lines {
  position: absolute;
  bottom: 200px;
  left: -30px;
  width: 150px;
  height: 150px;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(251, 35, 81, 0.05) 10px,
    rgba(251, 35, 81, 0.05) 11px
  );
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

/* 顶部导航 */
.agreement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  padding: 0 12px;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 15px rgba(251, 35, 81, 0.25);
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.header-title {
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  letter-spacing: 0.5px;
}

.header-right {
  width: 36px;
}

/* 内容区域 */
.agreement-content {
  position: relative;
  z-index: 1;
  padding: 20px 15px 40px;
}

/* Logo区域 */
.logo-section {
  text-align: center;
  padding: 30px 20px;
  margin-bottom: 25px;
}

.logo-icon {
  width: 70px;
  height: 70px;
  margin: 0 auto 15px;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(251, 35, 81, 0.3);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 10px 30px rgba(251, 35, 81, 0.3); }
  50% { transform: scale(1.05); box-shadow: 0 15px 40px rgba(251, 35, 81, 0.4); }
}

.logo-icon svg {
  width: 36px;
  height: 36px;
  color: #fff;
}

.logo-title {
  font-size: 22px;
  font-weight: 700;
  color: #333;
  margin: 0 0 8px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-subtitle {
  font-size: 14px;
  color: #888;
  margin: 0;
}

/* 条款容器 */
.terms-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 条款卡片 */
.term-card {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: #fff;
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(251, 35, 81, 0.08);
  transition: all 0.3s ease;
  animation: slideIn 0.5s ease forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.term-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(251, 35, 81, 0.12);
  border-color: rgba(251, 35, 81, 0.15);
}

.term-number {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}

.term-content {
  flex: 1;
  padding-top: 6px;
}

.term-content p {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #555;
}

/* 底部声明 */
.footer-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: linear-gradient(135deg, #fff5f5, #fff);
  padding: 18px;
  border-radius: 14px;
  margin: 25px 0;
  border: 1px dashed rgba(251, 35, 81, 0.2);
}

.notice-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  color: #fb2351;
  margin-top: 2px;
}

.footer-notice p {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #888;
}

/* 确认按钮 */
.confirm-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(45deg, #fb2351, #ff4b3e);
  color: #fff;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 25px rgba(251, 35, 81, 0.3);
  letter-spacing: 1px;
}

.confirm-btn:active {
  transform: scale(0.98);
  box-shadow: 0 5px 15px rgba(251, 35, 81, 0.3);
}

/* 响应式调整 */
@media (max-width: 400px) {
  .term-card {
    padding: 15px;
    gap: 12px;
  }

  .term-number {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }

  .term-content p {
    font-size: 13px;
  }
}
</style>