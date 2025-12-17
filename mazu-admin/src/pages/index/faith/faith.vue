<template>
    <indexPublic apiCode="3"></indexPublic>
</template>

<script setup>
import indexPublic from "~/pages/index/components/indexPublic.vue";
// <el-table
//         border
//         :data="filterTableData"
//         :scrollbar-always-on="false"
//         style="width: 100%"
//         @selection-change="handleSelectionChange"
//         @row-click="handleRowClick"
//     >
//         <el-table-column type="selection" width="55" />
//         <el-table-column label="id" prop="id" width="50" align="center" />
//         <el-table-column label="标题" prop="title" width="200" align="center">
//             <template #default="{ row }">
//                 <div class="ellipsis-2">{{ row.title }}</div>
//             </template>
//         </el-table-column>
//         <el-table-column label="内容" prop="content" width="380" header-align="center">
//             <template #default="{ row }">
//                 <div class="ellipsis-2">{{ row.content }}</div>
//             </template>
//         </el-table-column>
//         <el-table-column label="发布时间" prop="time" width="210" align="center" />
//         <el-table-column prop="imageUrl" label="图片" width="180" align="center">
//             <template #default="{ row }">
//                 <div class="imageContainer">
//                     <img
//                         v-for="(item, index) in row.imageUrl"
//                         :key="index"
//                         :src="item"
//                         class="image-item"
//                     />
//                 </div>
//             </template>
//         </el-table-column>
//         <el-table-column label="分类" prop="grid" width="100" align="center" />
//         <el-table-column label="操作" align="center" width="85">
//             <template #default="scope">
//                 <el-button type="primary" plain @click.stop="handleEdit(scope.row)">修改</el-button>
//             </template>
//         </el-table-column>
//     </el-table>

//     <!-- 单击显示弹窗 -->
//     <el-dialog v-model="dialogVisible" title="详情内容" width="75%">
//         <div class="clickDialog">
//             <el-table :data="[selectedRow]" border>
//                 <el-table-column label="ID" prop="id" width="100" />
//                 <el-table-column label="标题" prop="title" width="200" />
//                 <el-table-column label="内容" prop="content" width="300" />
//                 <el-table-column label="发布时间" prop="time" width="210" />
//                 <el-table-column label="分类" prop="grid" width="100" />
//                 <el-table-column label="图片" width="200">
//                     <template #default="{ row }">
//                         <div class="imageContainer">
//                             <img
//                                 v-for="(item, index) in row.imageUrl"
//                                 :key="index"
//                                 :src="item"
//                                 class="image-item"
//                             />
//                         </div>
//                     </template>
//                 </el-table-column>
//             </el-table>
//         </div>
//     </el-dialog>
</script>

<style></style>

