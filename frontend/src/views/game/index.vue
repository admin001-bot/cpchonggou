<template>
  <div class="game-page">
    <header class="header">
      <div class="logo">彩票系统</div>
      <nav class="nav">
        <router-link to="/home">首页</router-link>
        <router-link to="/user">个人中心</router-link>
      </nav>
    </header>

    <div class="game-content">
      <h2>{{ gameType }} 游戏</h2>
      <p>游戏功能开发中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const gameType = computed(() => {
  const type = route.params.type as string
  const typeMap: Record<string, string> = {
    cqssc: '重庆时时彩',
    pk10: 'PK10',
    gdkl10: '广东快乐十分',
    xync: '幸运农场',
    pcdd: 'PC蛋蛋',
    bjkl8: '北京快乐8',
    gd11x5: '广东11选5',
    jsk3: '江苏快3',
    xyft: '幸运飞艇',
    lhc: '六合彩',
  }
  return typeMap[type] || type
})
</script>

<style scoped>
.game-page {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
  background: #409eff;
  color: white;
}

.logo {
  font-size: 20px;
  font-weight: bold;
}

.nav a {
  margin-left: 20px;
  color: white;
  text-decoration: none;
}

.game-content {
  padding: 40px 20px;
  text-align: center;
}
</style>
