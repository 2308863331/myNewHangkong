<template>
  <div>
    <!-- 订单列表 -->
    <el-table :data="ordersList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="订单ID" />
      <el-table-column prop="orderNumber" label="订单号" sortable />
      <el-table-column prop="userId" label="用户ID" sortable />
      <el-table-column prop="flightId" label="航班ID" />
      <el-table-column prop="totalAmount" label="订单总价" />
      <el-table-column prop="status" label="订单状态" sortable />
      <el-table-column prop="createdTime" label="创建时间" />
      <el-table-column prop="updatedTime" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" label-width="120px">
      <!-- 订单号 -->
      <el-form-item prop="orderNumber" label="订单号" style="width: 92%">
        <el-input v-model="form.orderNumber" placeholder="请输入订单号" />
      </el-form-item>
      <!-- 用户ID -->
      <el-form-item prop="userId" label="用户ID">
        <el-input v-model="form.userId" placeholder="请输入用户ID" />
      </el-form-item>
      <!-- 航班ID -->
      <el-form-item prop="flightId" label="航班ID">
        <el-input v-model="form.flightId" placeholder="请输入航班ID" />
      </el-form-item>
      <!-- 订单总价 -->
      <el-form-item prop="totalAmount" label="订单总价">
        <el-input-number v-model="form.totalAmount" :precision="2" :step="0.01" placeholder="请输入订单总价" />
      </el-form-item>
      <!-- 订单状态 -->
      <el-form-item prop="status" label="订单状态">
        <el-select v-model="form.status" placeholder="请选择订单状态">
          <el-option label="未支付" value="未支付" />
          <el-option label="已支付" value="已支付" />
          <el-option label="已完成" value="已完成" />
          <el-option label="取消" value="取消" />
          <el-option label="已取消" value="已取消" />
        </el-select>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="editSubmit" v-if="form.id">修改</el-button>
        <el-button type="primary" @click="addSubmit" v-else>新增</el-button>
        <el-button @click="btnCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getOrders, addOrder, editOrder, delOrder } from '../api'
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  orderNumber: '',
  userId: '',
  flightId: '',
  totalAmount: 0.00,
  status: 'unpaid',
  createdAt: '',
  updatedAt: ''
})

const formRef = ref()
const ordersList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadOrders()
})

const resetForm = () => {
  formRef.value.resetFields()
  form.id = null
  form.orderNumber = ''
  form.userId = ''
  form.flightId = ''
  form.totalAmount = 0.00
  form.status = 'unpaid'
}

defineExpose({ resetForm })

const loadOrders = async () => {
  const response = await getOrders()
  ordersList.value = response
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增订单
const addSubmit = async () => {
  const data = {
    orderNumber: form.orderNumber,
    userId: parseInt(form.userId),
    flightId: parseInt(form.flightId),
    totalAmount: parseFloat(form.totalAmount),
    status: form.status
  }
  try {
    const response = await addOrder(data)
    if (response.data) {
      resetForm()
      loadOrders()
      emit('success')
    }
  } catch (error) {
    console.error('Failed to add order:', error.response ? error.response.data : error.message)
  }
}

// 修改订单  
const editSubmit = async () => {
  if (await editOrder(form)) {
    resetForm()
    loadOrders()
    emit('success')
  }
}

const delRow = async (row) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '您确定要删除此订单吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户点击了“确定”，执行删除操作
    const response = await delOrder({ id: row.id });

    if (response) { // 确保 response 和 response.data 存在且 code 为 1 表示成功
      loadOrders();
      emit('success')
    } else {
      console.error('Failed to delete order:');
    }
  } catch (error) {
    // 用户点击了“取消”或删除失败时处理错误
    if (error !== 'cancel') {
      console.error('Failed to delete order:', error);
    }
  }
}

// 重置表单
const btnCancel = () => {
  resetForm()
}
</script>

<style scoped>
.el-form-item {
  text-align: left;
}
.upload-demo {
  text-align: left;
  width: 91%;
}
</style>



