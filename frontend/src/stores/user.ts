import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/user'

interface UserInfo {
  uid: number
  username: string
  nickname: string
  name: string
  balance: number
  phone: string
  email: string
  userType: number
  type: number
  hasFundPwd: boolean
  grade: number
  fanDian: number
  testFlag?: number  // 是否为游客用户
}

// 从 localStorage 加载用户信息
function loadUserInfoFromStorage(): UserInfo | null {
  try {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('Failed to load userInfo from localStorage:', e)
  }
  return null
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(loadUserInfoFromStorage())
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  // 设置 Token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  // 设置用户信息
  function setUserInfo(info: any) {
    userInfo.value = {
      uid: info.uid || 0,
      username: info.username || '',
      nickname: info.nickname || info.username || '',
      name: info.name || '',
      balance: parseFloat(info.coin || info.balance || 0),
      phone: info.phone || '',
      email: info.email || '',
      userType: info.type || info.userType || 0,
      type: info.type || info.userType || 0,
      hasFundPwd: info.hasFundPwd || false,
      grade: info.grade || 1,
      fanDian: info.fanDian || 0,
      testFlag: info.testFlag || 0,
    }
    // 保存到 localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 获取用户信息
  async function getUserInfo() {
    try {
      const res = await userApi.getInfo()
      if (res.code === 0 && res.data) {
        setUserInfo({
          uid: res.data.uid,
          username: res.data.username,
          coin: res.data.coin,
          type: res.data.type,
          hasFundPwd: res.data.hasFundPwd,
          grade: res.data.grade,
          fanDian: res.data.fanDian,
        })
        return res.data
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
    return null
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout,
    getUserInfo,
  }
})
