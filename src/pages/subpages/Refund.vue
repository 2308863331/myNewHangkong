<template>
    <div>
      <!-- 新增退款按钮 -->
      <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增退款</el-button>
  
      <!-- 新增或修改退款的弹出框 -->
      <el-dialog v-model="dialogVisible" :title="id ? '修改退款' : '新增退款'" :before-close="handleBeforeClose">
        <RefundsEdit ref="refundsForm" :id="id" @success="editSuccess" />
      </el-dialog>
  
      <!-- 退款列表 -->
      <el-table :data="refundsList" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="id" label="退款ID" />
        <el-table-column prop="orderId" label="订单ID" />
        <el-table-column prop="refundAmount" label="退款金额" />
        <el-table-column prop="reason" label="退款原因" />
        <el-table-column prop="status" label="退款状态" />
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
  import { getRefundsList, delRefund } from '../../api'
  import RefundsEdit from '../../components/RefundsEdit.vue'
  import { ElMessageBox } from 'element-plus'
  
  // 定义响应式变量
  const refundsList = ref([])
  const page = ref(1)
  const pagesize = ref(10)
  const total = ref(0)
  const id = ref()
  const dialogVisible = ref(false)
  const refundsForm = ref()
  
  onMounted(() => {
    loadRefundsList()
  })
  
  const loadRefundsList = async () => {
    const params = { page: page.value, pagesize: pagesize.value }
    try {
      const response = await getRefundsList(params)
      if (response.total !== undefined && Array.isArray(response.records)) {
        refundsList.value = response.records
        total.value = response.total
      }
    } catch (error) {
      console.error('Error fetching refunds list:', error)
    }
  }
  
  const addRow = () => {
    if(refundsForm.value){
      refundsForm.value.resetForm(0)
    }
    id.value = 0
    dialogVisible.value = true
  }
  
  const editRow = row => {
    if(refundsForm.value){
      refundsForm.value.resetForm(row.id)
    }
    id.value = row.id
    dialogVisible.value = true
  }
  
  const delRow = async row => {
    try {
      await ElMessageBox.confirm('确定要删除此退款记录吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (await delRefund({ id: row.id })) {
        loadRefundsList()
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Failed to delete refund:', error)
      }
    }
  }
  
  const handleCurrentChange = value => {
    page.value = value
    loadRefundsList()
  }
  
  const editSuccess = () => {
    loadRefundsList()
    dialogVisible.value = false
  }
  
  const handleBeforeClose = () => {
    ElMessageBox.confirm('确定关闭对话框吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      dialogVisible.value = false
      setTimeout(() => refundsForm.value.resetForm(), 500)
    }).catch(() => {})
  }
  </script>