<script setup>
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // 中文配置
</script>

<template>
  <div>
    <el-config-provider :locale="zhCn">
      <router-view />
    </el-config-provider>
  </div>
</template>

<style scoped>

</style>
