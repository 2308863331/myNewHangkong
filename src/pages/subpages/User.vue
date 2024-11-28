<template>
  <div>
    <!-- 用户表格组件 -->
    <Usertable />
    <!-- 用户信息组件 -->
    <Userinfo />
    <!-- 编辑 -->
    <!-- 用户视图组件 -->
    <UserView />
  </div>
</template>

<script setup>
// 导入组件
import Userinfo from '../../components/user/info.vue'
import Usertable from '../../components/user/table.vue'
import UserView from '../../components/user/view.vue'

// 如果需要传递属性或监听事件，可以在这里进行
</script>

<style scoped>
/* 可以添加一些样式 */
</style>