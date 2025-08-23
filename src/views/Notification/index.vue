<script setup lang="ts">
  import ExploreChannelBar from '../Explore/comp/ExploreChannelBar.vue'
  import NotiTab from '@/views/Notification/NotiTab.vue'
  import BottomMore from '@/components/global/BottomMore.vue'

  import { NotificationChannelItems } from '@/common'
  import type { ExploreChannelItem } from '@/types/item'
  import { computed, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'
  import type { NotificationInfo } from '@/types/info'
  import { getNotificationCount, getNotificationInfo } from '@/api/notification'
  import { useUserStore } from '@/store/user'
  import { subscribe, unSubscribe } from '@/api/note'
  import { useNoteDialog } from '@/hooks/useNoteDialog'

  const router = useRouter()
  const userStore = useUserStore()
  const noteDialog = useNoteDialog()

  // 当前频道
  const channel = ref<ExploreChannelItem>(NotificationChannelItems[0])

  // 所有数据
  const counts = ref<number[]>([0, 0, 0])
  const objs = ref<NotificationInfo[][]>([[], [], []])

  // 当前显示的数据
  const data = computed(() => {
    return objs.value[index.value]
  })
  // 当前频道索引
  const index = computed(() => {
    const idx =
      NotificationChannelItems.findIndex(
        item => item.value === channel.value.value,
      ) || 0

    return idx
  })
  // 是否有更多数据
  const hasMore = computed(() => {
    return counts.value[index.value] > data.value.length
  })

  const handle = {
    clickChannelItem(item: ExploreChannelItem) {
      channel.value = item
    },
    clickAuthor(info: NotificationInfo) {
      const user = info.user
      router.push({ name: 'user', params: { id: user.id } })
    },
    clickFollow(info: NotificationInfo) {
      const user = info.user
      if (user.isFollow) {
        unSubscribe(user.id).then(res => {
          if (res.code !== 200) return
          user.isFollow = false
        })
      } else {
        subscribe(user.id).then(res => {
          if (res.code !== 200) return
          user.isFollow = true
        })
      }
    },
    clickNoteImg(info: NotificationInfo) {
      const id = info.extra?.id
      if (!id) return
      noteDialog.openNoteDialog(id)
    },
    clickMore() {
      const idx = index.value
      getMore(idx)
    },
    clickExtra(info: NotificationInfo) {
      if (index.value != 2) {
        handle.clickNoteImg(info)
      } else {
        handle.clickFollow(info)
      }
    },
  }

  const getMore = (index: number, num: number = 5) => {
    const id = userStore.useId.toString()

    if (!id) return

    getNotificationInfo(id, num, index).then(res => {
      if (res.code !== 200) return
      objs.value[index].push(...res.data.list)
    })
  }

  onMounted(() => {
    const id = userStore.useId.toString()

    getNotificationCount(id)
      .then(res => {
        if (res.code !== 200) return
        counts.value = res.data
      })
      .then(() => {
        getMore(0)
        getMore(1)
        getMore(2)
      })
  })
</script>

<template>
  <div class="center-wrapper">
    <div class="notif-container">
      <ExploreChannelBar
        class="channel-bar"
        :items="NotificationChannelItems"
        :active-value="channel.value"
        @click-item="handle.clickChannelItem" />
      <div class="divider"></div>

      <div class="tabs-container">
        <template
          v-for="info in data"
          :key="info.id">
          <NotiTab
            :info="info"
            :follow="index == 2"
            @click-author="handle.clickAuthor"
            @click-extra="handle.clickExtra" />
        </template>
      </div>

      <BottomMore
        :has-more="hasMore"
        @click-more="handle.clickMore" />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .center-wrapper {
    display: flex;
    justify-content: center;

    width: 100%;
  }

  .notif-container {
    width: 100%;

    @media (min-width: 1200px) {
      width: 75%;
    }
  }

  .channel-bar {
    margin: 0 24px;

    .phone-mode({
      margin: 0 12px;
    });
  }

  .divider {
    border-bottom: 1px solid var(--border-color);
  }

  .tabs-container {
    width: 100%;
    padding: 0 24px 32px 24px;

    .phone-mode({
      padding: 0 12px 24px 12px;
    });
  }
</style>
