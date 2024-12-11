<template>
  <div>
    <!-- 退款列表 -->
    <el-table :data="refundsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="退款ID" />
      <el-table-column prop="orderId" label="订单ID" sortable />
      <el-table-column prop="refundAmount" label="退款金额" sortable />
      <el-table-column prop="reason" label="退款原因" />
      <el-table-column prop="status" label="退款状态" sortable />
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
    <el-form ref="refundFormRef" :model="form" label-width="120px">
      <!-- 订单ID -->
      <el-form-item label="订单ID" prop="orderId" style="width: 92%">
        <el-input v-model="form.orderId" placeholder="请填写订单ID" />
      </el-form-item>
      <!-- 退款金额 -->
      <el-form-item label="退款金额" prop="refundAmount" style="width: 92%">
        <el-input-number v-model="form.refundAmount" :precision="2" :step="0.01" :min="0" placeholder="请填写退款金额" />
      </el-form-item>
      <!-- 退款原因 -->
      <el-form-item label="退款原因" prop="reason" style="width: 92%">
        <el-input type="textarea" v-model="form.reason" placeholder="请填写退款原因" />
      </el-form-item>
      <!-- 退款状态 -->
      <el-form-item label="退款状态" prop="status" style="width: 92%">
        <el-select v-model="form.status" placeholder="请选择退款状态">
          <el-option label="处理中" value="处理中" />
          <el-option label="已完成" value="已完成" />
          <el-option label="已拒绝" value="已拒绝" />
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
import { reactive, ref, onMounted } from 'vue'
import { getRefunds, addRefund, editRefund, delRefund } from '../api'
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus'

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  orderId: '',
  refundAmount: 0,
  reason: '',
  status: ''
})
const refundFormRef = ref()
const refundsList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadRefunds()
})

const resetForm = () => {
  refundFormRef.value.resetFields()
  form.id = null
  form.orderId = ''
  form.refundAmount = 0
  form.reason = ''
  form.status = ''
}

defineExpose({ resetForm })

const loadRefunds = async () => {
  const data = await getRefunds()
  refundsList.value = data
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增退款
const addSubmit = async () => {
  const data = {
    orderId: form.orderId,
    refundAmount: form.refundAmount,
    reason: form.reason,
    status: form.status
  }
  if (await addRefund(data)) {
    resetForm()
    loadRefunds()
    emit('success')
  }
}

// 修改退款
const editSubmit = async () => {
  if (await editRefund(form)) {
    resetForm()
    loadRefunds()
    emit('success')
  }
}

const delRow = async (row) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '您确定要删除此退款记录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户点击了“确定”，执行删除操作
    const response = await delRefund({ id: row.id });

    if (response) {
      loadRefunds();
      emit('success')
    } else {
      console.error('Failed to delete refund:');
    }
  } catch (error) {
    // 用户点击了“取消”或删除失败时处理错误
    if (error !== 'cancel') {
      console.error('Failed to delete refund:', error);
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
