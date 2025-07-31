<script setup lang="ts">
  import ExploreContainer from './comp/ExploreContainer.vue'
  import ExploreFloatSet from './comp/ExploreFloatSet.vue'
  import ExploreChannelBar from './comp/ExploreChannelBar.vue'
  import ExploreFeed from './comp/ExploreFeed.vue'
  import ExploreLoading from './comp/ExploreLoading.vue'

  import { computed, onMounted, ref } from 'vue'
  import type { ExploreChannelItem, ExploreFLoatSetItem } from '@/types/item'
  import { ExploreChannelItems } from '@/common'
  import type { ExploreFeedInfo } from '@/types/info'
  import { getExploreFeeds } from '@/api/explore'
  import { ExploreFloatSetItems } from '@/common'
  import { useNoteDialog } from '@/hooks/useNoteDialog'
  import { checkPermissions } from '@/hooks/usePermisions'
  import { PERMISSION } from '@/common/permision'
  import { like } from '@/api/note'
  import { openPage } from '@/service'

  const noteDialog = useNoteDialog()

  // 当前频道
  const channel = ref<string>(ExploreChannelItems[0].value)
  const feeds = ref<ExploreFeedInfo[]>([])
  const floatItems = ref<ExploreFLoatSetItem[]>(ExploreFloatSetItems)
  const loading = ref(false)
  const onlyPic = computed(() => {
    return floatItems.value.some(
      item => item.label === 'only-pic' && item.active,
    )
  })

  const freshFeedNum = 15 // 每次刷新数量
  const loadMoreNum = 5 // 每次加载更多数量

  // 回到顶部
  const backToTop = () => {
    const el = document.querySelector('.container')
    if (el) el.scrollTop = 0
  }

  // 刷新列表
  const freshFeeds = () => {
    loading.value = true
    backToTop()
    getExploreFeeds({
      num: freshFeedNum,
      channel: channel.value,
      only_pic: onlyPic.value,
    }).then(res => {
      loading.value = false
      feeds.value = res.data.list
    })
  }

  const handle = {
    // 加载更多列表
    loadMoreFeeds() {
      getExploreFeeds({
        num: loadMoreNum,
        channel: channel.value,
        only_pic: onlyPic.value,
      }).then(res => {
        feeds.value.push(...res.data.list)
      })
    },
    // 点击频道
    clickChannel(item: ExploreChannelItem) {
      channel.value = item.value
      freshFeeds()
    },
    // 点击浮动按钮
    clickFLoatItem(item: ExploreFLoatSetItem) {
      if (item.label === 'only-pic') {
        item.active = !item.active
      }
      freshFeeds()
    },
    // 点击Feed
    clickFeed(item: ExploreFeedInfo) {
      noteDialog.openNoteDialog(item.id)
    },
    // 点击Like
    clickLike(item: ExploreFeedInfo) {
      checkPermissions(PERMISSION.User, () => {
        if (item.isLiked) {
          like(item.id).then(res => {
            if (res.code !== 200) return
            item.likeCount--
            item.isLiked = false
          })
        } else {
          like(item.id).then(res => {
            if (res.code !== 200) return
            item.likeCount++
            item.isLiked = true
          })
        }
      })
    },
    // 点击Author
    clickAuthor(item: ExploreFeedInfo) {
      openPage(`http://localhost:5173/user/${item.id}`)
    },
  }
  // 初始加载数据
  onMounted(() => {
    freshFeeds()
  })
</script>

<template>
  <div class="explore-wrapper">
    <!-- 频道导航 -->
    <ExploreChannelBar
      :items="ExploreChannelItems"
      :active-value="channel"
      @click-item="handle.clickChannel" />

    <!-- 加载 -->
    <ExploreLoading :loading="loading" />

    <!-- 列表 -->
    <ExploreContainer @get-more="handle.loadMoreFeeds">
      <template
        v-for="feed in feeds"
        :key="feed.id">
        <ExploreFeed
          :feed="feed"
          @click="handle.clickFeed(feed)"
          @click-like="handle.clickLike(feed)"
          @click-author="handle.clickAuthor(feed)" />
      </template>
    </ExploreContainer>

    <!-- 浮动按钮 -->
    <ExploreFloatSet
      :items="floatItems"
      @click-item="handle.clickFLoatItem" />
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

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
