<template>
  <div class="warp" id="user_info">
    <el-row class="card">
      <el-col>
        <h1 class="text-center">
          个人信息
        </h1>
      </el-col>
      <el-col>
        <el-form ref="formRef" :rules="rules" :model="form" label-width="100px">
          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item label="头像">
              <el-upload class="avatar-uploader" drag accept="image/gif, image/jpeg, image/png, image/jpg"
                action="" :http-request="uploadAvatar" :show-file-list="false">
                <img v-if="form.avatar" :src="$fullUrl(form.avatar)" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item label="用户名" prop="username">
              {{ obj.username }}
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item prop="nickname" label="昵称">
              <el-input v-model="form.nickname" :minlength="0" :maxlength="16" placeholder="" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item label="用户组" prop="user_group">
              {{ obj.user_group }}
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item prop="phone" label="手机号码">
              <el-input v-model="form.phone" :minlength="0" :maxlength="11"
                placeholder="用户的手机号码，用于找回密码时或登录时" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item label="状态" prop="state">
              {{ getUserStateName(obj.state) }}
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
            <el-form-item prop="email" label="邮箱">
              <el-input v-model="form.email" :minlength="0" :maxlength="64"
                placeholder="用户的邮箱，用于找回密码时或登录时" />
            </el-form-item>
          </el-col>

          <el-col :xs="24" :sm="12" :lg="8" class="el_form_btn_warp">
            <el-form-item>
              <el-button type="primary" @click="submit()">提交</el-button>
              <el-button @click="cancel()">取消</el-button>
              <router-link v-if="sourceTable && ($checkAction(sourceTableCheckUrl, 'get') || $checkAction(sourceTableCheckUrl, 'set'))" class="el-button float-right el-button--default el-button--primary"
                           :to="sourceTableUrl">详情
              </router-link>
            </el-form-item>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

// 原来的 data 部分转化为响应式变量
const urlGetObj = "~/api/user/get_obj?" // 注释掉 API 地址
const urlSet = "~/api/user/set?" // 注释掉 API 地址
const urlUpload = "~/api/user/upload?" // 注释掉 API 地址
const urlUserGroupGetObj = "~/api/user_group/get_obj?" // 注释掉 API 地址

const sourceTable = ref(null)
const sourceTableName = ref(null)
const sourceTableCheckUrl = ref("")
const sourceTableUrl = ref("")

const field = "user_id"

const query = reactive({
  user_id: "" // 假设从 store 获取 user_id
})

const form = reactive({
  user_id: "", // 假设从 store 获取 user_id
  username: "",
  phone: "",
  email: "",
  nickname: "",
  avatar: ""
})

const listUserState = [
  {
    value: 1,
    name: "可用"
  }, {
    value: 2,
    name: "异常"
  }, {
    value: 3,
    name: "已冻结"
  }, {
    value: 4,
    name: "已注销"
  }
]

const rules = {
  nickname: [{
    required: true,
    message: '昵称不能为空！',
    trigger: 'blur'
  },
  {
    min: 2,
    max: 16,
    message: '长度在 2 到 16 个字符',
    trigger: 'blur'
  }],
  phone: [{
    min: 11,
    max: 11,
    message: '长度为 11 个字符',
    trigger: 'blur'
  }]
}

const obj = reactive({
  username: "",
  user_group: "",
  state: ""
})

// 辅助函数来获取用户状态名称
function getUserStateName(value) {
  const state = listUserState.find(item => item.value === value);
  return state ? state.name : '';
}

// 原来的 methods 部分转化为函数
function uploadAvatar(param) {
  // this.uploadFile(param.file, "avatar"); // 注释掉 API 调用
}

async function submitAfter(json, func) {
  // this.$get_user(() => {
  //   if (this.oauth.signIn) {
  //     if (this.user.user_id) {
  //       // 执行获取权限并存储
  //       this.$get_auth(this.user.user_group)
  //       if (func) {
  //         func(json);
  //       }
  //       this.$router.go(-1);
  //     } else {
  //       this.$router.push({
  //         path: "/login"
  //       })
  //     }
  //   } else {
  //     if (func) {
  //       func(json);
  //     }
  //     this.$router.go(-1);
  //   }
  // });
}

async function getObjAfter(json, func) {
  // let user_group = this.$store.state.user.user_group;
  // var json = await this.$get("~/api/user_group/get_obj?name="+user_group); // 注释掉 API 调用
  // if(json.result && json.result.obj){
  //   if (json.result.obj.source_table) {
  //     this.sourceTable = json.result.obj.source_table
  //     this.sourceTableName = user_group
  //     this.sourceTableCheckUrl = "/"+this.sourceTable +"/view";
  //     this.sourceTableUrl = this.sourceTableCheckUrl+"?user_id=" +this.form.user_id
  //   }
  // }
}

function submit() {
  // 这里可以添加提交逻辑
}

function cancel() {
  // 这里可以添加取消逻辑
}
</script>

<style scoped>
#user_info .card {
  padding: 2rem 1rem;
}

#user_info .text-center {
  text-align: center;
}

#user_info .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

#user_info .avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

#user_info .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

#user_info .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>



