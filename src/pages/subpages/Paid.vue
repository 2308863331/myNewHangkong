<template>
  <div>
    <!-- 新增航班按钮 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增航班</el-button>

    <!-- 新增或修改航班的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改商品' : '新增航班'" :before-close="handleBeforeClose">
      <GoodsEdit ref="goodsForm" :id="id" @success="editSuccess" />
    </el-dialog>

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
import { getGoodsList, delGoods } from '../../api' // 导入 API 函数
import GoodsEdit from '../../components/PaidEdit.vue' // 导入 GoodsEdit 组件
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

// 定义响应式变量
const goodsList = ref([]) // 商品列表
const page = ref(1) // 当前页码
const pagesize = ref(10) // 每页显示的商品数量
const total = ref(0) // 总记录数
const id = ref() // 当前操作的商品 ID
const dialogVisible = ref(false) // 控制对话框的显示与隐藏
const goodsForm = ref() // 引用 GoodsEdit 组件实例

// 页面加载完成后执行
onMounted(() => {
  loadGoodsList()
})

// 加载商品列表
const loadGoodsList = async () => {
  const params = {
    page: page.value, // 当前页码
    pagesize: pagesize.value // 每页显示的数量
  }
  try {
    const response = await getGoodsList(params) // 发送请求获取商品列表
    console.log('API Response:', response) // 添加调试信息
    if (response.total !== undefined && response.records !== undefined) {
      if (Array.isArray(response.records)) {
        goodsList.value = response.records.map(item => {
          item.description = removeTages(item.description || '') // 移除商品简介中的 HTML 标签
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

// 去掉标签，仅显示文字
const removeTages = str => {
  return str.replace(/<[^>]+>/g, '') // 使用正则表达式移除所有 HTML 标签
}

// 新增航班  
const addRow = () => {
  if (goodsForm.value) {
    goodsForm.value.resetForm(0) // 重置表单，0 表示新增
  }
  id.value = 0 // 设置 ID 为 0，表示新增
  dialogVisible.value = true // 显示对话框
}

// 修改商品
const editRow = row => {
  if (goodsForm.value) {
    goodsForm.value.resetForm(row.id) // 重置表单，传入商品 ID 表示编辑
    
  }
  id.value = row.id // 设置 ID 为当前商品的 ID
  dialogVisible.value = true // 显示对话框
}

// // 删除商品
// const delRow = row => {
//   ElMessageBox.confirm('确定要删除此航班信息吗？', {
//     closeOnClickModal: false,
//     confirmButtonText: '确定',
//     cancelButtonText: '取消',
//   }).then(async () => {
//     if (await delGoods({ id: row.id })) { // 发送请求删除商品
//       loadGoodsList() // 重新加载商品列表
//     }
//   }).catch(() => {}) // 用户取消删除操作
// }
// 删除航班

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
      loadGoodsList();
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
// 换页
const handleCurrentChange = value => {
  page.value = value // 更新当前页码
  loadGoodsList() // 重新加载商品列表
}

// 编辑完成
const editSuccess = () => {
  loadGoodsList() // 重新加载商品列表
  dialogVisible.value = false // 隐藏对话框
}

// 关闭弹出框前
const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', {
    showClose: false,
    closeOnClickModal: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    dialogVisible.value = false // 隐藏对话框
    setTimeout(() => {
      goodsForm.value.resetForm() // 延迟重置表单
    }, 500)
  }).catch(() => {}) // 用户取消关闭操作
}
</script>



