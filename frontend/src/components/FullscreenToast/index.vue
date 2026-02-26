<template>
  <Teleport to="body">
    <Transition name="fullscreen-toast">
      <div v-if="toastStore.isVisible" class="fullscreen-toast-overlay" @click.self="handleClickOverlay">
        <div class="fullscreen-toast-container" :class="[`toast-${toastStore.currentType}`]">
          <!-- 图标 -->
          <div class="toast-icon-wrapper">
            <!-- 成功图标 -->
            <svg v-if="toastStore.currentType === 'success'" class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <!-- 错误图标 -->
            <svg v-else-if="toastStore.currentType === 'error'" class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <!-- 警告图标 -->
            <svg v-else-if="toastStore.currentType === 'warning'" class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <!-- 信息图标 -->
            <svg v-else class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>

          <!-- 标题 -->
          <h2 v-if="toastStore.currentTitle" class="toast-title">{{ toastStore.currentTitle }}</h2>

          <!-- 内容 -->
          <p class="toast-message">{{ toastStore.currentMessage }}</p>

          <!-- 倒计时进度条 -->
          <div v-if="toastStore.shouldShowProgress" class="progress-bar">
            <div class="progress-fill" :style="{ animationDuration: `${toastStore.currentDuration}ms` }"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const handleClickOverlay = () => {
  if (toastStore.shouldCloseOnClick) {
    toastStore.close()
  }
}
</script>

<style scoped>
/* 遮罩层 - 全屏模糊效果 */
.fullscreen-toast-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* 内容容器 */
.fullscreen-toast-container {
  background: #fff;
  border-radius: 20px;
  padding: 40px 30px;
  max-width: 320px;
  width: 100%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: containerIn 0.3s ease;
}

@keyframes containerIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 不同类型顶部装饰条 */
.toast-success .toast-icon-wrapper {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.toast-error .toast-icon-wrapper {
  background: linear-gradient(135deg, #fb2351 0%, #ff4b3e 100%);
}

.toast-warning .toast-icon-wrapper {
  background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%);
}

.toast-info .toast-icon-wrapper {
  background: linear-gradient(135deg, #ff6b8a 0%, #fb2351 100%);
}

/* 图标样式 */
.toast-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 8px 20px rgba(251, 35, 81, 0.3);
}

.toast-icon {
  width: 40px;
  height: 40px;
  color: #fff;
}

/* 标题 */
.toast-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px;
  line-height: 1.4;
}

/* 不同状态的标题颜色 */
.toast-success .toast-title {
  color: #4CAF50;
}

.toast-error .toast-title {
  color: #fb2351;
}

.toast-warning .toast-title {
  color: #FF9800;
}

.toast-info .toast-title {
  color: #fb2351;
}

/* 消息内容 */
.toast-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
  word-break: break-word;
}

/* 进度条 */
.progress-bar {
  height: 3px;
  background: #f0f0f0;
  border-radius: 2px;
  margin-top: 24px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #fb2351, #ff4b3e);
  border-radius: 2px;
  animation: progress linear forwards;
}

@keyframes progress {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}

/* 进入动画 */
.fullscreen-toast-enter-active {
  transition: all 0.3s ease;
}

.fullscreen-toast-enter-from {
  opacity: 0;
}

.fullscreen-toast-enter-from .fullscreen-toast-container {
  transform: scale(0.8);
  opacity: 0;
}

/* 离开动画 */
.fullscreen-toast-leave-active {
  transition: all 0.2s ease;
}

.fullscreen-toast-leave-to {
  opacity: 0;
}

.fullscreen-toast-leave-to .fullscreen-toast-container {
  transform: scale(0.9);
  opacity: 0;
}
</style>
