<template>
  <el-form ref="formRef" :model="form" label-width="120px">
    <!-- 订单号 -->
    <el-form-item prop="order_number" label="订单号" style="width: 92%">
      <el-input v-model="form.order_number" placeholder="请输入订单号" />
    </el-form-item>
    <!-- 用户ID -->
    <el-form-item prop="user_id" label="用户ID">
      <el-input v-model="form.user_id" placeholder="请输入用户ID" />
    </el-form-item>
    <!-- 航班ID -->
    <el-form-item prop="flight_id" label="航班ID">
      <el-input v-model="form.flight_id" placeholder="请输入航班ID" />
    </el-form-item>
    <!-- 订单总价 -->
    <el-form-item prop="total_price" label="订单总价">
      <el-input-number v-model="form.total_price" :precision="2" :step="0.01" placeholder="请输入订单总价" />
    </el-form-item>
    <!-- 订单状态 -->
    <el-form-item prop="status" label="订单状态">
      <el-select v-model="form.status" placeholder="请选择订单状态">
        <el-option label="未支付" value="unpaid" />
        <el-option label="已支付" value="paid" />
        <el-option label="已完成" value="completed" />
      </el-select>
    </el-form-item>
    <!-- 操作按钮 -->
    <el-form-item>
      <el-button type="primary" @click="editSubmit" v-if="id">修改</el-button>
      <el-button type="primary" @click="addSubmit" v-else>新增</el-button>
      <el-button @click="btnCancel">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getOrder, getFlightsList, addOrder, editOrder } from '../api'
import useToken from '../stores/token'

const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: props.id,
  order_number: '',
  user_id: '',
  flight_id: '',
  total_price: 0.00,
  status: 'unpaid',
  created_at: '',
  updated_at: ''
})

const formRef = ref()
const flightsList = ref([])
const { token } = useToken()

onMounted(() => {
  loadOrder()
})

const loadOrder = async () => {
  if (form.id) {
    const data = await getOrder({ id: form.id })
    Object.assign(form, data)
  }
}

const resetForm = id => {
  form.id = id
  btnCancel()
}

defineExpose({ resetForm })

// 新增操作
const addSubmit = async () => {
  const data = {
    order_number: form.order_number,
    user_id: form.user_id,
    flight_id: form.flight_id,
    total_price: form.total_price,
    status: form.status
  }
  if (await addOrder(data)) {
    emit('success')
  }
}

// 修改操作
const editSubmit = async () => {
  if (await editOrder(form)) {
    emit('success')
  }
}

// 重置表单
const btnCancel = () => {
  formRef.value.resetFields()
  loadOrder()
}
</script>

<style scoped>
.el-form-item {
  width: 91%;
}
</style>



