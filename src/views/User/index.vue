<script setup lang="ts">
  import * as Api from "@/api/note";
  import UserInfo from "./UserInfo.vue";
  import ExploreChannelBar from "../Explore/comp/ExploreChannelBar.vue";
  import ExploreFeed from "../Explore/comp/ExploreFeed.vue";
  import ExploreFeedSkeleton from "../Explore/comp/ExploreFeedSkeleton.vue";
  import {
    computed,
    onMounted,
    onUnmounted,
    ref,
    inject,
    nextTick,
    watch,
  } from "vue";
  import { useRoute } from "vue-router";
  import type { ExploreChannelItem } from "@/types/item";
  import { UserChannelItems } from "@/common";
  import {
    getLikeFeeds,
    getNoteFeeds,
    getStarFeeds,
    getUserInfo,
  } from "@/api/user";
  import type { ExploreFeedInfo, UserDetailInfo } from "@/types/info";
  import { report } from "@/api/note";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import MasonryWall from "@yeger/vue-masonry-wall";
  import useVariable from "@/composables/useVariable";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { useStore } from "@/store";

  const backgroundImage = ref(
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2670&auto=format&fit=crop"
  );

  const route = useRoute();
  const noteDialog = useNoteDialog();
  const scrollContainer: any = inject("scrollContainer");
  const { updateColumnWidth, columnWidth, gap, feedsContainer } = useVariable();

  const channel = ref<string>(UserChannelItems[0].value);
  const userInfo = ref(<UserDetailInfo>{});
  const id = computed(() => Number(route.params.id));
  const page = ref(1);
  const isLoadMore = ref(false);

  // 笔记列表
  const noteFeeds = ref<EmptyObjectType[]>([]);
  const isNoMore = ref(false);
  // 收藏列表
  const starFeeds = ref<ExploreFeedInfo[]>([]);
  const likesFeeds = ref<EmptyObjectType[]>([]);
  // 展示列表
  const showFeeds = computed(() => {
    if (channel.value == "note") {
      return noteFeeds.value;
    } else if (channel.value == "star") {
      return starFeeds.value;
    } else if (channel.value == "like") {
      return likesFeeds.value;
    }
    return [];
  });
  const getRes = {
    noteFeeds() {
      if (isLoadMore.value) return;
      isLoadMore.value = true;
      const request = {
        id: id.value,
        page: page.value,
      };
      getNoteFeeds(request)
        .then((res) => {
          if (res.errcode !== 0) return;
          noteFeeds.value = [...noteFeeds.value, ...res.data];
          if (!res.data.length) {
            isNoMore.value = true;
          }
        })
        .finally(() => {
          isLoadMore.value = false;
        });
    },
    starFeeds() {
      // 获取收藏
      if (isLoadMore.value) return;
      isLoadMore.value = true;
      const request = {
        id: id.value,
        page: page.value,
      };
      getStarFeeds(request)
        .then((res) => {
          if (res.errcode !== 0) return;
          starFeeds.value = [...starFeeds.value, ...res.data];
          if (!res.data.length) {
            isNoMore.value = true;
          }
        })
        .finally(() => {
          isLoadMore.value = false;
        });
    },
    likeFeeds() {
      if (isLoadMore.value) return;
      isLoadMore.value = true;
      const request = {
        id: id.value,
        page: page.value,
      };
      getLikeFeeds(request)
        .then((res) => {
          if (res.errcode !== 0) return;
          likesFeeds.value = [...likesFeeds.value, ...res.data];
          if (!res.data.length) {
            isNoMore.value = true;
          }
        })
        .finally(() => {
          isLoadMore.value = false;
        });
    },
  };

  const handle = {
    clickChannel(item: ExploreChannelItem) {
      channel.value = item.value;
    },
    clickFollow(user: UserDetailInfo) {
      console.log("关注", id.value);
      checkPermissions(PERMISSION.User, () => {
        Api.follow(id.value).then((res) => {
          if (res.errcode !== 0) return;
          user.isFollow = !user.isFollow;
        });
      });
    },
    clickReport(user: UserDetailInfo) {
      report(user.id);
    },
    clickFeed(feed: EmptyObjectType) {
      noteDialog.openNoteDialog(feed.id);
    },
  };

  const onLoadMore = () => {
    if (channel.value == "note") {
      if (isLoadMore.value || isNoMore.value) return;
      page.value++;
      getRes.noteFeeds();
    } else if (channel.value === "star") {
      if (isLoadMore.value || isNoMore.value) return;
      page.value++;
      getRes.starFeeds();
    } else if (channel.value === "like") {
      if (isLoadMore.value || isNoMore.value) return;
      page.value++;
      getRes.likeFeeds();
    }
  };
  const onInit = () => {
    getUserInfo(id.value).then((res) => {
      userInfo.value = JSON.parse(JSON.stringify(res));
    });
    getRes.noteFeeds();
  };
  watch(
    () => id.value,
    () => {
      page.value = 1;
      onInit();
    }
  );
  watch(
    () => channel.value,
    (val) => {
      page.value = 1;
      isNoMore.value = false;
      if (val == "note") {
        noteFeeds.value = [];
        getRes.noteFeeds();
      } else if (val == "star") {
        starFeeds.value = [];
        getRes.starFeeds();
      } else if (val == "like") {
        likesFeeds.value = [];
        getRes.likeFeeds();
      }
    }
  );
  onMounted(() => {
    nextTick(() => {
      updateColumnWidth();
    });
    window.addEventListener("resize", updateColumnWidth);
    onInit();
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateColumnWidth);
  });

  const skeletonItems = computed(() => Array.from({ length: 10 }));
  const store = useStore();
</script>

<template>
  <div class="user-page-wrapper">
    <!-- Full-width background container -->
    <div
      class="user-background"
      :style="{
        backgroundImage: `url(${store?.configuration?.member_center_background})`,
      }"
    ></div>

    <!-- Centered content container -->
    <div class="user-content-container">
      <div class="user-content">
        <UserInfo
          :user="userInfo"
          @click-follow="handle.clickFollow"
          @click-report="handle.clickReport"
          @refresh="onInit"
        />
        <div class="channel-wrpper">
          <ExploreChannelBar
            :items="UserChannelItems"
            :active-value="channel"
            @click-item="handle.clickChannel"
          />
        </div>

        <el-divider />
        <div
          class="feeds-container"
          v-infinite-scroll="onLoadMore"
          infinite-scroll-distance="300"
        >
          <div ref="feedsContainer">
            <MasonryWall
              v-if="showFeeds?.length > 0"
              :items="showFeeds ?? []"
              :column-width="columnWidth"
              :gap="gap"
              item-key="id"
              :scroll-container="scrollContainer"
              :layout-animation-duration="500"
            >
              <template #default="{ item }">
                <ExploreFeed
                  :feed="item"
                  @click="handle.clickFeed(item)"
                />
              </template>
            </MasonryWall>
            <!-- Loading indicator for loading more -->
            <MasonryWall
              v-if="isLoadMore"
              :items="skeletonItems"
              :column-width="columnWidth"
              :gap="gap"
            >
              <template #default>
                <ExploreFeedSkeleton />
              </template>
            </MasonryWall>
          </div>
          <div
            class="flex justify-center text-xl py-2"
            v-if="isNoMore || !showFeeds.length"
          >
            <el-empty
              :image-size="120"
              description="没有更多了"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .user-page-wrapper {
    position: relative;
    width: 100%;
  }

  .user-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 300px; /* Or the height you want for the background */
    background-size: cover;
    background-position: center;
    z-index: 0;
  }

  .user-content-container {
    position: relative;
    z-index: 1;
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .user-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .channel-wrpper {
    width: fit-content;
  }

  .feeds-container {
    width: 100%;
    padding: 0 16px;
  }
</style>
