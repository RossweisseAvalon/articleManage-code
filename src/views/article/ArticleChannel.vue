<script setup>
import { artDelChannelService, artGetChannelsService } from '@/api/article'
import { ref } from 'vue'
import { Delete, Edit } from '@element-plus/icons-vue'
import ChannelEdit from './components/ChannelEdit.vue'
const isLoading = ref(false) // 控制loading加载效果
// 通过给 ChannelEdit 组件添加 ref="dialog",获取到ChannelEdit的dom元素
// 在用 ChannelEdit 组件对外暴露的 open 方法控制弹层的显示数据
const dialog = ref()
// 获取文章分类数据
const channelList = ref([])
const getChannelList = async () => {
  isLoading.value = true // 开启加载
  const res = await artGetChannelsService()
  channelList.value = res.data.data
  isLoading.value = false // 获取完后停止loading加载效果
}
getChannelList()
// 添加分类
const addChannel = () => dialog.value.open({})
// 编辑分类
const editChannel = (row) => dialog.value.open(row) // 传递row给子组件渲染 回显数据
// 删除
const deleteChannel = async (row) => {
  await ElMessageBox.confirm('你确认要删除该文章分类吗', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await artDelChannelService(row.id)
  ElMessage.success('删除成功')
  getChannelList()
}

</script>
<template>
  <page-container title="文章分类">
    <template #extra>
      <el-button @click="addChannel" type="primary">添加分类</el-button>
    </template>
    <el-table v-loading="isLoading" :data="channelList" style="width: 100%">
      <el-table-column label="序号" type="index" width="100"/>
      <el-table-column prop="cate_name" label="分类名称"/>
      <el-table-column prop="cate_alias" label="分类别名"/>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button :icon="Edit" type="primary" plain circle @click="editChannel(scope.row)"></el-button>
          <el-button :icon="Delete" type="danger" plain circle @click="deleteChannel(scope.row)"></el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="NULL"/>
      </template>
    </el-table>
    <ChannelEdit @success="getChannelList" ref="dialog"></ChannelEdit>
  </page-container>
</template>

<style lang="scss" scoped>
</style>