<script setup lang="ts">
  import { type MediaInfo } from '@/types/info'
  import { screenMode } from '@/hooks/useScreenMode'
  import { useTemplateRef } from 'vue'

  const videoRef = useTemplateRef('video')

  defineProps<{
    mediaInfo: MediaInfo
  }>()

  defineEmits(['close-video'])

  function closeVideo() {
    videoRef.value?.pause()
  }

  defineExpose({
    closeVideo,
  })
</script>

<template>
  <div
    class="wrapper"
    v-if="mediaInfo.videoUrl">
    <video
      ref="video"
      :src="mediaInfo.videoUrl"
      controls
      width="100%"></video>
  </div>
  <el-carousel
    v-else
    class="swiper"
    trigger="click"
    :indicator-position="screenMode === 'pc' ? '' : 'outside'"
    :autoplay="false">
    <el-carousel-item
      v-for="item in mediaInfo.imageUrl"
      :key="item">
      <div class="wrapper">
        <img :src="item" />
      </div>
    </el-carousel-item>
  </el-carousel>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

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
