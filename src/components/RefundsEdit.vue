<template>
    <el-form ref="refundsFormRef" :model="form" label-width="120px">
      <el-form-item label="订单ID" prop="orderId">
        <el-input v-model="form.orderId" placeholder="请填写订单ID" />
      </el-form-item>
      <el-form-item label="退款金额" prop="refundAmount">
        <el-input-number v-model="form.refundAmount" :precision="2" :step="0.1" placeholder="请填写退款金额" />
      </el-form-item>
      <el-form-item label="退款原因" prop="reason">
        <el-input v-model="form.reason" type="textarea" placeholder="请填写退款原因" />
      </el-form-item>
      <el-form-item label="退款状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择退款状态">
          <el-option label="处理中" value="processing" />
          <el-option label="已完成" value="completed" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editSubmit()" v-if="form.id">修改</el-button>
        <el-button type="primary" @click="addSubmit()" v-else>新增</el-button>
        <el-button @click="btnCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </template>
  
  <script setup>
  import { reactive, ref, onMounted } from 'vue'
  import { addRefund, editRefund } from '../api/refunds'
  import { ElMessageBox } from 'element-plus'
  
  const emit = defineEmits(['success'])
  
  const form = reactive({
    id: null,
    orderId: '',
    refundAmount: 0,
    reason: '',
    status: ''
  })
  const refundsFormRef = ref()
  
  const resetForm = () => {
    refundsFormRef.value.resetFields()
    Object.assign(form, {
      id: null,
      orderId: '',
      refundAmount: 0,
      reason: '',
      status: ''
    })
  }
  
  defineExpose({ resetForm })
  
  const addSubmit = async () => {
    const data = { ...form }
    if (await addRefund(data)) {
      resetForm()
      emit('success')
    }
  }
  
  const editSubmit = async () => {
    if (await editRefund(form)) {
      resetForm()
      emit('success')
    }
  }
  
  const btnCancel = () => {
    resetForm()
  }
  </script>