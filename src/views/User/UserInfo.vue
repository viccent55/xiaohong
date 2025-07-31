<script setup lang="ts">
  import ReportButton from '../Note/comp/ReportButton.vue'
  import FollowButton from '@/components/global/FollowButton.vue'

  import type { UserDetailInfo } from '@/types/info'
  import { useUserStore } from '@/store/user'
  import { computed } from 'vue'

  const props = defineProps<{ user: UserDetailInfo }>()
  const emits = defineEmits(['click-follow', 'click-report'])
  const userStore = useUserStore()

  const self = computed(() => {
    return userStore.useId === parseInt(props.user.id)
  })

  function clickFollow() {
    emits('click-follow', props.user)
  }
  function clickReport() {
    emits('click-report', props.user)
  }
</script>

<template>
  <div class="info-wrapper">
    <div class="avatar-wrapper">
      <img :src="user.avatarUrl" />
    </div>
    <div class="basic-wrapper">
      <div class="base-info">
        <img :src="user.avatarUrl" />
        <div class="name-wrapper">
          <span class="name">{{ user.name }}</span>
          <span class="id">小红书号: {{ user.id }}</span>
        </div>
      </div>
      <div class="desc">{{ user.desc }}</div>
      <div class="interactions">
        <div class="action">
          <span>{{ user.followCount }}</span>
          <span>关注</span>
        </div>
        <div class="action">
          <span>{{ user.followerCount }}</span>
          <span>粉丝</span>
        </div>
        <div class="action">
          <span>{{ user.likedCount }}</span>
          <span>获赞与收藏</span>
        </div>
      </div>
    </div>
    <div
      class="button-wrapper"
      v-if="!self">
      <FollowButton
        :is-follow="user.isFollow"
        @click="clickFollow" />
      <ReportButton @click-report="clickReport" />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .info-wrapper {
    padding: 16px;
    display: flex;
    position: relative;
    width: 100%;

    .pc-mode({
      width: 70%;
      max-width: 750px;
      min-width: 650px;
      padding-top: 32px;
      padding-bottom: 32px;
    });

    .pad-mode({
      width: 90%;
      padding-top: 24px;
      padding-bottom: 24px;
    });
  }

  .avatar-wrapper {
    min-width: 150px;
    max-width: 150px;
    min-height: 150px;
    max-height: 150px;
    border-radius: 50%;
    border: 1px solid var(--border-color);
    overflow: hidden;
    margin-right: 24px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .phone-mode({
      display: none;
    });
  }

  .base-info {
    display: flex;

    .name-wrapper {
      display: flex;
      flex-direction: column;
    }

    img {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 1px solid var(--border-color);
      object-fit: cover;
      display: none;
      margin-right: 16px;

      .phone-mode({
        display: block;
      });
    }

    .name {
      font-size: 24px;
      color: var(--text-color-dark);
      font-weight: 600;

      .mobile-mode({
        font-size: 18px;
      });
    }

    .id {
      font-size: 12px;
      margin-top: 8px;
    }
  }

  .desc {
    margin-top: 16px;
    font-size: 14px;
    color: var(--text-color-dark);
  }

  .interactions {
    margin-top: 20px;
    display: flex;
    gap: 16px;

    .action span {
      font-size: 14px;
      margin-right: 4px;

      .phone-mode({
        display: flex;
        flex-direction: column;
      });
    }
  }

  .button-wrapper {
    right: 16px;
    position: absolute;
    display: flex;
    gap: 16px;
    align-items: center;

    .phone-mode({
      bottom: 24px;
    });
  }
</style>
