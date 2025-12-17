<template>
    <div class="user-container">
        <!-- 顶部操作栏 -->
        <div class="table-header">
            <el-input v-model="searchKeyword" size="default" placeholder="输入昵称搜索用户" style="width: 30%"
                @keyup.enter="getUserList" />
            <el-button type="danger" @click="handleDeleteSelected"
                :disabled="selectedRows.length === 0">删除选中</el-button>
            <el-button type="success" @click="handleDrawer(null, 'add')">新增用户</el-button>
            <el-button type="info" @click="handleClearFilter">清空</el-button>
        </div>

        <!-- 用户表格 -->
        <el-table border :data="userList" style="width: 100%; margin-top: 20px" :loading="tableLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column label="序号" type="index" align="center" width="80" />
            <el-table-column label="昵称" prop="nickname" align="center" />
            <el-table-column label="OpenID" prop="openid" align="center" width="220" />
            <el-table-column label="头像" align="center" width="120">
                <template #default="scope">
                    <el-avatar :src="scope.row.avatarurl || defaultAvatar" size="medium" />
                </template>
            </el-table-column>
            <el-table-column label="性别" prop="gender" align="center">
                <template #default="scope">
                    <el-tag :type="getGenderTagType(scope.row.gender)">
                        {{ getGenderText(scope.row.gender) }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="余额" prop="balance" align="center">
                <template #default="scope">
                    <span class="balance-text">{{ scope.row.balance }} 元</span>
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

        <!-- 分页组件 -->
        <div class="pagination" style="margin-top: 20px; text-align: right">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page"
                :page-sizes="[10, 20, 50, 100]" :page-size="limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <!-- 新增/编辑抽屉弹窗 -->
        <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑用户' : '新增用户'" direction="rtl" size="50%">
            <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="OpenID" prop="openid">
                    <el-input v-model="form.openid" placeholder="请输入用户OpenID（唯一标识）" :disabled="isEdit" />
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname" placeholder="请输入用户昵称" />
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="avatar-uploader" action="#" :auto-upload="false" :on-change="handleAvatarChange"
                        :before-upload="beforeAvatarUpload">
                        <el-avatar :src="form.avatarurl || defaultAvatar" size="large">
                        </el-avatar>
                    </el-upload>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                    <el-select v-model="form.gender" placeholder="请选择性别">
                        <el-option label="未知" value="0" />
                        <el-option label="男" value="1" />
                        <el-option label="女" value="2" />
                    </el-select>
                </el-form-item>
                <el-form-item label="余额" prop="balance">
                    <el-input-number v-model="form.balance" :min="0" :step="0.01" :precision="2" placeholder="请输入用户余额"
                        style="width: 200px" />
                </el-form-item>
                <el-form-item label="创建时间" v-if="isEdit">
                    <el-input v-model="form.create_time" placeholder="创建时间" disabled />
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
import { getUserListAPI, addUserAPI, updateUserAPI, deleteUserAPI, uploadUserAvatarAPI } from "~/api/user/index.js";
import { ref, reactive, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 常量
const defaultAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

// 状态管理
const userList = ref([]);
const tableLoading = ref(false);
const searchKeyword = ref("");
const drawerVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const selectedRows = ref([]);

// 分页参数
const page = ref(1);
const limit = ref(10);
const total = ref(0);

// 表单数据
const form = reactive({
    id: "",
    openid: "",
    nickname: "",
    avatarurl: "",
    gender: "0",
    balance: 0,
    create_time: ""
});

// 表单校验规则
const formRules = reactive({
    openid: [
        { required: true, message: "请输入OpenID", trigger: "blur" },
        { min: 10, max: 50, message: "OpenID长度在10-50个字符之间", trigger: "blur" }
    ],
    nickname: [
        { required: true, message: "请输入昵称", trigger: "blur" },
        { min: 2, max: 30, message: "昵称长度在2-30个字符之间", trigger: "blur" }
    ],
    gender: [
        { required: true, message: "请选择性别", trigger: "change" }
    ],
    balance: [
        { required: true, message: "请输入余额", trigger: "blur" },
        { type: "number", min: 0, message: "余额不能为负数", trigger: "blur" }
    ]
});


const getGenderText = (gender) => {
    const genderMap = {
        0: "未知",
        1: "男",
        2: "女"
    };
    return genderMap[gender] || "未知";
};

// 性别标签类型映射
const getGenderTagType = (gender) => {
    const typeMap = {
        0: "default",
        1: "primary",
        2: "success"
    };
    return typeMap[gender] || "default";
};

// 时间格式化
const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const date = new Date(timeStr);
    return date.toLocaleString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

// 获取用户列表
const getUserList = async () => {
    tableLoading.value = true;
    try {
        const res = await getUserListAPI({ page: page.value, limit: limit.value });
        if (res.data.status === 200) {
            let list = res.data.data.list;
            if (searchKeyword.value) {
                list = list.filter(item =>
                    item.nickname.toLowerCase().includes(searchKeyword.value.toLowerCase())
                );
            }
            userList.value = list;
            total.value = res.data.data.total; // 分页总条数
        } else {
            ElMessage.error("获取用户列表失败");
        }
    } catch (err) {
        ElMessage.error("网络错误：" + err.message);
    } finally {
        tableLoading.value = false;
    }
};

// 打开抽屉弹窗（新增/编辑）
const handleDrawer = (row, type) => {
    if (type === "add") {
        isEdit.value = false;
        // 重置表单
        form.id = "";
        form.openid = "";
        form.nickname = "";
        form.avatarurl = "";
        form.gender = "0";
        form.balance = 0;
        form.create_time = "";
        formRef.value?.resetFields();
    } else if (type === "edit" && row) {
        isEdit.value = true;
        form.id = row.id;
        form.openid = row.openid;
        form.nickname = row.nickname;
        form.avatarurl = row.avatarurl || "";
        form.gender = row.gender.toString();
        form.balance = row.balance;
        form.create_time = formatTime(row.create_time);
    }
    drawerVisible.value = true;
};

// 提交表单（新增/编辑）
const submitForm = async () => {
    try {
        await formRef.value.validate();
        const formData = {
            openid: form.openid,
            nickname: form.nickname,
            avatarurl: form.avatarurl,
            gender: parseInt(form.gender),
            balance: Number(form.balance)
        };

        let res;
        if (isEdit.value) {
            console.log(1);
            // 编辑用户（传id）
            res = await updateUserAPI(form.id, formData);
        } else {
            console.log(2);

            // 新增用户（无需传id，数据库自增）
            res = await addUserAPI(formData);
        }

        if (res.data.status === 200) {
            ElMessage.success(isEdit.value ? "编辑用户成功" : "新增用户成功");
            drawerVisible.value = false;
            getUserList();
        } else {
            ElMessage.error(res.data.message || (isEdit.value ? "编辑失败" : "新增失败"));
        }
    } catch (err) {
        if (err.name === "Error") {
            ElMessage.error("网络错误：" + err.message);
        }
    }
};

// 表格选中事件
const handleSelectionChange = (val) => {
    selectedRows.value = val;
};

// 批量删除
const handleDeleteSelected = async () => {
    if (selectedRows.value.length === 0) return;
    try {
        await ElMessageBox.confirm(
            "此操作将永久删除选中的用户，是否继续？",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        );

        // 批量删除（循环调用单个删除接口）
        const deletePromises = selectedRows.value.map(row => deleteUserAPI(row.id));
        const results = await Promise.allSettled(deletePromises);
        const successCount = results.filter(
            item => item.status === "fulfilled" && item.value.data.status === 200
        ).length;

        ElMessage.success(`成功删除 ${successCount} 个用户`);
        getUserList();
        selectedRows.value = [];
    } catch (err) {
        if (err === "cancel") {
            ElMessage.info("已取消删除");
        } else {
            ElMessage.error("删除失败：" + err.message);
        }
    }
};

// 清空筛选
const handleClearFilter = () => {
    searchKeyword.value = "";
    getUserList();
};

// 头像上传处理（对接user头像上传接口）
const handleAvatarChange = async (uploadFile) => {
    try {
        // 构造FormData（字段名avatar和后端upload.single('avatar')一致）
        const formData = new FormData();
        formData.append("avatar", uploadFile.raw);

        // 调用用户头像上传接口
        const res = await uploadUserAvatarAPI(formData);

        // 处理响应
        if (res.data.status === 200) {
            form.avatarurl = res.data.avatarUrl; // 赋值后端返回的真实图片URL
            ElMessage.success("头像上传成功");
        } else {
            ElMessage.error("头像上传失败：" + res.data.message);
        }
    } catch (err) {
        ElMessage.error("头像上传出错：" + (err.message || "网络异常"));
    }
};

// 头像上传校验（格式+大小）
const beforeAvatarUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
        ElMessage.error("请上传图片文件（JPG、PNG、GIF、WEBP）");
    }
    if (!isLt2M) {
        ElMessage.error("图片大小不能超过 2MB");
    }
    return isImage && isLt2M;
};

// 分页大小改变
const handleSizeChange = (val) => {
    limit.value = val;
    getUserList();
};

// 当前页改变
const handleCurrentChange = (val) => {
    page.value = val;
    getUserList();
};

// 初始化加载列表
onMounted(() => {
    getUserList();
});
</script>

<style scoped>
.user-container {
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

.avatar-uploader .el-avatar {
    cursor: pointer;
    transition: all 0.3s;
    border: 1px dashed #dcdcdc;
}

.avatar-uploader .el-avatar:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
}

.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

.balance-text {
    color: #e6a23c;
    font-weight: 500;
}

.pagination {
    margin-top: 20px;
    text-align: right;
}
</style>