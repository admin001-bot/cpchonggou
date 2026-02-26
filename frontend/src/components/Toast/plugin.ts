import type { App } from 'vue'
import Toast from './index.vue'
import { showToast, showSuccess, showError, showWarning, showInfo, clearAllToasts, removeToast } from './useToast'

// 创建 Toast 插件
export const ToastPlugin = {
  install(app: App) {
    // 注册 Toast 组件
    app.component('GlobalToast', Toast)

    // 全局属性
    app.config.globalProperties.$toast = {
      show: showToast,
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
      clear: clearAllToasts,
      remove: removeToast
    }

    // 全局方法
    app.provide('toast', {
      show: showToast,
      success: showSuccess,
      error: showError,
      warning: showWarning,
      info: showInfo,
      clear: clearAllToasts,
      remove: removeToast
    })
  }
}

// 默认导出
export default ToastPlugin

// 导出方法供独立使用
export {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  clearAllToasts,
  removeToast
}

// 声明全局属性类型
declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: {
      show: typeof showToast
      success: typeof showSuccess
      error: typeof showError
      warning: typeof showWarning
      info: typeof showInfo
      clear: typeof clearAllToasts
      remove: typeof removeToast
    }
  }
}
