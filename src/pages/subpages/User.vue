<template>
    <!-- 新增评论按钮 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增用户</el-button>

    <!-- 新增或修改评论的弹出框 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改用户' : '新增用户'" :before-close="handleBeforeClose">
      <UserEdit ref="reviewsForm" :id="id" @success="editSuccess" />
    </el-dialog>

    <el-main class="bg table_wrap">
      <!-- 查询表单 -->
      <el-form label-position="right" :model="query" class="form p_4" label-width="120">
        <el-row>
          <el-col :xs="24" :sm="24" :lg="8" class="el_form_search_wrap">
            <el-form-item label="昵称">
              <el-input v-model="query.nickname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="24" class="search_btn_wrap">
            <el-col :xs="24" :sm="12" :lg="12" class="search_btn_1">
              <el-form-item>
                <el-button type="primary" @click="search()">查询</el-button>
                <el-button @click="reset()">重置</el-button>
                <el-button v-if="userGroup == '管理员'" type="danger" @click="delInfo()">删除</el-button>
                <el-button v-if="userGroup == '管理员'"  @click="addRow">添加</el-button>
              </el-form-item>
            </el-col>
          </el-col>
        </el-row>
      </el-form>
  
      <!-- 用户列表表格 -->
      <el-table :data="list" @selection-change="selectionChange" style="width: 100%" stripe>
        <el-table-column fixed type="selection" width="55"></el-table-column>
        <el-table-column fixed prop="nickname" label="昵称"></el-table-column>
        <el-table-column label="头像" min-width="110">
          <template #default="scope">
            <el-avatar   style="width: 80px;height: 80px;">
              <img src="/img/error.png" />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" sortable width="120"></el-table-column>
        <el-table-column prop="userGroup" label="用户组" sortable min-width="120">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" sortable min-width="120"></el-table-column>
        <el-table-column prop="phoneState" label="手机认证" sortable min-width="120">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" sortable min-width="180"></el-table-column>
        <el-table-column prop="emailState" label="邮箱状态" sortable min-width="120">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" sortable min-width="120">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="上次登录时间" sortable min-width="200">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" sortable min-width="200">
          <template #default="scope">
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="80">
          <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <!-- <el-button type="danger" @click="delRow(row)">删除</el-button> -->
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
    </el-main>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { getUsersList ,getUsers, delUser } from '../../api' // 假设API路径是这样
  import UserEdit from '../../components/UserEdit.vue'
  import { ElMessageBox } from 'element-plus'
// 定义响应式变量
const list = ref([])
const page = ref(1)
const pagesize = ref(10)
const total = ref(0)
const id = ref()
const dialogVisible = ref(false)
const userForm = ref()
onMounted(() => {
  loadUsersList()
})



const addRow = () => {
  if (userForm.value) {
    userForm.value.resetForm(0) // 重置表单，0 表示新增
  }
  id.value = 0
  dialogVisible.value = true
}

const editRow = row => {
  if (userForm.value) {
    userForm.value.resetForm(row.id) // 重置表单，传入用户ID表示编辑
  }
  id.value = row.id
  dialogVisible.value = true
}

const delRow = async row => {
  try {
    await ElMessageBox.confirm('确定要删除此用户吗？', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    if (await delUser({ id: row.id })) {
      loadUsersList()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete user:', error)
    }
  }
}
const handleCurrentChange = value => {
  page.value = value
  loadUsersList()
}

const editSuccess = () => {
  loadUsersList()
  dialogVisible.value = false
}

const handleBeforeClose = () => {
  ElMessageBox.confirm('确定关闭对话框吗？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    dialogVisible.value = false
    setTimeout(() => userForm.value.resetForm(), 500)
  }).catch(() => {})
}


  const query = reactive({
    size: 10,
    page: 1,
    nickname: "",
    userGroup: "管理员",
    loginTime: "",
    createTime: ""
  })
  
  const count = ref(0)
  const selectedRows = ref([])
  
  // 状态映射
  const listIsState = new Map([
    [0, { text: "未认证" }],
    [1, { text: "认证中" }],
    [2, { text: "已认证" }]
  ])
  
  const userGroup = ref("管理员")

  const loadUsersList = async () => {
  const params = { page: page.value, pagesize: pagesize.value }
  try {
    const response = await getUsersList(params)
    if (response.total !== undefined && Array.isArray(response.records)) {
        list.value = response.records
      total.value = response.total
    }
  } catch (error) {
    console.error('Error fetching reviews list:', error)
  }
}

  
  
  // 搜索功能
  function search() {
    query.page = 1 // 搜索时重置到第一页
    loadUsersList()
  }
  
  // 重置功能
  function reset() {
    query.nickname = ""
    query.loginTime = ""
    query.createTime = ""
    loadUsersList()
  }
  
  // 删除选中的用户信息
  async function delInfo() {
    if (!selectedRows.value.length) {
      return ElMessageBox.alert('请选择要删除的用户', '提示')
    }
  
    try {
      await ElMessageBox.confirm('确定要删除所选用户吗？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
  
      for (let row of selectedRows.value) {
        await delUser({ id: row.id })
      }
  
      loadUsersList()
    } catch (error) {
      if (error !== 'cancel') {
        console.error('Failed to delete users:', error)
      }
    }
  }
  
  // 分页大小改变
  function handleSizeChange(size) {
    query.size = size
    loadUsersList()
  }
  

  
  // 行选择变化时触发
  function selectionChange(selection) {
    selectedRows.value = selection
  }
  
  // 生命周期钩子
  onMounted(() => {
    loadUsersList()
  })
  </script>
  
  <style scoped>
  /* 添加一些基本样式 */
  .el_table{
    background-color: #409EFF; /* Element UI 默认蓝色 */
  }
  .el_avatar img {
    width: 80px;
    height: 80px;
  }
  </style>