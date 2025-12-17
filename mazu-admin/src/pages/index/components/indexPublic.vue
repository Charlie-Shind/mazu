<template>
  <div class="table-header">
    <el-input v-model="search" size="default" placeholder="根据标题搜索" style="width: 30%" />
    <el-select v-model="selectedCategory" placeholder="选择分类" clearable size="default"
      style="margin-right: 10px; width: 20%">
      <el-option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</el-option>
    </el-select>
    <el-button type="danger" @click="handleDeleteSelected" :disabled="selectedRows.length === 0">删除选中</el-button>
    <el-button type="success" @click="handleDrawer(null, 'add')">新增</el-button>
    <el-button type="info" @click="handleClearFilter">清空</el-button>
  </div>
  <el-table border :data="filterTableData" :scrollbar-always-on="false" style="width: 100%"
    @selection-change="handleSelectionChange" @row-click="handleRowClick">
    <el-table-column type="selection" />
    <el-table-column label="id" prop="id" align="center" width="80px" />
    <el-table-column label="标题" prop="title" align="left">
      <template #default="{ row }">
        <div class="ellipsis-2">{{ row.title }}</div>
      </template>
    </el-table-column>
    <el-table-column label="内容" prop="content" header-align="center" width="400px">
      <template #default="{ row }">
        <div class="ellipsis-2">{{ row.content }}</div>
      </template>
    </el-table-column>
    <el-table-column label="发布时间" prop="time" align="center" width="180px" />
    <el-table-column prop="imageUrl" label="图片" align="center">
      <template #default="{ row }">
        <div class="imageContainer">
          <img v-for="(item, index) in row.imageUrl" :key="index" :src="item" class="image-item" />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="分类" prop="grid" align="center" width="100px" />
    <el-table-column label="操作" align="center" width="100px">
      <template #default="scope">
        <el-button type="primary" plain @click.stop="handleDrawer(scope.row, 'edit')">修改</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 单击显示弹窗 -->
  <el-dialog v-model="dialogVisible" title="详情内容" width="75%">
    <div class="clickDialog">
      <el-table :data="[selectedRow]" border>
        <el-table-column label="ID" prop="id" />
        <el-table-column label="标题" prop="title" />
        <el-table-column label="内容" prop="content" />
        <el-table-column label="发布时间" prop="time" />
        <el-table-column label="分类" prop="grid" />
        <el-table-column label="图片">
          <template #default="{ row }">
            <div class="imageContainer">
              <img v-for="(item, index) in row.imageUrl" :key="index" :src="item" class="image-item" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>

  <!-- 新增/修改侧边栏 -->
  <el-drawer v-model="dialogVisible2" :title="drawerJudge ? '编辑内容' : '新增内容'" size="55%">
    <el-form :model="editingRow" label-width="80px" ref="formRef">
      <el-form-item label="标题" prop="title">
        <el-input v-model="editingRow.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <Toolbar style="
            border-right: 1px solid #ccc;
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
          " :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
        <Editor style="
            width: 100%;
            height: 200px;
            overflow-y: hidden;
            border-right: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
          " v-model="editingRow.content" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
      </el-form-item>
      <el-form-item label="发布时间" prop="time">
        <el-date-picker v-model="editingRow.time" type="datetime" placeholder="选择时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="分类" prop="grid">
        <el-select v-model="editingRow.grid" style="width: 30%">
          <el-option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</el-option>
        </el-select>
        <el-button type="primary" icon="plus" size="mini" @click="openAddCategoryDialog"
          style="margin-left: 10px">添加分类</el-button>
        <el-button type="danger" icon="delete" size="mini" @click="openDeleteCategoryDialog">删除分类</el-button>
      </el-form-item>
      <el-form-item label="图片">
        <div class="imageContainer">
          <div class="item" v-for="(item, index) in imageUrl" :key="index">
            <img :src="item" class="image-item imgCursor" @click="clickEditImage(item, index)" />
            <div class="deleteImageBtn" @click="confirmDeleteImage(item, index)">
              <el-icon>
                <CloseBold />
              </el-icon>
            </div>
          </div>
          <div class="addImage" @click="addImage" v-if="editingRow.imageUrl.length < 9">
            <el-icon>
              <Plus />
            </el-icon>
          </div>
        </div>
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

  <!-- fenlei  -->
  <el-dialog title="添加新分类" v-model="addCategoryDialogVisible" width="300px">
    <el-input v-model="newCategoryInput" placeholder="请输入新分类名称"></el-input>
    <template #footer>
      <el-button @click="addCategoryDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confirmAddCategory">确定</el-button>
    </template>
  </el-dialog>
  <el-dialog title="删除分类" v-model="deleteCategoryDialogVisible" width="300px">
    <p>确定要删除当前选中的分类吗？</p>
    <template #footer>
      <el-button @click="deleteCategoryDialogVisible = false">取消</el-button>
      <el-button type="danger" @click="confirmDeleteCategory">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, onBeforeUnmount, shallowRef, onMounted } from "vue";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import {
  getindexGridNewsAPI,
  getindexGridFuCultureAPI,
  getindexGridFaithAPI,
  getindexGridMazuCultureAPI,
  getindexGridPalaceTempleAPI,
  getindexGridPublicationAPI,
  getindexGridCultureCreativityAPI,
  getindexGridTourismAPI,
  deleteImageAPI,
  editIndexContentAPI,
  insertIndexContentAPI,
  deleteIndexContentAPI,
} from "~/api/index/index";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
// 获取token
import { getToken } from "~/composables/auth";
import axios from "axios";
import baseUrl from "~/baseUrl";
console.log(baseUrl);
// 接收父亲传来的值
let props = defineProps(["apiCode"]);

const editorRef = shallowRef();
const toolbarConfig = {
  excludeKeys: [
    "group-image",
    "insertImage",
    "insertVideo",
    "uploadVideo",
    "group-video",
  ],
};
const editorConfig = { placeholder: "请输入内容..." };

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor;
};

// 根据不同的值调用不同的函数
const getFunction = () => {
  let apiFunc;
  switch (props.apiCode) {
    case "1":
      apiFunc = getindexGridNewsAPI;
      break;
    case "2":
      apiFunc = getindexGridFuCultureAPI;
      break;
    case "3":
      apiFunc = getindexGridFaithAPI;
      break;
    case "4":
      apiFunc = getindexGridMazuCultureAPI;
      break;
    case "5":
      apiFunc = getindexGridPalaceTempleAPI;
      break;
    case "6":
      apiFunc = getindexGridPublicationAPI;
      break;
    case "7":
      apiFunc = getindexGridCultureCreativityAPI;
      break;
    case "8":
      apiFunc = getindexGridTourismAPI;
      break;
    default:
      apiFunc = null;
  }

  if (apiFunc) {
    apiFunc().then((res) => {
      tableData.value = res.data.message.map((item) => {
        return {
          ...item,
          time: formatDateTime(item.time),
          imageUrl: JSON.parse(item.imageUrl),
        };
      });
    });
  }
};
getFunction();

const tableData = ref([]);
const search = ref("");
const selectedRows = ref([]);
const dialogVisible = ref(false);
const selectedRow = ref(null);
// 临时变量
let imageUrl = ref([]);
const editingRow = ref({
  title: "",
  content: "",
  time: "",
  grid: "",
});
const dialogVisible2 = ref(false);

// 时间格式化函数
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// 搜索过滤
const filterTableData = computed(() =>
  tableData.value.filter(
    (data) =>
      (!search.value ||
        data.title.toLowerCase().includes(search.value.toLowerCase())) &&
      (!selectedCategory.value || data.grid === selectedCategory.value)
  )
);

// 侧边栏
const drawerJudge = ref(false);
const handleDrawer = (row, data) => {
  dialogVisible2.value = true;
  if (data == "edit") {
    editingRow.value = { ...row };
    imageUrl.value = editingRow.value.imageUrl
      ? [...editingRow.value.imageUrl]
      : [];
    drawerJudge.value = true;
  } else {
    // 初始化新增的编辑行
    editingRow.value = {
      title: "",
      content: "",
      time: "",
      grid: "",
      imageUrl: [], // 初始化为一个空数组
    };
    imageUrl.value = []; // 重置图片URLs
    drawerJudge.value = false;
  }
};

// 确认按钮
const handleSaveEdit = () => {
  // 处理时间
  if (editingRow.value.time) {
    const date = new Date(editingRow.value.time);
    const formattedTime = date.toISOString().slice(0, 19).replace("T", " ");
    editingRow.value.time = formattedTime;
  }
  // 处理图片
  editingRow.value.imageUrl = imageUrl.value;
  const proxyArray = editingRow.value.imageUrl;
  const normalArray = [...proxyArray];
  const formattedImageUrls = `["${normalArray.join('","')}"]`;
  editIndexContentAPI({
    editCode: props.apiCode,
    title: editingRow.value.title,
    content: editingRow.value.content,
    time: editingRow.value.time,
    grid: editingRow.value.grid,
    imageUrl: formattedImageUrls,
    id: editingRow.value.id,
  }).then((res) => {
    if (res.status == 200) {
      ElMessage.success("修改成功");
    } else {
      ElMessage.error("修改失败,请联系开发者");
    }
    // 重新获取数据
    getFunction();
    dialogVisible2.value = false;
  });
};

// 新增确认
const handleSaveAdd = () => {
  // 处理时间
  if (editingRow.value.time) {
    const date = new Date(editingRow.value.time);
    const formattedTime = date.toISOString().slice(0, 19).replace("T", " ");
    editingRow.value.time = formattedTime;
  }
  // 处理图片
  editingRow.value.imageUrl = imageUrl.value;
  const proxyArray = editingRow.value.imageUrl;
  const normalArray = [...proxyArray];
  const formattedImageUrls = `["${normalArray.join('","')}"]`;
  insertIndexContentAPI({
    editCode: props.apiCode,
    title: editingRow.value.title,
    content: editingRow.value.content,
    time: editingRow.value.time,
    grid: editingRow.value.grid,
    imageUrl: formattedImageUrls,
    id: editingRow.value.id,
  }).then((res) => {
    if (res.status == 200) {
      ElMessage.success("新增成功");
    } else {
      ElMessage.error("新增失败,请联系开发者");
    }
    // 重新获取数据
    getFunction();
    dialogVisible2.value = false;
  });
};

// 清空按钮
const handleClearFilter = () => {
  search.value = "";
  selectedCategory.value = "";
};

const handleSelectionChange = (rows) => {
  selectedRows.value = rows;
};

// 删除内容
const handleDeleteSelected = async () => {
  try {
    await ElMessageBox.confirm("确定要删除选中的行吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    const idsToDelete = selectedRows.value.map((row) => row.id);
    console.log(idsToDelete);
    deleteIndexContentAPI({
      editCode: props.apiCode,
      ids: idsToDelete,
    }).then((res) => {
      if (res.status == 200) {
        ElMessage.success("删除成功");
      } else {
        ElMessage.error("删除失败,请联系开发者");
      }
      // 重新获取数据
      getFunction();
    });
  } catch (error) {
    // 用户取消删除操作
  }
};

// 点击每行的功能
const handleRowClick = (row, column, event) => {
  if (event.target.tagName !== "BUTTON") {
    selectedRow.value = row;
    dialogVisible.value = true;
  }
};

// 存储编辑中图片索引的变量
const editImageIndex = ref(null);
// 点击图片事件
const clickEditImage = (item, index) => {
  editImageIndex.value = index;
  // 打开图片选择器
  showImagePicker(item, index);
};

// 是否删除图片
const confirmDeleteImage = async (item, index) => {
  try {
    await ElMessageBox.confirm("确定要删除此图片吗?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    });
    deleteImage(item, index, true);
  } catch (error) {
    // 用户取消删除操作
  }
};

// 删除图片事件
const deleteImage = (item, index, judge) => {
  const img = item.split("/").pop();
  if (index !== null) {
    deleteImageAPI(img, "prays").then((res) => {
      if (res.status == 200) {
        if (judge) {
          imageUrl.value.splice(index, 1);
          ElMessage.success("图片删除成功");
        } else {
          return;
        }
      } else {
        ElMessage.error(res.message);
      }
    });
  }
};

// 增加图片
const addImage = async () => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = async (event) => {
    // 显示加载效果
    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Loading...",
      background: "rgba(255, 255, 255, 0.7)",
    });
    const file = event.target.files[0];
    try {
      const formData = new FormData();
      formData.append("img", file);
      const response = await axios.post(
        `${baseUrl}/admin/indexUploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getToken(),
          },
        }
      );
      if (response.status === 200) {
        imageUrl.value.push(response.data.imageUrl);
        ElMessage.success("图片上传成功");
      } else {
        ElMessage.error("图片上传失败");
      }
    } catch (error) {
      ElMessage.error("图片上传失败：" + error.message);
    } finally {
      // 无论成功与否，关闭加载效果
      if (loadingInstance) loadingInstance.close();
      fileInput.value = "";
    }
  };

  fileInput.click();
};

// 修改图片
const showImagePicker = async (item, index) => {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.onchange = async (event) => {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: "Loading...",
      background: "rgba(255, 255, 255, 0.7)",
    });
    const file = event.target.files[0];
    try {
      const formData = new FormData();
      formData.append("img", file);
      const response = await axios.post(
        `${baseUrl}/admin/indexUploadImage`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: getToken(),
          },
        }
      );
      if (
        response.status === 200 &&
        editImageIndex.value !== null &&
        imageUrl.value.length > 0
      ) {
        const newImageUrl = response.data.imageUrl;
        const verifyResponse = await axios.get(newImageUrl);
        if (verifyResponse.status === 200) {
          await deleteImage(item, index, false);
          // 将新图片插回被修改图片的位置
          imageUrl.value.splice(index, 1, newImageUrl);
          ElMessage.success("图片修改成功");
        } else {
          ElMessage.error("新图片上传成功但无法正常访问，不执行删除旧图片操作");
        }
      } else {
        ElMessage.error("图片上传失败");
      }
    } catch (error) {
      ElMessage.error("图片上传失败：" + error.message);
    } finally {
      if (loadingInstance) loadingInstance.close();
      editImageIndex.value = null;
    }
  };
  fileInput.click();
};

// 对分类去重
const uniqueCategories = computed(() => {
  const categoriesSet = new Set();
  tableData.value.forEach((item) => {
    if (item.grid) {
      categoriesSet.add(item.grid);
    }
  });
  return Array.from(categoriesSet);
});
const selectedCategory = ref("");

// 添加分类
const addCategoryDialogVisible = ref(false);
const newCategoryInput = ref(null);
const openAddCategoryDialog = () => {
  addCategoryDialogVisible.value = true;
};
const confirmAddCategory = () => {
  const newCategory = newCategoryInput.value;
  if (newCategory && !uniqueCategories.value.includes(newCategory)) {
    uniqueCategories.value.push(newCategory);
    editingRow.value.grid = newCategory;
    addCategoryDialogVisible.value = false;
  } else {
    // 可以添加一些提示，比如新分类已存在或为空
  }
};

// 删除分类
const deleteCategoryDialogVisible = ref(false);
const openDeleteCategoryDialog = () => {
  deleteCategoryDialogVisible.value = true;
};

const confirmDeleteCategory = () => {
  const currentCategory = editingRow.value.grid;
  uniqueCategories.value = uniqueCategories.value.filter(
    (category) => category !== currentCategory
  );
  editingRow.value.grid = "";
  deleteCategoryDialogVisible.value = false;
};
</script>
<style scoped>
.table-header {
  display: flex;
  margin-bottom: 16px;
}

.table-header .el-input {
  width: 400px;
  margin-right: 10px;
  font-size: 14px;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;

  overflow: hidden;
  text-overflow: ellipsis;
}

.imageContainer {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}

.imageContainer .item {
  position: relative;
  height: 100%;
}

.imageContainer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.imageContainer .addImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px dashed #0000004c;
  font-size: 30px;
  color: #0000004c;
}

.deleteImageBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 50%;
}

.imgCursor {
  cursor: pointer;
}
</style>
