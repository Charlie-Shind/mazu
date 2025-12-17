<template>
  <div class="page-container">
    <div class="table-header">
      <el-input v-model="search" size="default" placeholder="根据祈福文字搜索" style="width: 30%" />
      <el-button style="margin-left: 10px" type="danger" @click="handleDeleteSelected"
        :disabled="selectedRows.length === 0">删除选中</el-button>
      <!-- <el-button type="success" @click="handleDrawer(null, 'add')" -->
      <el-button type="success" @click="handleDrawer(null, 'add')">新增</el-button>
      <el-button type="info" @click="handleClearFilter">清空</el-button>
    </div>
    <el-table border :data="tableData" :scrollbar-always-on="false" style="width: 100%" @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" />
      <el-table-column type="index" label="序号" width="60" align="center" />
      <el-table-column label="id" prop="id" align="center" width="100" />
      <el-table-column label="祈福文字" prop="content" align="center">
        <template #default="{ row }">
          <div class="ellipsis-2">{{ row.text }}</div>
        </template>
      </el-table-column>
      <el-table-column label="祈福图片" width="100" prop="image" align="center">
        <template #default="{ row }">
          <div class="imageContainer">
            <img v-for="(item, index) in row.image" :key="index" :src="item" class="image-item" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button type="primary" plain @click.stop="handleDrawer(scope.row, 'edit')">修改</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize"
      :total="totalCount" layout="prev, pager, next" style="margin-top: 16px" />
    <!-- 单击显示弹窗 -->
    <el-dialog v-model="dialogVisible" title="详情内容" width="75%">
      <div class="clickDialog">
        <el-table :data="[selectedRow]" border>
          <el-table-column label="ID" prop="id" />
          <el-table-column label="祈福文字" prop="content" align="center">
            <template #default="{ row }">
              <div class="ellipsis-2">{{ row.text }}</div>
            </template>
          </el-table-column>
          <el-table-column label="祈福图片" width="100" prop="image" align="center">
            <template #default="{ row }">
              <div class="imageContainer">
                <img v-for="(item, index) in row.image" :key="index" :src="item" class="image-item" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <!-- 新增/修改侧边栏 -->
    <el-drawer v-model="dialogVisible2" :title="drawerJudge ? '编辑祈福内容' : '新增祈福内容'" size="55%">
      <el-form :model="editingRow" label-width="80px" ref="formRef">
        <el-form-item label="祈福文字" prop="content">
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
        <el-form-item label="祈福图片">
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
  onBeforeUnmount,
  shallowRef,
  onMounted,
  computed,
  reactive,
} from "vue";
import { ElMessageBox, ElMessage, ElLoading } from "element-plus";
import axios from "axios";
import { deleteImageAPI } from "~/api/index/index";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import {
  getAllPraysAPI,
  addPraysDataAPI,
  deletePraysDataAPI,
  updatePraysDataAPI,
} from "~/api/prays/index";
import baseUrl from "~/baseUrl";

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
import { getToken } from "~/composables/auth";

onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor;
};

// 定义响应式数据
const search = ref("");
const selectedRows = ref([]);
const dialogVisible = ref(false);
const selectedRow = ref(null);
// 临时变量
let imageUrl = ref([]);
const editingRow = ref({
  prayText: "",
  prayImageUrl: [],
  content: "", // 用于存储富文本内容
});

const currentPage = ref(1); // 当前页码，初始化为1
const pageSize = ref(10); // 每页显示的数据条数，初始化为10
const totalCount = ref(0); // 总记录数

//TODO:   获取全部祈福数据
const tableData = ref([]);
const getPrayData = () => {
  getAllPraysAPI({
    page: currentPage.value,
    pageSize: pageSize.value
  }).then((response) => {
    if (Array.isArray(response.data.data)) {
      tableData.value = response.data.data.map((item) => {
        return {
          ...item,
          image: JSON.parse(item.image),
        };
      });
      totalCount.value = response.totalCount;
    } else {
      console.error("接口返回的 data 不是数组:", response.data);
      ElMessage.error("祈福数据获取失败");
    }
  })
    .catch((error) => {
      console.error("获取祈福数据失败", error);
      ElMessage.error("获取祈福数据失败");
    });
};

onMounted(() => {
  getPrayData();
  console.log(imageUrl.value);

});
// 侧边栏
const dialogVisible2 = ref(false);
const drawerJudge = ref(false);
const handleDrawer = (row, data) => {
  dialogVisible2.value = true;
  if (data == "edit") {
    editingRow.value = { ...row };
    editingRow.value.content = editingRow.value.text;
    imageUrl.value = editingRow.value.image ? [...editingRow.value.image] : [];
    drawerJudge.value = true;
  } else {
    // 初始化新增的编辑行
    editingRow.value = {
      prayText: "",
      prayImageUrl: [],
      content: "",
    };
    imageUrl.value = []; // 重置图片URLs
    drawerJudge.value = false;
  }
};

// 确认按钮 - 编辑，这里暂不调用实际接口，仅模拟输出要传递的数据
const handleSaveEdit = () => {
  const editData = {
    id: editingRow.value.id,
    prayText: editingRow.value.prayText,
    prayImageUrl: imageUrl.value,
    content: editingRow.value.content, // 包含富文本内容
  };
  const proxyArray = editData.prayImageUrl;
  const normalArray = [...proxyArray];
  updatePraysDataAPI({
    id: editData.id,
    image: `["${normalArray.join('","')}"]`,
    content: editData.content,
  }).then((res) => {
    if (res.status == 200) {
      ElMessage.success("修改成功");
    } else {
      ElMessage.error("修改失败,请联系开发者");
    }
    getPrayData();
  });
  dialogVisible2.value = false;
};

// 确认按钮 - 新增，这里暂不调用实际接口，仅模拟输出要传递的数据
const handleSaveAdd = () => {
  const proxyArray = imageUrl.value;
  const normalArray = [...proxyArray];
  addPraysDataAPI({
    image: `["${normalArray.join('","')}"]`,
    content: editingRow.value.content,
  }).then((res) => {
    if (res.status == 200) {
      ElMessage.success("新增成功");
    } else {
      ElMessage.error("新增失败,请联系开发者");
    }
    getPrayData();
  });
  // 重新获取数据
  dialogVisible2.value = false;
};

// 清空按钮
const handleClearFilter = () => {
  search.value = "";
};

const handleSelectionChange = (rows) => {
  console.log(rows);
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
    deletePraysDataAPI({
      id: idsToDelete,
    }).then((res) => {
      if (res.status == 200) {
        ElMessage.success("删除成功");
      } else {
        ElMessage.error("删除失败,请联系开发者");
      }
      getPrayData();
    });
  } catch (error) {
    // 用户取消删除操作
  }
};

// 点击每行的功能
const handleRowClick = (row, column, event) => {
  // 判断点击的是否是选择框
  if (!event.target.closest(".el-checkbox__input")) {
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

// 删除图片事件
const deleteImage = (item, index, judge) => {
  const img = item.split("/").pop();
  if (index !== null) {
    deleteImageAPI({
      imageUrl: `http://${baseUrl}/prays/` + img,
    }).then((res) => {
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

// 增加图片
const addImage = async () => {
  const token = getToken();
  const authHeader = token ? `${token}` : ""
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
        `${baseUrl}/prays/uploadPraysImage`, //修改了上传地址 但是返回是admin？？？
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        imageUrl.value.push(response.data.imageUrl);
        console.log("🧩 当前 imageUrl 数组：", JSON.parse(JSON.stringify(imageUrl.value)));


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
        `http://${baseUrl}/prays/uploadPraysImage`,
        formData,

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

// 分页页码改变时的处理函数
// const handleCurrentChange = (newPage) => {
//   currentPage.value = newPage;
//   getPrayData();
// };
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
}

.table-header.el-input {
  width: 400px;
  margin-right: 10px;
  font-size: 14px;
}

.ellipsis-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
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

.imageContainer.addImage {
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

.image-item {
  width: 150px !important;
}
</style>