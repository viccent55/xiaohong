<script setup lang="ts">
  import ExploreContainer from "./comp/ExploreContainer.vue";
  import ExploreFloatSet from "./comp/ExploreFloatSet.vue";
  import ExploreChannelBar from "./comp/ExploreChannelBar.vue";
  import ExploreLoading from "./comp/ExploreLoading.vue";

  import { computed, onMounted, ref, watch } from "vue";
  import type { ExploreFLoatSetItem } from "@/types/item";
  import type { ExploreFeedInfo } from "@/types/info";
  import { getExploreFeeds, getConfiguration } from "@/api/explore";
  import { ExploreFloatSetItems } from "@/common";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { like } from "@/api/note";
  import { openPage } from "@/service";
  import { useUserStore } from "@/store/user";
  import { useStore } from "@/store/index";
  import { storeToRefs } from "pinia";
  import useHome from "@/composables/useHome";
  import { itemAdClick } from "@/api/advertisment";

  const noteDialog = useNoteDialog();

  // 当前频道
  const store = useStore();
  const { configuration, channel, mode } = storeToRefs(store);
  const indexChannel = ref<string>(channel.value);
  const feeds = ref<ExploreFeedInfo[]>([]);
  const floatItems = ref<ExploreFLoatSetItem[]>(ExploreFloatSetItems);
  const loading = ref(false);
  const page = ref(1);
  const isNoMore = ref(false);
  const isInitialLoading = ref(true);
  const { getAdsPosition, checkVisitor } = useHome();

  const backToTop = (smooth = true) => {
    const el = document.querySelector(".container");
    if (el) {
      el.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
    }
  };

  const storeUser = useUserStore();
  // 刷新列表
  const freshFeeds = () => {
    loading.value = true;
    if (!feeds.value?.length) {
      isInitialLoading.value = true;
    }
    backToTop(false);
    const request = {
      ...(store.mode !== "0"
        ? { mode: store.mode } // if mode != '0' → add only mode
        : channel.value !== "001"
        ? { category: Number(store.channel) } // else if channel != "001" → add category
        : {}),
      visitor: storeUser.visitCode,
      page: page.value,
      limit: 30,
    };
    getExploreFeeds(request).then((res) => {
      feeds.value = res.data;
      loading.value = false;
      isInitialLoading.value = false;
    });
  };
  watch(
    () => [mode.value, channel.value],
    ([newMode, newChannel], [oldMode, oldChannel]) => {
      if (newMode !== oldMode) {
        // handle mode change
        console.log("mode changed:", oldMode, "→", newMode);
      }
      if (newChannel !== oldChannel) {
        // handle channel change
        console.log("channel changed:", oldChannel, "→", newChannel);
        indexChannel.value = newChannel;
      }
      page.value = 1;
      freshFeeds();
    }
  );
  const handle = {
    // 加载更多列表
    loadMoreFeeds() {
      if (loading.value || isNoMore.value) return;
      loading.value = true;
      page.value++;
      const request = {
        visitor: storeUser.visitCode,
        page: page.value,
        limit: 30,
        ...(channel.value !== "001" && { category: Number(store.channel) }),
        ...(store.mode !== "0" && { mode: store.mode }),
      };
      getExploreFeeds(request).then((res) => {
        if (res.errcode === 0 && res.data.length > 0) {
          feeds.value = [...feeds.value, ...res.data];
        } else if (res.errcode == -1) {
          isNoMore.value = true;
        }
        loading.value = false;
      });
    },
    // 点击频道
    clickChannel(item: Record<string, string>) {
      indexChannel.value = item.value;
      store.channel = item.value;
      store.mode = "0";
      // freshFeeds();
    },
    // 点击浮动按钮
    clickFLoatItem(item: ExploreFLoatSetItem) {
      if (item.name === "goto-top") {
        return backToTop();
      }
      freshFeeds();
    },
    // 点击Feed
    clickFeed(item: ExploreFeedInfo) {
      if (item.mode === 3) {
        itemAdClick(item.id);
      } else {
        noteDialog.openNoteDialog(String(item.id));
      }
    },
    // 点击Like
    clickLike(item: ExploreFeedInfo) {
      checkPermissions(PERMISSION.User, () => {
        if (item.isLiked) {
          like(item.id).then((res) => {
            if (res.code !== 200) return;
            item.likeCount--;
            item.isLiked = false;
          });
        } else {
          like(item.id).then((res) => {
            if (res.code !== 200) return;
            item.likeCount++;
            item.isLiked = true;
          });
        }
      });
    },
    // 点击Author
    clickAuthor(item: ExploreFeedInfo) {
      openPage(`http://localhost:5173/user/${item.id}`);
    },
  };
  // 初始加载数据
  const initConfig = async () => {
    const response = await getConfiguration();
    if (response.errcode == 0) {
      store.configuration = response.data;
    }
  };
  const categories = computed(() => {
    return [
      {
        name: "发现",
        value: "001",
      },
      ...configuration.value.categories?.map((item: EmptyObjectType) => ({
        name: item.name,
        value: item.id,
      })),
    ];
  });

  onMounted(() => {
    checkVisitor();
    initConfig();
    freshFeeds();
    getAdsPosition(1);
  });
</script>

<template>
  <div class="explore-wrapper">
    <!-- 频道导航 -->
    <ExploreChannelBar
      :items="categories"
      :active-value="indexChannel"
      @click-item="handle.clickChannel"
    />

    <!-- Loading indicator for loading more -->
    <ExploreLoading :loading="loading && !isInitialLoading" />

    <!-- 列表 -->
    <ExploreContainer
      class="explore-container"
      :items="feeds"
      :is-loading="isInitialLoading"
      :is-load-more="loading"
      @get-more="handle.loadMoreFeeds"
      @click-item="handle.clickFeed"
    />
    <div
      class="flex justify-center text-xl py-2"
      v-if="isNoMore"
    >
      <el-empty
        :image-size="120"
        description="没有更多了"
      />
    </div>
    <!-- 浮动按钮 -->
    <ExploreFloatSet
      :items="floatItems"
      @click-item="handle.clickFLoatItem"
    />
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .explore-wrapper {
    width: 100%;
    height: 100%;
    padding: 0 24px;

    .pc-mode({
      padding: @pc-padding;
    });

    .pad-mode({
      padding: @pad-padding;
      padding-bottom: 48px;
    });

    .phone-mode({
      padding-bottom: 48px;
      padding: @phone-padding;
    });
  }
</style>
