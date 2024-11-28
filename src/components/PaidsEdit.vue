<template>
  <div>
        <!-- 商品列表 -->
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

    <!-- 表单部分 -->
    <el-form ref="formRef" :model="form" label-width="120px">
      <!-- 订单ID -->
      <el-form-item prop="orderId" label="订单ID" style="width: 92%">
        <el-input v-model.number="form.orderId" placeholder="请输入订单ID" />
      </el-form-item>
      <!-- 支付金额 -->
      <el-form-item prop="amount" label="支付金额" style="width: 92%">
        <el-input-number v-model="form.amount" :precision="2" :step="0.01" placeholder="请输入支付金额" />
      </el-form-item>
      <!-- 支付方式 -->
      <el-form-item prop="paymentMethod" label="支付方式">
        <el-select v-model="form.paymentMethod" placeholder="请选择支付方式">
          <el-option label="支付宝" value="alipay" />
          <el-option label="微信支付" value="wechatpay" />
          <el-option label="信用卡" value="creditcard" />
          <el-option label="其他" value="other" />
        </el-select>
      </el-form-item>
      <!-- 交易ID -->
      <el-form-item prop="transactionId" label="交易ID" style="width: 92%">
        <el-input v-model="form.transactionId" placeholder="请输入交易ID" />
      </el-form-item>
      <!-- 支付状态 -->
      <el-form-item prop="status" label="支付状态">
        <el-select v-model="form.status" placeholder="请选择支付状态">
          <el-option label="待支付" value="待支付" />
          <el-option label="已支付" value="已支付" />
          <el-option label="已退款" value="已退款" />
          <el-option label="失败" value="失败" />
        </el-select>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" @click="editSubmit()" v-if="form.id">修改</el-button>
        <el-button type="primary" @click="addSubmit()" v-else>新增</el-button>
        <el-button @click="btnCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { getPayments, addPayment, editPayment, getPaymentsList, delPayment } from '../api'
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件
const paymentsList = ref([])


const emit = defineEmits(['success'])
const form = reactive({
  id: null,
  orderId: '',
  amount: 0.00,
  paymentMethod: '',
  transactionId: '',
  status: ''
})

const formRef = ref()
const { token } = useToken()


const resetForm = id => {

  form.id = id || null
  form.orderId = ''
  form.amount = 0.00
  form.paymentMethod = ''
  form.transactionId = ''
  form.status = ''
}

defineExpose({ resetForm })



onMounted(() => {
  loadPayment()
})



const loadPayment = async () => {
  const data = await getPayments()
  paymentsList.value = data
}
// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增航班
const addSubmit = async () => {
  const data = {
    orderId: form.orderId,
    amount: form.amount,
    paymentMethod: form.paymentMethod,
    transactionId: form.transactionId,
    status: form.status,
    createdTime: form.createdTime,
    updatedTime: form.updatedTime
  }
  if (await addPayment(data)) {
    resetForm()
    loadPayment()
    emit('success')
  }
}

// 修改航班  
const editSubmit = async () => {
  if (await editPayment(form)) {
    resetForm()
    loadPayment()
    emit('success')
  }
}

const delRow = async (row) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '您确定要删除此航班吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户点击了“确定”，执行删除操作
    const response = await delPayment({ id: row.id });

    if (response) { // 确保 response 和 response.data 存在且 code 为 1 表示成功
      loadPayment();
      emit('success')
    } else {
      console.error('Failed to delete flight:');
    }
  } catch (error) {
    // 用户点击了“取消”或删除失败时处理错误
    if (error !== 'cancel') {
      console.error('Failed to delete flight:', error);
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
  width: 91%;
}
</style>



