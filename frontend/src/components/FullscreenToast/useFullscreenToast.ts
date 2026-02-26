import { ref } from 'vue'

export type FullscreenToastType = 'success' | 'error' | 'warning' | 'info'

export interface FullscreenToastOptions {
  type?: FullscreenToastType
  title?: string
  message: string
  duration?: number
  showProgress?: boolean
  closeOnClick?: boolean
}

// 当前显示的 toast 状态
const visible = ref(false)
const toastType = ref<FullscreenToastType>('info')
const toastTitle = ref('')
const toastMessage = ref('')
const toastDuration = ref(3000)
const showProgressBar = ref(true)
const closeOnOverlayClick = ref(true)

let timer: ReturnType<typeof setTimeout> | null = null
let resolvePromise: ((value: boolean) => void) | null = null

/**
 * 显示全屏 Toast
 */
export function showFullscreenToast(options: FullscreenToastOptions | string): Promise<boolean> {
  // 如果传入字符串，转换为对象
  const opts: FullscreenToastOptions = typeof options === 'string'
    ? { message: options }
    : options

  // 设置状态
  toastType.value = opts.type || 'info'
  toastTitle.value = opts.title || getDefaultTitle(opts.type)
  toastMessage.value = opts.message
  toastDuration.value = opts.duration || 3000
  showProgressBar.value = opts.showProgress !== false
  closeOnOverlayClick.value = opts.closeOnClick !== false

  // 显示
  visible.value = true

  // 返回 Promise，等待关闭
  return new Promise((resolve) => {
    resolvePromise = resolve
    startTimer()
  })
}

/**
 * 显示成功提示
 */
export function showFullscreenSuccess(message: string, title?: string): Promise<boolean> {
  return showFullscreenToast({
    type: 'success',
    title: title || '成功',
    message
  })
}

/**
 * 显示错误提示
 */
export function showFullscreenError(message: string, title?: string): Promise<boolean> {
  return showFullscreenToast({
    type: 'error',
    title: title || '错误',
    message
  })
}

/**
 * 显示警告提示
 */
export function showFullscreenWarning(message: string, title?: string): Promise<boolean> {
  return showFullscreenToast({
    type: 'warning',
    title: title || '警告',
    message
  })
}

/**
 * 显示信息提示
 */
export function showFullscreenInfo(message: string, title?: string): Promise<boolean> {
  return showFullscreenToast({
    type: 'info',
    title: title || '提示',
    message
  })
}

/**
 * 关闭 Toast
 */
export function closeFullscreenToast(): void {
  visible.value = false
  stopTimer()
  if (resolvePromise) {
    resolvePromise(true)
    resolvePromise = null
  }
}

// 启动定时器
function startTimer(): void {
  stopTimer()
  timer = setTimeout(() => {
    closeFullscreenToast()
  }, toastDuration.value)
}

// 停止定时器
function stopTimer(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

// 获取默认标题
function getDefaultTitle(type?: FullscreenToastType): string {
  switch (type) {
    case 'success':
      return '成功'
    case 'error':
      return '错误'
    case 'warning':
      return '警告'
    default:
      return '提示'
  }
}

/**
 * 使用全屏 Toast 的组合式函数
 */
export function useFullscreenToast() {
  return {
    visible,
    type: toastType,
    title: toastTitle,
    message: toastMessage,
    duration: toastDuration,
    showProgress: showProgressBar,
    closeOnClick: closeOnOverlayClick,
    show: showFullscreenToast,
    success: showFullscreenSuccess,
    error: showFullscreenError,
    warning: showFullscreenWarning,
    info: showFullscreenInfo,
    close: closeFullscreenToast
  }
}

// 默认导出
export default {
  show: showFullscreenToast,
  success: showFullscreenSuccess,
  error: showFullscreenError,
  warning: showFullscreenWarning,
  info: showFullscreenInfo,
  close: closeFullscreenToast,
  useFullscreenToast
}
