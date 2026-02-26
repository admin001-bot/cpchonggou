<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-container" :class="[`modal-${type}`]">
          <!-- 头部 -->
          <div class="modal-header">
            <div class="modal-icon">
              <!-- 成功图标 -->
              <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <!-- 错误图标 -->
              <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <!-- 警告图标 -->
              <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <!-- 信息图标 -->
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
            </div>
            <button v-if="showClose" class="modal-close" @click="handleClose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <!-- 内容 -->
          <div class="modal-body">
            <h3 v-if="title" class="modal-title">{{ title }}</h3>
            <p class="modal-message">{{ message }}</p>
          </div>

          <!-- 底部按钮 -->
          <div v-if="showFooter" class="modal-footer">
            <button
              v-if="showCancel"
              class="modal-btn modal-btn-cancel"
              @click="handleCancel"
            >
              {{ cancelText }}
            </button>
            <button
              class="modal-btn modal-btn-confirm"
              :class="[`btn-${type}`]"
              @click="handleConfirm"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export type ModalType = 'success' | 'error' | 'warning' | 'info'

interface Props {
  visible: boolean
  type?: ModalType
  title?: string
  message: string
  showClose?: boolean
  showFooter?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  closeOnClickOverlay?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  showClose: true,
  showFooter: true,
  showCancel: false,
  confirmText: '确定',
  cancelText: '取消',
  closeOnClickOverlay: true
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
}

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.modal-container {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  animation: modalIn 0.3s ease;
}

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 不同类型顶部装饰条 */
.modal-success .modal-header {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
}

.modal-error .modal-header {
  background: linear-gradient(135deg, #fb2351 0%, #ff4b3e 100%);
}

.modal-warning .modal-header {
  background: linear-gradient(135deg, #FF9800 0%, #f57c00 100%);
}

.modal-info .modal-header {
  background: linear-gradient(135deg, #ff6b8a 0%, #fb2351 100%);
}

.modal-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.modal-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.modal-icon svg {
  width: 28px;
  height: 28px;
}

.modal-success .modal-icon svg {
  color: #4CAF50;
}

.modal-error .modal-icon svg {
  color: #fb2351;
}

.modal-warning .modal-icon svg {
  color: #FF9800;
}

.modal-info .modal-icon svg {
  color: #fb2351;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.4);
}

.modal-close svg {
  width: 16px;
  height: 16px;
  color: #fff;
}

.modal-body {
  padding: 20px;
  text-align: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px;
}

.modal-message {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.modal-footer {
  padding: 0 20px 20px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.modal-btn {
  flex: 1;
  max-width: 140px;
  padding: 12px 24px;
  border: none;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-btn-cancel {
  background: #f5f5f5;
  color: #666;
}

.modal-btn-cancel:hover {
  background: #e8e8e8;
}

.modal-btn-confirm {
  color: #fff;
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.btn-success:hover {
  background: linear-gradient(135deg, #45a049, #3d8b40);
}

.btn-error {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
}

.btn-error:hover {
  background: linear-gradient(135deg, #e91e4d, #f44336);
}

.btn-warning {
  background: linear-gradient(135deg, #FF9800, #f57c00);
}

.btn-warning:hover {
  background: linear-gradient(135deg, #f57c00, #ef6c00);
}

.btn-info {
  background: linear-gradient(135deg, #fb2351, #ff6b8a);
}

.btn-info:hover {
  background: linear-gradient(135deg, #e91e4d, #fb2351);
}

/* 动画效果 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}
</style>
