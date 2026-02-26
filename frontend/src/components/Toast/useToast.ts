import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  id?: string
  type?: ToastType
  title?: string
  message: string
  duration?: number
  closable?: boolean
}

export interface ToastItem extends Required<ToastOptions> {
  id: string
}

// 全局 toast 列表
const toasts = ref<ToastItem[]>([])
let toastId = 0

// 默认配置
const defaultOptions: Partial<ToastOptions> = {
  type: 'info',
  duration: 3000,
  closable: true
}

/**
 * 显示 Toast 提示
 */
export function showToast(options: ToastOptions | string): string {
  // 如果传入字符串，转换为对象
  const opts: ToastOptions = typeof options === 'string'
    ? { message: options }
    : options

  // 合并配置
  const config: ToastItem = {
    ...defaultOptions,
    ...opts,
    id: opts.id || `toast-${++toastId}`,
    type: opts.type || 'info',
    duration: opts.duration ?? 3000,
    closable: opts.closable ?? true,
    title: opts.title || ''
  }

  // 添加到列表
  toasts.value.push(config)

  // 设置自动关闭
  if (config.duration > 0) {
    setTimeout(() => {
      removeToast(config.id)
    }, config.duration)
  }

  return config.id
}

/**
 * 显示成功提示
 */
export function showSuccess(message: string, title?: string): string {
  return showToast({
    type: 'success',
    message,
    title: title || '成功',
    duration: 3000
  })
}

/**
 * 显示错误提示
 */
export function showError(message: string, title?: string): string {
  return showToast({
    type: 'error',
    message,
    title: title || '错误',
    duration: 5000
  })
}

/**
 * 显示警告提示
 */
export function showWarning(message: string, title?: string): string {
  return showToast({
    type: 'warning',
    message,
    title: title || '警告',
    duration: 4000
  })
}

/**
 * 显示信息提示
 */
export function showInfo(message: string, title?: string): string {
  return showToast({
    type: 'info',
    message,
    title: title || '提示',
    duration: 3000
  })
}

/**
 * 移除指定 Toast
 */
export function removeToast(id: string): void {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

/**
 * 清空所有 Toast
 */
export function clearAllToasts(): void {
  toasts.value = []
}

/**
 * 使用 Toast 的组合式函数
 */
export function useToast() {
  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts
  }
}

// 默认导出
export default {
  showToast,
  showSuccess,
  showError,
  showWarning,
  showInfo,
  removeToast,
  clearAllToasts,
  useToast
}
