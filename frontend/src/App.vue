<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('slide-forward')

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
  overflow: hidden;
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
