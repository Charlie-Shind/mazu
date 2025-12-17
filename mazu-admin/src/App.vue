<script setup>
import 'element-plus/theme-chalk/display.css'

</script>

<template>
  <router-view></router-view>
</template>

<style>
html {
  background-color: rgb(245, 245, 245);
}

#nprogress .bar {
  background-color: #f4f4f4 !important;
  height: 3px !important;
}

:root {
  --el-color-primary: #4667e7;
}
</style>
