<template>
  <div class="demo-page">
    <div class="demo-header">
      <h1>全局提示组件演示</h1>
      <p>红白主题风格的 Toast 和 Modal 提示组件</p>
    </div>

    <!-- Toast 演示区 -->
    <div class="demo-section">
      <h2>Toast 轻提示</h2>
      <p class="demo-desc">轻量级提示，自动关闭，适合简短的消息通知</p>

      <div class="demo-buttons">
        <button class="btn btn-success" @click="showSuccessToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          成功提示
        </button>

        <button class="btn btn-error" @click="showErrorToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          错误提示
        </button>

        <button class="btn btn-warning" @click="showWarningToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          警告提示
        </button>

        <button class="btn btn-info" @click="showInfoToast">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          信息提示
        </button>
      </div>
    </div>

    <!-- Modal 演示区 -->
    <div class="demo-section">
      <h2>Modal 对话框</h2>
      <p class="demo-desc">模态对话框，需要用户确认或输入，适合重要的消息和操作确认</p>

      <div class="demo-buttons">
        <button class="btn btn-success" @click="showSuccessModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M9 12l2 2 4-4"/>
          </svg>
          成功弹窗
        </button>

        <button class="btn btn-error" @click="showErrorModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          错误弹窗
        </button>

        <button class="btn btn-warning" @click="showConfirmModal">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          确认弹窗
        </button>
      </div>
    </div>

    <!-- API 演示 -->
    <div class="demo-section">
      <h2>API 调用演示</h2>
      <p class="demo-desc">模拟后端接口调用，展示全局错误处理</p>

      <div class="demo-buttons">
        <button class="btn btn-primary" @click="simulateApiSuccess">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          模拟成功响应
        </button>

        <button class="btn btn-danger" @click="simulateApiError">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          模拟错误响应
        </button>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="demo-footer">
      <button class="btn btn-back" @click="goBack">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { showSuccess, showError, showWarning, showInfo } from '@/components/Toast/useToast'
import { showSuccessModal, showErrorModal, showConfirmModal } from '@/components/Modal/useModal'

const router = useRouter()

// Toast 演示
const showSuccessToast = () => {
  showSuccess('操作成功完成！', '成功')
}

const showErrorToast = () => {
  showError('操作失败，请重试！', '错误')
}

const showWarningToast = () => {
  showWarning('请注意检查输入内容！', '警告')
}

const showInfoToast = () => {
  showInfo('这是一条普通的消息提示！', '提示')
}

// Modal 演示
const showSuccessModalDemo = () => {
  showSuccessModal('您的操作已成功完成！', '操作成功')
}

const showErrorModalDemo = () => {
  showErrorModal('操作过程中发生错误，请稍后重试或联系客服。', '操作失败')
}

const showConfirmModalDemo = () => {
  showConfirmModal(
    '您确定要执行此操作吗？此操作不可撤销。',
    '确认操作',
    {
      confirmText: '确认执行',
      cancelText: '取消',
      onConfirm: () => {
        showSuccess('操作已确认执行！')
      },
      onCancel: () => {
        showInfo('操作已取消')
      }
    }
  )
}

// API 模拟
const simulateApiSuccess = () => {
  showSuccess('数据加载成功！')
}

const simulateApiError = () => {
  showError('网络请求失败，请检查网络连接后重试！')
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
