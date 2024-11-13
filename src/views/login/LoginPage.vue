<script setup>
import { userLoginService, userRegisterService } from '@/api/user'
import { useUserStore } from '@/stores'
import { Lock, User } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
// 登录注册切换
const isRegister = ref(false)
// 用于获取form表单dom
const formRef = ref()
// 用于注册登录提交的数据对象
const formModel = ref({
  username: '',
  password: '',
  repassword: '',
})
// 表单校验规则
// 1.非空 required ，message 提示，trigger 触发时机 blur(失焦) change(值改变)
// 2.长度 min，max
// 3.正则 pattern   \S 非空字符
// 4.自定义校验：
//   validator: (rule, value, caliback)
//   (1) rule 当前校验规则相关的信息
//   (2) value 所校验的表单元素目前的表单值
//   (2) caliback 无论成功失败，都需要 caliback 回调
//         - caliback() 校验成功
//         - calibakc(new Error(错误信息)) 校验失败
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'change' },
    { min: 5, max: 10, message: '用户名必须是5-10位的字符', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'change' },
  ],
  repassword: [
    { required: true, message: '请输入密码', trigger: 'change' },
    { pattern: /^\S{6,15}$/, message: '密码必须是6-15位的非空字符', trigger: 'change' },
    {
      validator: (rule, value, caliback) => {
        // 判断 value 和 当前 form 中收集的 password 是否一致
        if (value !== formModel.value.password) {
          caliback(new Error('两次输入的密码不一致'))
        }
        else {
          caliback() // 校验成功也需要 caliback()
        }
      },
    },
  ],
}

const userStore = useUserStore()
// 注册
const register = async () => {
  // 注册成功之前，先进行校验，校验成功 -> 请求，校验失败 -> 自动提示
  await formRef.value.validate()
  // 调用注册接口
  await userRegisterService(formModel.value)
  // 将密码存在本地，用于后续修改验证
  userStore.password = formModel.value.password
  // 注册成功弹框
  ElMessage.success('注册成功')
  // 切换到登录页
  isRegister.value = false
}
// 登录
const router = useRouter()
const login = async () => {
  await formRef.value.validate()
  const res = await userLoginService(formModel.value)
  // 持久化到本地
  userStore.setToken(res.data.token)
  // 将密码存在本地，用于后续修改验证
  userStore.password = formModel.value.password
  ElMessage.success('登录成功')
  router.push('/')
}
// 切换注册登录重置表单，
watch(isRegister, () => {
  formModel.value = {
    username: '',
    password: '',
    repassword: '',
  }
})
</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg" />
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册 -->
      <el-form v-if="isRegister" ref="formRef" :model="formModel" :rules="rules" size="large" autocomplete="off">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="repassword">
          <el-input
            v-model="formModel.repassword"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入再次密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-form v-else ref="formRef" :model="formModel" :rules="rules" size="large" autocomplete="off">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="formModel.username" :prefix-icon="User" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formModel.password"
            name="password"
            :prefix-icon="Lock"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">
              忘记密码？
            </el-link>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login">
            登录
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background:
      url('') no-repeat 60% center / 240px auto,
      url('@/assets/丽塔.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
  }
}
</style>
