<template>
    <div>
      <!-- 用户列表 -->
      <el-table :data="usersList" style="width: 100%; margin-bottom: 20px">
        <el-table-column prop="userId" label="ID" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="userGroup" label="用户组" sortable min-width="120"/>
        <el-table-column fixed prop="nickname" label="昵称" />
        <el-table-column label="头像" min-width="110" />
        <el-table-column prop="phone" label="手机号码" sortable min-width="120" />
        <el-table-column prop="phoneState" label="手机认证" sortable min-width="120" />
        <el-table-column prop="email" label="邮箱" sortable min-width="180" />
        <el-table-column prop="emailState" label="邮箱状态" sortable min-width="120" />
        <el-table-column prop="state" label="状态" sortable min-width="120" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="address" label="地址" />
        <el-table-column fixed="right" label="操作" width="200">
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
          <el-button type="primary" @click="editSubmit()" v-if="form.id">修改</el-button>
          <el-button type="primary" @click="addSubmit()" v-else>新增</el-button>
          <el-button @click="btnCancel">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, onMounted } from 'vue'
  import { getUsers, addUser, editUser, delUser } from '../api' // 假设这些是API函数
  import useToken from '../stores/token'
  import { ElMessageBox } from 'element-plus'
  
  const resetForm = () => {
    userFormRef.value.resetFields()
    form.id = null
    form.username = ''
    form.email = ''
    form.phone = ''
    form.address = ''
  }
  
  defineExpose({ resetForm })
  
  const emit = defineEmits(['success'])
  
  const form = reactive({
    id: null,
    username: '',
    email: '',
    phone: '',
    address: ''
  })
  
  const userFormRef = ref()
  const usersList = ref([])
  
  const { token } = useToken()
  const headers = { jwt: token }
  
  onMounted(() => {
    loadUsers()
  })
  
  const loadUsers = async () => {
    const data = await getUsers() // 获取用户列表的API请求
    usersList.value = data
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
  
      const response = await delUser({ id: row.id })
  
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
  </style>