<script setup lang="ts">
  import Aside from "./components/Layout/Aside.vue";
  import Header from "./components/Layout/Header.vue";
  import Footer from "./components/Layout/Footer.vue";
  import NoteDialog from "./views/Note/NoteDialog.vue";
  import LoginDialog from "./views/Login/LoginDialog.vue";
  import { listenResizeEvent } from "./hooks/useScreenMode";
  import {
    checkPermissions,
    initPermissions,
    setDefaultPermission,
    setDefaultRejectCallback,
  } from "./hooks/usePermisions";
  import { openLoginDialog } from "./hooks/useLoginDialog";
  import { useNoteDialog } from "./hooks/useNoteDialog";
  import { PERMISSION } from "./common/permision";
  import { computed, onBeforeMount, onMounted, ref, provide } from "vue";
  import type { NavigationItem } from "./types/item";
  import { NavigationItems } from "./common";
  import { openPage } from "./service";
  import { useRouter, useRoute } from "vue-router";
  import { useUserStore } from "./store/user";
  import { useStore } from "./store";
  import InstallPWA from "./components/global/InstallPWA.vue";
  import DialogPopupAds from "./components/DialogPopupAds.vue";
  import useHome from "./composables/useHome";

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const noteDialog = useNoteDialog();
  const store = useStore();
  const { generateVisitCode } = useHome();

  const scrollContainer = ref<HTMLElement | null>(null);
  provide("scrollContainer", scrollContainer);

  // 顶层组件监听屏幕大小变化
  listenResizeEvent();

  // 初始化权限
  const permissions = [PERMISSION.Visitor, PERMISSION.User];
  initPermissions(permissions);
  const storeUser = useUserStore();

  // 设置默认权限
  setDefaultPermission(
    storeUser.isLogin ? PERMISSION.User : PERMISSION.Visitor
  );

  // 设置默认拒绝回调
  setDefaultRejectCallback(openLoginDialog);

  // 导航索引
  const navigationItem = computed(
    () => NavigationItems.find((item) => item.mode === store.mode) || "0"
  );

  // 点击导航项
  const clickNavigationItem = (item: NavigationItem) => {
    if (item.type === "router-link") {
      if (item.mode == "0") {
        store.mode = "0";
        router.push("/");
      } else if (item.mode == "#") {
        checkPermissions(PERMISSION.User, () => {
          router.push({ path: `/user/${userStore.useId}` });
        });
      } else {
        console.log(item);
        store.mode = item.mode;
        // router.push(item.href);
      }
    } else {
      // openPage(item.href);
    }
  };

  onBeforeMount(async () => {
    // 尝试登录
    generateVisitCode();
    store.initMode();
    if (!storeUser.isLogin) {
      openLoginDialog();
    }
  });

  onMounted(() => {
    // 检查是否需要打开笔记
    // 延迟500ms后执行，因为此时路由查询参数可能还未更新
    setTimeout(() => {
      noteDialog.queryNoteDialogId();
    }, 500);
  });
</script>

<template>
  <div class="app-center-wrapper">
    <div class="app-container">
      <Header></Header>
      <Aside
        :items="NavigationItems"
        :active-item="navigationItem"
        @click-nav-item="clickNavigationItem"
      ></Aside>

      <div
        class="container"
        ref="scrollContainer"
      >
        <InstallPWA v-show="!userStore.loginDialogVisible" />
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>

      <Footer
        :items="NavigationItems"
        :active-item="navigationItem"
        @click-nav-item="clickNavigationItem"
      ></Footer>
      <NoteDialog></NoteDialog>
      <LoginDialog></LoginDialog>
      <DialogPopupAds
        v-if="!userStore.loginDialogVisible"
        :adverts="store.homePopupAds"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .app-center-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
  }

  .app-container {
    width: 100%;
    height: 100%;
    min-width: 375px;
    max-width: 1728px;
    display: flex;
    position: relative;
  }

  .container {
    width: 100%;
    height: calc(100% - 72px);
    margin-top: 72px;

    overflow-x: auto;
    scrollbar-width: none;
  }
</style>
