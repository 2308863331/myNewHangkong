<template>
  <div>
    <el-button type="primary" style="margin-bottom: 10px" @click="addRow">新增分类</el-button>
    <!-- 新增分类的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改分类' : '新增分类'" :before-close="handleBeforeClose">
      <CategoryEdit ref="flightsForm" :id="id" @success="editSuccess" />
    </el-dialog>
    <!-- 航班管理 -->

    <el-table ref="tableRef" :data="tableData" style="margin-bottom: 20px" row-key="id" border default-expand-all>
    <el-table-column prop="id" label="航班ID" />
    <el-table-column prop="flight_number" label="航班号" sortable />
    <el-table-column label="航班状态">
      <template #default="{ row }">
        <span>{{ row.status }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="departure_airport" label="出发机场" />
    <el-table-column prop="arrival_airport" label="到达机场" />
    <el-table-column prop="departure_time" label="出发时间" />
    <el-table-column prop="arrival_time" label="到达时间" />
    <el-table-column prop="created_at" label="创建时间" />
    <el-table-column prop="updated_at" label="更新时间" />
    <el-table-column fixed="right" label="操作" width="180">
      <template #default="{ row }">
        <el-button type="warning" @click="editRow(row)">编辑</el-button>
        <el-button type="danger" @click="delRow(row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

    <!-- <el-table ref="tableRef" :data="tableData" style="margin-bottom: 20px" row-key="id" border default-expand-all>
      <el-table-column prop="name" label="分类名称" sortable />
      <el-table-column label="分类级别">
        <template #default="{ row }">
          <span v-if="row.pid == 0">一级分类</span>
          <span v-else>二级分类</span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="分类编号" />
      <el-table-column label="分类图片">
        <template #default="{ row }">
          <el-image v-if="row.picture != ''" :src="row.picture" fit="contain" style="display: flex; align-items: center; height: 60px" />
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getFlightsList, delCategory } from '../../api'
import { ElMessageBox, ElMessage } from 'element-plus'
import CategoryEdit from '../../components/CategoryEdit2.vue'

const tableData = ref([])
const dialogVisible = ref(false)
const id = ref(0)
const flightsForm = ref()

onMounted(() => {
  loadCategoryList()
})

// 查询分类列表
const loadCategoryList = async () => {
  const data = await getFlightsList().then(response => {
        this.tableData = response.data; // 假设后端返回的数据在 response.data 中
      })
      .catch(error => {
        console.error('Error fetching flight data:', error);
      });
  }

  tableData.value = convertToTree(data).data
// // 将一维数组转换成树形结构的方法
// const convertToTree = data => {
//   const treeData = []
//   const map = {}
//   // 遍历一维数组数据，建立节点映射表
//   for (const item of data) {
//     map[item.id] = { ...item, children: [] }
//   }
//   // 遍历映射表，将节点添加到父节点的children中
//   for (const item of data) {
//     const node = map[item.id]
//     if (item.pid === 0) {
//       treeData.push(node)
//     } else {
//       const parent = map[item.pid]
//       parent.children.push(node)
//     }
//   }
//   return treeData
// }

// 新增分类
const addRow = () => {
  if (flightsForm.value) {
    flightsForm.value.resetForm(0)
  }
  id.value = 0
  dialogVisible.value = true
}

// 修改分类
const editRow = row => {
  if (flightsForm.value) {
    flightsForm.value.resetForm(row.id)
  }
  id.value = row.id
  dialogVisible.value = true
}

// 删除分类
const delRow = row => {
  if (row.pid == 0 && row.children.length != 0) {
    ElMessage({
      type: 'warning',
      message: '该分类下存在二级分类，请先删除二级分类再删除此分类'
    })
  } else {
    ElMessageBox.confirm('确定要删除此分类吗？', {
      closeOnClickModal: false,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    }).then(async () => {
      if (await delCategory({ id: row.id })) {
        loadCategoryList()
      }
    }).catch(() => {})
  }
}

const editSuccess = () => {
  loadCategoryList()
  dialogVisible.value = false
}

// 关闭弹出框前
const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', {
    showClose: false,
    closeOnClickModal: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(() => {
    dialogVisible.value = false
  }).catch(() => {})
}
</script>
