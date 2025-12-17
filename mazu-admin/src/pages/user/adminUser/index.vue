<template>
    <div class="admin-container">
        <!-- 顶部操作栏 -->
        <div class="table-header">
            <el-input v-model="searchKeyword" size="default" placeholder="输入用户名搜索" style="width: 30%"
                @keyup.enter="getAdminList" />
            <el-button type="danger" @click="handleDeleteSelected"
                :disabled="selectedRows.length === 0">删除选中</el-button>
            <el-button type="success" @click="handleDrawer(null, 'add')">新增</el-button>
            <el-button type="info" @click="handleClearFilter">清空</el-button>
        </div>

        <!-- 管理员表格 -->
        <el-table border :data="adminList" style="width: 100%; margin-top: 20px" :loading="tableLoading"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" />
            <el-table-column label="序号" type="index" align="center" width="80" />
            <el-table-column label="用户名" prop="username" align="center" />
            <el-table-column label="头像" align="center" width="120">
                <template #default="scope">
                    <el-avatar :src="scope.row.imageUrl || defaultAvatar" size="medium" />
                </template>
            </el-table-column>
            <el-table-column label="角色权限" prop="roles" align="center">
                <template #default="scope">
                    <el-tag :type="scope.row.roles === 1 ? 'default' : 'primary'">
                        {{ scope.row.roles === 1 ? '普通管理员' : '超级管理员' }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button type="primary" plain @click.stop="handleDrawer(scope.row, 'edit')">修改</el-button>
                    <el-button type="primary" plain @click.stop="openDialog(scope.row.id)">添加待办事项</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 新增/编辑抽屉弹窗 -->
        <el-drawer v-model="drawerVisible" :title="isEdit ? '编辑管理员' : '新增管理员'" direction="rtl" size="50%">
            <el-form :model="form" :rules="formRules" ref="formRef" label-width="100px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码" :required="!isEdit">
                    <el-input v-model="form.password" placeholder="新增必填，编辑可选" type="password" />
                </el-form-item>
                <el-form-item label="头像">
                    <el-upload class="avatar-uploader" action="#" :auto-upload="false" :on-change="handleAvatarChange"
                        :before-upload="beforeAvatarUpload">
                        <el-avatar :src="form.imageUrl || defaultAvatar" size="large">
                        </el-avatar>
                    </el-upload>


                </el-form-item>

                <el-form-item label="角色权限" prop="roles">
                    <el-select v-model="form.roles" placeholder="请选择角色">
                        <el-option label="普通管理员" value="1" />
                        <el-option label="超级管理员" value="2" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="drawerVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确认</el-button>
                </div>
            </template>
        </el-drawer>

        <!-- 添加待办事项 -->
        <el-dialog v-model="dialogVisible" title="添加待办">
            <el-form :model="form" label-width="80px">
                <el-form-item label="待办内容" prop="content">
                    <el-input v-model="todoForm.content" type="textarea" :rows="3" placeholder="请输入待办内容" />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submit">确认提交</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { getAdminListAPI, addAdminAPI, updateAdminAPI, deleteAdminAPI, uploadAdminAvatarAPI, addTodoAPI } from "~/api/admin/index";
import { ref, reactive, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 常量
const defaultAvatar = "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

// 状态管理
const adminList = ref([]);
const tableLoading = ref(false);
const searchKeyword = ref("");
const drawerVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const selectedRows = ref([]); // 选中的行数据

// 表单数据
const form = reactive({
    id: "",
    username: "",
    password: "",
    imageUrl: "",
    roles: "1" // 默认普通管理员
});

// 表单校验规则
const formRules = reactive({
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
        { min: 3, max: 20, message: "用户名长度在 3-20 个字符之间", trigger: "blur" }
    ],
    roles: [
        { required: true, message: "请选择角色权限", trigger: "change" }
    ]
});




// 获取管理员列表
const getAdminList = async () => {
    tableLoading.value = true;
    try {
        const res = await getAdminListAPI();
        if (res.data.status === 200) {
            // 搜索过滤
            let list = res.data.message;
            if (searchKeyword.value) {
                list = list.filter(item =>
                    item.username.toLowerCase().includes(searchKeyword.value.toLowerCase())
                );
            }
            adminList.value = list;
        } else {
            ElMessage.error("获取管理员列表失败");
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
        form.username = "";
        form.password = "";
        form.imageUrl = "";
        form.roles = "1";
        formRef.value?.resetFields();
    } else if (type === "edit" && row) {
        isEdit.value = true;
        // 填充表单数据
        form.id = row.id;
        form.username = row.username;
        form.imageUrl = row.imageUrl || "";
        form.roles = row.roles.toString();
    }
    drawerVisible.value = true;
};

// 提交表单（新增/编辑）
const submitForm = async () => {
    try {
        await formRef.value.validate();
        const formData = {
            username: form.username,
            roles: form.roles,
            imageUrl: form.imageUrl
        };
        // 新增需要传密码，编辑可选
        if (!isEdit.value) {
            if (!form.password) {
                ElMessage.warning("请输入密码");
                return;
            }
            formData.password = form.password;
        } else if (form.password) {
            formData.password = form.password;
        }

        let res;
        if (isEdit.value) {
            // 编辑
            res = await updateAdminAPI(form.id, formData);
        } else {
            // 新增
            res = await addAdminAPI(formData);
        }

        if (res.data.status === 200) {
            ElMessage.success(isEdit.value ? "编辑成功" : "新增成功");
            drawerVisible.value = false;
            getAdminList(); // 刷新列表
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
            "此操作将永久删除选中的管理员，是否继续？",
            "提示",
            {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }
        );

        // 批量删除
        const deletePromises = selectedRows.value.map(row => deleteAdminAPI(row.id));
        const results = await Promise.allSettled(deletePromises);
        const successCount = results.filter(
            item => item.status === "fulfilled" && item.value.data.status === 200
        ).length;

        ElMessage.success(`成功删除 ${successCount} 个管理员`);
        getAdminList(); // 刷新列表
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
    getAdminList();
};

// 头像上传处理（对接后端，携带Token）
const handleAvatarChange = async (uploadFile) => {
    try {


        // 2. 构造FormData（字段名img和后端upload.single('img')一致）
        const formData = new FormData();
        formData.append("img", uploadFile.raw);

        // 3. 调用后端上传接口
        const res = await uploadAdminAvatarAPI(formData);

        // 4. 处理响应
        if (res.data.status === 200) {
            form.imageUrl = res.data.imageUrl; // 赋值后端返回的真实图片URL
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
// 添加待办事项

const dialogVisible = ref(false);
const todoForm = reactive({
    content: '',
    id: '',
});

const openDialog = (id) => {
    dialogVisible.value = true;
    todoForm.id = id;

};

const submit = async () => {
    if (!todoForm.content.trim()) {
        ElMessage.error('请输入待办内容');
        return;
    }


    const res = await addTodoAPI(todoForm);

    if (res.data.status === 200) {
        ElMessage.success('添加成功');
        dialogVisible.value = false;
        todoForm.content = ''; // 重置表单
        // 可在此处添加刷新列表等逻辑
    } else {
        ElMessage.error(res.data.message || '添加失败');
    }

};
// 初始化加载列表
onMounted(() => {
    getAdminList();
});
</script>

<style scoped>
.admin-container {
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
</style>