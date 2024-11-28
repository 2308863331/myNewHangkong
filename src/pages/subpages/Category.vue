<template>
  <div>
    <!-- 新增订单按钮 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增订单</el-button>

    <!-- 新增或修改订单的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改订单' : '新增订单'" :before-close="handleBeforeClose">
      <OrderEdit ref="orderForm" :id="id" @success="editSuccess" />
    </el-dialog>

    <!-- 订单列表 -->
    <el-table :data="ordersList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="订单ID" />
      <el-table-column prop="order_number" label="订单号" sortable />
      <el-table-column prop="total_price" label="订单总价" sortable />
      <el-table-column prop="status" label="订单状态" sortable />
      <el-table-column prop="created_at" label="创建时间" />
      <el-table-column prop="updated_at" label="更新时间" />
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
import { getOrdersList, delOrder } from '../../api' // 导入 API 函数
import OrderEdit from '../../components/CategoryEdit.vue' // 导入 OrderEdit 组件
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

// 定义响应式变量
const ordersList = ref([]) // 订单列表
const page = ref(1) // 当前页码
const pagesize = ref(10) // 每页显示的订单数量
const total = ref(0) // 总记录数
const id = ref() // 当前操作的订单 ID
const dialogVisible = ref(false) // 控制对话框的显示与隐藏
const orderForm = ref() // 引用 OrderEdit 组件实例

// 页面加载完成后执行
onMounted(() => {
  loadOrdersList()
})

// 加载订单列表
const loadOrdersList = async () => {
  const params = {
    page: page.value, // 当前页码
    pagesize: pagesize.value // 每页显示的数量
  }
  try {
    const response = await getOrdersList(params) // 发送请求获取订单列表
    console.log('API Response:', response) // 添加调试信息
    if (response.total !== undefined && response.records !== undefined) {
      if (Array.isArray(response.records)) {
        ordersList.value = response.records.map(item => ({
          ...item,
          created_at: new Date(item.created_at).toLocaleString(),
          updated_at: new Date(item.updated_at).toLocaleString()
        }))
        total.value = response.total // 更新总记录数
      } else {
        console.error('Invalid data structure:', response)
      }
    } else {
      console.error('Failed to fetch orders list: Missing total or records')
    }
  } catch (error) {
    console.error('Error fetching orders list:', error)
  }
}

// 新增订单  
const addRow = () => {
  if (orderForm.value) {
    orderForm.value.resetForm(0) // 重置表单，0 表示新增
  }
  id.value = 0 // 设置 ID 为 0，表示新增
  dialogVisible.value = true // 显示对话框
}

// 修改订单
const editRow = row => {
  if (orderForm.value) {
    orderForm.value.resetForm(row.id) // 重置表单，传入订单 ID 表示编辑
    
  }
  id.value = row.id // 设置 ID 为当前订单的 ID
  dialogVisible.value = true // 显示对话框
}

// 删除订单
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
      loadOrdersList();
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

// 换页
const handleCurrentChange = value => {
  page.value = value // 更新当前页码
  loadOrdersList() // 重新加载订单列表
}

// 编辑完成
const editSuccess = () => {
  loadOrdersList() // 重新加载订单列表
  dialogVisible.value = false // 隐藏对话框
}

// 关闭弹出框前
const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', {
    showClose: false,
    closeOnClickModal: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    dialogVisible.value = false // 隐藏对话框
    setTimeout(() => {
      orderForm.value.resetForm() // 延迟重置表单
    }, 500)
  }).catch(() => {}) // 用户取消关闭操作
}
</script>



