<script setup lang="ts">
  import { ref, defineExpose } from "vue";

  const showDialog = ref(false);
  const openDialog = () => {
    showDialog.value = true;
  };
  const carousel = ref();

  // keep track of touch start X
  let startX = 0;

  function onTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
  }

  function onTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const deltaX = endX - startX;

    if (!carousel.value) return;

    if (deltaX < -50) {
      // swipe left → go next
      carousel.value.next();
    } else if (deltaX > 50) {
      // swipe right → go previous
      carousel.value.prev();
    }
  }

  const steps = [
    {
      title: "步骤 1: 点击分享按钮",
      image: new URL("../../assets/guide/step-1.png", import.meta.url).href,
    },
    {
      title: "步骤 2: 选择 '添加到主屏幕'",
      image: new URL("../../assets/guide/step-2.png", import.meta.url).href,
    },
    {
      title: "步骤 3:",
      image: new URL("../../assets/guide/step-3.png", import.meta.url).href,
    },
    {
      title: "步骤 4: ",
       image: new URL("../../assets/guide/step-4.png", import.meta.url).href,
    }
  ];

  defineExpose({
    openDialog,
  });
</script>

<template>
  <el-dialog
    v-model="showDialog"
    width="90%"
    custom-class="pwa-dialog"
    append-to-body
    align-center
  >
    <!-- Carousel slides -->
    <el-carousel
      class="carousel-wrapper"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      :interval="0"
      ref="carousel"
      arrow="never"
    >
      <!-- slide 1 -->
      <el-carousel-item
        v-for="(step, index) in steps"
        :key="index"
      >
        <div class="slide">
          <h3>{{ step.title }}</h3>
          <el-image :src="step.image"></el-image>
        </div>
      </el-carousel-item>
    </el-carousel>
  </el-dialog>
</template>

<style scoped>
  .pwa-dialog {
    border-radius: 12px;
    max-width: 500px;
  }

  .dialog-header {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
  }

  .slide {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    height: 100%;
    padding: 1rem;
  }

  .slide h3 {
    margin-bottom: 1rem;
    font-size: 20px;
  }

  .slide p {
    font-size: 16px;
    margin: 0.5rem 0;
  }

  .tip {
    margin-top: 1rem;
    color: #666;
    font-size: 14px;
  }

  .footer-actions {
    text-align: center;
  }
</style>
