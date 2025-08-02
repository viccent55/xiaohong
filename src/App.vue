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
  import { computed, onBeforeMount, onMounted } from "vue";
  import type { DropdownItem, NavigationItem } from "./types/item";
  import { NavigationItems } from "./common";
  import { openPage } from "./service";
  import { useRouter, useRoute } from "vue-router";
  import { useUserStore } from "./store/user";
  import { useStore } from "./store";

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const noteDialog = useNoteDialog();
  const store = useStore();

  // 顶层组件监听屏幕大小变化
  listenResizeEvent();

  // 初始化权限
  const permissions = [PERMISSION.Visitor, PERMISSION.User];
  initPermissions(permissions);

  // 设置默认权限
  setDefaultPermission(PERMISSION.Visitor);

  // 设置默认拒绝回调
  setDefaultRejectCallback(openLoginDialog);

  // 导航索引
  const navigationItem = computed(() => {
    return (
      NavigationItems.find((item) => item.href === route.path) ||
      (route.path == `/user/${userStore.useId}`
        ? NavigationItems[3]
        : undefined) ||
      undefined
    );
  });

  // 点击导航项
  const clickNavigationItem = (item: NavigationItem) => {
    if (item.type === "router-link") {
      if (item.href !== "/explore") {
        checkPermissions(PERMISSION.User, () => {
          if (item.href == "/user")
            router.push({ path: `${item.href}/${userStore.useId}` });
          else router.push(item.href);
        });
      } else {
        router.push(item.href);
      }
    } else {
      openPage(item.href);
    }
  };

  // 点击菜单项
  const clickDropdownItem = (item: DropdownItem) => {
    console.log(item);

    if (item.label === "退出登录") {
      useUserStore().logout();
    } else {
      openPage("https://www.xiaohongshu.com");
    }
  };

  onBeforeMount(async () => {
    // 尝试登录
    store.initMode();
    userStore.login();
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
      <Header @click-menu-item="clickDropdownItem"></Header>
      <Aside
        :items="NavigationItems"
        :active-item="navigationItem"
        @click-menu-item="clickDropdownItem"
        @click-nav-item="clickNavigationItem"
      ></Aside>

      <div class="container">
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
