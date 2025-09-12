<script setup lang="ts">
  import { useStore } from "@/store";
  import { computed, ref } from "vue";
  import DialogInfo from "../DialogInfo.vue";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { Download } from "@element-plus/icons-vue";
  import usePWA from "@/composables/usePWA";
  import GuideIos from "../global/GuideIos.vue";
  import { useRoute } from "vue-router";
  import { openPage } from "@/service/index";
  import { adsClick } from "@/api/advertisment";
  import AppLink from "../AppLink.vue";

  const store = useStore();
  const emits = defineEmits(["click-menu-item"]);

  const toggleDarkMode = () => {
    store.toggleDarkMode();
  };

  const menuItems = computed(() => {
    const links = store.configuration?.header_menu_link || ""; // fallback empty string
    return links
      .split("\n")
      .filter((line: string) => line.includes("|")) // avoid bad lines
      .map((line: string) => {
        const [name, page] = line.split("|");
        return { name: name.trim(), page: page.trim() };
      });
  });

  const dialgInfo = ref();
  const openLoginDialog = (item: Record<string, string>) => {
    dialgInfo.value.open(item);
  };
  const categories = computed(() => {
    return [
      {
        name: "发现",
        value: "001",
      },
      ...store.configuration?.categories?.map((item: EmptyObjectType) => ({
        name: item.name,
        value: item.id,
      })),
    ];
  });
  const clickMenuItem = (item: Record<string, string>) => {
    store.channel = item.value;
  };
  const searchDisabled = ref(false);
  const onFocusSearch = () => {
    if (searchDisabled.value) return;

    checkPermissions(PERMISSION.User, () => {});
  };
  const route = useRoute();
  const onOpenPage = () => {
    const param = route.query.chan || "";
    const urlParams = new URLSearchParams(window.location.search);
    const chan = urlParams.get("chan"); // "cgtt"
    openPage(`${store.configuration?.download_app_url}?chan=${chan || param}`);
  };
  const { isIOS, onInstall, dialogIosGuide, openDialogIos } = usePWA();
  const dialogVisible = ref(false);
  const openAds = () => {
    dialogVisible.value = true;
  };
  const handleClose = () => {
    dialogVisible.value = false;
  };

  const itemClick = (item: EmptyObjectType) => {
    adsClick(item.id);
  };
</script>

<template>
  <div class="header">
    <!-- prettier-ignore -->
    <a href="/"><img src="/logo.png" alt="logo" /></a>

    <div class="input-wrapper">
      <input
        :disabled="searchDisabled"
        v-model.trim="store.search"
        type="text"
        @focus="onFocusSearch"
        @keydown.enter="onFocusSearch"
        placeholder="搜索"
      />
      <div class="search-icon">
        <el-icon><Search /></el-icon>
      </div>
    </div>
    <div class="button-wrapper">
      <!-- Dark mode toggle -->
      <el-button
        class="mr-1"
        circle
        @click="toggleDarkMode"
        title="切换主题"
        style="width: 40px"
      >
        <el-icon v-if="store.isDarkmode === 'light'"><Moon /></el-icon>
        <el-icon v-else><Sunny /></el-icon>
      </el-button>
      <!-- >960 -->
      <div class="flex">
        <button
          v-for="(item, index) in menuItems"
          :key="index"
          @click="openLoginDialog(item)"
        >
          {{ item.name }}
        </button>
      </div>

      <!-- <960 -->
      <el-dropdown trigger="click">
        <button class="more-btn">
          <el-icon><MoreFilled /></el-icon>
        </button>
        <template #dropdown>
          <el-dropdown-menu class="custom-dropdown">
            <el-dropdown-item
              v-for="(item, index) in categories"
              :key="index"
              @click="clickMenuItem(item)"
            >
              <span class="px-3 py-1 text-base">{{ item.name }}</span>
            </el-dropdown-item>
            <el-divider style="margin: 6px 0"></el-divider>
            <el-dropdown-item>
              <!-- iOS Instructions -->
              <div
                v-if="isIOS"
                class="text-base px-3 py-1"
                @click="openDialogIos"
              >
                安装到桌面
              </div>

              <!-- Android/Desktop Prompt -->
              <div
                v-else
                class="buttons px-3 py-1"
                @click="onInstall"
              >
                安装到桌面
              </div>
              <el-icon><Download /></el-icon>
            </el-dropdown-item>
            <el-dropdown-item>
              <span
                class="text-base px-3 py-1"
                @click="onOpenPage"
              >
                下载app
              </span>
            </el-dropdown-item>
            <el-divider style="margin: 6px 0"></el-divider>
            <el-dropdown-item
              v-for="(item, index) in [
                ...menuItems,
                { name: '福利应用', page: 'ads' },
              ]"
              :key="index"
              @click="item.page === 'ads' ? openAds() : openLoginDialog(item)"
            >
              <span
                class="text-base px-3 py-1"
                :key="index"
              >
                {{ item.name }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- <Dropdown
        @click-item="clickMenuItem"
        :items="categories"
        placement="bottom-end"
        trigger="click"
      >
        <button class="more-btn">
          <el-icon><MoreFilled /></el-icon>
        </button>
      </Dropdown> -->
    </div>

    <DialogInfo ref="dialgInfo" />
    <GuideIos ref="dialogIosGuide" />
    <el-dialog
      v-model="dialogVisible"
      width="320px"
      append-to-body
      align-center
      :before-close="handleClose"
    >
      <template #title>
        <div class="text-center">推荐福利应用</div>
      </template>
      <AppLink
        class="mt-2"
        :apps="store?.recommendAds"
        v-if="store?.recommendAds?.length > 0"
        @item-click="itemClick"
        height="100%"
      />
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .header {
    z-index: 10;
    width: 100%;
    max-width: 1728px; // Match .app-container max-width
    height: 72px;
    background-color: var(--background-color);
    display: flex;
    padding: 0 16px 0 16px;
    align-items: center;
    position: fixed;
    top: 0;
    gap: 5px;
    justify-content: space-between;
  }

  a {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      height: 32px;
    }
  }

  .input-wrapper {
    width: 50%;
    min-width: 200px;
    max-width: 500px;
    height: 40px;
    .btn-base();
    background-color: var(--background-color-dark);
    display: flex;

    input {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      outline: none;
      cursor: text;
    }

    .search-icon {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      margin-left: 20px;
      // cursor: pointer;

      :hover {
        color: var(--text-color-dark);
      }
    }
  }

  button {
    .btn-base();

    &:hover {
      color: var(--text-color-dark);
      background-color: var(--background-color-dark);
    }
  }

  .dark-mode-btn {
    border-radius: 50%;
    padding: 8px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      font-size: 18px;
    }
  }

  .more-btn {
    border-radius: 50%;
    padding: 12px;
  }

  .button-wrapper {
    display: flex;
    align-items: center;

    > :nth-child(2),
    > {
      .mobile-mode({
        display: none;
      });
    }

    > :nth-child(3) {
      .pc-mode({
        display: none;
      });
    }
  }
  .custom-dropdown {
    min-width: 170px; /* adjust as needed */
  }
</style>
