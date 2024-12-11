<template>
  <div>
    <!-- 评论列表 -->
    <el-table :data="reviewsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="flightId" label="航班ID" />
      <el-table-column prop="rating" label="评分" />
      <el-table-column prop="comment" label="评论内容" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button> <!-- 传递 row 参数 -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单部分 -->
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
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getReviews, addReview, editReview, delReview } from '../api' // 假设这些是API函数
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus'
const resetForm = () => {
  reviewsFormRef.value.resetFields()
  form.id=''
  form.userId= ''
  form.flightId= ''
  form.rating= 0
  form.comment=''
}
defineExpose({ resetForm })

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  userId: '',
  flightId: '',
  rating: 0,
  comment: ''
})

const reviewsFormRef = ref()
const reviewsList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadReviews()
})


const loadReviews = async () => {
  const data = await getReviews() // 假设这是一个获取评论列表的API请求
  reviewsList.value = data
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增评论
const addSubmit = async () => {
  const data = { ...form }
  if (await addReview(data)) {
    resetForm()
    loadReviews()
    emit('success')
  }
}

// 修改评论  
const editSubmit = async () => {
  if (await editReview(form)) {
    resetForm()
    loadReviews()
    emit('success')
  }
}

// 删除评论
const delRow = async (row) => {
  try {
    await ElMessageBox.confirm(
      '您确定要删除此评论吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await delReview({ id: row.id })

    if (response) {
      loadReviews()
      emit('success')
    } else {
      console.error('Failed to delete review:')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete review:', error)
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
</style>