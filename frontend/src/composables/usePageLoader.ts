import { useLoadingStore } from '@/stores/loading'

/**
 * 组件挂载时检测样式加载的 composable
 * 用在每个页面组件中，确保样式加载完成后才隐藏加载动画
 */
export function usePageLoader() {
  const loadingStore = useLoadingStore()

  // 等待样式加载完成
  const waitForStyles = async (timeout = 3000): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = Date.now()

      const checkStyles = () => {
        const sheets = document.styleSheets
        let allLoaded = true

        if (sheets && sheets.length > 0) {
          for (let i = 0; i < sheets.length; i++) {
            const sheet = sheets[i]
            if (sheet.href) {
              try {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const rules = sheet.cssRules || sheet.rules
              } catch {
                allLoaded = false
                break
              }
            }
          }
        }

        if (allLoaded) {
          resolve()
        } else if (Date.now() - startTime > timeout) {
          // 超时也继续
          resolve()
        } else {
          setTimeout(checkStyles, 50)
        }
      }

      checkStyles()
    })
  }

  // 等待组件渲染完成
  const waitForRender = async (): Promise<void> => {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve()
        })
      })
    })
  }

  // 组件加载完成，可以隐藏加载动画
  const markLoaded = () => {
    loadingStore.hide()
  }

  return {
    waitForStyles,
    waitForRender,
    markLoaded,
  }
}
