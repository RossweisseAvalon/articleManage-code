<script setup>
import { userUpdatePasswordService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
const formRef = ref()
// 表单数据
const form = ref({
  old_pwd: '',
  new_pwd: '',
  re_pwd: ''
})
// 表单验证
const userStore = useUserStore()
const rules = {
  old_pwd: [
    { required: true, message: '请输入原密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        if (value !== userStore.password) {
          callback(new Error('原密码不正确'))
        } else {
          callback()
        }
      }, trigger: 'change' 
    }
  ],
  new_pwd: [
    { required: true, message: '请输入新密码', trigger: 'chagne' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'change' },
    { 
      validator: (rule, value, callback) => {
        if (value === form.value.old_pwd) {
          callback(new Error('新密码不能与原密码相同'))
        } else {
          callback()
        }
      }, trigger: 'change'
   }
  ],
  re_pwd: [
    { required: true, message: '请确认新密码', trigger: 'chagne' },
    {
      validator: (rule, value, callback) => {
        if (value !== form.value.new_pwd) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      }, trigger: 'change'
    }
  ]
}
// 修改密码
const router = useRouter()
const updatePwd = async () => {
  await formRef.value.validate()
  await userUpdatePasswordService(form.value)
  ElMessage.success('修改密码成功')
  // 密码修改后退出重新登录
  // 清空用户信息，token
  userStore.setToken('')
  userStore.setUser({})
  userStore.password = ''
  router.push('/login')
  }
</script>
<template>
  <page-container title="重置密码">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" style="width: 40%;">
      <el-form-item label="原密码" prop="old_pwd">
        <el-input v-model="form.old_pwd"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="new_pwd">
        <el-input v-model="form.new_pwd"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="re_pwd">
        <el-input v-model="form.re_pwd"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="updatePwd" type="primary">修改密码</el-button>
        <el-button @click="form={}">重置</el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
