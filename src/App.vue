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
  import { PERMISSION } from "@/common/permision";

  import { computed, onBeforeMount, onMounted, provide, ref } from "vue";
  import type { NavigationItem } from "./types/item";
  import { NavigationItems } from "./common";
  import { useUserStore } from "./store/user";
  import InstallPWA from "./components/global/InstallPWA.vue";
  import DialogPopupAds from "./components/DialogPopupAds.vue";

  import AnalyticsLoader from "@/components/AnalyticsLoader.vue";
  import useVariable from "./composables/useVariable";
  import useHome from "./composables/useHome";
  import { getConfiguration } from "@/api/getMethod";
  import NotificationDialog from "./components/NotificationDialog.vue";

  const { router, store, platform } = useVariable();
  const userStore = useUserStore();
  const noteDialog = useNoteDialog();
  const { generateVisitCode, initVisitor } = useHome();
  const allAdsClosed = ref(false);
  const scrollContainer = ref<HTMLElement | null>(null);
  const notificationDialogRef = ref<InstanceType<typeof NotificationDialog>>();
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
    () =>
      NavigationItems.find((item) => item.mode === store?.mode) ??
      NavigationItems[0]
  );

  // 点击导航项
  const clickNavigationItem = (item: NavigationItem) => {
    if (item.type === "router-link") {
      if (item.mode != "#") {
        store.mode = item.mode;
        store.channel = "001";
        router.push("/");
      } else {
        checkPermissions(PERMISSION.User, () => {
          store.mode = item.mode;
          router.push({ path: `/user/${userStore.useId}` });
        });
      }
    } else {
      // openPage(item.href);
    }
  };

  const reloadPage = () => {
    window.location.reload();
  };
  const initializeApp = async () => {
    const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour
    try {
      store.initMode();
      const response = await getConfiguration();
      if (response.errcode == 0) {
        store.configuration = response.data;
        localStorage.removeItem("lastNotificationTimestamp");
      }
      // If initMode is successful, check for login
      if (!userStore.isLogin) {
        openLoginDialog();
      }
    } catch (error) {
      console.error("Server is down or initial fetch failed:", error);
      const now = Date.now();
      const lastShown = localStorage.getItem("lastNotificationTimestamp");
      if (!lastShown || now - Number(lastShown) > NOTIFICATION_COOLDOWN) {
        notificationDialogRef.value?.open();
        localStorage.setItem("lastNotificationTimestamp", String(now));
      }
      allAdsClosed.value = false;
    }
  };

  onBeforeMount(async () => {
    if (!storeUser.visitCode) {
      generateVisitCode();
    } else {
      initVisitor();
    }
    initializeApp();
  });
  onMounted(async () => {
    // Check if the note needs to be opened
    // Execute after a 500ms delay, as the route query parameters may not have been updated at this time
    setTimeout(() => {
      noteDialog.queryNoteDialogId();
    }, 500);
  });
  // 初始加载数据
</script>

<template>
  <div class="app-center-wrapper">
    <div class="app-container">
      <Header></Header>
      <Aside
        :items="NavigationItems"
        @click-nav-item="clickNavigationItem"
      ></Aside>

      <div
        class="container"
        :class="
          platform === 'ios'
            ? 'isIos'
            : platform === 'android'
            ? 'isAndroid'
            : ''
        "
        ref="scrollContainer"
      >
        <router-view v-slot="{ Component }">
          <keep-alive include="Explore">
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
      <NotificationDialog
        ref="notificationDialogRef"
        @retry="reloadPage"
      />
      <DialogPopupAds
        v-if="!userStore.loginDialogVisible"
        :adverts="store.homePopupAds"
        @all-ads-closed="allAdsClosed = true"
      />
      <InstallPWA
        v-if="allAdsClosed"
        v-show="!userStore.loginDialogVisible"
      />
      <AnalyticsLoader :analytics="store.configuration?.analytics" />
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
    // height: 100%;
    margin-top: var(--header-height, 72px);
    overflow-y: auto;
    overflow-x: auto;
    z-index: 0;
    scrollbar-width: none;

    .mobile-mode({
      /* Account for the mobile footer height */
      padding-bottom: var(--footer-height-mobile, 48px);
    });
  }
</style>
