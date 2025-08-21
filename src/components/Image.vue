<script lang="ts" setup>
  import { ref, watchEffect, reactive, nextTick, type PropType, computed } from "vue";
  import { useDecryption } from "@/composables/useDecryption";
  import { ElImage, ElIcon } from "element-plus";
  import {
    Loading as IconLoading,
  } from "@element-plus/icons-vue";
  import EmptImage from "@/assets/loading.jpg";

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    width: {
      type: [String, Number],
      default: "100%",
    },
    height: {
      type: [String, Number],
      default: 'auto',
    },
    fit: {
      type: String as PropType<
        "cover" | "fill" | "contain" | "none" | "scale-down"
      >,
      default: "cover",
    },
  });

  const emit = defineEmits(["imageDimensions"]);
  const { decryptImage, decryptedImage } = useDecryption();

  watchEffect(() => {
    if (props.src) {
      decryptImage(props.src);
    }
  });

  const imageRef = ref<HTMLImageElement | null>(null);

  const state = reactive({
    width: 0,
    height: 0,
    isVertical: false,
  });

  const imageStyle = computed(() => {
    const style: { width: string; height: string; aspectRatio?: string } = {
        width: '100%',
        height: 'auto',
    };
    if (props.width && props.height && props.height !== 'auto' && Number(props.height) > 0) {
      style.aspectRatio = `${props.width} / ${props.height}`;
    } else {
      style.aspectRatio = '1 / 1'; // Default to a square if dimensions are invalid
    }
    return style;
  });

  const handleImageLoad = () => {
    // Wait for the next DOM update to ensure the image element is available
    nextTick(() => {
      const img = imageRef.value;
      if (img) {
        state.width = img.naturalWidth;
        state.height = img.naturalHeight;
        state.isVertical = state.height > state.width;
        emit("imageDimensions", state);
      } else {
        // console.error("Could not find image element in the DOM.");
      }
    });
  };
</script>

<template>
  <div
    class="image-container"
    :style="imageStyle"
  >
    <el-image
      v-if="decryptedImage"
      :src="decryptedImage"
      :fit="props.fit"
      class="decrypted-image"
      ref="imageRef"
      @load="handleImageLoad"
    >
      <!-- Loading Placeholder -->
      <template #placeholder>
        <div class="image-slot">
          <el-icon
            class="is-loading"
            size="160"
          >
            <IconLoading />
          </el-icon>
        </div>
      </template>

      <!-- Error Placeholder -->
      <template #error>
        <div class="image-slot">
          <el-image fit="contain" class="rounded-xl" :src="EmptImage"></el-image>
        </div>
      </template>
    </el-image>
    <div v-else class="image-slot ">
      <!-- Placeholder for when there is no src prop -->
      <img class="rounded-xl" :src="EmptImage"></img>
    </div>
  </div>
</template>

<style scoped>
  .image-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
    width: 100%;
    height: auto;
  }

  .el-image {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }

  .image-slot {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-secondary);
    font-size: 30px;
  }
</style>
