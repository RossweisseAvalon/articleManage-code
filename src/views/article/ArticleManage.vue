<script setup>
import { artDeleteService, artGetListService } from '@/api/article'
import { formatTime } from '@/utils/format'
import { Delete, Edit } from '@element-plus/icons-vue'
import { ref } from 'vue'
import ArticleEdit from './components/ArticleEdit.vue'
import ChannelSelect from './components/ChannelSelect.vue'

const articleList = ref([]) // 文章列表
const total = ref(0) // 总条数
const loading = ref(false)
const drawer = ref()
// 定义请求参数对象
const params = ref({
  pagenum: 1, // 当前页
  pagesize: 5, // 页面条数
  cate_id: '', // 分类id
  state: '', // 状态
})
// 基于params参数获取文章列表
const getArtlList = async () => {
  loading.value = true
  const res = await artGetListService(params.value)
  articleList.value = res.data.data
  total.value = res.data.total
  loading.value = false
}
getArtlList()
// 处理分页逻辑
const handleSizeChange = (size) => {
  // 每页数据变化了，那么原本正在访问的当前页意义不大了，所以每次都回到第1页
  params.value.pagenum = 1
  params.value.pagesize = size
  getArtlList()
}
const handleCurrentChange = (page) => {
  params.value.pagenum = page
  getArtlList()
}
// 搜索
const search = () => {
  params.value.pagenum = 1 // 重置页码
  getArtlList()
}
// 重置
const reset = () => {
  params.value.pagenum = 1 // 重置页码
  params.value.cate_id = ''
  params.value.state = ''
  getArtlList()
}

// 添加文章
const addArticle = () => {
  drawer.value.open({})
}
// 编辑文章
const editArticle = (row) => {
  drawer.value.open(row)
}
// 删除
const deleteArticle = async (row) => {
  await ElMessageBox.confirm('你确认要删除该文章吗', '温馨提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
  await artDeleteService(row.id)
  ElMessage.success('删除成功')
  getArtlList()
}
// 添加/编辑成功的回调
const handelSuccess = (type) => {
  // 如果是添加，渲染最后一页，展示新发布的文章
  if (type === 'add') {
    // total(总条数)+1(刚发布的) / pagesize(每页的数量) 并向上取整
    const lastPage = Math.ceil((total.value + 1) / params.value.pagesize)
    // 更新成最大页码数
    params.value.pagenum = lastPage
  }
  getArtlList()
}
</script>

<template>
  <page-container title="文章管理">
    <!-- 头部具名插槽 -->
    <template #extra>
      <el-button type="primary" @click="addArticle">
        发布文章
      </el-button>
    </template>

    <!-- 表单区域 -->
    <el-form :inline="true">
      <el-form-item label="文章分类:">
        <ChannelSelect v-model="params.cate_id" />
      </el-form-item>

      <el-form-item label="发布状态:">
        <el-select v-model="params.state" style="width: 200px">
          <el-option label="已发布" value="已发布" />
          <el-option label="草稿" value="草稿" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">
          搜索
        </el-button>
        <el-button @click="reset">
          重置
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="articleList" style="width: 100%;">
      <el-table-column prop="title" label="文章标题">
        <template #default="{ row }">
          <el-link type="primary" :underline="false">
            {{ row.title }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="cate_name" label="分类" />
      <el-table-column prop="pub_date" label="发表时间">
        <template #default="{ row }">
          {{ formatTime(row.pub_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" />
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button :icon="Edit" type="primary" plain circle @click="editArticle(row)" />
          <el-button :icon="Delete" type="danger" plain circle @click="deleteArticle(row)" />
        </template>
      </el-table-column>

      <!-- 空状态 -->
      <template #empty>
        <el-empty description="NULL" />
      </template>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="params.pagenum"
      v-model:page-size="params.pagesize"
      :page-sizes="[2, 3, 5, 10]"
      :background="true"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      style=" justify-content: center;margin-top: 20px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <ArticleEdit ref="drawer" @success="handelSuccess" />
  </page-container>
</template>

<style lang="scss" scoped>
</style>
