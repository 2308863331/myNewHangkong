<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <el-avatar class="avatar" :src="admin.avatar" shape="square" :size="40"> </el-avatar>
            <span style="font-size: 24px;">{{ admin.username }} </span>
          </div>
        </template>
        <div class="info">
          <p>登录时间：{{ loginInfo.loginTime }}</p>
          <p>登录地点：{{ loginInfo.loginPlace }}</p>
        </div>
      </el-card>
    </el-col>
    <!-- 单月统计信息展示 -->
    <el-col :span="18">
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            11月统计信息
          </div>
        </template>
        <div class="info">
          <el-row :gutter="24">
            <!-- 商品数量 -->
            <el-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style="background-color: #EEAD0E;">
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number" >{{orderNum}}</p>
                  <p>订单数量(个)</p>
                </div>
              </div>
            </el-col>
            <!-- 商品分类数量 -->
            <el-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style="background-color: #AB82FF;">
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">87</p>
                  <p>今日订单数</p>
                </div>
              </div>
            </el-col>
            <!-- 用户访问次数 -->
            <el-col :span="8">
              <div class="card-container">
                <div class="card-left-container" style=" background-color: #63B8FF;">
                  <el-icon :size="90">
                    <Memo />
                  </el-icon>
                </div>
                <div class="card-right-container">
                  <p class="number">121</p>
                  <p>今日新增用户数</p>
                  <!-- <p>用户访问次数(次)</p> -->
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <!-- 图表区域 -->
  <el-row :gutter="20">
    <el-col :span="12">
      <!-- 通过折线图展示2022年月度销售额 -->
      <el-card class="box-card">
        <div id="salesVolume" style="width: auto; height:400px;"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <!-- 通过柱状图展示2022年订单数量 -->
      <el-card class="box-card">
        <div id="orderQuantity" style="width: auto; height:400px;"></div>
      </el-card>
    </el-col>
  </el-row>

  <div>
    <el-card class="flight-reviews">
      <div ref="chartContainer" style="width: 100%; height: 400px;"></div>
    </el-card>
  </div>

</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { getAdmin, getOrderCount } from '../../api'
import useAdmin from '../../stores/admin'
import { Memo } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
onMounted(() => {
  initChart();
  loadAdmin()
  loadOrderCount() // 加载订单统计数据
  initCharts1()
  initCharts2()
})

//import { getFlightReviews } from '@/api'; // 假设这是获取数据的API函数

// 假设这是从后端获取的数据格式
const flightReviewsData = ref([]);


// const initChart = () => {
//   //const myChart = echarts.init(chartContainer.value);
//   // 假设这是从后端获取的数据格式，现在使用虚拟数据填充
// const flightReviewsData = ref([
//   {
//     "flight_id": 1,
//     "flight_number": "Flight 1",
//     "avg_rating": 2.3,
//     "all_comments": "Good flight; On time; Comfortable seats; Bad food; Noisy cabin;"
//   },
//   {
//     "flight_id": 2,
//     "flight_number": "Flight 2",
//     "avg_rating": 4.1,
//     "all_comments": "Good flight; On time; Comfortable seats; Bad food; Noisy cabin;"
//   }
//   // ... 添加更多虚拟数据项 ...
// ]);

const chartContainer = ref(null);

const initChart = () => {
  // if (!chartContainer.value) return;

  const myChart = echarts.init(chartContainer.value);
  
  const option = {
    title: {
      text: '航班评论及平均评分'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: flightReviewsData.value.map(item => item.flight_number),
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '平均评分',
        type: 'bar',
        data: flightReviewsData.value.map(item => item.avg_rating),
        label: {
          show: true,
          position: 'top'
        }
      }
    ]
  };

  myChart.setOption(option);
};



// onMounted(async () => {
//   // 获取数据
//  // flightReviewsData.value = await getFlightReviews();
//   // 初始化图表
//   initChart();
// });

// 初始化 orderNum 为响应式引用，并设置默认值
let orderNum = ref(0)

const { admin, updateAdmin } = useAdmin()



const loadAdmin = async () => {
  let data = await getAdmin()
  updateAdmin({
    username: data.username,
    avatar: data.avatar
  })
}

// 用户登录信息（模拟数据）
const loginInfo = reactive({
  loginTime: '2024-12-12 17:45:00',
  loginPlace: '郑州'
})

// 订单统计数据
const orderStats = reactive({
  totalOrders: 0,
  todayOrders: 0,
})

// 加载订单统计数据
const loadOrderCount = async () => {
  try {
    const response = await getOrderCount();
    if (response) {
      orderNum.value = response; // 更新 orderNum 的值
      console.log('Updated Order Count:', orderNum.value);
    } else {
      console.error('Unexpected response structure');
    }
  } catch (error) {
    console.error('Error fetching order count:', error.message || error);
  }
};


// 图表1：月度销售额
const initCharts1 = () => {
  const myChart = echarts.init(document.getElementById('salesVolume'))
  myChart.setOption({
    color: ['#1493fa'],
    title: { text: '2023年月度销售额' },
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      name: '月份',
      axisLabel: {
        interval: 0
      },
    },
    yAxis: {
      name: '单位（千万元）',
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '5%',
      containLabel: true,
    },
    legend: {},
    series: [
      {
        data: [6, 7, 8.5, 8, 9, 10, 13, 12, 10, 16, 15, 14],
        type: 'line',
        name: '销售额',
        smooth: true,
        label: {
          show: true,
          position: 'top',
        }
      }
    ]
  })
  // 图表自适应大小
  window.onresize = () => {
    myChart.resize()
  }
}

// 图表2：2022年订单数量
const initCharts2 = () => {
  const myChart = echarts.init(document.getElementById('orderQuantity'))
  myChart.setOption({
    title: { text: '2023年订单数量' },
    color: ['#1493fa'],
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      // type: 'flights',
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      name: '月份',
      // 类目轴中在 boundaryGap 为 true 的时候有效，可以保证刻度线和标签对齐
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        interval: 0,rotate: 45 // 设置刻度标签旋转角度为45度
      },
    },
    legend: {},
    yAxis: {
      name: '单位（个）',
    },
    series: [
      {
        data: [400, 450, 300, 230, 250, 300, 400, 350, 160, 350, 380, 400],
        type: 'bar',
        barWidth: '60%',
        name: '订单总数',
        label: {
          show: true,
          position: 'top',
        }
      }
    ]
  })
  // 图表自适应大小
  window.onresize = () => {
    myChart.resize()
  }
}

</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    .box-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .info {
        font-size: 14px;
      }
    }
  }
}
.card-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e4e7ed;
  text-align: center;
  padding-right: 20px;
  .card-left-container {
    color: white;
  }
  .card-right-container {
    .number {
      font-size: 18px;
      font-weight: bold;
    }
  }
}

.flight-reviews {
  margin: 20px;
}
</style>