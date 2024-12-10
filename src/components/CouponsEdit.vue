<template>
    <el-form ref="couponsFormRef" :model="form" label-width="120px">
      <el-form-item label="优惠券码" prop="code">
        <el-input v-model="form.code" placeholder="请填写优惠券码" />
      </el-form-item>
      <el-form-item label="折扣金额" prop="discountAmount">
        <el-input-number v-model="form.discountAmount" :precision="2" :step="0.1" placeholder="请填写折扣金额" />
      </el-form-item>
      <el-form-item label="有效开始时间" prop="validFrom">
        <el-date-picker v-model="form.validFrom" type="datetime" placeholder="请选择有效开始时间" />
      </el-form-item>
      <el-form-item label="有效结束时间" prop="validTo">
        <el-date-picker v-model="form.validTo" type="datetime" placeholder="请选择有效结束时间" />
      </el-form-item>
      <el-form-item label="使用限制次数" prop="usageLimit">
        <el-input-number v-model="form.usageLimit" :min="1" placeholder="请填写使用限制次数" />
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
  import { addCoupon, editCoupon } from '../api/coupons'
  import { ElMessageBox } from 'element-plus'
  
  const emit = defineEmits(['success'])
  
  const form = reactive({
    id: null,
    code: '',
    discountAmount: 0,
    validFrom: '',
    validTo: '',
    usageLimit: 1,
    usedCount: 0
  })
  const couponsFormRef = ref()
  
  const resetForm = () => {
    couponsFormRef.value.resetFields()
    Object.assign(form, {
      id: null,
      code: '',
      discountAmount: 0,
      validFrom: '',
      validTo: '',
      usageLimit: 1,
      usedCount: 0
    })
  }
  
  defineExpose({ resetForm })
  
  const addSubmit = async () => {
    const data = { ...form }
    if (await addCoupon(data)) {
      resetForm()
      emit('success')
    }
  }
  
  const editSubmit = async () => {
    if (await editCoupon(form)) {
      resetForm()
      emit('success')
    }
  }
  
  const btnCancel = () => {
    resetForm()
  }
  </script>