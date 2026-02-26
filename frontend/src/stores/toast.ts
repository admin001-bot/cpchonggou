import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
  type?: ToastType
  title?: string
  message: string
  duration?: number
  showProgress?: boolean
  closeOnClick?: boolean
}

export const useToastStore = defineStore('toast', () => {
  // 状态
  const visible = ref(false)
  const toastType = ref<ToastType>('info')
  const toastTitle = ref('')
  const toastMessage = ref('')
  const toastDuration = ref(3000)
  const showProgressBar = ref(true)
  const closeOnOverlayClick = ref(true)

  let timer: ReturnType<typeof setTimeout> | null = null

  // Getters
  const isVisible = computed(() => visible.value)
  const currentType = computed(() => toastType.value)
  const currentTitle = computed(() => toastTitle.value)
  const currentMessage = computed(() => toastMessage.value)
  const currentDuration = computed(() => toastDuration.value)
  const shouldShowProgress = computed(() => showProgressBar.value)
  const shouldCloseOnClick = computed(() => closeOnOverlayClick.value)

  // Actions
  function show(options: ToastOptions) {
    // 停止之前的定时器
    stopTimer()

    // 设置状态
    toastType.value = options.type || 'info'
    toastTitle.value = options.title || getDefaultTitle(options.type)
    toastMessage.value = options.message
    toastDuration.value = options.duration || 3000
    showProgressBar.value = options.showProgress !== false
    closeOnOverlayClick.value = options.closeOnClick !== false

    // 显示
    visible.value = true

    // 启动定时器
    startTimer()
  }

  function close() {
    visible.value = false
    stopTimer()
  }

  function startTimer() {
    stopTimer()
    timer = setTimeout(() => {
      close()
    }, toastDuration.value)
  }

  function stopTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function getDefaultTitle(type?: ToastType): string {
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

  return {
    // 状态
    visible,
    toastType,
    toastTitle,
    toastMessage,
    toastDuration,
    showProgressBar,
    closeOnOverlayClick,
    // Getters
    isVisible,
    currentType,
    currentTitle,
    currentMessage,
    currentDuration,
    shouldShowProgress,
    shouldCloseOnClick,
    // Actions
    show,
    close,
    startTimer,
    stopTimer
  }
})
