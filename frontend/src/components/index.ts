// 全局组件统一导出

// Toast 轻提示
export { default as GlobalToast } from './Toast/index.vue'
export {
  useToast,
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  removeToast,
  clearAllToasts
} from './Toast/useToast'
export { ToastPlugin } from './Toast/plugin'

// Modal 弹窗
export { default as GlobalModal } from './Modal/index.vue'
export {
  useModal,
  showModal,
  showSuccessModal,
  showErrorModal,
  showWarningModal,
  showConfirmModal
} from './Modal/useModal'

// 导出插件（用于全局注册）
export { ToastPlugin as default } from './Toast/plugin'
