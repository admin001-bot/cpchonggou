<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>

  <!-- 全局全屏 Toast -->
  <FullscreenToast
    :visible="toastStore.isVisible"
    :type="toastStore.currentType"
    :title="toastStore.currentTitle"
    :message="toastStore.currentMessage"
    :duration="toastStore.currentDuration"
    :show-progress="toastStore.shouldShowProgress"
    @close="toastStore.close"
  />

  <!-- 全局加载动画 -->
  <LoadingOverlay
    :visible="loadingStore.isLoading"
  />
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import FullscreenToast from '@/components/FullscreenToast/index.vue'
import LoadingOverlay from '@/components/LoadingOverlay/index.vue'
import { useToastStore } from '@/stores/toast'
import { useLoadingStore } from '@/stores/loading'

// 路由动画
const route = useRoute()
const transitionName = ref('slide-forward')

// Toast store
const toastStore = useToastStore()

// Loading store
const loadingStore = useLoadingStore()

// 路由动画
let history: string[] = []

watch(() => route.path, (newPath) => {
  const lastPath = history[history.length - 1]
  if (lastPath === newPath) {
    history.pop()
    transitionName.value = 'slide-back'
  } else {
    history.push(newPath)
    transitionName.value = 'slide-forward'
  }
  if (history.length > 5) history = history.slice(-5)
}, { immediate: true })

// 初始化时检测资源加载
onMounted(() => {
  // 初始加载时显示加载动画直到资源加载完成
  loadingStore.show()

  // 等待所有资源加载完成
  setTimeout(() => {
    loadingStore.hide()
  }, 500)
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  height: 100%;
  font-family: 'Microsoft YaHei', sans-serif;
  background: #f5f5f5;
}

/* 新页面滑入 - 前进 */
.slide-forward-enter-active {
  animation: slideIn 0.25s ease-out;
}

.slide-forward-leave-active {
  animation: fadeOut 0.15s ease-out;
}

/* 新页面滑入 - 后退 */
.slide-back-enter-active {
  animation: slideInBack 0.25s ease-out;
}

.slide-back-leave-active {
  animation: fadeOutBack 0.15s ease-out;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes fadeOut {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(-10%); opacity: 0.8; }
}

@keyframes slideInBack {
  from { transform: translateX(-20%); }
  to { transform: translateX(0); }
}

@keyframes fadeOutBack {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(20%); opacity: 0.8; }
}
</style>
