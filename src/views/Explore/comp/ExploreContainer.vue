<script setup lang="ts">
  import {
    ref,
    computed,
    onMounted,
    onUnmounted,
    type PropType,
  } from "vue";
  import ExploreFeed from "./ExploreFeed.vue";
  import ExploreFeedSkeleton from "./ExploreFeedSkeleton.vue";

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

  const scrollableContainer = ref<Element | null>(null);
  let scrollTimeout: number | null = null;

  const onScroll = () => {
    if (!scrollableContainer.value) return;
    if (props.isLoadMore) return; // Add this guard

    if (scrollTimeout) {
      cancelAnimationFrame(scrollTimeout);
    }
    scrollTimeout = requestAnimationFrame(() => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableContainer.value!;
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        emits("get-more");
      }
    });
  };

  const numColumns = ref(4);

  const calculateColumns = () => {
    if (window.innerWidth >= 1400) {
      numColumns.value = 5;
    } else if (window.innerWidth >= 1200) {
      numColumns.value = 4;
    } else if (window.innerWidth >= 695) {
      numColumns.value = 3;
    } else {
      numColumns.value = 2;
    }
  };

  onMounted(() => {
    calculateColumns();
    window.addEventListener("resize", calculateColumns);
    scrollableContainer.value = document.querySelector(".container");
    if (scrollableContainer.value) {
      scrollableContainer.value.addEventListener("scroll", onScroll);
    }
  });

  onUnmounted(() => {
    window.removeEventListener("resize", calculateColumns);
    if (scrollableContainer.value) {
      scrollableContainer.value.removeEventListener("scroll", onScroll);
    }
  });

  const columnizedItems = computed(() => {
    const columns: any[][] = Array.from({ length: numColumns.value }, () => []);
    props.items.forEach((item, index) => {
      if (item) {
        columns[index % numColumns.value].push(item);
      }
    });
    return columns;
  });

  const skeletonItems = computed(() => Array.from({ length: 10 }));

  const columnizedSkeletons = computed(() => {
    const columns: any[][] = Array.from({ length: numColumns.value }, () => []);
    skeletonItems.value.forEach((_, index) => {
      columns[index % numColumns.value].push({});
    });
    return columns;
  });

  const handleItemClick = (item: any) => {
    emits("click-item", item);
  };
</script>

<template>
  <div class="feeds-container">
    <template v-if="isLoading">
      <div
        v-for="(column, columnIndex) in columnizedSkeletons"
        :key="`skeleton-column-${columnIndex}`"
        class="feed-column"
      >
        <div
          v-for="(_, itemIndex) in column"
          :key="`skeleton-item-${itemIndex}`"
          class="feed-item"
        >
          <ExploreFeedSkeleton />
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(column, columnIndex) in columnizedItems"
        :key="`column-${columnIndex}`"
        class="feed-column"
      >
        <div v-for="item in column" :key="item.id" class="feed-item">
          <ExploreFeed :feed="item" @click="handleItemClick(item)" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="less">
  .feeds-container {
    display: flex;
    width: 100%;
    gap: 20px;
    align-items: flex-start;
  }

  .feed-column {
    display: flex;
    flex-direction: column;
    flex: 1;
    gap: 20px;
  }

  .feed-item {
    width: 100%;
  }
</style>
