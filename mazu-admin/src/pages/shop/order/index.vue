<template>
    <div>
        <div class="table-header">
            <el-input placeholder="搜索订单id" v-model="searchQuery" clearable @clear="handleClear"
                prefix-icon="el-icon-search" class="search-input" @keyup.enter="searchOrders()" />
            <el-button type="primary" @click="searchOrders" class="search-button">搜索</el-button>
            <el-button type="danger" @click="handleDelete" class="delete-button">删除选中</el-button>
            <el-button type="info" @click="handleClear" class="delete-button">清空</el-button>
            <el-button type="success" icon="el-icon-download" @click="handleExportOrder" :loading="exportLoading">
                导出订单列表
            </el-button>
        </div>

        <el-table border :data="filterTableData" :scrollbar-always-on="false" style="width: 100%"
            @selection-change="handleSelectionChange" @row-click="handleRowClick">
            <el-table-column type="selection" />
            <el-table-column label="订单id" prop="order_id" align="center" />
            <el-table-column label="用户id" prop="user_id" align="center" />
            <el-table-column label="商品id" prop="shop_id" align="center" />
            <el-table-column label="订单创建时间" align="center">
                <template #default="scope">{{ formatDateTime(scope.row.create_time) }}</template>
            </el-table-column>
            <el-table-column label="订单状态" align="center">
                <template #default="scope">
                    <el-tag v-if="scope.row.order_status === 0" type="info">已取消</el-tag>
                    <el-tag v-else-if="scope.row.order_status === 10" type="warning">未付款</el-tag>
                    <el-tag v-else-if="scope.row.order_status === 20" type="primary">已付款</el-tag>
                    <el-tag v-else-if="scope.row.order_status === 30" type="warning">已发货</el-tag>
                    <el-tag v-else-if="scope.row.order_status === 40" type="success">交易成功</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" plain @click.stop="handleDrawer(scope.row.id, 'edit')">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination size="small" background layout="prev, pager, next" :total="totalItems" :page-size="pageSize"
            :current-page="currentPage" @current-change="onPageChange" class="mt-4 pagination"
            :hide-on-single-page="totalItems < pageSize" />

        <!-- 订单详情抽屉 -->
        <el-drawer title="订单详情" :model-value="isDrawerOpen" :before-close="handleDrawerClose" direction="rtl"
            size="50%">
            <div class="order-detail-container" v-if="orderDetail">
                <!-- 订单基本信息 -->
                <div class="detail-section mb-4">
                    <h3 class="section-title">订单基本信息</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="label">订单ID：</span>
                            <span class="value">{{ orderDetail.order_id }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">支付金额：</span>
                            <span class="value">¥{{ orderDetail.payment }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">支付方式：</span>
                            <span class="value">{{ orderDetail.payment_type === 1 ? '微信支付' : '其他支付' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">创建时间：</span>
                            <span class="value">{{ formatDateTime(orderDetail.create_time) }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">支付时间：</span>
                            <span class="value">{{ orderDetail.pay_time ? formatDateTime(orderDetail.pay_time) : '未支付'
                            }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">订单备注：</span>
                            <span class="value">{{ orderDetail.note || '无' }}</span>
                        </div>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div class="detail-section mb-4">
                    <h3 class="section-title">商品信息</h3>
                    <div class="product-info">
                        <div class="product-images">
                            <el-image v-for="(img, index) in productImages" :key="index" :src="img"
                                :preview-src-list="productImages" class="product-img" fit="contain" />
                        </div>
                        <div class="product-details">
                            <h4 class="product-name">{{ orderDetail.shopname }}</h4>
                            <div class="product-price">单价：¥{{ orderDetail.price }}</div>
                            <div class="product-category">分类：{{ orderDetail.grid }}</div>
                            <div class="product-desc">
                                <span class="label">商品介绍：</span>
                                <p>{{ orderDetail.shopInfo }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 收货信息 -->
                <div class="detail-section">
                    <h3 class="section-title">收货信息</h3>
                    <div class="address-info">
                        <div class="info-item">
                            <span class="label">收货人：</span>
                            <span class="value">{{ orderDetail.name }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">联系电话：</span>
                            <span class="value">{{ orderDetail.mobile }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">收货地址：</span>
                            <span class="value">{{ orderDetail.province_id }} {{ orderDetail.city_id }} {{
                                orderDetail.district_id }} {{ orderDetail.remark }}</span>
                        </div>
                    </div>
                </div>

            </div>

            <el-empty description="加载中..." v-else />
        </el-drawer>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { shopOrderAdminAPI, getOrderDetailAPI, getExportAPI } from "~/api/shop/index";

const filterTableData = ref([]); // 表格原始数据
const currentPage = ref(1); // 当前页码
const pageSize = ref(10); // 每页条数
const totalItems = ref(0); // 数据总数
const searchQuery = ref(""); // 搜索查询
const selectedOrders = ref([]); // 选中的订单
const isDrawerOpen = ref(false); // 抽屉显示状态
const orderDetail = ref([]); // 订单详情数据
const productImages = ref([]); // 商品图片数组
const originalTableData = ref([]); // 原始数据

// 获取渲染数据
const shopOrderAdmin = () => {
    shopOrderAdminAPI(currentPage.value, searchQuery.value).then((res) => {
        filterTableData.value = res.data.message;
        originalTableData.value = res.data.message;
        console.log(originalTableData.value);
        totalItems.value = res.data.total;
    });
};

// 点击分页
const onPageChange = (newPage) => {
    currentPage.value = newPage;
    shopOrderAdmin();
};

// 清空搜索
const handleClear = () => {
    searchQuery.value = "";
    shopOrderAdmin();
};
// 搜索订单
const searchOrders = async () => {
    const keyword = searchQuery.value;
    // 显示加载状态（优化体验）

    try {
        // 1. 调用接口获取数据（无需传搜索参数，纯前端过滤）
        const res = await shopOrderAdminAPI(currentPage.value, '');
        if (res.data.status === 200) {
            let list = res.data.message;
            console.log(list);

            // 2. 有关键词时，前端过滤（和社区页面逻辑完全一致）
            if (keyword) {
                list = list.filter(item =>
                    item.order_id.toLowerCase().includes(keyword.toLowerCase())
                );
            }
            filterTableData.value = list;
            console.log(filterTableData.value);
        } else {
            ElMessage.error("获取订单列表失败");
        }
    } catch (err) {
    }
};




// 删除选中的订单
const handleDelete = () => {
    if (selectedOrders.value.length > 0) {
        // 这里可以替换为实际的删除API调用
        console.log("Deleting orders: ", selectedOrders.value);
        // 删除后重新获取订单列表
        shopOrderAdmin();
        // 清空选中状态
        selectedOrders.value = [];
    } else {
        ElMessage.warning("请先选择要删除的订单");
    }
};

const handleDrawer = async (id, type) => {
    isDrawerOpen.value = true;
    try {
        const res = await getOrderDetailAPI(id);
        console.log(res.data.data
        );

        // 现在接口数据在 res.data 中，HTTP 状态码 200 表示请求成功
        if (res.status === 200 && res.data) {
            // 若 res.data 直接是订单详情
            orderDetail.value = res.data.data
                ;
            // 处理商品图片（假设图片字段在 res.data.imageUrl）
            if (res.data.imageUrl) {
                try {
                    productImages.value = JSON.parse(res.data.imageUrl);
                    if (!Array.isArray(productImages.value)) {
                        productImages.value = [];
                        ElMessage.warning('商品图片格式异常');
                    }
                } catch (e) {
                    productImages.value = [];
                    console.error('解析商品图片失败', e);
                    ElMessage.warning('商品图片解析失败');
                }
            } else {
                productImages.value = [];
            }
        } else {
            ElMessage.error(`获取订单详情失败：${res.data?.message || '接口返回异常'}`);
            orderDetail.value = null;
            productImages.value = [];
        }
    } catch (error) {
        ElMessage.error('网络异常，无法获取订单详情');
        console.error('获取订单详情网络错误', error);
        orderDetail.value = null;
        productImages.value = [];
    }
};
// 关闭抽屉
const handleDrawerClose = () => {
    isDrawerOpen.value = false;
    // 清空详情数据
    orderDetail.value = null;
    productImages.value = [];
};

// 时间格式化函数
const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 初始化加载订单列表
shopOrderAdmin();




const exportLoading = ref(false);

const handleExportOrder = async () => {
    exportLoading.value = true;
    try {
        const res = await getExportAPI()

        // 触发下载
        const blob = new Blob([res.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = '订单列表.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        ElMessage.success('导出成功！');
    } catch (err) {
        console.error('导出失败：', err);
        ElMessage.error('导出失败，请重试！');
    } finally {
        exportLoading.value = false;
    }
};
</script>

<style scoped>
.table-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.search-input {
    width: 300px;
}

.delete-button,
.search-button {
    margin-left: 10px;
}

.pagination {
    width: 100%;
    display: flex;
    justify-content: center;
}

/* 订单详情样式 */
.order-detail-container {
    padding: 20px;
}

.detail-section {
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1989fa;
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 8px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.info-item {
    display: flex;
    align-items: center;
}

.label {
    color: #666;
    width: 100px;
    font-weight: 500;
}

.value {
    color: #333;
    flex: 1;
}

.product-info {
    display: flex;
    gap: 20px;
}

.product-images {
    display: flex;
    gap: 10px;
    flex-shrink: 0;
}

.product-img {
    width: 100px;
    height: 100px;
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    cursor: pointer;
}

.product-details {
    flex: 1;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
}

.product-price {
    color: #e53935;
    font-size: 15px;
    margin-bottom: 8px;
}

.product-category {
    color: #666;
    margin-bottom: 16px;
}

.product-desc .label {
    display: block;
    margin-bottom: 8px;
}

.product-desc p {
    color: #333;
    line-height: 1.6;
    margin: 0;
}

.address-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .info-grid {
        grid-template-columns: 1fr;
    }

    .product-info {
        flex-direction: column;
    }

    .product-images {
        flex-wrap: wrap;
    }
}
</style>