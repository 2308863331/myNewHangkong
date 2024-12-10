<template>
    <div>
      <!-- 新增优惠券按钮 -->
      <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增优惠券</el-button>
  
      <!-- 新增或修改优惠券的弹出框 -->
      <el-dialog v-model="dialogVisible" :title="id ? '修改优惠券' : '新增优惠券'" :before-close="handleBeforeClose">
        <CouponsEdit ref="couponsForm" :id="id" @success="editSuccess" />
      </el-dialog>
  
      <!-- 优惠券列表 -->
      <el-table :data="couponsList" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="id" label="优惠券ID" />
        <el-table-column prop="code" label="优惠券码" />
        <el-table-column prop="discountAmount" label="折扣金额" />
        <el-table-column prop="validFrom" label="有效开始时间" />
        <el-table-column prop="validTo" label="有效结束时间" />
        <el-table-column prop="usageLimit" label="使用限制次数" />
        <el-table-column prop="usedCount" label="已使用次数" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column fixed="right" label="操作" width="200">
          <template #default="{ row }">
            <el-button type="warning" @click="editRow(row)">编辑</el-button>
            <el-button type="danger" @click="delRow(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 分页组件 -->
      <el-pagination
        v-model:current-page="page"
        background layout="prev, pager, next"
        :total="total"
        :page-size="pagesize"
        @current-change="handleCurrentChange"
        style="margin-bottom: 50px;"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getCouponsList, delCoupon } from '../../api/coupons'
  import CouponsEdit from '../../components/CouponsEdit.vue'
  import { ElMessageBox } from 'element-plus'
  
  // 定义响应式变量
  const couponsList = ref([])
  const page = ref(1)
  const pagesize = ref(10)
  const total = ref(0)
  const id = ref()
  const dialogVisible = ref(false)
  const couponsForm = ref()
  
  onMounted(() => {
    loadCouponsList()
  })
  
  const loadCouponsList = async () => {
    const params = { page: page.value, pagesize: pagesize.value }
    try {
      const response = await getCouponsList(params)
      if (response.total !== undefined && Array.isArray(response.records)) {
        couponsList.value = response.records
        total.value = response.total
      }
    } catch (error) {
      console.error('Error fetching coupons list:', error)
    }
  }
  
  const addRow = () => {
    couponsForm.value.resetForm(0)
    id.value = 0
    dialogVisible.value = true
  }
  
  const editRow = row => {
    couponsForm.value.resetForm(row.id)
    id.value = row.id
    dialogVisible.value = true
  }
  
  const delRow = async row => {
    try {
      await ElMessageBox.confirm('确定要删除此优惠券吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (await delCoupon({ id: row.id })) {
        loadCouponsList()
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Failed to delete coupon:', error)
      }
    }
  }
  
  const handleCurrentChange = value => {
    page.value = value
    loadCouponsList()
  }
  
  const editSuccess = () => {
    loadCouponsList()
    dialogVisible.value = false
  }
  
  const handleBeforeClose = () => {
    ElMessageBox.confirm('确定关闭对话框吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      dialogVisible.value = false
      setTimeout(() => couponsForm.value.resetForm(), 500)
    }).catch(() => {})
  }
  </script>