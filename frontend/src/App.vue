<template>
  <router-view v-slot="{ Component }">
    <transition :name="transitionName" mode="out-in">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="routeKey" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const transitionName = ref('slide-left')

const routeKey = computed(() => route.fullPath)

const cachedViews = ['Home', 'Game', 'UserCenter', 'Deposit', 'Withdraw', 'WeekRecord', 'DayRecord', 'NotCount', 'Settled']

// 监听路由变化，控制滑动方向
watch(() => route.path, (newPath) => {
  if (newPath === '/home' || newPath === '/') {
    transitionName.value = 'slide-right'
  } else {
    transitionName.value = 'slide-left'
  }
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

/* 页面切换动画 */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.38s cubic-bezier(0.32, 0.72, 0, 1);
  will-change: transform, opacity;
}

/* 从右向左滑入 */
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(-25%);
  opacity: 0.6;
}

/* 从左向右滑入 */
.slide-right-enter-from {
  transform: translateX(-25%);
  opacity: 0.6;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
