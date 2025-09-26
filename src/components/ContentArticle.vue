<script lang="ts" setup>
  import { ref, computed, onMounted, watch } from "vue";
  import Hls from "hls.js";
  import { useDecryption } from "@/composables/useDecryption";

  const props = defineProps({
    content: {
      type: String,
      default: () => "",
    },
    skeleton: {
      type: Number,
      default: 4,
    },
  });

  const { decryptImage, decryptedImage } = useDecryption();

  const contentRef = ref<HTMLDivElement | null>(null);
  const clonedContent = computed(() => structuredClone(props.content));
  const loading = ref(false);

  const initImgAndVideo = async () => {
    loading.value = true;
    try {
      if (!props.content) return;

      // Parse HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(props.content, "text/html");

      // 🔹 Decrypt images
      const images = Array.from(doc.querySelectorAll("img[data-lazy-src]"));
      await Promise.all(
        images.map(async (img: any) => {
          const lazySrc = img.getAttribute("data-lazy-src");
          if (!lazySrc) return;
          try {
            await decryptImage(lazySrc);
            if (decryptedImage.value) {
              img.removeAttribute("data-lazy-src");
              img.src = decryptedImage.value;
            }
          } catch (err) {
            console.error("Error decrypting image:", err);
          }
        })
      );

      // Insert decrypted content
      Array.from(doc.body.childNodes).forEach((node) => {
        contentRef.value?.appendChild(node);
      });

      // 🔹 Handle HLS videos
      const videos = contentRef.value?.querySelectorAll("video");
      if (videos && videos.length > 0) {
        videos.forEach((video: HTMLVideoElement) => {
          video.style.display = "block";
          video.style.width = "100%";

          const src = video.getAttribute("src");
          if (!src) return;

          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = src; // Safari
          } else if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
          }
        });
      }
    } catch (e) {
      console.error("initImgAndVideo error:", e);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    watch(
      () => props.content,
      () => {
        if (contentRef.value) {
          contentRef.value.innerHTML = "";
        }
        initImgAndVideo();
      }
    );
    initImgAndVideo();
  });
</script>
<template>
  <div
    class="mt-5 article-content"
    style="max-width: 100%"
  >
    <div
      v-show="loading"
      v-html="clonedContent"
    />

    <!-- Final decrypted content -->
    <div
      v-show="!loading"
      ref="contentRef"
    />
    <!-- 🔹 Fallback for no-JS -->
    <noscript>
      <div v-html="clonedContent"></div>
    </noscript>
  </div>
</template>

<style scoped>
  .article-content {
    width: 100%;
    display: block;
  }

  .article-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin-inline: auto;
  }
</style>
