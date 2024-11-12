<script setup>
import { artGetChannelsService } from '@/api/article'
import { ref }  from 'vue'
const model = defineModel()
const artChannelList = ref([])
// 获取文章分类
const getArtChannelList = async () =>{
  const res = await artGetChannelsService()
  artChannelList.value = res.data.data
}
getArtChannelList()
</script>
<template>
  <el-select v-model="model" style="width: 240px">
    <el-option v-for="item in artChannelList" :key="item.id" :label="item.cate_name" :value="item.id" />
  </el-select>
</template>
