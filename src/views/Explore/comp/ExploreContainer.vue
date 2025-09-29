<script setup lang="ts">
  import { nextTick, onMounted, onUnmounted, type PropType, inject } from "vue";
  import ExploreFeed from "./ExploreFeed.vue";
  import { Loading as IconLoading } from "@element-plus/icons-vue";
  import MasonryWall from "@yeger/vue-masonry-wall";
  import useVariable from "@/composables/useVariable";

  const props = defineProps({
    items: {
      type: Array as PropType<any[]>,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isLoadMore: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(["get-more", "click-item"]);

  const scrollContainer: any = inject("scrollContainer");
  let scrollTimeout: number | null = null;

  const onScroll = () => {
    if (!scrollContainer.value) return;
    if (props.isLoadMore) return; // Add this guard

    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer.value!;
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        emits("get-more");
      }
    });
  };

  const { updateColumnWidth, columnWidth, gap, feedsContainer } = useVariable();

  onMounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener("scroll", onScroll);
    }
    nextTick(() => {
      updateColumnWidth();
    });
    window.addEventListener("resize", updateColumnWidth);
  });

  onUnmounted(() => {
    if (scrollContainer.value) {
      scrollContainer.value.removeEventListener("scroll", onScroll);
    }
    window.removeEventListener("resize", updateColumnWidth);
  });

  const handleItemClick = (item: any) => {
    emits("click-item", item);
  };
</script>

<template>
  <div
    class="feeds-container"
    ref="feedsContainer"
  >
    <!-- <MasonryWall
      v-if="isLoading"
      :items="skeletonItems"
      :column-width="columnWidth"
      :gap="gap"
      :scroll-container="scrollContainer"
    >
      <template #default>
        <ExploreFeedSkeleton />
      </template>
    </MasonryWall> -->
    <MasonryWall
      :items="items ?? []"
      :column-width="columnWidth"
      :gap="gap"
      item-key="id"
      :scroll-container="scrollContainer"
      :layout-animation-duration="500"
    >
      <template #default="{ item }">
        <ExploreFeed
          :feed="item"
          @click="handleItemClick(item)"
        />
      </template>
    </MasonryWall>
    <!-- Loading indicator for loading more -->
    <div
      class="pb-24 pt-5 lg:pb-12 mb-10 flex justify-center"
      v-if="isLoadMore"
    >
      <el-icon
        class="is-loading"
        style="font-size: 40px"
      >
        <IconLoading class="text-[40px]" />
      </el-icon>
    </div>
  </div>
</template>

<style scoped lang="less">
  .feeds-container {
    width: 100%;
  }
</style>
