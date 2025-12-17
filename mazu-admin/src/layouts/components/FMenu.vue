<template>
  <el-aside class="f-menu">
    <el-menu
      :default-active="defaultActive"
      class="el-menu-vertical-demo"
      :collapse-transition="false"
      :collapse="store.state.isCollapse"
      router
      :unique-opened="true"
    >
      <template v-for="(item, index) in menuList" :key="item.path">
        <el-sub-menu :index="item.path" v-if="item.children">
          <template #title>
            <el-icon>
              <component :is="item.meta.icon" />
            </el-icon>
            <span>{{ item.meta.title }}</span>
          </template>
          <el-menu-item
            :index="list.path"
            :key="list.path"
            v-for="(list, index) in item.children"
          >
            <el-icon>
              <component :is="list.meta.icon" />
            </el-icon>
            <span>{{ list.meta.title }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="'/' + item.path" v-else>
          <el-icon>
            <component :is="item.meta.icon" />
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </el-aside>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
// 获取路由信息
import routes from "~/router/index";
const router = useRouter();
const store = useStore();
const route = useRoute();

// 监听路由变化,更新 defaultActive
const defaultActive = ref(route.path);
watch(
  () => route.path,
  (newPath) => {
    defaultActive.value = newPath;
  }
);
// 菜单数据
const menuList = routes[0].children;
</script>
<style>
.f-menu {
  transition: all 0.3s;
  top: 64px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  @apply shadow-md fixed bg-light-50;
}

.f-menu::-webkit-scrollbar {
  width: 0px;
}

.el-menu {
  border: none !important;
}

.el-menu-item,
.el-sub-menu {
  border-radius: 10px;
  width: 90%;
  margin: auto;
  margin-bottom: 5px;
}

.el-sub-menu .el-menu-item {
  min-width: 100%;
  margin-bottom: 5px;
}

.el-sub-menu__title {
  border-radius: 10px;
  margin-bottom: 5px;
}

/* 选中菜单项的背景色 */
.el-menu-item.is-active {
  background-color: #4667e7 !important;
  color: #fff !important;
  border-radius: 10px;
}

/* 展开的子菜单背景色 */
.el-sub-menu.is-active .el-sub-menu__title {
  /* background-color: rgba(59, 130, 246, 0.1); */
  /* color: #000 !important; */
  color: #4667e7;
  font-weight: 500;
}
</style>
