<script setup lang="ts">
  import {
    nextTick,
    computed,
    onMounted,
    onUnmounted,
    type PropType,
    inject,
  } from "vue";
  import ExploreFeed from "./ExploreFeed.vue";
  import ExploreFeedSkeleton from "./ExploreFeedSkeleton.vue";
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

  const skeletonItems = computed(() => Array.from({ length: 10 }));

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
    <MasonryWall
      v-if="isLoadMore"
      :items="skeletonItems"
      :column-width="columnWidth"
      :gap="gap"
      :scroll-container="scrollContainer"
    >
      <template #default>
        <ExploreFeedSkeleton />
      </template>
    </MasonryWall>
  </div>
</template>

<style scoped lang="less">
  .feeds-container {
    width: 100%;
  }
</style>
