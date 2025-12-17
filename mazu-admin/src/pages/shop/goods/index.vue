<template>
    <div class="page-container">
        <div class="table-header">
            <el-input v-model="search" size="default" placeholder="根据商品名称搜索" style="width: 30%"
                @keyup.enter="getShopData" />
            <el-button style="margin-left: 10px" type="danger" @click="handleDeleteSelected"
                :disabled="selectedRows.length === 0">删除选中</el-button>
            <el-button type="success" @click="handleDrawer(null, 'add')">新增</el-button>
            <el-button type="info" @click="handleClearFilter">清空</el-button>
        </div>
        <el-table border :data="tableData" :scrollbar-always-on="false" style="width: 100%" @row-click="handleRowClick"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="商品名称" prop="shopname" align="center" width="200" />
            <el-table-column label="商品分类" prop="grid" align="center" width="120" />
            <el-table-column label="价格" prop="price" align="center" width="100">
                <template #default="{ row }">
                    ¥{{ Number(row.price).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" align="center" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? '上架' : '下架' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="等级" prop='type' align="center" width="100" />

            <el-table-column label="商品图片" width="100" align="center">
                <template #default="{ row }">
                    <div class="imageContainer">
                        <img v-if="getFirstImage(row.imageUrls)" :src="getFirstImage(row.imageUrls)" class="image-item"
                            :alt="row.shopname + '图片'" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="商品描述" prop="shopinfo" align="center">
                <template #default="{ row }">

                    <div class="description-content">{{ row.shopInfo || '暂无描述' }}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template #default="scope">
                    <el-button type="primary" plain @click.stop="handleDrawer(scope.row, 'edit')">修改</el-button>
                    <el-button type="danger" plain @click.stop="handleDeleteSingle(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
            :total="totalCount" layout="prev, pager, next" style="margin-top: 16px" />
        <!-- 单击显示弹窗 -->
        <el-dialog v-model="dialogVisible" title="商品详情" width="75%">
            <div class="clickDialog">
                <el-table :data="[selectedRow]" border>
                    <el-table-column label="商品ID" prop="id" />
                    <el-table-column label="商品名称" prop="shopname" />
                    <el-table-column label="分类" prop="grid" />
                    <el-table-column label="价格" prop="price">
                        <template #default="{ row }">
                            ¥{{ Number(row.price).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template #default="{ row }">
                            {{ row.status === 1 ? '上架' : '下架' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="等级" prop="type" />
                    <el-table-column label="描述" prop="shopinfo" />
                    <el-table-column label="商品图片" width="400">
                        <template #default="{ row }">
                            <div class="imageContainer">
                                <!-- 直接复用帖子页面的循环逻辑，确保解析函数调用正确 -->
                                <img v-for="(item, index) in parseImageUrls(row.imageUrls)" :key="index" :src="item"
                                    class="image-item" style="width: 100px; margin-right: 10px"
                                    :alt="`商品图片${index + 1}`" />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 新增/修改侧边栏 -->
        <el-drawer v-model="dialogVisible2" :title="drawerJudge ? '编辑商品' : '新增商品'" size="55%">
            <el-form :model="editingRow" label-width="80px" ref="formRef" :rules="formRules">
                <el-form-item label="商品名称" prop="shopname">
                    <el-input v-model="editingRow.shopname" placeholder="请输入商品名称" />
                </el-form-item>
                <el-form-item label="商品分类" prop="grid">
                    <el-select v-model="editingRow.grid" placeholder="请选择商品分类">
                        <el-option v-for="(item, index) in gridList" :key="item.id || index" :label="item.grid"
                            :value="item.grid" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品价格">
                    <el-input v-model="editingRow.price" type="number" step="0.01" placeholder="请输入商品价格" />
                </el-form-item>

                <el-form-item label="商品状态" prop="status">
                    <el-select v-model="editingRow.status" placeholder="请选择商品状态">
                        <el-option label="上架" value="1" />
                        <el-option label="下架" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品等级">
                    <el-input v-model="editingRow.type" type="number" placeholder="请输入商品等级" />
                </el-form-item>
                <el-form-item label="商品描述" prop="shopinfo">
                    <el-input v-model="editingRow.shopinfo" type="textarea" :rows="3" placeholder="请输入商品描述" />
                </el-form-item>
                <el-form-item label="商品图片" prop="imageUrls">
                    <div class="imageContainer">
                        <div class="item" v-for="(item, index) in imageUrl" :key="index">
                            <img :src="item" class="image-item imgCursor" @click="clickEditImage(item, index)" />
                            <div class="deleteImageBtn" @click="confirmDeleteImage(item, index)">
                                <el-icon>
                                    <CloseBold />
                                </el-icon>
                            </div>
                        </div>
                        <div class="addImage" @click="addImage">
                            <el-icon>
                                <Plus />
                            </el-icon>
                        </div>
                    </div>
                    <div class="tip-text">最多上传5张图片，点击图片可替换</div>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible2 = false">取消</el-button>
                    <el-button type="primary" @click="handleSaveEdit" v-if="drawerJudge">确定</el-button>
                    <el-button type="primary" @click="handleSaveAdd" v-else>确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import {
    ref,
    shallowRef,
    onMounted,
    reactive
} from "vue";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { CloseBold, Plus } from "@element-plus/icons-vue";
import { getToken } from "~/composables/auth";

// 引入API（需根据你的实际接口路径调整）
import {
    getShopListAPI,
    getShopGridAPI,
    uploadShopImagesAPI,
    addShopAPI,
    deleteShopAPI,
    updateShopAPI,
    deleteImageAPI
} from "~/api/shop/index";

// 定义响应式数据
const search = ref("");
const selectedRows = ref([]);
const dialogVisible = ref(false);
const selectedRow = ref(null);
const imageUrl = ref([]); // 临时存储图片URL
const gridList = ref([]); // 商品分类列表
const formRef = shallowRef(null); // 表单引用

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 表单数据
const editingRow = ref({
    id: "",
    shopname: "",
    grid: "",
    price: "",
    status: "1", // 默认上架
    type: "",
    shopinfo: "",
    imageUrls: []
});

// 表单校验规则
const formRules = reactive({
    shopname: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
    grid: [{ required: true, message: "请选择商品分类", trigger: "change" }],
    price: [
        { required: true, message: "请输入商品价格", trigger: "blur" },
        { type: "number", min: 0.01, message: "价格必须大于等于0.01", trigger: "blur" }
    ],
    status: [{ required: true, message: "请选择商品状态", trigger: "change" }],
    type: [
        { required: true, message: "请输入商品等级", trigger: "blur" },
        { type: "number", min: 1, message: "等级必须大于等于1", trigger: "blur" }
    ],
    shopinfo: [{ required: true, message: "请输入商品描述", trigger: "blur" }],
    imageUrls: [
        {
            required: true,
            validator: (rule, value, callback) => {
                if (imageUrl.value.length === 0) {
                    callback(new Error("请上传至少1张商品图片"));
                } else {
                    callback();
                }
            },
            trigger: ["change", "input"]
        }
    ]
});

// 侧边栏相关
const dialogVisible2 = ref(false);
const drawerJudge = ref(false);

// 解析图片URL（兼容字符串和数组格式）
const parseImageUrls = (imageUrlStr) => {
    if (!imageUrlStr) return [];
    // 优先处理JSON字符串（后端返回的["url1","url2"]格式）
    try {
        return JSON.parse(imageUrlStr);
    } catch (e) {
        // 兼容逗号分隔格式（兜底）
        return imageUrlStr.split(",").filter(Boolean);
    }
};

const getFirstImage = (imageUrlStr) => {
    const urls = parseImageUrls(imageUrlStr);
    return urls[0] || "";
};
// 获取商品列表数据
const tableData = ref([]);
const getShopData = () => {
    const loadingInstance = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(255, 255, 255, 0.7)"
    });

    getShopListAPI({
        page: currentPage.value,
        pageSize: pageSize.value,
        search: search.value.trim()
    }).then((response) => {
        if (response.data.status === 200) {
            let list = response.data.data;
            if (search.value.trim()) {
                list = list.filter(item =>
                    item.shopname.toLowerCase().includes(search.value.trim().toLowerCase())
                );

            }
            tableData.value = response.data.data;
            totalCount.value = response.data.totalCount;
        } else {
            ElMessage.error("帖子数据获取失败");
        }
    }).catch((error) => {
        console.error("获取商品数据失败:", error);
        ElMessage.error("商品数据获取失败");
    }).finally(() => {
        loadingInstance.close();
    });
};

// 获取商品分类
const getShopGrid = () => {
    getShopGridAPI().then((response) => {
        if (response.status === 200 && Array.isArray(response.data.data)) {
            gridList.value = response.data.data;
        }
    }).catch((error) => {
        console.error("获取商品分类失败:", error);
        ElMessage.error("获取商品分类失败");
    });
};

// 页面加载时初始化
onMounted(() => {
    getShopData();
    getShopGrid();
});

// 侧边栏打开/关闭
const handleDrawer = (row, type) => {
    dialogVisible2.value = true;
    if (type === "edit") {
        // 编辑模式：赋值现有数据并解析图片数组
        editingRow.value = { ...row };
        imageUrl.value = parseImageUrls(row.imageUrls);
        drawerJudge.value = true;
    } else {
        // 新增模式：完整重置表单
        editingRow.value = {
            id: "",
            shopname: "",
            grid: "",
            price: "",
            status: "1",
            type: "",
            shopinfo: "",
            imageUrls: []
        };
        imageUrl.value = [];
        drawerJudge.value = false;
        // 重置表单校验
        if (formRef.value) {
            formRef.value.resetFields();
        }
    }
};

// 保存新增商品
const handleSaveAdd = async () => {
    await formRef.value.validate();

    const loadingInstance = ElLoading.service({
        lock: true,
        text: "提交中..."
    });

    try {
        const imageUrlsJson = JSON.stringify(imageUrl.value);

        // 直接传递图片URL数组（与帖子页面格式一致）
        const response = await addShopAPI({
            shopname: editingRow.value.shopname,
            grid: editingRow.value.grid,
            price: editingRow.value.price,
            status: editingRow.value.status,
            type: editingRow.value.type,
            shopinfo: editingRow.value.shopinfo,
            imageUrls: imageUrlsJson
        });

        if (response.status === 200) {
            ElMessage.success("新增商品成功");
            dialogVisible2.value = false;
            getShopData();
        } else {
            ElMessage.error("新增商品失败: " + (response.data.message || "未知错误"));
        }
    } catch (error) {
        console.error("新增商品失败:", error);
        ElMessage.error("新增商品失败");
    } finally {
        loadingInstance.close();
    }
};

// 保存编辑商品
const handleSaveEdit = async () => {
    await formRef.value.validate();

    const loadingInstance = ElLoading.service({
        lock: true,
        text: "提交中..."
    });

    try {
        const imageUrlsJson = JSON.stringify(imageUrl.value);
        // 直接传递图片URL数组
        const response = await updateShopAPI({
            id: editingRow.value.id,
            shopname: editingRow.value.shopname,
            grid: editingRow.value.grid,
            price: editingRow.value.price,
            status: editingRow.value.status,
            type: editingRow.value.type,
            shopinfo: editingRow.value.shopinfo,
            imageUrls: imageUrlsJson
        });

        if (response.status === 200) {
            ElMessage.success("修改商品成功");
            dialogVisible2.value = false;
            getShopData();
            console.log(imageUrl.value);

        } else {
            ElMessage.error("修改商品失败: " + (response.data.message || "未知错误"));
        }
    } catch (error) {
        console.error("修改商品失败:", error);
        ElMessage.error("修改商品失败");
    } finally {
        loadingInstance.close();
    }
};

// 上传图片（使用导入的API，统一接口调用）
const addImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true;

    fileInput.onchange = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        const maxAllow = 5 - imageUrl.value.length;
        const selectFiles = Array.from(files).slice(0, maxAllow);

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "图片上传中..."
        });

        try {
            const formData = new FormData();
            selectFiles.forEach(file => {
                formData.append("imgs", file);
            });

            // 使用导入的API接口
            const response = await uploadShopImagesAPI(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": ` ${getToken()}`
                }
            });

            if (response.status === 200 && Array.isArray(response.data.imageUrls)) {
                imageUrl.value.push(...response.data.imageUrls);
                ElMessage.success(`成功上传${response.data.imageUrls.length}张图片`);
            } else {
                ElMessage.error("图片上传失败");
            }
        } catch (error) {
            console.error("图片上传失败:", error);
            ElMessage.error("图片上传失败: " + (error.message || "网络错误"));
        } finally {
            loadingInstance.close();
            fileInput.value = "";
        }
    };

    fileInput.click();
};

// 编辑图片（替换）
const clickEditImage = (oldUrl, index) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "图片替换中..."
        });

        try {
            const formData = new FormData();
            formData.append("imgs", file);

            // 使用导入的API接口
            const response = await uploadShopImagesAPI(formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": ` ${getToken()}`
                }
            });

            if (response.status === 200 && response.data.imageUrls.length > 0) {
                imageUrl.value.splice(index, 1, response.data.imageUrls[0]);
                // 可选：删除旧图片
                if (oldUrl) {
                    await deleteImageAPI({ imageUrl: oldUrl }).catch(err => {
                        console.warn("删除旧图片失败:", err);
                    });
                }
                ElMessage.success("图片替换成功");
            } else {
                ElMessage.error("图片替换失败");
            }
        } catch (error) {
            console.error("图片替换失败:", error);
            ElMessage.error("图片替换失败");
        } finally {
            loadingInstance.close();
            fileInput.value = "";
        }
    };

    fileInput.click();
};

// 确认删除图片
const confirmDeleteImage = async (url, index) => {
    try {
        await ElMessageBox.confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "删除中..."
        });

        try {
            await deleteImageAPI({ imageUrl: url });
            imageUrl.value.splice(index, 1);
            ElMessage.success("图片删除成功");
        } catch (error) {
            console.error("图片删除失败:", error);
            ElMessage.error("图片删除失败");
            imageUrl.value.splice(index, 1);
        } finally {
            loadingInstance.close();
        }
    } catch (error) {
        // 用户取消删除
    }
};

// 批量删除选中商品
const handleDeleteSelected = async () => {
    try {
        await ElMessageBox.confirm("确定要删除选中的商品吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        const ids = selectedRows.value.map(row => row.id);
        if (ids.length === 0) {
            ElMessage.warning("请先选择要删除的商品");
            return;
        }

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "删除中..."
        });

        try {
            let successCount = 0;
            let failCount = 0;
            const failIds = [];

            for (const id of ids) {
                try {
                    const response = await deleteShopAPI({ ids: [id] });

                    if (response.status === 200) {
                        successCount++;
                    } else {
                        failCount++;
                        failIds.push(id);
                    }
                } catch (err) {
                    failCount++;
                    failIds.push(id);
                    console.error(`删除商品ID: ${id} 失败:`, err);
                }
            }

            if (successCount > 0 && failCount === 0) {
                ElMessage.success(`成功删除 ${successCount} 个商品`);
                getShopData();
            } else if (successCount > 0 && failCount > 0) {
                ElMessage.warning(`部分删除成功：成功 ${successCount} 个，失败 ${failCount} 个（失败ID：${failIds.join(',')}）`);
            } else {
                ElMessage.error(`删除失败：${failCount} 个商品均未删除成功`);
            }

            selectedRows.value = [];

        } catch (error) {
            console.error("批量删除商品异常:", error);
            ElMessage.error("批量删除失败，请重试");
        } finally {
            loadingInstance.close();
        }

    } catch (error) {
        // 用户取消删除
    }
};

// 单个删除商品
const handleDeleteSingle = async (id) => {
    try {
        await ElMessageBox.confirm("确定要删除该商品吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "删除中..."
        });

        try {
            const response = await deleteShopAPI({ ids: [id] });
            if (response.status === 200) {
                ElMessage.success("删除成功");
                getShopData();
            } else {
                ElMessage.error("删除失败");
            }
        } catch (error) {
            console.error("删除商品失败:", error);
            ElMessage.error("删除失败");
        } finally {
            loadingInstance.close();
        }
    } catch (error) {
        // 用户取消删除
    }
};

// 清空搜索
const handleClearFilter = () => {
    search.value = "";
    currentPage.value = 1;
    getShopData();
};

// 表格选择事件
const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};

// 行点击事件（查看详情）
const handleRowClick = (row, column, event) => {
    if (!event.target.closest(".el-checkbox__input")) {
        selectedRow.value = row;
        dialogVisible.value = true;
    }
};

// 分页切换
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getShopData();
};
</script>

<style scoped>
.page-container {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
}

.table-header {
    display: flex;
    margin-bottom: 16px;
    align-items: center;
}

/* 描述文字溢出处理 */
.description-content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 图片容器样式 */
.imageContainer {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
}

.imageContainer .item {
    position: relative;
    width: 100px;
    height: 100px;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
}

.imageContainer .addImage {
    width: 100px;
    height: 100px;
    border: 1px dashed #ccc;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 24px;
    color: #999;
    transition: all 0.3s;
}

.imageContainer .addImage:hover {
    border-color: #409eff;
    color: #409eff;
}

.image-item {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.imgCursor {
    cursor: pointer;
    transition: transform 0.3s;
}

.imgCursor:hover {
    transform: scale(1.05);
}

.deleteImageBtn {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff4d4f;
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tip-text {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}

.dialog-footer {
    text-align: right;
}

.clickDialog {
    padding: 20px;
}
</style>