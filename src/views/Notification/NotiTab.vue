<script setup lang="ts">
  import type { NotificationInfo } from '@/types/info'
  import FollowButton from '@/components/global/FollowButton.vue'

  defineProps<{
    info: NotificationInfo
    follow?: boolean
  }>()

  defineEmits(['click-author', 'click-extra'])
</script>

<template>
  <div class="container">
    <img
      :src="info.user.avatarUrl"
      @clcik="$emit('click-author')" />
    <div class="main">
      <div class="info">
        <a @click="$emit('click-author', info)">{{ info.user.name }}</a>
        <div class="interaction">
          <span>{{ info.hint }}</span>
          <span>{{ info.time }}</span>
        </div>
        <div
          class="content"
          v-if="info.content">
          {{ info.content }}
        </div>
        <div
          class="quote"
          v-if="info.extra?.quote">
          {{ info.extra.quote }}
        </div>
      </div>
      <div class="extra">
        <FollowButton
          v-if="follow"
          :is-follow="info.user.isFollow"
          @click="$emit('click-extra', info)" />
        <img
          v-else
          @click="$emit('click-extra', info)"
          class="extra-img"
          :src="info.extra?.extraUrl" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

  .container {
    display: flex;
    width: 100%;
    padding-top: 24px;

    img {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      margin-right: 24px;
      border: 1px solid var(--border-color);
      cursor: pointer;

      .phone-mode({
        width: 36px;
        height: 36px;
      });
    }
  }

  .main {
    width: 100%;
    display: flex;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border-color);

    .info {
      padding-right: 16px;
      a {
        font-size: 16px;
        color: var(--text-color-dark);
        font-weight: 600;
        margin-bottom: 4px;
      }

      .interaction {
        margin-bottom: 8px;

        span {
          font-size: 14px;
          color: var(--text-color-light);
          margin-right: 8px;
        }
      }

      .content {
        font-size: 14px;
        color: var(--text-color-dark);
        margin-bottom: 12px;
      }
    }
  }

  .extra {
    margin-left: auto;

    .extra-img {
      width: 48px;
      height: 48px;
      border-radius: 6px;
      border: 1px solid var(--border-color);
      cursor: pointer;
    }
  }

  .quote {
    font-size: 12px;
    margin-bottom: 12px;
    color: var(--text-color-light);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 200px;

    .pc-mode({
      width: 500px;
    });

    .pad-mode({
      width: 400px;
    });

    &::before {
      content: '';
      font-size: 12px;
      width: 4px;
      height: 17px;
      border: 2px solid var(--border-color);
      margin-right: 8px;
      border-radius: 8px;
    }
  }
</style>
