<script setup lang="ts">
  import { screenMode } from "@/hooks/useScreenMode";
  import Image from "@/components/Image.vue";
  import { ref, defineExpose, defineAsyncComponent } from "vue";

  const VideoPlayer = defineAsyncComponent(
    () => import("@/components/Video.vue")
  );

  defineProps<{
    mediaInfo: any[];
  }>();

  const videoPlayerRef = ref<InstanceType<typeof VideoPlayer>[]>([]);

  const closeVideo = () => {
    videoPlayerRef.value.forEach((player) => {
      player?.closeVideo();
    });
  };
  defineExpose({
    closeVideo,
  });
</script>

<template>
  <el-carousel
    class="swiper"
    trigger="click"
    :indicator-position="
      mediaInfo?.length <= 1 ? 'none' : screenMode === 'pc' ? '' : 'outside'
    "
    :arrow="mediaInfo?.length <= 1 ? 'never' : 'always'"
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
        ref="videoPlayerRef"
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
