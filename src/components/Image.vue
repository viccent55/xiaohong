<script lang="ts" setup>
  import { watchEffect, reactive, type PropType, computed } from "vue";
  import { useDecryption } from "@/composables/useDecryption";
  import { ElImage, ElIcon } from "element-plus";
  import { Loading as IconLoading } from "@element-plus/icons-vue";
  import EmptImage from "@/assets/loading.jpg";

  const props = defineProps({
    src: {
      type: String,
      default: "",
    },
    width: {
      type: [String, Number] as PropType<string | number>,
      default: "100%",
    },
    height: {
      type: [String, Number] as PropType<string | number>,
      default: "auto",
    },
    fit: {
      type: String as PropType<
        "cover" | "fill" | "contain" | "none" | "scale-down"
      >,
      default: "cover",
    },
  });

  const emit = defineEmits<{
    (
      e: "imageDimensions",
      value: {
        width: number;
        height: number;
        isVertical: boolean;
      }
    ): void;
  }>();

  const { decryptImage, decryptedImage } = useDecryption();

  watchEffect(() => {
    if (props.src) {
      decryptImage(props.src);
    }
  });

  const state = reactive({
    width: 0,
    height: 0,
    isVertical: false,
  });

  const imageStyle = computed(() => {
    const style: { width: string; height: string; aspectRatio?: string } = {
      width: "100%",
      height: "auto",
    };
    if (
      props.width &&
      props.height &&
      props.height !== "auto" &&
      Number(props.height) > 0
    ) {
      style.aspectRatio = `${props.width} / ${props.height}`;
    } else {
      style.aspectRatio = "1 / 1"; // fallback square
    }
    return style;
  });

  const handleImageLoad = (event: Event) => {
    const img = event.target as HTMLImageElement;
    if (img) {
      state.width = img.naturalWidth;
      state.height = img.naturalHeight;
      state.isVertical = state.height > state.width;
      emit("imageDimensions", state);
    }
  };
</script>

<template>
  <el-image
    v-if="decryptedImage"
    :src="decryptedImage"
    :fit="props.fit"
    :width="width"
    :height="height"
    class="decrypted-image"
    @load="handleImageLoad"
  >
    <!-- Loading Placeholder -->
    <template #placeholder>
      <div class="image-slot">
        <el-icon
          class="is-loading"
          size="260"
        >
          <IconLoading />
        </el-icon>
      </div>
    </template>

    <!-- Error Placeholder -->
    <template #error>
      <div class="image-slot">
        <el-image
          :width="width"
          :height="height"
          fit="contain"
          class="rounded-xl"
          :src="EmptImage"
        />
      </div>
    </template>
  </el-image>

  <div
    v-else
    class="image-slot"
  >
    <img
      class="rounded-xl"
      :src="EmptImage"
    />
  </div>
</template>

<style scoped>
  .decrypted-image {
    position: relative;
    display: block;
    width: 100%;
    height: auto;
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
