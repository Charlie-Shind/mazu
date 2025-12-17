<template>
    <div class="page-container">
        <div class="table-header">
            <el-input v-model="search" size="default" placeholder="根据帖子标题搜索" style="width: 30%"
                @keyup.enter="getPostData()" />
            <el-button style="margin-left: 10px" type="danger" @click="handleDeleteSelected"
                :disabled="selectedRows.length === 0">删除选中</el-button>
            <el-button type="success" @click="handleDrawer(null, 'add')">新增帖子</el-button>
            <el-button type="info" @click="handleClearFilter">清空</el-button>
        </div>
        <el-table border :data="tableData" :scrollbar-always-on="false" style="width: 100%" @row-click="handleRowClick"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column type="index" label="序号" width="60" align="center" />
            <el-table-column label="帖子标题" prop="title" align="center" width="200" />
            <el-table-column label="所属板块" prop="topic_name" align="center" width="120" />
            <el-table-column label="发布人" prop="nickname" align="center" width="100" />
            <el-table-column label="发布时间" prop="time" align="center" width="180">
                <template #default="{ row }">
                    {{ formatDate(row.time) }}
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="status" align="center" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                        {{ row.status === 1 ? '正常' : '已下架' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="帖子图片" width="100" align="center">
                <template #default="{ row }">
                    <div class="imageContainer">
                        <img v-if="row.imageUrl" :src="getFirstImage(row.imageUrl)" class="image-item" />
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="帖子内容" prop="content" align="center">
                <template #default="scope">
                    <el-tooltip :content="scope.row.content" placement="top">
                        <div class="description-content">{{ scope.row.content }}</div>
                    </el-tooltip>
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
        <!-- 帖子详情弹窗 -->
        <el-dialog v-model="dialogVisible" title="帖子详情" width="75%">
            <div class="clickDialog">
                <el-table :data="[selectedRow]" border>
                    <el-table-column label="帖子ID" prop="id" />
                    <el-table-column label="帖子标题" prop="title" />
                    <el-table-column label="所属板块" prop="topic_name" />
                    <el-table-column label="发布人" prop="nickname" />
                    <el-table-column label="发布时间" prop="time">
                        <template #default="{ row }">
                            {{ formatDate(row.time) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status">
                        <template #default="{ row }">
                            {{ row.status === 1 ? '正常' : '已下架' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="帖子内容" prop="content" />
                    <el-table-column label="帖子图片" width="400">
                        <template #default="{ row }">
                            <div class="imageContainer">
                                <img v-for="(item, index) in parseImageUrls(row.imageUrl)" :key="index" :src="item"
                                    class="image-item" style="width: 100px; margin-right: 10px" />
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
        <!-- 新增/修改侧边栏 -->
        <el-drawer v-model="dialogVisible2" :title="drawerJudge ? '编辑帖子' : '新增帖子'" size="55%">
            <el-form :model="editingRow" label-width="80px" ref="formRef" :rules="formRules">
                <el-form-item label="帖子标题" prop="title">
                    <el-input v-model="editingRow.title" placeholder="请输入帖子标题" />
                </el-form-item>
                <el-form-item label="用户id" prop="user_id">
                    <el-input v-model="editingRow.user_id" placeholder="请输入用户id" />
                </el-form-item>
                <el-form-item label="所属板块" prop="grid_id">
                    <el-select v-model="editingRow.grid_id" placeholder="请选择所属板块">
                        <el-option v-for="(item, index) in topicList" :key="item.id" :label="item.name"
                            :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="帖子状态" prop="status">
                    <el-select v-model="editingRow.status" placeholder="请选择帖子状态">
                        <el-option label="正常" value="1" />
                        <el-option label="已下架" value="0" />
                    </el-select>
                </el-form-item>
                <el-form-item label="帖子内容" prop="content">
                    <el-input v-model="editingRow.content" type="textarea" :rows="3" placeholder="请输入帖子内容" />
                </el-form-item>
                <el-form-item label="帖子图片">
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
                    <div class="tip-text">最多上传9张图片，点击图片可替换</div>
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
import { ref, shallowRef, onMounted, reactive } from "vue";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import { CloseBold, Plus } from "@element-plus/icons-vue";
import { getToken } from "~/composables/auth";

// 导入拆分后的 API 接口（与订单API风格一致）
import {
    getPostListAPI,
    searchPostAPI,
    addPostAPI,
    updatePostAPI,
    deletePostAPI,
    getPostDetailAPI,
    uploadPostImagesAPI
} from '~/api/community/post';
import { getCommunityListAPI } from '~/api/community/topic';

// 定义响应式数据
const search = ref("");
const selectedRows = ref([]);
const dialogVisible = ref(false);
const selectedRow = ref(null);
const imageUrl = ref([]); // 临时存储图片URL
const topicList = ref([]); // 社区板块列表
const formRef = shallowRef(null); // 表单引用

// 分页相关
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);

// 表单数据（匹配后端 community_post 表字段）
const editingRow = ref({
    id: "",
    title: "",
    content: "",
    grid_id: "", // 所属板块ID
    user_id: "", // 用户设置
    status: "1", // 默认正常状态
    imageUrl: "" // 图片URL字符串（逗号分隔）
});

// 表单校验规则
const formRules = reactive({
    title: [{ required: true, message: "请输入帖子标题", trigger: "blur" }],
    grid_id: [{ required: true, message: "请选择所属板块", trigger: "change" }],
    user_id: [{ required: true, message: "请选择用户id", trigger: "change" }],
    content: [{ required: true, message: "请输入帖子内容", trigger: "blur" }],
    status: [{ required: true, message: "请选择帖子状态", trigger: "change" }]
});

// 侧边栏相关
const dialogVisible2 = ref(false);
const drawerJudge = ref(false);

// 格式化日期
const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

// 解析图片URL（后端存储为JSON字符串/逗号分隔，前端转为数组）
const parseImageUrls = (imageUrlStr) => {
    if (!imageUrlStr) return [];
    // 兼容两种格式：JSON字符串（如["url1","url2"]）和逗号分隔（如"url1,url2"）
    try {
        return JSON.parse(imageUrlStr);
    } catch (e) {
        return imageUrlStr.split(",").filter(Boolean);
    }
};

// 获取第一张图片（表格显示用）
const getFirstImage = (imageUrlStr) => {
    const urls = parseImageUrls(imageUrlStr);
    return urls[0] || "";
};

// 获取帖子列表数据（分页+搜索）
const tableData = ref([]);
const getPostData = () => {
    const loadingInstance = ElLoading.service({
        lock: true,
        text: "加载中...",
        background: "rgba(255, 255, 255, 0.7)"
    });

    console.log(1);

    getPostListAPI({ page: currentPage.value, pageSize: pageSize.value }).then((response) => {
        if (response.data.status === 200) {
            let list = response.data.message;
            console.log(list);
            if (search.value) {
                list = list.filter(item =>
                    item.title.toLowerCase().includes(search.value.toLowerCase())
                );
            }
            tableData.value = list;
            totalCount.value = response.data.total;
        } else {
            ElMessage.error("帖子数据获取失败");
        }
    }).catch((error) => {
        console.error("获取帖子数据失败:", error);
        ElMessage.error("帖子数据获取失败");
    }).finally(() => {
        loadingInstance.close();
    });
}


// 获取社区板块列表
const getTopicData = () => {
    getCommunityListAPI().then((response) => {
        if (response.data.status === 200) {
            topicList.value = response.data.message;
        }
    }).catch((error) => {
        console.error("获取社区板块失败:", error);
    });
};

// 页面加载时初始化
onMounted(() => {
    // 从token获取当前用户ID（需根据你的token结构调整）
    const token = getToken();
    if (token) {
        try {
            const decoded = JSON.parse(atob(token.split(".")[1]));
            editingRow.value.user_id = decoded.id; // 假设token中存储了用户id
        } catch (e) {
            ElMessage.error("获取用户信息失败，请重新登录");
        }
    }
    getPostData();
    getTopicData();
});

// 侧边栏打开/关闭
const handleDrawer = async (row, type) => {
    dialogVisible2.value = true;
    if (type === "edit") {
        editingRow.value = { ...row };
        console.log(editingRow.value);
        imageUrl.value = parseImageUrls(row.imageUrl);
        drawerJudge.value = true;
    } else {
        // 新增模式：重置表单
        editingRow.value = {
            id: "",
            title: "",
            content: "",
            grid_id: "",
            user_id: editingRow.value.user_id, // todo 肯定是别人的id 不是自己的
            status: "1",
            imageUrl: ""
        };
        imageUrl.value = [];
        drawerJudge.value = false;
        // 重置表单校验
        if (formRef.value) {
            formRef.value.resetFields();
        }
    }
};

// 保存新增帖子
const handleSaveAdd = async () => {
    // 表单校验
    await formRef.value.validate();

    if (imageUrl.value.length === 0) {
        return ElMessage.error("请上传至少1张帖子图片");
    }

    const loadingInstance = ElLoading.service({
        lock: true,
        text: "提交中..."
    });

    try {
        // 图片URL数组转为逗号分隔字符串（匹配后端存储格式）
        const imageUrlJson = JSON.stringify(imageUrl.value);
        const response = await addPostAPI({
            title: editingRow.value.title,
            content: editingRow.value.content,
            imageUrl: imageUrlJson, // 提交JSON字符串
            grid_id: editingRow.value.grid_id,
            user_id: editingRow.value.user_id,
            status: editingRow.value.status
        });

        if (response.data.status === 200) {
            ElMessage.success("新增帖子成功");
            dialogVisible2.value = false;
            getPostData(); // 重新获取列表
        } else {
            ElMessage.error("新增帖子失败: " + (response.data.message || "未知错误"));
        }
    } catch (error) {
        console.error("新增帖子失败:", error);
        ElMessage.error("新增帖子失败");
    } finally {
        loadingInstance.close();
    }
};

// 保存编辑帖子
const handleSaveEdit = async () => {
    // 表单校验
    await formRef.value.validate();

    if (imageUrl.value.length === 0) {
        return ElMessage.error("请上传至少1张帖子图片");
    }

    const loadingInstance = ElLoading.service({
        lock: true,
        text: "提交中..."
    });

    try {
        // 图片URL数组转为逗号分隔字符串
        // 关键修改：数组转为JSON字符串（格式：["url1","url2"]）
        const imageUrlJson = JSON.stringify(imageUrl.value);
        const response = await updatePostAPI({
            id: editingRow.value.id,
            title: editingRow.value.title,
            content: editingRow.value.content,
            imageUrl: imageUrlJson, // 提交JSON字符串
            grid_id: editingRow.value.grid_id,
            user_id: editingRow.value.user_id,
            status: editingRow.value.status
        });

        if (response.data.status === 200) {
            ElMessage.success("修改帖子成功");
            dialogVisible2.value = false;
            getPostData(); // 重新获取列表
        } else {
            ElMessage.error("修改帖子失败: " + (response.data.message || "未知错误"));
        }
    } catch (error) {
        console.error("修改帖子失败:", error);
        ElMessage.error("修改帖子失败");
    } finally {
        loadingInstance.close();
    }
};

// 上传图片（新增/替换）
const addImage = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.multiple = true; // 支持多选

    fileInput.onchange = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        // 限制最多选择9张（剩余可上传数量）
        const maxAllow = 9 - imageUrl.value.length;
        const selectFiles = Array.from(files).slice(0, maxAllow);

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "图片上传中..."
        });

        try {
            const formData = new FormData();
            selectFiles.forEach(file => {
                formData.append("images", file); // 匹配后端多图上传字段名
            });

            const response = await uploadPostImagesAPI(formData);

            if (response.data.status === 200 && Array.isArray(response.data.imageUrls)) {
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
            formData.append("images", file);

            const response = await uploadPostImagesAPI(formData);

            if (response.data.status === 200 && response.data.imageUrls.length > 0) {
                // 替换旧图片URL
                imageUrl.value.splice(index, 1, response.data.imageUrls[0]);
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

// 确认删除图片（仅前端移除，后端在修改/删除帖子时自动清理）
const confirmDeleteImage = async (url, index) => {
    try {
        await ElMessageBox.confirm("确定要删除此图片吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        imageUrl.value.splice(index, 1);
        ElMessage.success("图片删除成功");
    } catch (error) {
        // 用户取消删除
    }
};

// 批量删除选中帖子
const handleDeleteSelected = async () => {
    try {
        await ElMessageBox.confirm("确定要删除选中的帖子吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        const ids = selectedRows.value.map(row => row.id);
        if (ids.length === 0) {
            ElMessage.warning("请先选择要删除的帖子");
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

            // 循环单个删除（后端接口支持单ID删除）
            for (const id of ids) {
                try {
                    const response = await deletePostAPI({ id });

                    if (response.data.status === 200) {
                        successCount++;
                    } else {
                        failCount++;
                        failIds.push(id);
                    }
                } catch (err) {
                    failCount++;
                    failIds.push(id);
                    console.error(`删除帖子ID: ${id} 失败:`, err);
                }
            }

            // 结果提示
            if (successCount > 0 && failCount === 0) {
                ElMessage.success(`成功删除 ${successCount} 个帖子`);
                getPostData();
            } else if (successCount > 0 && failCount > 0) {
                ElMessage.warning(`部分删除成功：成功 ${successCount} 个，失败 ${failCount} 个（失败ID：${failIds.join(',')}）`);
            } else {
                ElMessage.error(`删除失败：${failCount} 个帖子均未删除成功`);
            }

            selectedRows.value = []; // 清空选中状态

        } catch (error) {
            console.error("批量删除帖子异常:", error);
            ElMessage.error("批量删除失败，请重试");
        } finally {
            loadingInstance.close();
        }

    } catch (error) {
        // 用户取消删除
    }
};

// 单个删除帖子
const handleDeleteSingle = async (id) => {
    try {
        await ElMessageBox.confirm("确定要删除该帖子吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        });

        const loadingInstance = ElLoading.service({
            lock: true,
            text: "删除中..."
        });

        try {
            const response = await deletePostAPI({ id });
            if (response.data.status === 200) {
                ElMessage.success("删除成功");
                getPostData();
            } else {
                ElMessage.error("删除失败");
            }
        } catch (error) {
            console.error("删除帖子失败:", error);
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
    getPostData();
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
    getPostData();
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

.ellipsis-2 {
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 200px;
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

.description-content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>