<script setup>
import { userUpdateInfoService } from '@/api/user'
import { useUserStore } from '@/stores'
import { ref } from 'vue'

const userStore = useUserStore() // 获取用户数据
const formRef = ref()
// 表单数据，从仓库中获取回显以及提交修改
const formModel = ref({
  username: userStore.user.username,
  nickname: userStore.user.nickname,
  email: userStore.user.email,
  id: userStore.user.id,
})
// 校验规则
const rules = {
  nickname: [
    { required: true, message: '昵称不能为空', trigger: 'change' },
    { pattern: /^\S{2,10}$/, message: '昵称长度为2-10个非空字符', trigger: 'change' },
  ],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'change' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'change' },
  ],
}

// 表单提交
const submit = async () => {
  // 校验
  await formRef.value.validate()
  // 提交修改
  await userUpdateInfoService(formModel.value)
  // 通知user模块更新数据
  userStore.getUser()
  // 提示成功
  ElMessage.success('修改成功')
}
</script>

<template>
  <page-container title="基本资料">
    <el-form ref="formRef" :model="formModel" :rules="rules" label-width="100px" style="width: 40%;">
      <el-form-item label="登录名称" prop="username">
        <el-input v-model="formModel.username" disabled />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formModel.nickname" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="email">
        <el-input v-model="formModel.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">
          提交修改
        </el-button>
      </el-form-item>
    </el-form>
  </page-container>
</template>
