<template>
  <div>
    <!-- 优惠券列表 -->
    <el-table :data="couponsList" style="width: 100%; margin-bottom: 20px">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="code" label="优惠券码" />
      <el-table-column prop="discountAmount" label="折扣金额" />
      <el-table-column prop="validFrom" label="有效开始时间" />
      <el-table-column prop="validTo" label="有效结束时间" />
      <el-table-column prop="usageLimit" label="使用限制次数" />
      <el-table-column prop="usedCount" label="已使用次数" />
      <el-table-column fixed="right" label="操作" width="200">
        <template #default="{ row }">
          <el-button type="warning" @click="editRow(row)">编辑</el-button>
          <el-button type="danger" @click="delRow(row)">删除</el-button> <!-- 传递 row 参数 -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 表单部分 -->
    <el-form ref="couponFormRef" :model="form" label-width="120px">
      <el-form-item label="优惠券码" prop="code">
        <el-input v-model="form.code" placeholder="请填写优惠券码" />
      </el-form-item>
      <el-form-item label="折扣金额" prop="discountAmount">
        <el-input-number v-model="form.discountAmount" :precision="2" :step="0.1" placeholder="请填写折扣金额" />
      </el-form-item>
      <el-form-item label="有效开始时间" prop="validFrom">
        <el-date-picker v-model="form.validFrom" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="有效结束时间" prop="validTo">
        <el-date-picker v-model="form.validTo" type="datetime" placeholder="选择日期时间" />
      </el-form-item>
      <el-form-item label="使用限制次数" prop="usageLimit">
        <el-input-number v-model="form.usageLimit" :min="1" placeholder="请填写使用限制次数" />
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
import { getCoupons, addCoupon, editCoupon, delCoupon } from '../api' // 假设这些是API函数
import useToken from '../stores/token'
import { ElMessageBox } from 'element-plus'

const resetForm = () => {
  if (couponFormRef.value) {
    couponFormRef.value.resetFields();
  }
  Object.assign(form, {
    id: null,
    code: '',
    discountAmount: 0.00,
    validFrom: '',
    validTo: '',
    usageLimit: 1,
    usedCount: 0
  });
}
defineExpose({ resetForm })

const emit = defineEmits(['success'])

const form = reactive({
  id: null,
  code: '',
  discountAmount: 0.00,
  validFrom: '',
  validTo: '',
  usageLimit: 1,
  usedCount: 0
})

const couponFormRef = ref()
const couponsList = ref([])

const { token } = useToken()
const headers = { jwt: token }

onMounted(() => {
  loadCoupons()
})

const loadCoupons = async () => {
  const data = await getCoupons() // 假设这是一个获取优惠券列表的API请求
  couponsList.value = data
}

// 编辑行
const editRow = (row) => {
  Object.assign(form, row)
}

// 新增优惠券
const addSubmit = async () => {
  const data = { ...form }
  if (await addCoupon(data)) {
    resetForm()
    loadCoupons()
    emit('success')
  }
}

// 修改优惠券  
const editSubmit = async () => {
  if (await editCoupon(form)) {
    resetForm()
    loadCoupons()
    emit('success')
  }
}

// 删除优惠券
const delRow = async (row) => {
  try {
    await ElMessageBox.confirm(
      '您确定要删除此优惠券吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const response = await delCoupon({ id: row.id })

    if (response) {
      loadCoupons()
      emit('success')
    } else {
      console.error('Failed to delete coupon:')
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete coupon:', error)
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