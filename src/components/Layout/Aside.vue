<script setup lang="ts">
  import { onMounted } from "vue";
  import { useUserStore } from "@/store/user";
  import { openLoginDialog } from "@/hooks/useLoginDialog";
  import type { NavigationItem } from "@/types/item";
  import SocialNetwork from "@/components/SocialNetwork.vue";
  import AppLink from "@/components/AppLink.vue";
  import useHome from "@/composables/useHome";
  import { useStore } from "@/store";
  import { adsClick } from "@/api/advertisment";
  import { User } from "@element-plus/icons-vue";
  import { openPage } from "@/service";
  import { useRoute } from "vue-router";

  const userStore = useUserStore();

  defineEmits([
    "click-menu-item", // 点击选项
    "click-nav-item", // 点击选项
  ]);

  defineProps<{
    items: NavigationItem[];
    activeItem?: NavigationItem;
  }>();

  const store = useStore();

  const { getAdsPosition } = useHome();

  const itemClick = (item: EmptyObjectType) => {
    adsClick(item.id);
  };

  const route = useRoute();
  const onOpenPage = () => {
    const param = route.query.chan;
    openPage(`${store.configuration?.download_app_url}?chan=${param}`);
  };
  onMounted(() => {
    getAdsPosition(2);
  });
</script>

<template>
  <div class="aside flex flex-col gap-5">
    <SocialNetwork />
    <!-- 登录按钮 -->
    <el-button
      type="danger"
      size="large"
      round
      v-if="!userStore.isLogin"
      @click="openLoginDialog"
    >
      <span>登录</span>
    </el-button>

    <el-button
      type="warning"
      size="large"
      round
      style="margin: 0"
      @click="onOpenPage"
    >
      <span>App下载</span>
    </el-button>
    <!-- 浮动框 -->
    <!-- <div
      class="float-box"
      @click="openLoginDialog"
      v-if="!userStore.isLogin"
    >
      <span>马上登录即可</span>
      <span class="flex ga-2">
        <Pointer />
        刷到更懂你的优质内容
      </span>
      <span class="flex ga-2">
        <Position />
        搜索最新种草、拔草信息
      </span>
      <span class="flex ga-2">
        <Star />
        查看收藏、点赞笔记
      </span>
      <span class="flex ga-2">
        <ChatSquare />
        与他人更好地互动、交流
      </span>
    </div> -->
    <AppLink
      :apps="store?.recommendAds"
      v-if="store?.recommendAds?.length > 0"
      @item-click="itemClick"
    />

    <el-button
      v-if="userStore.isLogin"
      size="large"
      round
      @click="$router.push(`/user/${userStore.useId}`)"
    >
      <div class="flex gap-2 items-center">
        <User />

        <span>个人中心</span>
      </div>
    </el-button>
    <div v-else></div>
    <!-- <Dropdown
      @click-item="(item) => $emit('click-menu-item', item)"
      :items="dropDownItems3"
      placement="top-start"
      trigger="click"
    >
      <button>
        <MoreFilled />
        <span>更多</span>
      </button>
    </Dropdown> -->
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .aside {
    margin-top: 72px;
    margin-left: 16px;
    padding-top: 16px;
    display: flex;
    flex-direction: column;
    width: 270px;
    height: calc(100% - 72px);

    > :last-child {
      margin-top: auto;
      margin-bottom: 20px;
    }

    .mobile-mode({
      width: 0;
      display: none;
    });
  }

  // 登录按钮样式
  .login-btn {
    color: var(--background-color);
    background-color: var(--primary-color);
    justify-content: center;

    &:hover {
      color: var(--background-color) !important;
      background-color: var(--primary-color) !important;
    }
  }

  .float-box {
    padding: 16px;
    display: flex;
    flex-direction: column;

    border: 1px solid var(--border-color);
    border-radius: 16px;
    cursor: pointer;

    span {
      &:first-of-type {
        color: var(--text-color-dark);
        margin-bottom: 12px;
      }

      &:not(:last-of-type) {
        margin-bottom: 8px;
      }

      color: var(--text-color-light);
      font-size: 14px;
      line-height: 120%;

      svg {
        width: 14px;
        height: 14px;
        margin-right: 8px;
      }
    }
  }
</style>
