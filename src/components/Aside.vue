<template>
  <el-row>
    <el-col :span="24">
      <el-menu active-text-color="#white" class="el-menu-vertical-demo" :default-active="active" text-color="#333">
        <!-- 首页 -->
        <router-link :to="{ name: 'index' }">
          <el-menu-item index="1">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>首页</span>
          </el-menu-item>
        </router-link>
        <!-- 首页 -->
        <router-link :to="{ name: 'user' }">
          <el-menu-item index="2">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>
        </router-link>
        <!-- 分类管理 -->
        <router-link :to="{ name: 'orders' }">
          <el-menu-item index="2">
            <el-icon>
              <List />
            </el-icon>
            <span>订单管理</span>
          </el-menu-item>
        </router-link>
        <!-- 商品管理 -->
        <router-link :to="{ name: 'flights' }">
          <el-menu-item index="3">
            <el-icon>
              <List />
            </el-icon>
            <span>航班管理</span>
          </el-menu-item>
        </router-link>
         <!-- 支付记录管理 -->
         <router-link :to="{ name: 'paids' }">
          <el-menu-item index="4">
            <el-icon>
              <List />
            </el-icon>
            <span>支付记录管理</span>
          </el-menu-item>
        </router-link>
        <!-- 机票座位管理 -->
        <router-link :to="{ name: 'seats' }">
          <el-menu-item index="5">
            <el-icon>
              <List />
            </el-icon>
            <span>机票座位管理</span>
          </el-menu-item>
        </router-link>
        <!-- 评论管理 -->
        <router-link :to="{ name: 'reviews' }">
          <el-menu-item index="8">
            <el-icon>
              <List />
            </el-icon>
            <span>评论管理</span>
          </el-menu-item>
        </router-link>
        <!-- 优惠券管理 -->
        <router-link :to="{ name: 'coupons' }">
          <el-menu-item index="9">
            <el-icon>
              <List />
            </el-icon>
            <span>优惠券管理</span>
          </el-menu-item>
        </router-link>
        <!-- 退款管理 -->
        <router-link :to="{ name: 'refunds' }">
          <el-menu-item index="10">
            <el-icon>
              <List />
            </el-icon>
            <span>退款管理</span>
          </el-menu-item>
        </router-link>
        <!-- 个人中心 -->
        <router-link :to="{ name: 'setting' }">
          <el-menu-item index="6">
            <el-icon>
              <Setting />
            </el-icon>
            <span>个人中心</span>
          </el-menu-item>
        </router-link>
      </el-menu>
    </el-col>
  </el-row>
</template>
  
<script setup>
import { HomeFilled, Setting, List } from '@element-plus/icons-vue'
import { ref } from 'vue'
import router from '../router'
const menuIndex = {
  'index': '1',
  'user': '2',
  'orders/list': '3',
  'flights': '4',
  'paids':'5',
  'seats': '6',
  'reviews':'7',
  'coupons':'8',
  'refunds':'9',
  'setting': '10'

}
const active = ref(menuIndex[router.currentRoute.value.name] || '0')
</script>
  
<style lang="scss" scoped>
.el-menu {
  border: 0 !important;
  .is-active {
    background: linear-gradient(90deg, #1493fa, #01c6fa) !important
  }
  a {
    text-decoration: none;
    color: white;
  }
}
</style>