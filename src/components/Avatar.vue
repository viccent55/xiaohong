<script lang="ts" setup>
  import { ref, watchEffect, reactive, nextTick } from "vue";
  import { useDecryption } from "@/composables/useDecryption";

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
    size: {
      type: String,
      default: "small",
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
    const gender = "women";
    const randomNumber = Math.floor(Math.random() * 100);
    return `https://randomuser.me/api/portraits/${gender}/${randomNumber}.jpg`;
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
