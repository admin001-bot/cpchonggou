<template>
  <transition name="fade">
    <div v-if="visible" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner-circle"></div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean
}>()
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 单圆旋转加载器 */
.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(231, 76, 60, 0.2);
  border-top-color: #e74c3c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
