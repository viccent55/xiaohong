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
  import { ElMessage } from "element-plus";
  import { retrySendEmailCode, veryCode } from "@/api/user";
  import { useUserStore } from "@/store/user";

  const route = useRoute();
  const noteDialog = useNoteDialog();
  const scrollContainer: any = inject("scrollContainer");
  const { updateColumnWidth, columnWidth, gap, feedsContainer } = useVariable();

  const channel = ref<string>(UserChannelItems[0].value);
  const userInfo = ref(<UserDetailInfo>{});
  const id = computed(() => Number(route.params.id));
  const page = ref(1);
  const isLoadMore = ref(false);
  const code = ref("");

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
  const resetItems = () => {
    noteFeeds.value = [];
    starFeeds.value = [];
    likesFeeds.value = [];
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
      resetItems();
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

  const skeletonItems = computed(() => Array.from({ length: 10 }));
  const store = useStore();

  const isShowPupup = ref(false);
  const loading = ref(false);
  const onVeryEmail = async () => {
    if (!userInfo.value.email) {
      ElMessage.warning("请输入您的代码");
      return;
    }
    try {
      loading.value = true;
      const response = await retrySendEmailCode({
        email: userInfo.value.email,
      });
      if (response.errcode === 0) {
        ElMessage.success(response.info);
        isShowPupup.value = true;
      } else {
        ElMessage.error(response.info);
      }
      isShowPupup.value = true;
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      loading.value = false;
    }
  };

  const verifyEmail = async () => {
    if (!userInfo.value.email) {
      ElMessage.warning("请输入您的代码");
      return;
    }
    if (!code.value) {
      ElMessage.error("需要代码！");
      return;
    }
    try {
      const response = await veryCode({
        email: userInfo.value.email,
        code: code.value,
      });
      if (response.errcode === 0) {
        ElMessage.success(response.info);
      } else {
        ElMessage.error(response.info);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };
  const isVerify = computed(() => {
    // If input contains any non-digit character, return true
    return /\D/.test(userInfo.value.invite_code);
  });
  const userStore = useUserStore();
  const self = computed(() => {
    return userStore.useId === userInfo.value.id;
  });
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
        <div class="flex items-center align-middle gap-2 px-4">
          <el-alert
            v-if=" self"
            type="warning"
            :closable="false"
            size="small"
            class="max-w-[600px]"
          >
            <template
              #title
              class="flex align-middle items-center"
            >
              <span>⚠️ 未验证邮箱 {{ userInfo.email }} 验证后可订阅最新域名防止失联</span>
              <el-button
                type="primary"
                size="small"
                class="ml-2"
                :loading="loading"
                @click="onVeryEmail"
              >
                验证邮箱
              </el-button>
            </template>
          </el-alert>
        </div>
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
    <el-dialog
      v-model="isShowPupup"
      title="Warning"
      width="350px"
      center
      align-center
    >
      <el-form class="mt-5">
        <el-form-item label="验证码">
          <el-input
            type="number"
            v-model.trim="code"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button @click="isShowPupup = false">取消</el-button>
          <el-button
            type="primary"
            @click="verifyEmail"
          >
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
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
