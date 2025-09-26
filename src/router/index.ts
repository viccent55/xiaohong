import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: '/explore',
  // },
  {
    path: "/",
    name: "Explore",
    component: () => import("@/views/Explore/index.vue"),
  },
  {
    path: "/article",
    name: "Article",
    component: () => import("@/views/Article/index.vue"),
  },
  {
    path: "/anime",
    name: "Anime",
    component: () => import("@/views/Anime/index.vue"),
  },
  {
    path: "/creator",
    name: "Creator",
    component: () => import("@/views/Creator/index.vue"),
  },
  {
    path: "/user/:id",
    name: "User",
    component: () => import("@/views/User/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
