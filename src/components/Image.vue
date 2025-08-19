<script lang="ts" setup>
  import { ref, watchEffect, reactive, nextTick, type PropType } from "vue";
  import { useDecryption } from "@/composables/useDecryption";
  import { ElImage, ElIcon } from "element-plus";
  import {
    Picture as IconPicture,
    Loading as IconLoading,
  } from "@element-plus/icons-vue";

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "100%",
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
        console.error("Could not find image element in the DOM.");
      }
    });
  };
</script>

<template>
  <div
    class="image-container"
    :style="{ width: props.width, height: props.height }"
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
          <el-icon size="160"><IconPicture class="h-100" /></el-icon>
        </div>
      </template>
    </el-image>
    <div
      v-else
      class="image-slot"
    >
      <!-- Placeholder for when there is no src prop -->
      <el-icon><IconPicture /></el-icon>
    </div>
  </div>
</template>

<style scoped>
  .image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 4px;
  }

  .el-image {
    width: 100%;
    height: 100%;
    transition: all 0.3s ease;
  }

  .image-slot {
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
