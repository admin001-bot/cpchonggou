import { ref, h, render } from 'vue'
import type { VNode } from 'vue'
import Modal from './index.vue'

export type ModalType = 'success' | 'error' | 'warning' | 'info'

export interface ModalOptions {
  type?: ModalType
  title?: string
  message: string
  showClose?: boolean
  showFooter?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  closeOnClickOverlay?: boolean
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
}

// 当前显示的 modal 列表
const modals = ref<VNode[]>([])

/**
 * 创建并显示 Modal
 */
export function showModal(options: ModalOptions): void {
  const container = document.createElement('div')

  const vnode = h(Modal, {
    visible: true,
    type: options.type || 'info',
    title: options.title,
    message: options.message,
    showClose: options.showClose ?? true,
    showFooter: options.showFooter ?? true,
    showCancel: options.showCancel ?? false,
    confirmText: options.confirmText || '确定',
    cancelText: options.cancelText || '取消',
    closeOnClickOverlay: options.closeOnClickOverlay ?? true,
    'onUpdate:visible': (val: boolean) => {
      if (!val) {
        // 关闭时移除
        render(null, container)
        container.remove()
        options.onClose?.()
      }
    },
    onConfirm: () => {
      options.onConfirm?.()
    },
    onCancel: () => {
      options.onCancel?.()
    }
  })

  render(vnode, container)
  document.body.appendChild(container)
  modals.value.push(vnode)
}

/**
 * 显示成功弹窗
 */
export function showSuccessModal(message: string, title?: string): void {
  showModal({
    type: 'success',
    title: title || '成功',
    message,
    showCancel: false,
    confirmText: '确定'
  })
}

/**
 * 显示错误弹窗
 */
export function showErrorModal(message: string, title?: string): void {
  showModal({
    type: 'error',
    title: title || '错误',
    message,
    showCancel: false,
    confirmText: '确定'
  })
}

/**
 * 显示警告弹窗
 */
export function showWarningModal(message: string, title?: string): void {
  showModal({
    type: 'warning',
    title: title || '警告',
    message,
    showCancel: false,
    confirmText: '确定'
  })
}

/**
 * 显示确认弹窗
 */
export function showConfirmModal(
  message: string,
  title?: string,
  options?: {
    confirmText?: string
    cancelText?: string
    onConfirm?: () => void
    onCancel?: () => void
  }
): void {
  showModal({
    type: 'info',
    title: title || '确认',
    message,
    showCancel: true,
    confirmText: options?.confirmText || '确定',
    cancelText: options?.cancelText || '取消',
    onConfirm: options?.onConfirm,
    onCancel: options?.onCancel
  })
}

/**
 * 使用 Modal 的组合式函数
 */
export function useModal() {
  return {
    show: showModal,
    success: showSuccessModal,
    error: showErrorModal,
    warning: showWarningModal,
    confirm: showConfirmModal
  }
}

// 默认导出
export default {
  show: showModal,
  success: showSuccessModal,
  error: showErrorModal,
  warning: showWarningModal,
  confirm: showConfirmModal,
  useModal
}
