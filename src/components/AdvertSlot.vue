<script setup lang="ts">
  import Image from "./Image.vue";

  defineProps({
    advert: {
      type: Object,
      required: true,
    },
    heightImage: {
      type: String || Number,
      default: "120px",
    },
    class: {
      type: String,
      default: () => "",
    },
  });
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
        height="auto"
        contain
      />
    </a>
  </el-card>
</template>
