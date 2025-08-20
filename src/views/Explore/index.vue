<script setup lang="ts">
  import ExploreContainer from "./comp/ExploreContainer.vue";
  import ExploreFloatSet from "./comp/ExploreFloatSet.vue";
  import ExploreChannelBar from "./comp/ExploreChannelBar.vue";
  import ExploreFeed from "./comp/ExploreFeed.vue";
  import ExploreLoading from "./comp/ExploreLoading.vue";

  import { computed, onMounted, onUnmounted, ref } from "vue";
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

  const noteDialog = useNoteDialog();

  // 当前频道
  const store = useStore();
  const { configuration } = storeToRefs(store);
  const category = configuration.value.categories[0];
  const channel = ref<string>(category?.name);
  const feeds = ref<ExploreFeedInfo[]>([]);
  const floatItems = ref<ExploreFLoatSetItem[]>(ExploreFloatSetItems);
  const loading = ref(false);
  const onlyPic = computed(() => {
    return floatItems.value.some(
      (item) => item.label === "goto-top" && item.active
    );
  });
  // Note: These variables appear to be unused.
  // const freshFeedNum = 15; // 每次刷新数量
  // const loadMoreNum = 5; // 每次加载更多数量

  // --- Start of changes for masonry layout ---

  const numColumns = ref(4);
  const columns = computed(() => {
    const result: ExploreFeedInfo[][] = Array.from(
      { length: numColumns.value },
      () => []
    );
    feeds.value.forEach((feed, index) => {
      result[index % numColumns.value].push(feed);
    });
    return result;
  });

  const calculateColumns = () => {
    const width = window.innerWidth;
    if (width > 1600) numColumns.value = 6;
    else if (width > 1200) numColumns.value = 5;
    else if (width > 992) numColumns.value = 4;
    else if (width > 768) numColumns.value = 3;
    else numColumns.value = 2;
  };

  onUnmounted(() => {
    window.removeEventListener("resize", calculateColumns);
  });

  // --- End of changes for masonry layout ---

  // 回到顶部
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
    backToTop(false);
    const request = {
      visitorCode: storeUser.visitCode,
      videos_id: storeUser.videos_id,
      galleries_id: "",
      video_offset: "",
      gallery_offset: "",
    };
    getExploreFeeds(request).then((res) => {
      if (res.data.videos_id) {
        storeUser.videos_id = res.data.videos_id;
      }
      feeds.value = res.data.data;
      loading.value = false;
    });
  };

  const handle = {
    // 加载更多列表
    loadMoreFeeds() {
      getExploreFeeds({
        visitorCode: storeUser.visitCode,
        videos_id: storeUser.videos_id,
        galleries_id: "",
        video_offset: "",
        gallery_offset: "",
      }).then((res) => {
        if (res.data.videos_id) {
          storeUser.videos_id = res.data.videos_id ?? "";
        }
        if (res.data?.data.length > 0) {
          feeds.value.push(...res.data.data);
        }
      });
    },
    // 点击频道
    clickChannel(item: Record<string, string>) {
      channel.value = item.name;
      freshFeeds();
    },
    // 点击浮动按钮
    clickFLoatItem(item: ExploreFLoatSetItem) {
      if (item.label === "goto-top") {
        return backToTop();
      }
      freshFeeds();
    },
    // 点击Feed
    clickFeed(item: ExploreFeedInfo) {
      noteDialog.openNoteDialog(String(item.id));
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
  onMounted(() => {
    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    initConfig();
    freshFeeds();
  });
</script>

<template>
  <div class="explore-wrapper">
    <!-- 频道导航 -->

    <ExploreChannelBar
      :items="configuration.categories"
      :active-value="channel"
      @click-item="handle.clickChannel"
    />

    <!-- 加载 -->
    <ExploreLoading :loading="loading" />

    <!-- 列表 -->
    <ExploreContainer
      class="explore-container"
      @get-more="handle.loadMoreFeeds"
    >
      <div
        class="explore-column"
        v-for="(column, index) in columns"
        :key="`column-${index}`"
      >
        <template
          v-for="feed in column"
          :key="feed.id"
        >
          <ExploreFeed
            :feed="feed"
            @click="handle.clickFeed(feed)"
            @click-like="handle.clickLike(feed)"
            @click-author="handle.clickAuthor(feed)"
          />
        </template>
      </div>
    </ExploreContainer>

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

    .explore-container {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 24px;
    }

    .explore-column {
      display: flex;
      flex-direction: column;
      flex: 1 1 0;
      gap: 16px;
    }

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
