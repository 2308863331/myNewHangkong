<template>
  <div>
    <!-- 用户列表 -->
    <el-table :data="usersList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="userId" label="ID" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="orderId" label="订单id" sortable min-width="120"/>
      <el-table-column prop="totalAmount" label="订单总额" />
      <el-table-column prop="paymentMethod" label="支付方式" sortable min-width="120" />
      <el-table-column prop="paymentStatus" label="支付状态" sortable min-width="120" />
      <el-table-column prop="paymentTime" label="支付时间" sortable min-width="180" >
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单部分 -->
    <el-form ref="userFormRef" :model="form" label-width="300px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请填写用户名" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请填写邮箱" />
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone" placeholder="请填写电话" />
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-input v-model="form.address" placeholder="请填写地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="editSubmit()">修改</el-button>
        <el-button type="primary" @click="addSubmit()">新增</el-button>
        <el-button @click="btnCancel">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { userOrder } from '../../api' // 假设这些是API函数
import useToken from '../../stores/token'
import { ElMessageBox } from 'element-plus'

const resetForm = () => {
  userFormRef.value.resetFields()
  form.id = null
  form.username = ''
  form.orderId = ''
  form.totalAmount = 0.0
  form.paymentMethod = ''
  form.paymentTime = ''
  form.paymentStatus = ''
}

defineExpose({ resetForm })

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  username: '',
  orderId: '',
  totalAmount: 0.0,
  paymentMethod: '',
  paymentTime: '',
  paymentStatus: ''
})

const userFormRef = ref()
const usersList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  console.log('Component mounted');
  loadUsers()
})

const loadUsers = async () => {
  try {
    const userId = 1;
    
    // 调用API并立即检查返回值是否如预期
    let response = await userOrder({ userId });
    console.log('API Response:', response); // 打印响应信息以便调试

    // 确认response存在并且有data属性
    if (response && Array.isArray(response.data)) {
      usersList.value = response.data;
    } else {
      console.error('Unexpected response structure or data is not an array');
      usersList.value = []; // 设置为空数组以防显示“暂无数据”
    }
  } catch (error) {
    console.error('Error fetching user orders:', error.message || error);
    usersList.value = []; // 设置为空数组以防显示“暂无数据”
  }
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增用户
const addSubmit = async () => {
  const data = { ...form }
  if (await addUser(data)) {
    resetForm()
    loadUsers()
    emit('success')
  }
}

// 修改用户  
const editSubmit = async () => {
  if (await editUser(form)) {
    resetForm()
    loadUsers()
    emit('success')
  }
}

// 删除用户
const delRow = async (row) => {
  try {
    await ElMessageBox.confirm(
      '您确定要删除此用户吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await delUser({ userId: row.userId })

    if (response) {
      loadUsers()
      emit('success')
    } else {
      console.error('Failed to delete user:')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete user:', error)
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

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
