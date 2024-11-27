<template>
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
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getFlightsList, uploadPictureURL, getGoods, addGoods, editGoods } from '../api'
import useToken from '../stores/token'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  id: {
    type: Number
  }
})

const emit = defineEmits(['success'])

const form = reactive({
  id: props.id,
  flightNumber: '',
  departureAirport: '',
  arrivalAirport: '',
  departureTime: '',
  arrivalTime: '',
  status: ''
})
const flightFormRef = ref()
const flightsList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadFlight()
  loadFlights()
})

const resetForm = id => {
  form.id = id
  btnCancel()
}

defineExpose({ resetForm })

const loadFlight = async () => {
  if (form.id) {
    const goods = await getGoods({ id: form.id })
    Object.assign(form, goods)
  }
}

const loadFlights = async () => {
  const data = await getFlightsList()
  flightsList.value = convertToTree(data)
}

const convertToTree = data => {
  const treeData = []
  const map = {}
  for (const item of data) {
    map[item.id] = { ...item, children: [] }
  }
  for (const item of data) {
    const node = map[item.id]
    if (item.pid === 0) {
      treeData.push(node)
    } else {
      const parent = map[item.pid]
      parent.children.push(node)
    }
  }
  return treeData
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
  if (await addGoods(data)) { // 保持现有API调用不变
    emit('success')
  }
}

// 修改航班
const editSubmit = async () => {
  if (await editGoods(form)) { // 保持现有API调用不变
    emit('success')
  }
}

// 重置表单
const btnCancel = () => {
  flightFormRef.value.resetFields()
  form.flightNumber = ''
  form.departureAirport = ''
  form.arrivalAirport = ''
  form.departureTime = ''
  form.arrivalTime = ''
  form.status = ''
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








<!-- 
<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getGoods, addGoods, editGoods } from '../api' // 保持现有API路径不变
import useToken from '../stores/token'

const props = defineProps({
  id: {
    type: Number
  }
})

const formRef = ref()

onMounted(() => {
  loadFlight()
})

const resetForm = id => {
  form.id = id
  btnCancel()
}

defineExpose({ resetForm })

const loadFlight = async () => {
  if (form.id) {
    const flight = await getGoods({ id: form.id }) // 保持现有API调用不变
    Object.assign(form, flight)
  }
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
  if (await addGoods(data)) { // 保持现有API调用不变
    emit('success')
  }
}

// 修改航班
const editSubmit = async () => {
  if (await editGoods(form)) { // 保持现有API调用不变
    emit('success')
  }
}

// 重置表单
const btnCancel = () => {
  formRef.value.resetFields()
  form.flightNumber = ''
  form.departureAirport = ''
  form.arrivalAirport = ''
  form.departureTime = ''
  form.arrivalTime = ''
  form.status = ''
}
</script>

<style scoped>
.el-form-item {
  text-align: left;
}
</style> -->
