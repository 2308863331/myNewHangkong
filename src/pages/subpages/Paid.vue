<template>
  <div>
    <!-- 新增支付按钮 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增支付</el-button>

    <!-- 新增或修改支付的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改支付' : '新增支付'" :before-close="handleBeforeClose">
      <PaysEdit ref="paysForm" :id="id" @success="editSuccess" />
    </el-dialog>

    <!-- 支付记录列表 -->
    <el-table :data="paymentsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="支付记录ID" />
      <el-table-column prop="orderId" label="订单ID" sortable />
      <el-table-column prop="amount" label="支付金额" sortable />
      <el-table-column prop="paymentMethod" label="支付方式" />
      <el-table-column prop="transactionId" label="交易ID" />
      <el-table-column prop="status" label="支付状态" sortable />
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
import { getPaymentsList, delPayment } from '../../api' // 导入 API 函数
import PaysEdit from '../../components/PaidsEdit.vue' // 导入 PaysEdit 组件
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

// 定义响应式变量
const paymentsList = ref([]) // 支付记录列表
const page = ref(1) // 当前页码
const pagesize = ref(10) // 每页显示的支付记录数量
const total = ref(0) // 总记录数
const id = ref() // 当前操作的支付记录 ID
const dialogVisible = ref(false) // 控制对话框的显示与隐藏
const paysForm = ref() // 引用 PaysEdit 组件实例

// 页面加载完成后执行
onMounted(() => {
  loadPaymentsList()
})

// 加载支付记录列表
const loadPaymentsList = async () => {
  const params = {
    page: page.value, // 当前页码
    pagesize: pagesize.value // 每页显示的数量
  }
  try {
    const response = await getPaymentsList(params) // 发送请求获取商品列表
    console.log('API Response:', response) // 添加调试信息
    if (response.total !== undefined && response.records !== undefined) {
      if (Array.isArray(response.records)) {
        paymentsList.value = response.records.map(item => {
          return item
        })
        total.value = response.total // 更新总记录数
      } else {
        console.error('Invalid data structure:', response)
      }
    } else {
      console.error('Failed to fetch goods list: Missing total or records')
    }
  } catch (error) {
    console.error('Error fetching goods list:', error)
  }
}

// 新增支付  
const addRow = () => {
  if (paysForm.value) {
    paysForm.value.resetForm(0) // 重置表单，0 表示新增
  }
  id.value = 0 // 设置 ID 为 0，表示新增
  dialogVisible.value = true // 显示对话框
}

// 修改支付
const editRow = row => {
  if (paysForm.value) {
    paysForm.value.resetForm(row.id) // 重置表单，传入支付记录 ID 表示编辑
  }
  id.value = row.id // 设置 ID 为当前支付记录的 ID
  dialogVisible.value = true // 显示对话框
}

// 删除支付
const delRow = async (row) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '您确定要删除此支付记录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户点击了“确定”，执行删除操作
    const response = await delPayment({ id: row.id });

    if (response) { // 确保 response 存在且 code 为 1 表示成功
      loadPaymentsList();
    } else {
      console.error('Failed to delete payment:');
    }
  } catch (error) {
    // 用户点击了“取消”或删除失败时处理错误
    if (error !== 'cancel') {
      console.error('Failed to delete payment:', error);
    }
  }
}

// 关闭对话框前的操作
const handleBeforeClose = (done) => {
  done()
}

// 编辑成功后的回调函数
const editSuccess = () => {
  dialogVisible.value = false
  loadPaymentsList()
}

// 处理分页变化
const handleCurrentChange = (newPage) => {
  page.value = newPage
  loadPaymentsList()
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



