<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>{{ t('demo.title') }}</h1>
      <p>{{ t('demo.subtitle') }}</p>
    </div>

    <!-- Toast 演示区 -->
    <div class="demo-section">
      <h2>{{ t('demo.toastTitle') }}</h2>
      <p class="demo-desc">{{ t('demo.toastDesc') }}</p>

      <div class="demo-buttons">
        <button class="btn btn-success" @click="showSuccessToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          {{ t('demo.successToast') }}
        </button>

        <button class="btn btn-error" @click="showErrorToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ t('demo.errorToast') }}
        </button>

        <button class="btn btn-warning" @click="showWarningToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {{ t('demo.warningToast') }}
        </button>

        <button class="btn btn-info" @click="showInfoToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          {{ t('demo.infoToast') }}
        </button>
      </div>
    </div>

    <!-- Modal 演示区 -->
    <div class="demo-section">
      <h2>{{ t('demo.modalTitle') }}</h2>
      <p class="demo-desc">{{ t('demo.modalDesc') }}</p>

      <div class="demo-buttons">
        <button class="btn btn-success" @click="showSuccessModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          {{ t('demo.successModal') }}
        </button>

        <button class="btn btn-error" @click="showErrorModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ t('demo.errorModal') }}
        </button>

        <button class="btn btn-warning" @click="showConfirmModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          {{ t('demo.confirmModal') }}
        </button>
      </div>
    </div>

    <!-- API 演示 -->
    <div class="demo-section">
      <h2>{{ t('demo.apiTitle') }}</h2>
      <p class="demo-desc">{{ t('demo.apiDesc') }}</p>

      <div class="demo-buttons">
        <button class="btn btn-primary" @click="simulateApiSuccess">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          {{ t('demo.apiSuccess') }}
        </button>

        <button class="btn btn-danger" @click="simulateApiError">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ t('demo.apiError') }}
        </button>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="demo-footer">
      <button class="btn btn-back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        {{ t('demo.backHome') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { t } from '@/locales'
import { showSuccess, showError, showWarning, showInfo } from '@/components/Toast/useToast'
import { showSuccessModal, showErrorModal, showConfirmModal } from '@/components/Modal/useModal'

const router = useRouter()

// Toast 演示
const showSuccessToast = () => {
  showSuccess(t('demo.msgOperationSuccess'), t('toast.success'))
}

const showErrorToast = () => {
  showError(t('demo.msgOperationFailed'), t('toast.error'))
}

const showWarningToast = () => {
  showWarning(t('demo.msgCheckInput'), t('toast.warning'))
}

const showInfoToast = () => {
  showInfo(t('demo.msgInfoMessage'), t('toast.info'))
}

// Modal 演示
const showSuccessModalDemo = () => {
  showSuccessModal(t('demo.msgModalSuccess'), t('demo.operationSuccess'))
}

const showErrorModalDemo = () => {
  showErrorModal(t('demo.msgModalError'), t('demo.operationFailed'))
}

const showConfirmModalDemo = () => {
  showConfirmModal(
    t('demo.msgConfirmAction'),
    t('demo.confirmAction'),
    {
      confirmText: t('demo.confirmExecute'),
      cancelText: t('modal.cancel'),
      onConfirm: () => {
        showSuccess(t('demo.msgConfirmed'))
      },
      onCancel: () => {
        showInfo(t('demo.msgCancelled'))
      }
    }
  )
}

// API 模拟
const simulateApiSuccess = () => {
  showSuccess(t('demo.msgDataLoaded'))
}

const simulateApiError = () => {
  showError(t('demo.msgNetworkError'))
}

const goBack = () => {
  router.push('/home')
}
</script>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 20px;
  max-width: 640px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  padding: 20px 0;
  margin-bottom: 20px;
}

.demo-header h1 {
  font-size: 24px;
  color: #333;
  margin: 0 0 8px;
}

.demo-header p {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.demo-section {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.demo-section h2 {
  font-size: 16px;
  color: #333;
  margin: 0 0 8px;
}

.demo-desc {
  font-size: 13px;
  color: #999;
  margin: 0 0 16px;
}

.demo-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border: none;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn svg {
  width: 16px;
  height: 16px;
}

.btn-success {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: #fff;
}

.btn-success:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.4);
}

.btn-error {
  background: linear-gradient(135deg, #fb2351, #ff4b3e);
  color: #fff;
}

.btn-error:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 35, 81, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #FF9800, #f57c00);
  color: #fff;
}

.btn-warning:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #ff6b8a, #fb2351);
  color: #fff;
}

.btn-info:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(251, 35, 81, 0.4);
}

.btn-primary {
  background: linear-gradient(135deg, #2196F3, #1976D2);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #f44336, #d32f2f);
  color: #fff;
}

.btn-danger:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.btn-back {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.btn-back:hover {
  background: #f5f5f5;
}

.demo-footer {
  text-align: center;
  padding: 20px 0;
}
</style>
