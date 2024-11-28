<template>
  <div>
    <!-- 新增座位按钮 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增座位</el-button>

    <!-- 新增或修改座位的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改座位' : '新增座位'" :before-close="handleBeforeClose">
      <SeatEdit ref="seatForm" :id="id" @success="editSuccess" />
    </el-dialog>

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
import { getSeatsList, delSeat} from '../../api' // 导入 API 函数
import SeatEdit from '../../components/SeatEdit.vue' // 导入 SeatEdit 组件
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

// 定义响应式变量
const seatsList = ref([]) // 座位列表
const page = ref(1) // 当前页码
const pagesize = ref(10) // 每页显示的座位数量
const total = ref(0) // 总记录数
const id = ref() // 当前操作的座位 ID
const dialogVisible = ref(false) // 控制对话框的显示与隐藏
const seatForm = ref() // 引用 SeatEdit 组件实例

// 页面加载完成后执行
onMounted(() => {
  loadSeatsList()
})

// 加载座位列表
const loadSeatsList = async () => {
  const params = {
    page: page.value, // 当前页码
    pagesize: pagesize.value // 每页显示的数量
  }
  try {
    const response = await getSeatsList(params) // 发送请求获取座位列表
    console.log('API Response:', response) // 添加调试信息
    if (response.total !== undefined && response.records !== undefined) {
      if (Array.isArray(response.records)) {
        seatsList.value = response.records.map(item => {
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

// 新增座位  
const addRow = () => {
  if (seatForm.value) {
    seatForm.value.resetForm(0) // 重置表单，0 表示新增
  }
  id.value = 0 // 设置 ID 为 0，表示新增
  dialogVisible.value = true // 显示对话框
}

// 修改座位
const editRow = row => {
  if (seatForm.value) {
    seatForm.value.resetForm(row.id) // 重置表单，传入座位 ID 表示编辑
  }
  id.value = row.id // 设置 ID 为当前座位的 ID
  dialogVisible.value = true // 显示对话框
}

// 删除座位
const delRow = async (row) => {
  try {
    // 显示确认对话框
    await ElMessageBox.confirm(
      '您确定要删除此座位吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    // 用户点击了“确定”，执行删除操作
    const response = await delSeat({ id: row.id });
    if (response) { // 确保 response 存在且 code 为 1 表示成功
      loadSeatsList();
    } else {
      console.error('Failed to delete seat:');
    }
  } catch (error) {
    // 用户点击了“取消”或删除失败时处理错误
    if (error !== 'cancel') {
      console.error('Failed to delete seat:', error);
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
  loadSeatsList()
}

// 处理分页变化
const handleCurrentChange = (newPage) => {
  page.value = newPage
  loadSeatsList()
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



