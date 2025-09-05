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
    path: "/notification",
    name: "Notification",
    component: () => import("@/views/Notification/index.vue"),
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
