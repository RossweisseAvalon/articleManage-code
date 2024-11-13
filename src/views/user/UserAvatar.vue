<script setup>
import { userUpdateAvatarService } from '@/api/user'
import { useUserStore } from '@/stores'
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
// 基于stroe获取i用户头像初始值
const userStore = useUserStore()
const imageUrl = ref('')
imageUrl.value = userStore.user.user_pic
// 通过给upload绑定ref，获取到dom元素，在点击选择按钮时，调用dom元素的click方法，
const uploadRef = ref()
const selectFile = (uploadFile) => {
  // 基于 FileReader 本地预览（base64格式）
  const reader = new FileReader()
  reader.readAsDataURL(uploadFile.raw)
  reader.onload = () => {
    imageUrl.value = reader.result
  }
}
// 上传头像
const uploadAvatar = async () => {
  await userUpdateAvatarService(imageUrl.value)
  // 更新store，重新渲染
  await userStore.getUser()
  ElMessage.success('上传头像成功')
}
</script>

<template>
  <page-container title="更换头像">
    <el-upload
      ref="uploadRef"
      :on-change="selectFile"
      style="margin-bottom: 20px;"
      :auto-upload="false"
      :show-file-list="false"
      class="avatar-uploader"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <el-icon v-else class="avatar-uploader-icon">
        <Plus />
      </el-icon>
    </el-upload>
    <!-- $el: 用于获取组件内 DOM -->
    <el-button type="primary" :icon="Plus" @click="uploadRef.$el.querySelector('input').click()">
      选择图片
    </el-button>
    <el-button type="success" :icon="Upload" @click="uploadAvatar">
      上传头像
    </el-button>
  </page-container>
</template>

<style lang="scss" scoped>
.avatar-uploader,
.avatar {
  display: block;
  width: 225px;
  height: 225px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.el-icon {
  width: 225px;
  height: 225px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
