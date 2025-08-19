<script setup lang="ts">
  import UserInfo from "./UserInfo.vue";
  import ExploreChannelBar from "../Explore/comp/ExploreChannelBar.vue";
  import ExploreFeed from "../Explore/comp/ExploreFeed.vue";
  import BottomMore from "@/components/global/BottomMore.vue";
  import { computed, onMounted, ref } from "vue";
  import { useRoute } from "vue-router";
  import type { ExploreChannelItem } from "@/types/item";
  import { UserChannelItems } from "@/common";
  import { getNoteFeeds, getStarFeeds, setUserInfo } from "@/api/user";
  import type { ExploreFeedInfo, UserDetailInfo } from "@/types/info";
  import { follow, report, unfollow } from "@/api/note";
  import { useNoteDialog } from "@/hooks/useNoteDialog";
  import { useUserStore } from "@/store/user";

  const route = useRoute();
  const noteDialog = useNoteDialog();
  const { id } = route.params;
  const storeUser = useUserStore();
  const channel = ref<string>(UserChannelItems[0].value);
  const userInfo = ref(storeUser.userInfo);
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
      const id_ = id as string;
      // 获取笔记
      getNoteFeeds(id_, num).then((res) => {
        console.log("res", res);
        if (res.errcode !== 0) return;
        noteFeeds.value.push(...res.data.list);
      });
    },
    starFeeds(num: number) {
      const id_ = id as string;
      // 获取收藏
      getStarFeeds(id_, num).then((res) => {
        if (res.errcode !== 0) return;
        starFeeds.value.push(...res.data.list);
      });
    },
  };

  const handle = {
    clickChannel(item: ExploreChannelItem) {
      channel.value = item.value;
    },
    clickFollow(user: UserDetailInfo) {
      if (user.subscribed) {
        unfollow(user.id).then((res) => {
          if (res.code !== 200) return;
          user.subscribed = false;
        });
      } else {
        follow(user.id).then((res) => {
          if (res.code !== 200) return;
          user.subscribed = true;
        });
      }
    },
    clickReport(user: UserDetailInfo) {
      report(user.id);
    },
    clickFeed(feed: ExploreFeedInfo) {
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
      // const id_ = id as string;
      // getUserInfo(id_ as string).then((res) => {
      //   if (res.code !== 200) return;
      //   userInfo.value = res.data;
      // });

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
        <template
          v-for="feed in showFeeds"
          :key="feed.id"
        >
          <ExploreFeed
            :feed="feed"
            @click="handle.clickFeed(feed)"
          />
        </template>
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
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 0 32px;

    @media (max-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1200px) {
      grid-template-columns: repeat(5, 1fr);
    }
  }
</style>
