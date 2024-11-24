<template>
  <div>
    <!-- 新增商品按钮 -->
    <!-- 当点击按钮时，触发 addRow 方法，显示新增商品的弹出框 -->
    <el-button type="primary" style="margin-bottom: 10px;" @click="addRow">新增商品</el-button>

    <!-- 新增或修改商品的弹出框 -->
    <!-- 使用 v-model 控制对话框的显示与隐藏，标题根据是否有 id 判断显示新增还是修改 -->
    <el-dialog v-model="dialogVisible" :title="id ? '修改商品' : '新增商品'" :before-close="handleBeforeClose">
      <!-- GoodsEdit 组件负责处理商品信息的编辑 -->
      <!-- 通过 ref 引用 GoodsEdit 组件实例，便于在父组件中调用其方法 -->
      <!-- 将 id 作为属性传递给 GoodsEdit 组件，用于区分是新增还是修改 -->
      <!-- 监听 GoodsEdit 组件的成功事件，当编辑成功时执行 editSuccess 方法 -->
      <GoodsEdit ref="goodsForm" :id="id" @success="editSuccess" />
    </el-dialog>

    <!-- 商品列表 -->
    <!-- 使用 el-table 组件展示商品列表，每列显示不同的商品信息 -->
    <el-table :data="goodsList" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
      <el-table-column prop="id" label="商品编号" width="100" />
      <el-table-column prop="name" label="商品名称" width="260" />
      <el-table-column prop="price" label="商品价格" width="100" />
      <el-table-column prop="stock" label="商品库存" width="100" />
      <el-table-column prop="description" label="商品简介" />
      <!-- 商品图片列 -->
      <el-table-column prop="picture" label="商品图片" width="120">
        <!-- 使用作用域插槽自定义列内容 -->
        <!-- 当有图片时，显示图片；否则显示空白 -->
        <template #default="{ row }">
          <el-image v-if="row.picture != ''" :src="row.picture" fit="contain"
            style="display: flex; align-items: center; height: 60px;" />
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column fixed="right" label="操作" width="200">
        <!-- 使用作用域插槽为每行添加操作按钮 -->
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <!-- 使用 el-pagination 组件实现分页功能 -->
    <!-- 绑定当前页码，监听当前页变化事件 -->
    <!-- total 表示总记录数，pagesize 表示每页显示的记录数 -->
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
import GoodsEdit from '../../components/GoodsEdit.vue' // 导入 GoodsEdit 组件
import { ElMessageBox } from 'element-plus' // 导入 Element Plus 的消息框组件

// 定义响应式变量
const goodsList = ref([]) // 商品列表
const page = ref(1) // 当前页码
const pagesize = ref(2) // 每页显示的商品数量
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
  const data = await getGoodsList(params) // 发送请求获取商品列表
  goodsList.value = data.list.map(item => {
    item.description = removeTages(item.description) // 移除商品简介中的 HTML 标签
    return item
  })
  total.value = data.total // 更新总记录数
}

// 去掉标签，仅显示文字
const removeTages = str => {
  return str.replace(/<[^>]+>/g, '') // 使用正则表达式移除所有 HTML 标签
}

// 新增商品
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

// 删除商品
const delRow = row => {
  ElMessageBox.confirm('确定要删除此商品吗？', { // 创建确认对话框
    closeOnClickModal: false,
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(async () => {
    if (await delGoods({ id: row.id })) { // 发送请求删除商品
      loadGoodsList() // 重新加载商品列表
    }
  }).catch(() => {}) // 用户取消删除操作
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
  ElMessageBox.confirm('确定关闭对话框吗？', { // 创建确认对话框
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