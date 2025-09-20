<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from "vue";
  import type { ExploreChannelItem } from "@/types/item";
  import { ElScrollbar } from "element-plus";
  import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
  import useVariable from "@/composables/useVariable";

  defineProps<{
    items: ExploreChannelItem[];
    activeValue: string | number;
  }>();

  defineEmits(["click-item"]);

  const { isNativePlatform } = useVariable();
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
  const showArrows = ref(false);

  const scroll = (direction: "left" | "right") => {
    if (!scrollbarRef.value) return;
    const scrollAmount = direction === "left" ? -200 : 200;
    scrollbarRef.value.wrapRef!.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const updateArrowsVisibility = () => {
    const scrollContainer = scrollbarRef.value?.wrapRef;
    if (scrollContainer) {
      showArrows.value =
        scrollContainer.scrollWidth > scrollContainer.clientWidth;
    }
  };

  let resizeObserver: ResizeObserver;

  onMounted(() => {
    const scrollContainer = scrollbarRef.value?.wrapRef;
    if (scrollContainer) {
      updateArrowsVisibility(); // Initial check
      resizeObserver = new ResizeObserver(updateArrowsVisibility);
      resizeObserver.observe(scrollContainer);
      if (scrollContainer.firstElementChild) {
        resizeObserver.observe(scrollContainer.firstElementChild);
      }
    }
  });

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
  });
</script>

<template>
  <div
    class="channel-bar-container"
    :class="isNativePlatform ? 'mt-4' : ''"
  >
    <div
      v-if="showArrows"
      class="arrow-wrapper left"
      @click="scroll('left')"
    >
      <el-icon><ArrowLeft /></el-icon>
    </div>
    <el-scrollbar
      ref="scrollbarRef"
      class="channel-scrollbar"
    >
      <div class="button-group">
        <template
          v-for="item in items"
          :key="item.id"
        >
          <el-button
            round
            @click="$emit('click-item', item)"
            :type="item.value === activeValue ? 'danger' : 'default'"
            text
            :bg="item.value === activeValue ? true : false"
          >
            {{ item.name }}
          </el-button>
        </template>
      </div>
    </el-scrollbar>
    <div
      v-if="showArrows"
      class="arrow-wrapper right"
      @click="scroll('right')"
    >
      <el-icon><ArrowRight /></el-icon>
    </div>
  </div>
</template>

<style scoped lang="less">
  .channel-bar-container {
    display: flex;
    align-items: center;
    height: 72px;
    width: 100%;

    .arrow-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 0 8px;
      color: var(--primary-color);
      flex-shrink: 0;
    }

    .channel-scrollbar {
      flex-grow: 1;
      height: 32px;

      :deep(.el-scrollbar__bar) {
        display: none;
      }
    }

    .button-group {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
      padding: 0 10px;

      .el-button {
        flex-shrink: 0;
      }
    }
  }
</style>
