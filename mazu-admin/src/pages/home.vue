<template>
  <!-- 顶部数据统计 -->
  <el-row :gutter="20">
    <el-col :lg="6" :md="12" v-for="(item, index) in data" :key="index">
      <div class="grid-content">
        <div class="content-echarts">
          <!-- <div ref="chartRefs" style="width: 150px;height:150px;"></div> -->
          <div ref="chartRefs"></div>
        </div>
        <div class="right-data">
          <div class="data">
            <span v-if="index >= 2">￥</span>
            <count-to :key="item.data" :startVal="0" :endVal="item.data" :duration="5000" />
          </div>
          <div class="title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <!-- <count-to :key="item.data" :startVal="0" :endVal="item.data" :duration="5000" /> -->

  <el-row :gutter="20">
    <el-col :lg="18">
      <div class="grid-content" style="justify-content: start">
        <div>
          <div class="orderCount">销售额统计</div>
          <div>
            <div ref="lineChartRef"></div>
          </div>
        </div>
        <div class="order-data hidden-md-and-down">
          <div>
            <p class="title">本周销售额</p>
            <p class="sales">{{ thisWeekSum }}</p>
            <p style="display: flex">
              <span style="display: flex; align-items: center; color: #ffa992">
                <el-icon>
                  <CaretTop v-if="thisWeekSum - lastWeekSum > 0" />
                  <CaretBottom v-else />
                </el-icon>
                <span v-if="thisWeekSum > 0 && lastWeekSum > 0">
                  {{
                    (((thisWeekSum - lastWeekSum) / lastWeekSum) * 100).toFixed(
                      2
                    )
                  }}%</span>
                <span v-else>{{ (thisWeekSum - lastWeekSum).toFixed(2) }}%</span>
              </span>
              <span style="padding-left: 10px; color: rgba(0, 0, 0, 0.6)">对比上周</span>
            </p>
          </div>
          <div>
            <p class="title">上周销售额</p>
            <p class="sales">{{ lastWeekSum }}</p>
            <p style="display: flex">
              <span style="display: flex; align-items: center; color: #ff1f00">
                <el-icon>
                  <CaretTop v-if="lastWeekSum - thisWeekSum > 0" />
                  <CaretBottom v-else />
                </el-icon>
                <span v-if="thisWeekSum > 0 && lastWeekSum > 0">
                  {{
                    (((lastWeekSum - thisWeekSum) / lastWeekSum) * 100).toFixed(
                      2
                    )
                  }}%
                </span>
                <span v-else>
                  {{ (lastWeekSum - thisWeekSum).toFixed(2) }}%
                </span>
              </span>
              <span style="padding-left: 10px; color: rgba(0, 0, 0, 0.6)">对比本周</span>
            </p>
          </div>
        </div>
      </div>
    </el-col>
    <el-col :lg="6">
      <div class="grid-content">
        <ul class="right-order">
          <el-badge :value="12" class="item">
            <li>待付款订单</li>
          </el-badge>
          <li>待发货订单</li>
          <li>已完成订单</li>
          <li>待处理退货订单</li>
          <li>待处理退款订单</li>
          <li>待确认退货订单</li>
          <li>新缺货登记</li>
        </ul>
      </div>
    </el-col>
  </el-row>

  <el-row :gutter="20" type="flex" align="middle" class="dashboard-container">
    <!-- 左侧日期选择区 -->
    <el-col :span="7" class="date-picker-col">
      <div class="flex justify-center p-4 bg-white rounded-lg shadow-sm">
        <el-date-picker-panel v-model="value" />
      </div>
    </el-col>

    <!-- 中间待办事项区（可滚动） -->
    <el-col :span="11" class="todos-col">
      <div class="bg-white rounded-lg shadow-sm p-4 h-full">
        <h3 class="text-lg font-semibold mb-4">待办事项</h3>
        <!-- 滚动容器 -->
        <div class="todos-scroll-container">
          <el-table :data="todoList" border stripe :header-cell-style="{ 'background-color': '#f5f7fa' }"
            class="todo-table">
            <el-table-column label="序号" type="index" width="60" align="center" />
            <el-table-column label="内容" prop="content" align="center" :show-overflow-tooltip="true" />
            <el-table-column label="创建时间" prop="create_time" width="160" align="center">
              <template #default="scope">
                {{ formatTime(scope.row.create_time) }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" width="100" align="center">
              <template #default="scope">
                <!-- 已完成：不可点击 | 未完成：可点击切换 -->
                <el-tag :type="scope.row.status === 1 ? 'success' : 'warning'" @click="handleStatusChange(scope.row)"
                  :disabled="scope.row.status === 1" :class="['status-tag', { 'completed': scope.row.status === 1 }]">
                  {{ scope.row.status === 1 ? '已完成' : '未完成' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <!-- 空数据提示 -->
          <div v-if="todoList.length === 0" class="empty-tips">
            暂无待办事项
          </div>
        </div>
      </div>
    </el-col>
    <!-- 右侧妈祖商品销售热度排行榜（固定死数据） -->
    <el-col :span="6" class="ranking-col">
      <div class="bg-white rounded-lg shadow-sm p-4 h-full">
        <h3 class="text-lg font-semibold mb-4">妈祖商品销售热度排行榜</h3>
        <div class="ranking-list">
          <!-- 固定排序的销售数据，无需动态变化 -->
          <div v-for="(item, index) in fixedSalesRanking" :key="item.id"
            class="ranking-item flex items-center p-2 mb-2 rounded hover:bg-f5f7fa transition-colors">
            <!-- 排名标识 -->
            <div class="ranking-num mr-3 flex items-center justify-center" :class="{
              'bg-red-500 text-white': index === 0,
              'bg-orange-400 text-white': index === 1,
              'bg-yellow-500 text-white': index === 2,
              'bg-gray-300 text-gray-700': index >= 3
            }">
              {{ index + 1 }}
            </div>
            <!-- 商品信息（含图片） -->
            <div class="flex items-center">
              <el-image :src="item.imageUrl" class="ranking-img" fit="cover" :preview-src-list="[item.imageUrl]" />
              <div class="ml-2 ranking-content">
                <div class="truncate" :title="item.shopname">{{ item.shopname }}</div>
                <div class="text-xs text-gray-500 mt-1">分类：{{ item.grid }}</div>
              </div>
            </div>
            <!-- 销量/销售额展示 -->
            <div class="ranking-hot text-red-500 font-medium">
              销量：{{ item.salesVolume }}
              <span class="ml-2 text-gray-400">¥{{ item.salesAmount }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>

</template>

<script setup>
import { ElMessage } from 'element-plus'
import { CountTo } from 'vue3-count-to';
import { ref, onMounted, reactive } from "vue";
import * as echarts from "echarts";
import {
  getTodayOrderCountAPI,
  getTodayVisitCountAPI,
  getTodaySalesAPI,
  getSubSalesAPI,
  getThisWeekSalesAPI,
  getLastWeekSalesAPI,
  getTodoAPI
} from "~/api/index/index.js";

const data = reactive([
  { title: "今日订单总数", data: 0 },
  { title: "今日用户访问量", data: 0 },
  { title: "今日销售总额", data: 0 },
  { title: "昨日销售总额", data: 0 },
]);

// 顶部数据获取
const getTodayOrderCount = () => {
  getTodayOrderCountAPI().then((res) => {
    data[0].data = res.data.message[0].orderCount;
    initEcharts(0);
  });
};
const getTodayVisitCount = () => {
  getTodayVisitCountAPI().then((res) => {
    data[1].data = res.data.message[0].visitCount;
    initEcharts(1);
  });
};
const getTodaySales = () => {
  getTodaySalesAPI().then((res) => {
    data[2].data = res.data.message[0].sales;
    initEcharts(2);
  });
};
const getSubSales = () => {
  getSubSalesAPI().then((res) => {
    data[3].data = res.data.message[0].subSales;
    initEcharts(3);
  });
};

// 获取本周echarts销售额
const thisWeekSales = ref([]);
const thisWeekSum = ref();
const getThisWeekSales = () => {
  getThisWeekSalesAPI().then((res) => {
    // map出相对应的数据
    const sales = res.data.message.map((item) => item.sales);
    thisWeekSales.value = sales;
    // 累加器计算
    thisWeekSum.value = sales.reduce((acc, val) => acc + val, 0);
    initLineChart();
  });
};

// 获取上周echarts销售额
const lastWeekSales = ref([]);
const lastWeekSum = ref();
const getLastWeekSales = () => {
  getLastWeekSalesAPI().then((res) => {
    // map出相对应的数据
    const sales = res.data.message.map((item) => item.sales);
    lastWeekSales.value = sales;
    // 累加器计算
    lastWeekSum.value = sales.reduce((acc, val) => acc + val, 0);
    initLineChart();
  });
};

const echartsInstances = ref([]);
const chartRefs = ref([]);
const lineChartRef = ref(null);

const initEcharts = (index) => {
  const chartDom = chartRefs.value[index];
  const myChart = echarts.init(chartDom);
  let options = {};
  // 动态设置 echarts 实例的大小
  myChart.resize({
    width: 160,
    height: 160,
  });
  // 折线图
  if (index === 4) {
    options = NewOptions();
  } else {
    switch (index) {
      case 0:
        options = {
          title: {
            text: data[0].data,
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "#0580f2",
              fontSize: "20",
            },
          },
          color: ["rgba(73, 157, 255, 0.1)"],
          series: [
            {
              name: "Line 1",
              type: "pie",
              radius: ["50%", "66%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
              hoverAnimation: true,
              data: [
                {
                  value: 60,
                  name: "01",
                  itemStyle: {
                    normal: {
                      color: {
                        // 完成的圆环的颜色
                        colorStops: [
                          {
                            offset: 0,
                            color: "#00cefc", // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "#367bec", // 100% 处的颜色
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  name: "02",
                  value: 40,
                },
              ],
            },
          ],
        };
        break;
      case 1:
        options = {
          title: {
            text: data[1].data,
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "#A03AFF",
              fontSize: "20",
            },
          },
          color: ["rgba(165,59,255,0.1)"],
          series: [
            {
              name: "Line 1",
              type: "pie",
              radius: ["50%", "66%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
              hoverAnimation: true,
              data: [
                {
                  value: 70,
                  name: "01",
                  itemStyle: {
                    normal: {
                      color: {
                        // 完成的圆环的颜色
                        colorStops: [
                          {
                            offset: 0,
                            color: "rgba(165,59,255,0.6)", // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "rgb(165,59,255)", // 100% 处的颜色
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  name: "02",
                  value: 30,
                },
              ],
            },
          ],
        };
        break;
      case 2:
        options = {
          title: {
            text: data[2].data,
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "#FF7049",
              fontSize: "20",
            },
          },
          color: ["rgba(255,112,73,0.1)"],
          series: [
            {
              name: "Line 1",
              type: "pie",
              radius: ["50%", "66%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
              hoverAnimation: true,
              data: [
                {
                  value: 80,
                  name: "01",
                  itemStyle: {
                    normal: {
                      color: {
                        // 完成的圆环的颜色
                        colorStops: [
                          {
                            offset: 0,
                            color: "rgba(255,112,73,0.6)", // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "#FF7049", // 100% 处的颜色
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  name: "02",
                  value: 20,
                },
              ],
            },
          ],
        };
        break;
      case 3:
        options = {
          title: {
            text: data[3].data,
            x: "center",
            y: "center",
            textStyle: {
              fontWeight: "normal",
              color: "#0580f2",
              fontSize: "20",
            },
          },
          color: ["rgba(86,59,255,0.1)"],
          series: [
            {
              name: "Line 1",
              type: "pie",
              radius: ["50%", "66%"],
              itemStyle: {
                normal: {
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false,
                  },
                },
              },
              hoverAnimation: true,
              data: [
                {
                  value: 30,
                  name: "01",
                  itemStyle: {
                    normal: {
                      color: {
                        // 完成的圆环的颜色
                        colorStops: [
                          {
                            offset: 0,
                            color: "rgba(86,59,255,0.6)", // 0% 处的颜色
                          },
                          {
                            offset: 1,
                            color: "#367bec", // 100% 处的颜色
                          },
                        ],
                      },
                    },
                  },
                },
                {
                  name: "02",
                  value: 70,
                },
              ],
            },
          ],
        };
        break;
    }
  }
  myChart.setOption(options);
  echartsInstances.value[index] = myChart;
};

const initLineChart = () => {
  const chartDom = lineChartRef.value;
  const myChart = echarts.init(chartDom);
  myChart.setOption(NewOptions());
  myChart.resize({
    width: 800,
    height: 400,
  });
};

// 折线图配置
const NewOptions = () => {
  return {
    xAxis: {
      type: "category",
      data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      boundaryGap: false,
    },
    yAxis: {
      type: "value",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      orient: "horizontal",
      right: "10%",
      top: "3%",
    },
    series: [
      {
        name: "本周销售额",
        color: "#499DFF",
        data: thisWeekSales.value,
        type: "line",
        smooth: true,
        areaStyle: {
          color: "#499DFF",
          opacity: 0.05,
        },
      },
      {
        name: "上周销售额",
        color: "#FF7A45",
        data: lastWeekSales.value,
        type: "line",
        smooth: true,
        areaStyle: {
          color: "#FF7A45",
          opacity: 0.05,
        },
      },
    ],
  };
};

onMounted(() => {
  // 获取顶部四个数据
  getSubSales();
  getTodayOrderCount();
  getTodayVisitCount();
  getTodaySales();
  getTodo()

  // 获取echarts曲线图数据集
  getThisWeekSales();
  getLastWeekSales();
  for (let i = 1; i < 4; i++) {
    initEcharts(i);
  }
});
// 格式化时间函数
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const formatTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!time || !dayjs(time).isValid()) return '';
  return dayjs(time).format(format);
};
const todoList = ref([

]);

// 固定的销售排行榜死数据（按热度排序好，无需动态变化）
const fixedSalesRanking = ref([
  { id: 1, shopname: '妈祖平安符', grid: '祈福类', imageUrl: 'http://47.122.115.28:8889/shop/shop1-1.jpg', salesVolume: 1286, salesAmount: 299 },
  { id: 2, shopname: '妈祖金身摆件', grid: '工艺品', imageUrl: 'http://47.122.115.28:8889/shop/shop2-1.jpg', salesVolume: 953, salesAmount: 1299 },
  { id: 3, shopname: '妈祖文化书籍', grid: '文化类', imageUrl: 'http://47.122.115.28:8889/shop/shop3-1.jpg', salesVolume: 762, salesAmount: 89 },
  { id: 4, shopname: '妈祖主题手串', grid: '饰品类', imageUrl: 'http://47.122.115.28:8889/shop/shop4-1.jpg', salesVolume: 589, salesAmount: 199 },
  { id: 6, shopname: '妈祖纪念币', grid: '收藏品', imageUrl: 'http://47.122.115.28:8889/shop/shop5-1.jpg', salesVolume: 387, salesAmount: 399 },
]);

// 获取当前用户的todo
const getTodo = async () => {
  const res = await getTodoAPI();
  todoList.value = res.data.data;
};
import request from '~/axios'
// 状态切换处理
const handleStatusChange = async (row) => {
  if (row.status !== 0) return;

  try {
    const response = await request.put(`/todo/${row.id}/status`);

    if (response.data.status === 200) {
      row.status = 1;
      ElMessage.success('标记为已完成！');
    } else {
      ElMessage.error('更新失败：' + response.data.message);
    }
  } catch (error) {
    console.error('状态更新接口异常：', error);
    ElMessage.error('网络错误，更新失败');
  }
};



</script>

<style scoped>
.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 6px;
}

.grid-content {
  border-radius: 8px;
  background-color: #fff;
  /* padding: 10px; */
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  flex-wrap: wrap;
  transition: 0.3s;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  overflow: hidden;
}

.grid-content:hover {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  transition: 0.3s;
}

.content-echarts {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-data {
  width: 45%;
  text-align: left;
}

.right-data .data {
  font-size: 24px;
  color: #15134b;
  font-weight: bold;
}

.right-data .title {
  color: #5a5881cc;
  font-weight: 100;
  padding: 5px 0;
  cursor: default;
}

.orderCount {
  padding: 20px;
  padding-bottom: 0;
  color: #11263c;
  font-size: 20px;
  cursor: default;
}

.orderCount::before {
  content: "";
  border: 4px solid #545bf5;
  margin-right: 20px;
}

.right-order {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item {
  width: 80%;
  margin-top: 30px;
  margin-right: -10px;
}

.right-order li {
  height: 64px;
  line-height: 64px;
  width: 100%;
  padding: 0 30px;
  position: relative;
  font-size: 14px;
  color: #000000b8;
  letter-spacing: 1px;
  transition: 0.2s;
}

.right-order li:hover {
  cursor: pointer;
  background-color: #367bec;
  color: #fff;
  transition: 0.2s;
}

.right-order li:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0px;
  right: 0px;
  height: 1px;
  background-color: #e0e0e07e;
}

.order-data {
  height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.order-data .title {
  color: #000000a7;
  font-size: 14px;
  padding: 10px 0;
}

.order-data .sales {
  font-size: 24px;
}


/*我添加的 */
.dashboard-container {
  width: 100%;
  height: calc(100vh - 40px);
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9fafb;
}

.date-picker-col,
.todos-col,
.ranking-col {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.todos-scroll-container {
  width: 100%;
  flex: 1;
  overflow-y: auto;
  max-height: calc(100vh - 180px);
}

.todo-table {
  width: 100%;
}

.empty-tips {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
}

/* 排名样式 */
.ranking-list {
  height: calc(100% - 80px);
  overflow-y: auto;
}

.ranking-item {
  cursor: pointer;
}

.ranking-num {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
}

.ranking-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}

.ranking-content {
  font-size: 14px;
  color: #333;
}

.ranking-hot {
  font-size: 13px;
}

.el-radio-group {
  gap: 12px;
}

/* 已完成标签样式（不可点击） */
.el-tag.cursor-not-allowed {
  opacity: 0.7;
  cursor: not-allowed !important;
}

/* 未完成标签 hover 效果 */
.el-tag.warning:not(.is-disabled):hover {
  background-color: #e6a23c;
  border-color: #e6a23c;

}

/* 基础标签样式 */
.status-tag {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  /* 未完成状态：默认小手图标 */
  transition: all 0.2s ease;
}

/* 已完成状态：禁用样式 */
.status-tag.completed {
  cursor: not-allowed !important;
  /* 强制显示禁用图标 */
  opacity: 0.7;
  /* 降低透明度，视觉区分 */
  pointer-events: none;
  /* 彻底禁止点击（比 disabled 更可靠） */
}

/* 滚动条美化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
</style>
