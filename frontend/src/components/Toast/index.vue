<template>
  <Teleport to="body">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast-item"
        :class="[`toast-${toast.type}`]"
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </div>
          <div class="toast-text">
            <div v-if="toast.title" class="toast-title">{{ toast.title }}</div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from './useToast'

const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-item {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  min-width: 300px;
  max-width: 90vw;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(251, 35, 81, 0.25);
  display: flex;
  align-items: flex-start;
  padding: 16px;
  gap: 12px;
}

/* 成功状态 - 绿色渐变 */
.toast-success {
  border-left: 4px solid #4CAF50;
}
.toast-success .toast-icon {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

/* 错误状态 - 红色渐变（主色调） */
.toast-error {
  border-left: 4px solid #fb2351;
}
.toast-error .toast-icon {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
}

/* 警告状态 - 橙色渐变 */
.toast-warning {
  border-left: 4px solid #FF9800;
}
.toast-warning .toast-icon {
  background: linear-gradient(135deg, #FF9800, #f57c00);
}

/* 信息状态 - 粉红主题色 */
.toast-info {
  border-left: 4px solid #ff6b8a;
}
.toast-info .toast-icon {
  background: linear-gradient(135deg, #ff6b8a, #fb2351);
}

.toast-content {
  flex: 1;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
}

.toast-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(251, 35, 81, 0.3);
}

.toast-icon svg {
  width: 22px;
  height: 22px;
  color: #fff;
}

.toast-text {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.toast-message {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  word-break: break-word;
}

.toast-close {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toast-close:hover {
  background: #fb2351;
}

.toast-close svg {
  width: 14px;
  height: 14px;
  color: #999;
  transition: color 0.2s;
}

.toast-close:hover svg {
  color: #fff;
}

/* 动画效果 */
.toast-enter-active {
  transition: all 0.3s ease;
}

.toast-leave-active {
  transition: all 0.3s ease;
  position: absolute;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
