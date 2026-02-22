<template>
  <div class="home-page">
    <header class="header">
      <div class="logo">彩票系统</div>
      <nav class="nav">
        <router-link to="/home">首页</router-link>
        <router-link to="/game/cqssc">时时彩</router-link>
        <router-link to="/game/pk10">PK10</router-link>
        <router-link to="/user" v-if="userStore.isLoggedIn">个人中心</router-link>
        <router-link to="/login" v-else>登录</router-link>
      </nav>
    </header>

    <main class="main">
      <h1>欢迎来到彩票系统</h1>
      <p>基于 Vue3 + Go + Gin 重构</p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<style scoped>
.home-page {
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

.nav a:hover {
  text-decoration: underline;
}

.main {
  padding: 40px 20px;
  text-align: center;
}

.main h1 {
  font-size: 32px;
  margin-bottom: 10px;
}

.main p {
  color: #666;
}
</style>
