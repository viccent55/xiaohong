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
  >
    <template #header>
      <div class="dialog-header">📲 安装到主屏幕</div>
    </template>

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
      <el-carousel-item>
        <div class="slide">
          <h3>步骤 1</h3>
          <p>在 Safari 浏览器中打开放置 PWA 的页面。</p>
          <div class="tip">🔍 确保使用 Safari 打开</div>
        </div>
      </el-carousel-item>

      <!-- slide 2 -->
      <el-carousel-item>
        <div class="slide">
          <h3>步骤 2</h3>
          <p>
            点击底部工具栏上的
            <strong>分享</strong>
            按钮 （一个方框和箭头图标）。
          </p>
        </div>
      </el-carousel-item>

      <!-- slide 3 -->
      <el-carousel-item>
        <div class="slide">
          <h3>步骤 3</h3>
          <p>
            向下滑动菜单，选择
            <strong>添加到主屏幕</strong>
            。
          </p>
          <p class="tip">✅ 完成后，你可以直接从桌面打开应用！</p>
        </div>
      </el-carousel-item>
    </el-carousel>

    <template #footer>
      <div class="footer-actions">
        <el-button
          type="danger"
          @click="showDialog = false"
        >
          我知道了
        </el-button>
      </div>
    </template>
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
