import { userGetInfoService } from '@/api/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 用户模块
export const useUserStore = defineStore('user', () => {
  // token
  const token = ref('')
  const setToken = (newToken) => token.value = newToken
  // user
  const user = ref({})
  const getUser = async () => {
    const res = await userGetInfoService()    
    user.value = res.data.data
  }
  const setUser = (obj) => user.value = obj
  // 用户密码
  const password = ref('')
  return {
    token,
    setToken,
    user,
    getUser,
    setUser,
    password,
  }
}, {
  persist: true
})