<script setup lang="ts">
  import ReportButton from "../Note/comp/ReportButton.vue";
  import FollowButton from "@/components/global/FollowButton.vue";
  import Dialog from "./Dialog.vue";

  import type { UserDetailInfo } from "@/types/info";
  import { useUserStore } from "@/store/user";
  import md5 from "crypto-js/md5";
  import { computed } from "vue";
  import Image from "@/components/Image.vue";

  const props = defineProps<{ user: UserDetailInfo }>();
  const emits = defineEmits(["click-follow", "click-report", "refresh"]);
  const userStore = useUserStore();

  const self = computed(() => {
    return userStore.useId === props.user.id;
  });

  const gravatarUrl = computed(() => {
    const emailHash = props.user.email ? md5(props.user.email.toString()) : "";
    return `https://cravatar.cn/avatar/${emailHash}`;
  });
  function clickFollow() {
    emits("click-follow", props.user);
  }
  function clickReport() {
    emits("click-report", props.user);
  }
</script>

<template>
  <div class="info-wrapper">
    <div class="avatar-wrapper">
      <img
        v-if="!user.avatar || user.avatar == '/avatar/user/header.png'"
        :src="gravatarUrl"
        fit="cover"
      />
      <Image
        v-else
        :src="user.avatar"
        class="avatar-wrapper"
        fit="cover"
      />
    </div>
    <div class="basic-wrapper min-w-[300px]">
      <div class="base-info items-start justify-between">
        <div class="name-wrapper">
          <span class="name">{{ user?.nickname }}</span>
          <span class="id">小红书号: {{ user.id }}</span>
        </div>
        <Dialog
          v-if="self"
          :user="user"
          @refresh="emits('refresh')"
        />
      </div>
      <div class="desc">{{ user.slogan || "还没有简介" }}</div>
      <div class="interactions">
        <div class="action">
          <span>{{ user?.subscribed }}</span>
          <span>关注</span>
        </div>
        <div class="action">
          <span>{{ user.inviter }}</span>
          <span>粉丝</span>
        </div>
        <div class="action">
          <span>{{ user.invite_count }}</span>
          <span>获赞与收藏</span>
        </div>
      </div>
    </div>

    <div
      class="button-wrapper"
      v-if="!self"
    >
      <FollowButton
        :is-follow="user.isFollow"
        @click="clickFollow"
      />
      <ReportButton @click-report="clickReport" />
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

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
      min-width: 72px;
      max-width: 72px;
      min-height: 72px;
      max-height: 72px;
      margin-right: 16px;
    });
  }

  .base-info {
    display: flex;
    align-items: center;
    .name-wrapper {
      display: flex;
      flex-direction: column;
      width: 100px;
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
