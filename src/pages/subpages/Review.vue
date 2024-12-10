<template>
    <div>
      <!-- 新增评论按钮 -->
      <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增评论</el-button>
  
      <!-- 新增或修改评论的弹出框 -->
      <el-dialog v-model="dialogVisible" :title="id ? '修改评论' : '新增评论'" :before-close="handleBeforeClose">
        <ReviewsEdit ref="reviewsForm" :id="id" @success="editSuccess" />
      </el-dialog>
  
      <!-- 评论列表 -->
      <el-table :data="reviewsList" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="id" label="评论ID" />
        <el-table-column prop="userId" label="用户ID" sortable />
        <el-table-column prop="flightId" label="航班ID" sortable />
        <el-table-column prop="rating" label="评分" sortable />
        <el-table-column prop="comment" label="评论内容" />
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
  import { getReviewsList, delReview } from '../../api/reviews'
  import ReviewsEdit from '../../components/ReviewsEdit.vue'
  import { ElMessageBox } from 'element-plus'
  
  // 定义响应式变量
  const reviewsList = ref([])
  const page = ref(1)
  const pagesize = ref(10)
  const total = ref(0)
  const id = ref()
  const dialogVisible = ref(false)
  const reviewsForm = ref()
  
  onMounted(() => {
    loadReviewsList()
  })
  
  const loadReviewsList = async () => {
    const params = { page: page.value, pagesize: pagesize.value }
    try {
      const response = await getReviewsList(params)
      if (response.total !== undefined && Array.isArray(response.records)) {
        reviewsList.value = response.records
        total.value = response.total
      }
    } catch (error) {
      console.error('Error fetching reviews list:', error)
    }
  }
  
  const addRow = () => {
    reviewsForm.value.resetForm(0)
    id.value = 0
    dialogVisible.value = true
  }
  
  const editRow = row => {
    reviewsForm.value.resetForm(row.id)
    id.value = row.id
    dialogVisible.value = true
  }
  
  const delRow = async row => {
    try {
      await ElMessageBox.confirm('确定要删除此评论吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      if (await delReview({ id: row.id })) {
        loadReviewsList()
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Failed to delete review:', error)
      }
    }
  }
  
  const handleCurrentChange = value => {
    page.value = value
    loadReviewsList()
  }
  
  const editSuccess = () => {
    loadReviewsList()
    dialogVisible.value = false
  }
  
  const handleBeforeClose = () => {
    ElMessageBox.confirm('确定关闭对话框吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      dialogVisible.value = false
      setTimeout(() => reviewsForm.value.resetForm(), 500)
    }).catch(() => {})
  }
  </script>