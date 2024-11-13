<script setup>
// 封装弹层组件
import { artAddChannelsService, artEditChannelsService } from '@/api/article'
import { defineEmits, ref } from 'vue'

// 获取父组件的 '获取文章分类数据(getChannelList)'，用于数据修改添加后更新视图
const emit = defineEmits(['success'])
// 控制弹层
const dialogVisible = ref(false)
// 表单
const formRef = ref()
// 表单验证
const formModel = ref({
  cate_name: '',
  cate_alias: '',
})
const rules = {
  cate_name: [
    { required: true, message: '请输入分类名称', trigger: 'change' },
    { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位非空字符', trigger: 'change' },
  ],
  cate_alias: [
    { required: true, message: '请输入分类别名', trigger: 'change' },
    { pattern: /^[a-z0-9]{1,15}$/i, message: '分类别名必须是1-15位字符或数字', trigger: 'change' },
  ],
}

// 确认
const submit = async () => {
  await formRef.value.validate()
  const isEdit = formModel.value.id
  if (isEdit) {
    await artEditChannelsService(formModel.value)
    ElMessage.success('编辑成功')
  }
  else {
    await artAddChannelsService(formModel.value)
    ElMessage.success('添加成功')
  }
  dialogVisible.value = false
  emit('success')
}

// 组件对外暴露一个方法 open,基于open传的参数，区分添加还是编辑
// open({}) => 表单无需渲染，说明是添加
// open({ id, cate_name, ... }) => 表单需要渲染，说明是编辑
const open = (row) => {
  // 这里必须对row进行展开，因为row是一个响应式对象，包含了proxy
  // 不展开直接 = row，在编辑修改时，页面中对应的数据会实时修改，需求是点击确认在修改
  formModel.value = { ...row }
  dialogVisible.value = true
}
// 对外暴露方法
defineExpose({
  open,
})
</script>

<template>
  <el-dialog v-model="dialogVisible" :title="formModel.id ? '编辑分类' : '添加分类'" width="30%">
    <el-form ref="formRef" :model="formModel" :rules="rules">
      <el-form-item label="分类名称" prop="cate_name">
        <el-input v-model="formModel.cate_name" placeholder="请输入分类名称" />
      </el-form-item>
      <el-form-item label="分类别名" prop="cate_alias">
        <el-input v-model="formModel.cate_alias" placeholder="请输入分类别名" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="submit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
