<template>
    <el-form ref="reviewsFormRef" :model="form" label-width="120px">
      <el-form-item label="用户ID" prop="userId">
        <el-input v-model="form.userId" placeholder="请填写用户ID" />
      </el-form-item>
      <el-form-item label="航班ID" prop="flightId">
        <el-input v-model="form.flightId" placeholder="请填写航班ID" />
      </el-form-item>
      <el-form-item label="评分" prop="rating">
        <el-rate v-model="form.rating" :max="5" show-score />
      </el-form-item>
      <el-form-item label="评论内容" prop="comment">
        <el-input v-model="form.comment" type="textarea" placeholder="请填写评论内容" />
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
  import { addReview, editReview } from '../api/reviews'
  import { ElMessageBox } from 'element-plus'
  
  const emit = defineEmits(['success'])
  
  const form = reactive({
    id: null,
    userId: '',
    flightId: '',
    rating: 0,
    comment: ''
  })
  const reviewsFormRef = ref()
  
  const resetForm = () => {
    reviewsFormRef.value.resetFields()
    Object.assign(form, {
      id: null,
      userId: '',
      flightId: '',
      rating: 0,
      comment: ''
    })
  }
  
  defineExpose({ resetForm })
  
  const addSubmit = async () => {
    const data = { ...form }
    if (await addReview(data)) {
      resetForm()
      emit('success')
    }
  }
  
  const editSubmit = async () => {
    if (await editReview(form)) {
      resetForm()
      emit('success')
    }
  }
  
  const btnCancel = () => {
    resetForm()
  }
  </script>