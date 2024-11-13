<script setup>
import avatar from '@/assets/default.png'
import { useUserStore } from '@/stores'
import {
  CaretBottom,
  Crop,
  EditPen,
  Management,
  Promotion,
  SwitchButton,
  User,
  UserFilled,
} from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
// 获取用户数据
const userStore = useUserStore()
userStore.getUser()

// 下拉菜单处理
const router = useRouter()
const handleCommand = async (key) => {
  if (key === 'logout') {
    // 退出，异步 会返回 promise ，成功才继续执行
    await ElMessageBox.confirm('你确认要退出吗', '温馨提示', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    })
    // 清空 token 和 user 信息后跳转到登录页
    userStore.setToken('')
    userStore.setUser({})
    // 清空密码
    userStore.password = ''
    router.push('/login')
  }
  else {
    router.push(`/user/${key}`)
  }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo" />
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        :default-active="$route.path"
        text-color="#fff"
        router
      >
        <el-menu-item index="/article/channel">
          <el-icon><Management /></el-icon>
          <span>文章分类</span>
        </el-menu-item>
        <el-menu-item index="/article/manage">
          <el-icon><Promotion /></el-icon>
          <span>文章管理</span>
        </el-menu-item>
        <el-sub-menu index="/user">
          <template #title>
            <el-icon><UserFilled /></el-icon>
            <span>个人中心</span>
          </template>
          <el-menu-item index="/user/profile">
            <el-icon><User /></el-icon>
            <span>基本资料</span>
          </el-menu-item>
          <el-menu-item index="/user/avatar">
            <el-icon><Crop /></el-icon>
            <span>更换头像</span>
          </el-menu-item>
          <el-menu-item index="/user/password">
            <el-icon><EditPen /></el-icon>
            <span>重置密码</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div>ID：<strong>{{ userStore.user.nickname || userStore.user.username }}</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
            <el-avatar :src="userStore.user.user_pic || avatar" />
            <el-icon><CaretBottom /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile" :icon="User">
                基本资料
              </el-dropdown-item>
              <el-dropdown-item command="avatar" :icon="Crop">
                更换头像
              </el-dropdown-item>
              <el-dropdown-item command="password" :icon="EditPen">
                重置密码
              </el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
      <el-footer>后台数据管理系统</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    &__logo {
      height: 120px;
      background: url('') no-repeat center / 120px auto;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        margin-left: 10px;
        color: #999;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>
