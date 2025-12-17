import { createRouter, createWebHashHistory } from "vue-router";

// 共享主页
import AllIndex from "~/pages/index.vue"

import Login from "~/pages/login.vue";
import NotFound from "~/pages/404.vue";
import Admin from "~/layouts/admin.vue";

// import Index from "~/pages/index/index.vue";
import News from "~/pages/index/news/news.vue"
import Home from "~/pages/home.vue"
import FuCulture from "~/pages/index/fuCulture/fuCulture.vue"
import cultureCreativity from "~/pages/index/cultureCreativity/cultureCreativity.vue"
import faith from "~/pages/index/faith/faith.vue"
import mazuCulture from "~/pages/index/mazuCulture/mazuCulture.vue"
import placeTemple from "~/pages/index/placeTemple/placeTemple.vue"
import publication from "~/pages/index/publication/publication.vue"
import tourism from "~/pages/index/tourism/tourism.vue"

import Prays from "~/pages/prays/index.vue"

import MinUser from "~/pages/user/minUser/index.vue"
import AdminUser from "~/pages/user/adminUser/index.vue"

import Post from "~/pages/community/post/index.vue"
import Topic from "~/pages/community/topic/index.vue"

import Order from "~/pages/shop/order/index.vue"
import Goods from "~/pages/shop/goods/index.vue"

// 默认路由, 所有用户共享
const routes = [
  {
    path: "/",
    name: "admin",
    component: Admin,
    redirect: "home",
    children: [
      {
        path: "home",
        name: "home",
        component: Home,
        meta: {
          title: "后台首页",
          icon: "House"
        },
      },
      // 主页设置
      {
        path: "index",
        name: "Index",
        component: AllIndex,
        meta: {
          title: "主页设置",
          icon: "Edit"
        },
        children: [
          {
            path: "/index/news",
            name: "News",
            component: News,
            meta: {
              title: "新闻中心",
              icon: "Edit"
            },
          },
          {
            path: "/index/fuCulture",
            name: "FuCulture",
            component: FuCulture,
            meta: {
              title: "福文化",
              icon: "Edit"
            },
          },
          {
            path: "/index/faith",
            name: "faith",
            component: faith,
            meta: {
              title: "信俗活动",
              icon: "Edit"
            },
          },
          {
            path: "/index/mazuCulture",
            name: "mazuCulture",
            component: mazuCulture,
            meta: {
              title: "妈祖文化",
              icon: "Edit"
            },
          },
          {
            path: "/index/placeTemple",
            name: "placeTemple",
            component: placeTemple,
            meta: {
              title: "天下宫庙",
              icon: "Edit"
            },
          },
          {
            path: "/index/publication",
            name: "publication",
            component: publication,
            meta: {
              title: "数字出版",
              icon: "Edit"
            },
          },
          {
            path: "/index/cultureCreativity",
            name: "cultureCreativity",
            component: cultureCreativity,
            meta: {
              title: "妈祖文创",
              icon: "Edit"
            },
          },
          {
            path: "/index/tourism",
            name: "tourism",
            component: tourism,
            meta: {
              title: "两岸旅游",
              icon: "Edit"
            },
          },
        ]
      },
      // 祈福数据
      {
        path: "prays",
        name: "Prays",
        component: Prays,
        meta: {
          title: "祈福数据",
          icon: "MagicStick"
        },
      },
      // 商城管理
      {
        path: "shop",
        name: "Shop",
        component: AllIndex,
        meta: {
          title: "商城管理",
          icon: "ShoppingCart"
        },
        children: [
          {
            path: "/shop/goods",
            name: "Goods",
            component: Goods,
            meta: {
              title: "商品管理",
              icon: "Goods"
            },
          },
          {
            path: "/shop/order",
            name: "Order",
            component: Order,
            meta: {
              title: "订单列表",
              icon: "Notification"
            },
          },
        ]
      },
      // 社区管理
      {
        path: "community",
        name: "Community",
        component: AllIndex,
        meta: {
          title: "社区管理",
          icon: "PictureRounded"
        },
        children: [
          {
            path: "/community/topic",
            name: "Topic",
            component: Topic,
            meta: {
              title: "社区话题",
              icon: "WindPower"
            },
          },
          {
            path: "/community/post",
            name: "Post",
            component: Post,
            meta: {
              title: "帖子管理",
              icon: "Monitor"
            },
          },
        ]
      },
      // 用户管理
      {
        path: "user",
        name: "User",
        component: AllIndex,
        meta: {
          title: "用户管理",
          icon: "User"
        },
        children: [
          {
            path: "/user/minUser",
            name: "MinUser",
            component: MinUser,
            meta: {
              title: "小程序用户",
              icon: "Orange"
            },
          },
          {
            path: "/user/adminUser",
            name: "AdminUser",
            component: AdminUser,
            meta: {
              title: "系统用户",
              icon: "Coin"
            },
          },
        ]
      },
    ],
  },
  {
    path: "/login",
    component: Login,
    meta: {
      title: "登录页",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: NotFound,
  },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default routes; 
