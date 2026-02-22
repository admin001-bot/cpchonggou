<template>
  <div class="center-page">
    <header class="header">
      <div class="logo">彩票系统</div>
      <nav class="nav">
        <router-link to="/home">首页</router-link>
        <a href="#" @click.prevent="handleLogout">退出</a>
      </nav>
    </header>

    <div class="content">
      <el-card>
        <template #header>
          <span>个人中心</span>
        </template>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="用户名">{{ userStore.userInfo?.username }}</el-descriptions-item>
          <el-descriptions-item label="余额">{{ userStore.userInfo?.balance || 0 }}</el-descriptions-item>
          <el-descriptions-item label="手机">{{ userStore.userInfo?.phone || '未绑定' }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ userStore.userInfo?.email || '未绑定' }}</el-descriptions-item>
        </el-descriptions>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.center-page {
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

.content {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
