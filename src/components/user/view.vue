<template>
     <!-- 编辑 -->
  <el-main class="bg edit_wrap">
    <el-form ref="formRef" :model="form" status-icon :rules="rules" label-width="80px">

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="头像" prop="avatar">
          <el-upload class="avatar-uploader" drag accept="image/gif, image/jpeg, image/png, image/jpg"
            action="" :http-request="uploadimg" :show-file-list="false">
            <img v-if="form.avatar" :src="$fullUrl(form.avatar)" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="用户名" prop="username">
          <span v-if="obj.username">{{ obj.username }}</span>
          <el-input v-else v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="密码" prop="password">
          <span v-if="obj.password">{{ obj.password }}</span>
          <el-input v-else type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
        </el-form-item>
      </el-col>

      <!-- <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="用户组" prop="user_group">
          <el-select v-model="form.user_group" placeholder="请选择">
            <el-option v-for="o in userGroup" :key="o.name" :label="o.name"
              :value="o.name">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="手机号码" prop="phone">
          <el-input type="phone" v-model="form.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="手机认证" prop="phone_state">
          <el-select v-model="form.phone_state" placeholder="请选择">
            <el-option v-for="group in listState" :key="group.value" :label="group.name"
              :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="邮箱认证" prop="email_state">
          <el-select v-model="form.email_state" placeholder="请选择">
            <el-option v-for="group in listState" :key="group.value" :label="group.name"
              :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <span></span>
      </el-col>

      <el-col :xs="24" :sm="12" :lg="8" class="el_form_item_warp">
        <el-form-item label="状态" prop="state">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option v-for="group in listUserState" :key="group.value" :label="group.name"
              :value="group.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :xs="24" :sm="24" :lg="24" class="el_form_btn_warp">
        <el-form-item>
          <el-col :xs="24" :sm="24" :lg="12" class="el_form_btn el_form_btn_1">
            <el-button style="width: 100%; float: left;" type="primary" @click="submit()">提交</el-button>
          </el-col>
          <el-col :xs="24" :sm="24" :lg="12" class="el_form_btn el_form_btn_2">
            <el-button style="width: 100%; float: right;" @click="cancel()">取消</el-button>
          </el-col>
        </el-form-item>
      </el-col>

    </el-form>
  </el-main>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
// import mixin from "@/mixins/page.js"; // 注释掉 mixin 引入

// 原来的 data 部分转化为响应式变量
const field = ref("user_id")
// const url_add = "~/api/user/add?" // 注释掉 API 地址
// const url_set = "~/api/user/set?" // 注释掉 API 地址
// const url_get_obj = "~/api/user/get_obj?" // 注释掉 API 地址
// const url_upload = "~/api/user/upload?" // 注释掉 API 地址

const query = reactive({
  user_id: 0,
  user_group: ""
})

const obj = reactive({
  user_id: 0,
  username: '',
  nickname: '',
  password: '',
  avatar: '',
  phone: '',
  email: '',
  user_group: '管理员',
  phone_state: 0,
  email_state: 0,
  state: 1
})

const form = reactive({
  user_id: 0,
  username: '',
  nickname: '',
  password: '',
  avatar: '',
  phone: '',
  email: '',
  user_group: '管理员',
  phone_state: 0,
  email_state: 0,
  state: 1
})

const rules = {
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  {
    min: 5,
    max: 25,
    message: '长度在 5 到 25 个字符',
    trigger: 'blur'
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }],
  user_group: [{
    required: true,
    message: '最少要分配一个权限',
    trigger: 'blur'
  }],
  phone: [{
    validator: isPhone,
    trigger: 'blur'
  }],
  email: [{
    validator: isEmail,
    trigger: 'blur'
  }],
}

const userGroup = ref([])

const listState = [
  {
    value: 0,
    name: "未认证"
  }, {
    value: 1,
    name: "审核中"
  }, {
    value: 2,
    name: "已认证"
  }
]

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

// 原来的 methods 部分转化为函数
/**
 * 验证手机号
 * @param {Object} rule 
 * @param {Object} value 验证值 
 * @param {Object} callback 返回函数
 */
function isPhone(rule, value, callback) {
  if (!value) {
    callback();
  } else if (/^\D+$/.test(value)) {
    callback(new Error('手机号必须是数字型'));
  } else if (value.length > 13 || value.length < 8) {
    callback(new Error('手机号长度必须大于8 并且小于 13!'));
  } else {
    callback();
  }
}

/**
 * 验证邮箱
 * @param {Object} rule 
 * @param {Object} value 验证值 
 * @param {Object} callback 返回函数
 */
function isEmail(rule, value, callback) {
  if (!value || /^\w+@\w+\.\w+$/.test(value)) {
    callback();
  } else {
    callback(new Error('必须是邮箱格式，例：test@test.com'));
  }
}

/**
 * 上传成功时返回地址
 * @param {Object} res
 * @param {Object} file
 */
function handleAvatarSuccess(res, file) {
  console.log("返回地址");
  form.avatar = URL.createObjectURL(file.raw);
}

/**
 * 判断图片类型和大小
 * @param {Object} file
 * @return {Boolen} 符合条件时返回true, 不符合条件时返回false
 */
function beforeAvatarUpload(file) {
  console.log("判断")
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size / 1024 / 1024 < 2;

  if (!isJPG) {
    this.$message.error('上传头像图片只能是 JPG 格式!');
  } else if (!isLt2M) {
    this.$message.error('上传头像图片大小不能超过 2MB!');
  }
  return isLt2M;
}

/**
 * 获取用户组
 */
async function getUserGroup() {
  // var json = await this.$get("~/api/user_group/get_list?"); // 注释掉 API 调用
  // console.log(json);
  // userGroup.value = json.result.list; // 注释掉赋值操作
}

/**
 * 上传文件
 * @param {Object} param
 */
function uploadimg(param) {
  // uploadFile(param.file, "avatar"); // 注释掉 API 调用
}

// 提交表单
function submit() {
  // 这里可以添加表单验证和提交逻辑
}

// 取消操作
function cancel() {
  // 这里可以添加取消逻辑
}

// 生命周期钩子
onMounted(() => {
  getUserGroup()
})
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>



