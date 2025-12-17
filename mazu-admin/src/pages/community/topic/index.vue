<template>
    <div class="community-container">
        <!-- 顶部操作栏 -->
        <div class="table-header">
            <el-input v-model="searchKeyword" size="default" placeholder="输入社区名称搜索" style="width: 30%"
                @keyup.enter="getCommunityList" />
            <el-button type="danger" @click="handleDeleteSelected"
                :disabled="selectedRows.length === 0">删除选中</el-button>
            <el-button type="success" @click="handleDrawer(null, 'add')">新增社区</el-button>
            <el-button type="info" @click="handleClearFilter">清空</el-button>
        </div>

        <!-- 社区表格 -->
        <el-table border :data="communityList" style="width: 100%; margin-top: 20px" :loading="tableLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column label="序号" type="index" align="center" width="80" />
            <el-table-column label="社区名称" prop="name" align="center" />
            <el-table-column label="社区封面" align="center" width="120">
                <template #default="scope">
                    <!-- 移除默认图，未上传时显示文字提示 -->
                    <div class="cover-preview" v-if="scope.row.cover">
                        <img :src="scope.row.cover" alt="社区封面" class="cover-img" />
                    </div>
                    <div class="cover-placeholder" v-else>
                        未上传封面
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="社区描述" prop="description" align="center">
                <template #default="scope">
                    <el-tooltip :content="scope.row.description" placement="top">
                        <div class="description-content">{{ scope.row.description }}</div>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="create_time" align="center" width="200">
                <template #default="scope">
                    {{ formatTime(scope.row.create_time) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
                <template #default="scope">
                    <el-button type="primary" plain @click.stop="handleDrawer(scope.row, 'edit')">修改</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑抽屉弹窗 -->
        <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑社区' : '新增社区'" direction="rtl" size="50%">
            <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="社区名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入社区名称" />
                </el-form-item>
                <el-form-item label="社区封面" prop="cover">
                    <!-- 方形裁剪上传组件 -->
                    <div class="square-upload-container">
                        <el-upload class="cover-uploader" action="#" :auto-upload="false" :on-change="handleCoverChange"
                            :before-upload="beforeCoverUpload" accept="image/jpeg,image/png,image/gif,image/webp">
                            <!-- 上传前：方形占位框 -->
                            <div v-if="!form.cover" class="upload-placeholder square-box">
                                <i class="el-icon-plus upload-icon"></i>
                                <div class="upload-text">点击上传方形封面图</div>
                            </div>
                            <!-- 上传后：方形预览图 -->
                            <div v-else class="preview-container square-box">
                                <img :src="form.cover" alt="预览图" class="preview-img" />
                                <el-button type="text" class="delete-img-btn" @click.stop="removeCover">
                                    <i class="el-icon-delete"></i> 删除
                                </el-button>
                            </div>
                        </el-upload>
                        <div class="upload-tip">
                            支持JPG、PNG、GIF、WEBP格式，大小不超过2MB，<span class="required-tip">必须为方形图片（宽高比1:1）</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="社区描述" prop="description">
                    <el-input v-model="form.description" placeholder="请输入社区描述" type="textarea" :rows="5" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="drawerVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确认</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup>
import { getCommunityListAPI, addCommunityAPI, updateCommunityAPI, deleteCommunityAPI, uploadCommunityCoverAPI } from "../.././../api/community/topic";
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox, ElTooltip } from "element-plus";

// 状态管理
const communityList = ref([]);
const tableLoading = ref(false);
const searchKeyword = ref("");
const drawerVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const selectedRows = ref([]);
const uploadLoading = ref(false); // 上传加载状态

// 表单数据（移除默认图）
const form = reactive({
    id: "",
    name: "",
    cover: "", // 初始为空，无默认图
    description: ""
});

// 表单校验规则
const formRules = reactive({
    name: [
        { required: true, message: "请输入社区名称", trigger: "blur" },
        { min: 2, max: 30, message: "社区名称长度在 2-30 个字符之间", trigger: "blur" }
    ],
    cover: [
        { required: true, message: "请上传社区封面", trigger: "change" }
    ],
    description: [
        { required: true, message: "请输入社区描述", trigger: "blur" },
        { min: 5, max: 200, message: "社区描述长度在 5-200 个字符之间", trigger: "blur" }
    ]
});

// 获取社区列表（保持不变）
const getCommunityList = async () => {


    tableLoading.value = true;
    try {
        const res = await getCommunityListAPI();
        if (res.data.status === 200) {
            let list = res.data.message;
            if (searchKeyword.value) {
                list = list.filter(item =>
                    item.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
                );
            }
            communityList.value = list;
        } else {
            ElMessage.error("获取社区列表失败");
        }
    } catch (err) {
        ElMessage.error("网络错误：" + err.message);
    } finally {
        tableLoading.value = false;
    }
};

// 打开抽屉弹窗（保持不变）
const handleDrawer = (row, type) => {
    if (type === "add") {
        isEdit.value = false;
        form.id = "";
        form.name = "";
        form.cover = ""; // 重置为空
        form.description = "";
        formRef.value?.resetFields();
    } else if (type === "edit" && row) {
        isEdit.value = true;
        form.id = row.id;
        form.name = row.name;
        form.cover = row.cover || ""; // 保留原有图片或为空
        form.description = row.description || "";
    }
    drawerVisible.value = true;
};

// 提交表单（保持不变）
const submitForm = async () => {
    try {
        await formRef.value.validate();
        const formData = {
            name: form.name,
            cover: form.cover,
            description: form.description
        };

        let res;
        if (isEdit.value) {
            res = await updateCommunityAPI(form.id, formData);
        } else {
            res = await addCommunityAPI(formData);
        }

        if (res.data.status === 200) {
            ElMessage.success(isEdit.value ? "编辑社区成功" : "新增社区成功");
            drawerVisible.value = false;
            getCommunityList();
        } else {
            ElMessage.error(res.data.message || (isEdit.value ? "编辑社区失败" : "新增社区失败"));
        }
    } catch (err) {
        if (err.name === "Error") {
            ElMessage.error("网络错误：" + err.message);
        }
    }
};

// 表格选中事件（保持不变）
const handleSelectionChange = (val) => {
    selectedRows.value = val;
};

// 批量删除（保持不变）
const handleDeleteSelected = async () => {
    if (selectedRows.value.length === 0) return;
    try {
        await ElMessageBox.confirm(
            "此操作将永久删除选中的社区，是否继续？",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        );

        const deletePromises = selectedRows.value.map(row => deleteCommunityAPI(row.id));
        const results = await Promise.allSettled(deletePromises);
        const successCount = results.filter(
            item => item.status === "fulfilled" && item.value.data.status === 200
        ).length;

        ElMessage.success(`成功删除 ${successCount} 个社区`);
        getCommunityList();
    } catch (err) {
        if (err === "cancel") {
            ElMessage.info("已取消删除");
        } else {
            ElMessage.error("删除失败：" + err.message);
        }
    }
};

// 清空筛选（保持不变）
const handleClearFilter = () => {
    searchKeyword.value = "";
    getCommunityList();
};

// 封面上传处理（修复：上传后即时赋值，显示预览）
const handleCoverChange = async (uploadFile) => {
    uploadLoading.value = true;
    try {
        // 1. 先通过FileReader预览本地图片（解决"上传了看不到"的问题）
        const reader = new FileReader();
        reader.onload = (e) => {
            // 本地预览图（即时显示，无需等接口返回）
            form.cover = e.target.result;
        };
        reader.readAsDataURL(uploadFile.raw);

        // 2. 构造FormData上传到服务器
        const formData = new FormData();
        formData.append("cover", uploadFile.raw);

        // 3. 调用后端接口（同步服务器图片地址）
        const res = await uploadCommunityCoverAPI(formData);
        if (res.data.status === 200) {
            // 接口返回后替换为服务器地址（确保提交正确）
            form.cover = res.data.imageUrl;
            ElMessage.success("封面上传成功");
        } else {
            ElMessage.error("封面上传失败：" + res.data.message);
            form.cover = ""; // 上传失败清空预览
        }
    } catch (err) {
        ElMessage.error("封面上传出错：" + (err.message || "网络异常"));
        form.cover = "";
    } finally {
        uploadLoading.value = false;
    }
};

// 封面上传校验（新增：方形校验+格式大小校验）
const beforeCoverUpload = (file) => {
    return new Promise((resolve, reject) => {
        // 1. 格式校验
        const isImage = file.type.startsWith("image/");
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!isImage || !allowedTypes.includes(file.type)) {
            ElMessage.error("请上传JPG、PNG、GIF、WEBP格式的图片");
            reject(false);
            return;
        }

        // 2. 大小校验
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            ElMessage.error("图片大小不能超过 2MB");
            reject(false);
            return;
        }

        // 3. 方形校验（宽高比1:1）
        const img = new Image();
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            // 允许±1像素误差（避免压缩后的微小偏差）
            if (Math.abs(width - height) > 1) {
                ElMessage.error(`图片必须为方形（当前宽高：${width}x${height}）`);
                reject(false);
            } else {
                resolve(true); // 全部校验通过
            }
        };
        img.onerror = () => {
            ElMessage.error("图片解析失败，请选择有效的图片文件");
            reject(false);
        };
        img.src = URL.createObjectURL(file);
    });
};

// 移除封面图
const removeCover = () => {
    form.cover = "";
};

// 初始化加载列表（保持不变）
onMounted(() => {
    getCommunityList();
    console.log(1);

});
// 格式化时间函数
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const formatTime = (time, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!time || !dayjs(time).isValid()) return '';
    return dayjs(time).format(format);
};

</script>

<style scoped>
.community-container {
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.table-header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
}

/* 表格中的封面样式 */
.cover-preview {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid #eee;
}

.cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cover-placeholder {
    width: 80px;
    height: 80px;
    margin: 0 auto;
    border: 1px dashed #dcdcdc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #999;
    font-size: 12px;
    background-color: #fafafa;
}

/* 上传组件样式 - 强制方形 */
.square-upload-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.square-box {
    width: 200px;
    height: 200px;
    border-radius: 4px;
    box-sizing: border-box;
}

.upload-placeholder {
    border: 1px dashed #dcdcdc;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fafafa;
    cursor: pointer;
    transition: all 0.3s;
}

.upload-placeholder:hover {
    border-color: #409eff;
    background-color: #f5fafe;
}

.upload-icon {
    font-size: 24px;
    color: #409eff;
    margin-bottom: 8px;
}

.upload-text {
    font-size: 14px;
    color: #999;
}

.preview-container {
    position: relative;
    overflow: hidden;
    border: 1px solid #eee;
}

.preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.delete-img-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    padding: 4px 0;
    opacity: 0;
    transition: opacity 0.3s;
}

.preview-container:hover .delete-img-btn {
    opacity: 1;
}

.upload-tip {
    margin-top: 8px;
    font-size: 12px;
    color: #999;
}

.required-tip {
    color: #f56c6c;
    font-weight: 500;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
}

.description-content {
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 隐藏默认上传组件的图标 */
.cover-uploader .el-upload__input {
    display: none;
}
</style>