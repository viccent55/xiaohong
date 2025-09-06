<script lang="ts" setup>
  import { ref, watchEffect, reactive, nextTick } from "vue";
  import { useDecryption } from "@/composables/useDecryption";
  import md5 from "crypto-js/md5";

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    size: {
      type: String,
      default: "small",
    },
    id: {
      type: Number || String,
      default: () => "",
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

  const generateAvatar = () => {
    const id = props.id ? md5(props.id.toString()) : "";
    return `https://cravatar.cn/avatar/${id}`;
  };
</script>

<template>
  <el-avatar
    v-if="decryptedImage"
    :src="decryptedImage"
    :size="size"
  />
  <el-avatar
    v-else
    :size="size"
    :src="generateAvatar()"
    @load="handleImageLoad"
  />
</template>

<style scoped></style>
