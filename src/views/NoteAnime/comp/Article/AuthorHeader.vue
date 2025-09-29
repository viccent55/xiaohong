<script setup lang="ts">
  import CloseButton from "@/components/global/CloseButton.vue";
  const emits = defineEmits(["click-close", "click-author", "click-follow"]);
</script>

<template>
  <div class="author-header justify-end rounded-r-2xl">
    <!-- <CloseButton
      class="close-btn"
      @click="$emit('click-close')"
    /> -->
    <el-button
      icon="Close"
      @click="$emit('click-close')"
      type="danger"
      circle
      class=""
    ></el-button>
    <!-- <a @click="$emit('click-author', props.author.id)">
      <Avatar :src="props.author?.avatar" />
      <span>{{ props.author?.nickname }}</span>
    </a>
    
    <FollowButton
      :is-follow="author?.isFollow"
      @click="clickFollow"
    /> -->
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .author-header {
    position: sticky;
    top: 0;
    z-index: 16;
    width: 100%;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    background-color: var(--background-color);

    a {
      display: flex;
      align-items: center;
    }

    img {
      width: 40px;
      height: 40px;
      border: 1px solid var(--border-color);
      border-radius: 50%;
    }

    span {
      margin-left: 12px;
      font-size: 16px;
      line-height: 16px;

      &:hover {
        color: var(--text-color-dark);
      }
    }
  }

  // 关闭按钮
  .close-btn {
    position: absolute;
    right: 12px;
    top: 12px;

    .mobile-mode({
      left: 12px;
    });
  }
</style>
