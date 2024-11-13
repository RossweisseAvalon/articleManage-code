<script setup>
import { artAddService, artEditService, artGetDetailService } from '@/api/article'
import { baseURL } from '@/utils/request' // 回显图片需使用基地址
import { Plus } from '@element-plus/icons-vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import axios from 'axios'

import { ref, shallowRef } from 'vue'
import ChannelSelect from './ChannelSelect.vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
// 提交
const emit = defineEmits(['success'])
const btnBisabled = ref(false)
// 控制抽屉显示隐藏
const drawer = ref(false)
// 发布默认数据
const defaultForm = {
  title: '',
  cate_id: '',
  content: '',
  cover_img: '',
  state: '',
}
// 发布文章的数据
const formModel = ref({ ...defaultForm })
// 图片上传相关
const imgUrl = ref('')
const selectFile = (uploadFile) => {
  // 预览图片 URL.createObjectURL(...)回显
  imgUrl.value = URL.createObjectURL(uploadFile.raw)
  // 立刻将图片存入formModel.value.cover_img，用于发布提交
  formModel.value.cover_img = uploadFile.raw
}
// 富文本相关
const editorRef = shallowRef()
const editorConfig = { placeholder: '请输入内容...' }
const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
// 基于父组件传递的row，添加/编辑
const open = async (row) => {
  if (row.id) {
    // 基于row.id发送请求，获取编辑对应的回显数据
    const res = await artGetDetailService(row.id)
    // 将获取的数据赋值给formModel回显
    formModel.value = res.data.data
    // 图片回显需单独处理
    imgUrl.value = baseURL + formModel.value.cover_img

    // 提交给后台，需要的数据格式是file对象格式
    // 需要将网络图片地址转换成file对象
    const file = await urlToFile(imgUrl.value, formModel.value.cover_img, 'image/jpeg')
    formModel.value.cover_img = file
  }
  else {
    // 基于默认数据重置form数据
    formModel.value = { ...defaultForm }
    imgUrl.value = '' // 清空图片
  }
  drawer.value = true // 关闭抽屉
}
// 准备子传父
const publish = async (state) => {
  // 将state('已发布'或'草稿')状态存入
  formModel.value.state = state
  // 需要的是 formData 格式对象
  const fd = new FormData() // 创建 formdata 对象实例
  // 使用遍历，然后通过append的方法累加
  for (const key in formModel.value) {
    fd.append(key, formModel.value[key])
  }
  // 编辑
  if (formModel.value.id) {
    btnBisabled.value = true
    await artEditService(fd)
    ElMessage.success('编辑文章成功')
    btnBisabled.value = false
    drawer.value = false
    emit('success', 'edit')
  }
  else {
    // 添加
    btnBisabled.value = true
    await artAddService(fd)
    ElMessage.success('发布文章成功')
    btnBisabled.value = false
    drawer.value = false
    // 通知到父组件添加成功，父组件实现添加完后跳转到新文章所在页，add区分添加还是编辑
    emit('success', 'add')
  }
}

// 将网络图片地址转换成file对象
async function urlToFile(url, filename, mimeType) {
  try {
    // 获取图片的二进制数据
    const response = await axios.get(url, {
      responseType: 'blob', // 将响应数据作为Blob类型
    })
    const blob = response.data
    // 将Blob转换为File对象
    return new File([blob], filename, { type: mimeType })
  }
  catch (error) {
    console.error('Error fetching and converting image:', error)
    throw error
  }
}

defineExpose({
  open,
})
</script>

<template>
  <!-- 抽屉 -->
  <el-drawer v-model="drawer" :title="formModel.id ? '编辑文章' : '添加文章'" size="50%">
    <el-form label-width="100px">
      <el-form-item label="文章标题">
        <el-input v-model="formModel.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="文章分类">
        <ChannelSelect v-model="formModel.cate_id" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="文章封面">
        <!-- 此处需关闭element-plus的自动上传，不需要配置action等参数 -->
        <!-- 只做前端本地预览，不做在提交之前上传图片 -->
        <!-- 语法：URL.createObjectURL(...) -->
        <el-upload
          class="avatar-uploader"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="selectFile"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar">
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item label="文章内容">
        <div style="border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
          />
          <Editor
            v-model="formModel.content"
            style="height: 500px; overflow-y: hidden;"
            :default-config="editorConfig"
            @on-created="handleCreated"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="btnBisabled" type="primary" @click="publish('已发布')">
          发布
        </el-button>
        <el-button :disabled="btnBisabled" @click="publish('草稿')">
          草稿
        </el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<style lang="scss" scoped>
.avatar-uploader,
.avatar {
  width: 178px;
  height: 178px;
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;

  .el-icon {
    width: 178px;
    height: 178px;
    font-size: 28px;
    color: #8c939d;
  }

  &:hover {
    border-color: var(--el-color-primary);
  }
}
</style>
