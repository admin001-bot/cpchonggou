import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  uid: number
  username: string
  name: string
  balance: number
  phone: string
  email: string
  userType: number
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)
  const isLoggedIn = ref<boolean>(false)

  // 设置Token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('token', newToken)
    isLoggedIn.value = true
  }

  // 设置用户信息
  function setUserInfo(info: UserInfo) {
    userInfo.value = info
    isLoggedIn.value = true
  }

  // 登出
  function logout() {
    token.value = ''
    userInfo.value = null
    isLoggedIn.value = false
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout,
  }
})
