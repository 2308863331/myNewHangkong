<template>
  <div>
    <!-- 商品列表 -->
    <el-table :data="goodsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="航班ID" />
      <el-table-column prop="flightNumber" label="航班号" sortable />
      <el-table-column prop="status" label="航班状态" sortable />
      <el-table-column prop="departureAirport" label="出发机场" />
      <el-table-column prop="arrivalAirport" label="到达机场" />
      <el-table-column prop="departureTime" label="出发时间" />
      <el-table-column prop="arrivalTime" label="到达时间" />
      <el-table-column prop="createdTime" label="创建时间" />
      <el-table-column prop="updatedTime" label="更新时间" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button> <!-- 传递 row 参数 -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单部分 -->
    <el-form ref="flightFormRef" :model="form" label-width="120px">
      <!-- 航班号 -->
      <el-form-item label="航班号" prop="flightNumber" style="width: 92%">
        <el-input v-model="form.flightNumber" placeholder="请填写航班号" />
      </el-form-item>
      <!-- 出发机场 -->
      <el-form-item label="出发机场" prop="departureAirport" style="width: 92%">
        <el-input v-model="form.departureAirport" placeholder="请填写出发机场" />
      </el-form-item>
      <!-- 到达机场 -->
      <el-form-item label="到达机场" prop="arrivalAirport" style="width: 92%">
        <el-input v-model="form.arrivalAirport" placeholder="请填写到达机场" />
      </el-form-item>
      <!-- 出发时间 -->
      <el-form-item label="出发时间" prop="departureTime" style="width: 92%">
        <el-date-picker
          v-model="form.departureTime"
          type="datetime"
          placeholder="请选择出发时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <!-- 到达时间 -->
      <el-form-item label="到达时间" prop="arrivalTime" style="width: 92%">
        <el-date-picker
          v-model="form.arrivalTime"
          type="datetime"
          placeholder="请选择到达时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </el-form-item>
      <!-- 航班状态 -->
      <el-form-item label="航班状态" prop="status" style="width: 92%">
        <el-select v-model="form.status" placeholder="请选择航班状态">
          <el-option label="按时" value="按时" />
          <el-option label="延误" value="延误" />
          <el-option label="取消" value="取消" />
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
import { getFlightsList, uploadPictureURL, getGoods, addGoods, editGoods, delGoods } from '../api'
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

const form = reactive({
  id: null,
  flightNumber: '',
  departureAirport: '',
  arrivalAirport: '',
  departureTime: '',
  arrivalTime: '',
  status: ''
})
const flightFormRef = ref()
const goodsList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadFlights()
})

const resetForm = () => {
  flightFormRef.value.resetFields()
  form.id = null
  form.flightNumber = ''
  form.departureAirport = ''
  form.arrivalAirport = ''
  form.departureTime = ''
  form.arrivalTime = ''
  form.status = ''
}

defineExpose({ resetForm })

const loadFlights = async () => {
  const data = await getFlightsList()
  goodsList.value = data
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增航班
const addSubmit = async () => {
  const data = {
    flightNumber: form.flightNumber,
    departureAirport: form.departureAirport,
    arrivalAirport: form.arrivalAirport,
    departureTime: form.departureTime,
    arrivalTime: form.arrivalTime,
    status: form.status
  }
  if (await addGoods(data)) {
    resetForm()
    loadFlights()
  }
}

// 修改航班
const editSubmit = async () => {
  if (await editGoods(form)) {
    resetForm()
    loadFlights()
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
    const response = await delGoods({ id: row.id });

    if (response) { // 确保 response 和 response.data 存在且 code 为 1 表示成功
      loadFlights();
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
  text-align: left;
}
.upload-demo {
  text-align: left;
  width: 91%;
}
</style>



