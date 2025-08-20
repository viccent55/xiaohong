<script setup lang="ts">
  import { screenMode } from "@/hooks/useScreenMode";
  import Image from "@/components/Image.vue";
  import VideoPlayer from "@/components/Video.vue";

  defineProps<{
    mediaInfo: any[];
  }>();
</script>

<template>
  <el-carousel
    class="swiper"
    trigger="click"
    :indicator-position="
      mediaInfo?.length <= 1 ? 'none' : screenMode === 'pc' ? '' : 'outside'
    "
    :arrow="mediaInfo?.length <= 1 ? 'never' : 'hover'"
    :autoplay="false"
  >
    <el-carousel-item
      v-for="item in mediaInfo"
      :key="item"
    >
      <Image
        class="wrapper"
        :src="item.value"
        v-if="item.name === 'image'"
      />
      <VideoPlayer
        :src="item.value"
        class="wrapper"
        v-else
      ></VideoPlayer>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .swiper {
    width: 100%;
    height: 100%;
    min-height: 300px;
  }

  .wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
