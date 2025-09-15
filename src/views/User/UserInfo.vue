<script setup lang="ts">
  import FollowButton from "@/components/global/FollowButton.vue";
  import Dialog from "./Dialog.vue";

  import type { UserDetailInfo } from "@/types/info";
  import { useUserStore } from "@/store/user";
  import md5 from "crypto-js/md5";
  import { computed } from "vue";
  import Image from "@/components/Image.vue";
  import { screenMode } from "@/hooks/useScreenMode";
  import Avatar from "@/components/Avatar.vue";
  import useVariable from "@/composables/useVariable";
  import { ElMessage } from "element-plus";

  const props = defineProps<{ user: UserDetailInfo }>();
  const emits = defineEmits(["click-follow", "click-report", "refresh"]);
  const userStore = useUserStore();
  const { onCopy } = useVariable();
  import { getCurrentDomain } from "@/service";

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
  const onCopyUsername = () => {
    const url = `${getCurrentDomain()}/#/user/${props.user.id}`;
    ElMessage.success("复制用户名!");
    onCopy(url);
  };
</script>

<template>
  <div class="info-wrapper">
    <el-avatar
      :size="screenMode == 'phone' ? 80 : 120"
      v-if="self"
      class="mr-5"
      fit="cover"
    >
      <Image
        v-if="user.avatar"
        :src="user.avatar"
        fit="cover"
        height="100%"
        width="100%"
      />
      <img
        v-else
        :src="gravatarUrl"
        fit="cover"
      />
    </el-avatar>
    <span v-else>
      <el-avatar
        :size="70"
        v-if="!user.avatar"
        class="mr-5"
      >
        <img
          :src="gravatarUrl"
          fit="cover"
        />
      </el-avatar>
      <Avatar
        v-else
        :src="user.avatar"
        class="avatar-wrapper"
        fit="cover"
      />
    </span>
    <div class="basic-wrapper">
      <div class="base-info items-start justify-between w-full">
        <div class="name-wrapper">
          <span class="name w-[200px]">
            {{ user?.nickname }}
          </span>
          <span class="id w-[200px] flex items-center gap-1">
            小红书号: {{ user.invite_code }}
            <el-icon
              :size="16"
              @click="onCopyUsername()"
              class="cursor-pointer"
            >
              <CopyDocument />
            </el-icon>
          </span>
        </div>
      </div>
      <div class="desc break-words">{{ user.slogan || "还没有简介" }}</div>
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

    <div class="button-wrapper md:flex-row flex-col-reverse">
      <Dialog
        :user="user"
        :self="self"
        @refresh="
          () => {
            emits('refresh');
          }
        "
      />
      <FollowButton
        v-if="!self"
        :is-follow="user.isFollow"
        @click="clickFollow"
      />
      <!-- <ReportButton @click-report="clickReport" /> -->
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
    align-items: start;

    .pc-mode({
      width: 70%;
      max-width: 800px;
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

  .basic-wrapper {
    flex: 1;
    min-width: 0; /* Prevents flex item from overflowing */
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
    word-break: break-word;
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
    display: flex;
    gap: 12px;
    align-items: start;

    .phone-mode({
      bottom: 24px;
    });
  }
</style>
