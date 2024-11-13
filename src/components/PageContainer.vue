<script setup>
// 插槽，props父传子定制标题，具名插槽定制按钮，默认插槽地定制主体，
defineProps({
  title: {
    required: true,
    type: String,
  },
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>{{ title }}</span>
        <div class="extra">
          <slot name="extra" />
        </div>
      </div>
    </template>
    <slot />
  </el-card>
</template>

<style lang="scss" scoped>
.page-container {
  box-sizing: border-box;
  min-height: 100%;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
