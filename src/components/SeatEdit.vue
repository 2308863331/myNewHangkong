<template>
  <div>

    <!-- 座位列表 -->
    <el-table :data="seatsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="座位ID" />
      <el-table-column prop="flightId" label="航班ID" sortable />
      <el-table-column prop="seatNumber" label="座位号" />
      <el-table-column prop="seatType" label="座位类型" />
      <el-table-column prop="price" label="价格" sortable />
      <el-table-column prop="status" label="状态" sortable />
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
      <!-- 航班ID -->
      <el-form-item prop="flightId" label="航班ID" style="width: 92%">
        <el-input v-model.number="form.flightId" placeholder="请输入航班ID" />
      </el-form-item>
      <!-- 座位号 -->
      <el-form-item prop="seatNumber" label="座位号" style="width: 92%">
        <el-input v-model="form.seatNumber" placeholder="请输入座位号" />
      </el-form-item>
      <!-- 座位类型 -->
      <el-form-item prop="seatType" label="座位类型">
        <el-select v-model="form.seatType" placeholder="请选择座位类型">
          <el-option label="经济舱" value="经济舱" />
          <el-option label="商务舱" value="商务舱" />
          <el-option label="头等舱" value="头等舱" />
        </el-select>
      </el-form-item>
      <!-- 价格 -->
      <el-form-item prop="price" label="价格" style="width: 92%">
        <el-input-number v-model="form.price" :precision="2" :step="0.01" placeholder="请输入价格" />
      </el-form-item>
      <!-- 状态 -->
      <el-form-item prop="status" label="状态">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="可用" value="可用" />
          <el-option label="已预订" value="已预订" />
          <el-option label="已售出" value="已售出" />
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
import { getSeats, addSeat, editSeat } from '../api'
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件
// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}
const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  flightId: '',
  seatNumber: '',
  seatType: '',
  price: 0.00,
  status: ''
})

const formRef = ref()
const { token } = useToken()
const seatsList = ref([])

onMounted(() => {
  if (props.id) {
    loadSeat(props.id)
  }
})

const resetForm = id => {
  form.id = id || null
  form.flightId = ''
  form.seatNumber = ''
  form.seatType = ''
  form.price = 0.00
  form.status = ''
}

defineExpose({ resetForm })

const loadSeat = async () => {
  const data = await getSeats()
  seatsList.value = data
}

// 新增操作
const addSubmit = async () => {
  const data = {
    flightId: form.flightId,
    seatNumber: form.seatNumber,
    seatType: form.seatType,
    price: form.price,
    status: form.status
  }
  try {
    const response = await addSeat(data)
    if (response) {
      emit('success')
      loadSeat
    }
  } catch (error) {
    console.error('Failed to add seat:', error.response ? error.response.data : error.message)
  }
}

// 修改操作
const editSubmit = async () => {
  const data = {
    id: form.id,
    flightId: form.flightId,
    seatNumber: form.seatNumber,
    seatType: form.seatType,
    price: form.price,
    status: form.status
  }
  try {
    const response = await editSeat(data)
    if (response) {
      emit('success')
      loadSeat
    }
  } catch (error) {
    console.error('Failed to edit seat:', error.response ? error.response.data : error.message)
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
    const response = await delSeat({ id: row.id });
    if (response) { // 确保 response 和 response.data 存在且 code 为 1 表示成功
      loadSeat();
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



