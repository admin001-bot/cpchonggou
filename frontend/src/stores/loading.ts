import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false)

  // 资源加载状态
  const stylesLoaded = ref(false)
  const imagesLoaded = ref(false)
  const domReady = ref(false)

  // 检查所有资源是否加载完成
  const checkAllLoaded = () => {
    return stylesLoaded.value && domReady.value
  }

  const show = () => {
    isLoading.value = true
    // 重置加载状态
    stylesLoaded.value = false
    imagesLoaded.value = false
    domReady.value = false
  }

  const hide = () => {
    isLoading.value = false
  }

  // 标记样式已加载
  const markStylesLoaded = () => {
    stylesLoaded.value = true
  }

  // 标记图片已加载
  const markImagesLoaded = () => {
    imagesLoaded.value = true
  }

  // 标记 DOM 已就绪
  const markDomReady = () => {
    domReady.value = true
  }

  return {
    isLoading,
    stylesLoaded,
    imagesLoaded,
    domReady,
    show,
    hide,
    checkAllLoaded,
    markStylesLoaded,
    markImagesLoaded,
    markDomReady,
  }
})
