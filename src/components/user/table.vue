<template>
  <el-main class="bg table_wrap">
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
              <el-button type="primary" @click="search()" class="search_btn_find">查询</el-button>
              <el-button @click="reset()" class="search_btn_reset">重置</el-button>
              <el-button v-if="userGroup == '管理员'" class="float-right search_btn_del" type="danger" @click="delInfo()">删除</el-button>
              <router-link v-if="userGroup == '管理员'" class="el-button float-right el-button--default el-button--primary search_btn_add"
                to="./view?">添加</router-link>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="12" class="search_btn_2">
            
          </el-col>
        </el-col>
      </el-row>
    </el-form>
    <el-table border :data="list" @selection-change="selectionChange" @sort-change="$sortChange" style="width: 100%" stripe>
      <el-table-column fixed type="selection" tooltip-effect="dark" width="55"></el-table-column>
      <el-table-column fixed prop="nickname" label="昵称"></el-table-column>
      <el-table-column label="头像" min-width="110">
        <template #default="scope">
          <el-avatar :src="$fullUrl(scope.row.avatar)" style="width: 80px;height: 80px;">
            <img src="/img/error.png" />
          </el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="120"></el-table-column>
      <el-table-column prop="user_group" label="用户组" sortable min-width="120">
        <template #default="scope">
          {{ scope.row.user_group }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" sortable min-width="120"></el-table-column>
      <el-table-column prop="phone_state" label="手机认证" sortable min-width="120">
        <template #default="scope">
          {{ listIsState.getVal("text", { value: scope.row.phone_state }) }}
        </template>
      </el-table-column>
      <el-table-column prop="email" label="邮箱" sortable min-width="180"></el-table-column>
      <el-table-column prop="email_state" label="邮箱状态" sortable min-width="120">
        <template #default="scope">
          {{ listIsState.getVal("text", { value: scope.row.email_state }) }}
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" sortable min-width="120">
        <template #default="scope">
          {{ listIsState.getVal("text", { value: scope.row.state }) }}
        </template>
      </el-table-column>
      <el-table-column prop="login_time" label="上次登录时间" sortable min-width="200">
        <template #default="scope">
          {{ $toTime(scope.row["login_time"], "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <el-table-column sortable prop="create_time" label="创建时间" min-width="200">
        <template #default="scope">
          {{ $toTime(scope.row["create_time"], "yyyy-MM-dd hh:mm:ss") }}
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column fixed="right" label="操作" width="80">
        <template #default="scope">
          <router-link class="el-button el-button--small is-plain el-button--primary"
            :to="'./view?' + field + '=' + scope.row[field]" size="small">
            详情
          </router-link>
        </template>
      </el-table-column>
      <!-- /操作 -->
    </el-table>
    <!-- 分页器 -->
    <div class="mt text_center">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="query.page"
        :page-sizes="[7, 10, 30, 100]" :page-size="query.size" layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </div>
    <!-- /分页器 -->
  </el-main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import mixin from "@/mixins/page.js"; // 注释掉 mixin 引入

// 原来的 data 部分转化为响应式变量
const urlGetList = "~/api/user/get_list?like=0" // 注释掉 API 地址
const urlDel = "~/api/user/del?" // 注释掉 API 地址

const field = ref("user_id")

const query = reactive({
  size: 10,
  page: 1,
  nickname: "",
  user_group: "管理员",
  login_time: "",
  create_time: ""
})

const list = ref([])
const count = ref(0)

const listState = [
  {
    text: '可用',
    value: 1
  }, {
    text: '异常',
    value: 2
  }, {
    text: '已冻结',
    value: 3
  }, {
    text: '已注销',
    value: 4
  }
]

const listIsState = new Map([
  [0, { text: "未认证" }],
  [1, { text: "认证中" }],
  [2, { text: "已认证" }]
])

const listUserGroup = ref([])

const userGroup = ref("管理员") // 假设用户组默认为管理员

// 原来的 methods 部分转化为函数
function deleteRow(index, rows) {
  rows.splice(index, 1)
}

async function getListUserGroup() {
  // var json = await this.$get("~/api/user_group/get_list?"); // 注释掉 API 调用
  // if (json.result) {
  //   listUserGroup.value = json.result.list;
  // } else if (json.error) {
  //   console.error(json.error);
  // }
}

function tableClass({ row, column, rowIndex, columnIndex }) {
  return "table_class"
}

// 查询功能
function search() {
  // 这里可以添加查询逻辑
}

// 重置功能
function reset() {
  query.nickname = ""
  query.login_time = ""
  query.create_time = ""
}

// 删除功能
function delInfo() {
  // 这里可以添加删除逻辑
}

// 分页大小改变
function handleSizeChange(size) {
  query.size = size
  // 获取列表数据的逻辑
}

// 当前页改变
function handleCurrentChange(page) {
  query.page = page
  // 获取列表数据的逻辑
}

// 生命周期钩子
onMounted(() => {
  getListUserGroup()
})
</script>

<style scoped>
/* 添加一些基本样式 */
.el_avatar img {
  width: 80px;
  height: 80px;
}
</style>



