<template>
    <div class="f-header">
        <div class="logo">
            <img src="../../assets/logo2.png" alt="">
            福泽海韵
        </div>
        <el-icon class="icon-btn" @click="$store.commit('handleAsideWidth')">
            <fold v-if="$store.state.asideWidth == '250px'" />
            <Expand v-else />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh />
            </el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <full-screen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>

            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-dark-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.imageUrl" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>

</template>
<script setup>
import { ref, inject } from "vue";
import FormDrawer from '~/components/FormDrawer.vue'
import { useFullscreen } from '@vueuse/core'
import { useRepassword, useLogout } from "~/composables/useManager"
import { useStore } from 'vuex'
const store = useStore()

const {
    // 是否全屏状态
    isFullscreen,
    // 切换全屏
    toggle
} = useFullscreen()

const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm
} = useRepassword()

const {
    handleLogout
} = useLogout()

const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            openRePasswordForm()
            break;
    }
}

// 刷新
const handleRefresh = () => location.reload()

</script>
<style>
.f-header {
    @apply flex items-center text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
    background-color: #8774f4;
    background-color: #fff;
    color: rgb(74, 74, 74);
    z-index: 999;
}

.logo {
    width: 200px;
    padding: 0 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-weight: bold;
    font-size: 26px;
    cursor: pointer;
}

.logo img {
    border-radius: 5px;
    max-width: 40px;
    height: 40px;
    /* margin: 0 20px; */
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    /* @apply bg-indigo-600; */
    background-color: #4667e7;
    color: #fff;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>