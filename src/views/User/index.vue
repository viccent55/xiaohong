<script setup lang="ts">
  import UserInfo from "./UserInfo.vue";
  import ExploreChannelBar from "../Explore/comp/ExploreChannelBar.vue";
  import ExploreFeed from "../Explore/comp/ExploreFeed.vue";
  import BottomMore from "@/components/global/BottomMore.vue";
  import { computed, onMounted, ref, inject } from "vue";
  import { useRoute } from "vue-router";
  import type { ExploreChannelItem } from "@/types/item";
  import { UserChannelItems } from "@/common";
  import { getNoteFeeds, getStarFeeds, getUserInfo } from "@/api/user";
  import type { ExploreFeedInfo, UserDetailInfo } from "@/types/info";
  import { subscribe, report, unSubscribe } from "@/api/note";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import MasonryWall from "@yeger/vue-masonry-wall";

  const route = useRoute();
  const noteDialog = useNoteDialog();
  const scrollContainer: any = inject("scrollContainer");

  const channel = ref<string>(UserChannelItems[0].value);
  const userInfo = ref(<UserDetailInfo>{});
  const id = Number(route.params.id);
  // 笔记列表
  const noteFeeds = ref<EmptyObjectType[]>([]);
  // 收藏列表
  const starFeeds = ref<ExploreFeedInfo[]>([]);
  // 展示列表
  const showFeeds = computed(() => {
    return channel.value === UserChannelItems[0].value
      ? noteFeeds.value
      : starFeeds.value;
  });
  // 当前频道是否有更多Feeds
  // const hasMoreFeeds = computed(() => {
  //   if (channel.value === UserChannelItems[0].value) {
  //     return noteFeeds.value.length < userInfo.value.noteCount;
  //   } else {
  //     return starFeeds.value.length < userInfo.value.starCount;
  //   }
  // });

  const getRes = {
    noteFeeds(num: number) {
      // 获取笔记
      getNoteFeeds(id).then((res) => {
        console.log("res1", res);
        if (res.errcode !== 0) return;
        noteFeeds.value = [...noteFeeds.value, ...res.data.items];
      });
    },
    starFeeds(num: number) {
      // 获取收藏
      getStarFeeds(id).then((res) => {
        if (res.errcode !== 0) return;
        starFeeds.value = [...starFeeds.value, ...res.data.items];
      });
    },
  };

  const handle = {
    clickChannel(item: ExploreChannelItem) {
      channel.value = item.value;
    },
    clickFollow(user: UserDetailInfo) {
      if (user.subscribed) {
        unSubscribe(user.id).then((res) => {
          if (res.code !== 200) return;
          user.subscribed = false;
        });
      } else {
        subscribe(user.id).then((res) => {
          if (res.code !== 200) return;
          user.subscribed = true;
        });
      }
    },
    clickReport(user: UserDetailInfo) {
      report(user.id);
    },
    clickFeed(feed: EmptyObjectType) {
      noteDialog.openNoteDialog(feed.id);
    },
    clickMore() {
      if (channel.value === UserChannelItems[0].value) {
        getRes.noteFeeds(5);
      } else {
        getRes.starFeeds(5);
      }
    },
  };
  const updateUserInfo = async () => {
    // await setUserInfo();
  };
  onMounted(() => {
    if (id) {
      getUserInfo(id).then((res) => {
        userInfo.value = JSON.parse(JSON.stringify(res));
        console.log("userInfo", userInfo.value);
      });

      getRes.noteFeeds(5);
    }
  });
</script>

<template>
  <div class="center-wrapper">
    <div class="user-container">
      <UserInfo
        :user="userInfo"
        @click-follow="handle.clickFollow"
        @click-report="handle.clickReport"
      />

      <div class="channel-wrpper">
        <ExploreChannelBar
          :items="UserChannelItems"
          :active-value="channel"
          @click-item="handle.clickChannel"
        />
      </div>

      <el-divider />

      <div class="container">
        <MasonryWall
          v-if="showFeeds.length > 0"
          :items="showFeeds"
          :column-width="200"
          :gap="20"
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
      </div>

      <!-- <BottomMore
        :has-more="hasMoreFeeds"
        @click-more="handle.clickMore"
      /> -->
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .center-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .user-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .channel-wrpper {
    width: min-content;
  }

  .container {
    width: 100%;
    padding: 0 32px;
  }
</style>
