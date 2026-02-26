import { onMounted, onBeforeUnmount } from 'vue'
import { useLoadingStore } from '@/stores/loading'

/**
 * 检测页面资源加载完成的 composable
 */
export function useResourceLoader() {
  const loadingStore = useLoadingStore()

  // 检查所有样式是否加载完成
  const checkStylesLoaded = (): Promise<void> => {
    return new Promise((resolve) => {
      // 获取所有样式表
      const sheets = document.styleSheets

      // 如果没有样式表，直接返回
      if (!sheets || sheets.length === 0) {
        resolve()
        return
      }

      // 检查所有样式表是否已加载
      const checkInterval = setInterval(() => {
        let allLoaded = true

        for (let i = 0; i < sheets.length; i++) {
          const sheet = sheets[i]
          // 如果是外部样式表，检查是否加载完成
          if (sheet.href && !sheet.ownerNode) {
            allLoaded = false
            break
          }
        }

        if (allLoaded) {
          clearInterval(checkInterval)
          loadingStore.markStylesLoaded()
          resolve()
        }
      }, 50)

      // 最多等待 3 秒
      setTimeout(() => {
        clearInterval(checkInterval)
        loadingStore.markStylesLoaded()
        resolve()
      }, 3000)
    })
  }

  // 检查页面可见内容是否渲染完成
  const checkDomReady = (): Promise<void> => {
    return new Promise((resolve) => {
      if (document.readyState === 'complete') {
        loadingStore.markDomReady()
        resolve()
        return
      }

      const onReady = () => {
        loadingStore.markDomReady()
        resolve()
      }

      window.addEventListener('load', onReady, { once: true })

      // 备用方案：超时后强制标记为就绪
      setTimeout(() => {
        window.removeEventListener('load', onReady)
        loadingStore.markDomReady()
        resolve()
      }, 3000)
    })
  }

  // 等待所有资源加载完成
  const waitForAllLoaded = async (): Promise<void> => {
    await Promise.all([
      checkStylesLoaded(),
      checkDomReady(),
    ])
  }

  // 检查当前是否所有内容已加载
  const isAllLoaded = (): boolean => {
    return loadingStore.checkAllLoaded()
  }

  onBeforeUnmount(() => {
    // 清理监听器
    window.removeEventListener('load', () => {})
  })

  return {
    waitForAllLoaded,
    isAllLoaded,
    checkStylesLoaded,
    checkDomReady,
  }
}
