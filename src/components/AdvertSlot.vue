<script setup lang="ts">
  import Image from "./Image.vue";

  defineProps({
    advert: {
      type: Object,
      required: true,
    },
    height: {
      type: String || Number,
      default: "120px",
    },
    width: {
      type: String || Number,
      default: "100%",
    },
    fit: {
      type: String,
      default: "cover",
    },
  });

  const emit = defineEmits<{
    (e: "allowClose", value: boolean): void;
  }>();
</script>

<template>
  <el-card
    shadow="never"
    body-style="padding: 0; background: transparent;"
    style="background: transparent; border: none"
  >
    <a
      :href="advert?.url || '#'"
      target="_blank"
      rel="nofollow noopener noreferrer"
    >
      <Image
        :src="advert?.image"
        :alt="advert?.title"
        :width="width"
        :height="height"
        fit="cover"
        @imageDimensions="emit('allowClose', true)"
      />
    </a>
  </el-card>
</template>
