<script setup lang="ts">
  import { ref, onMounted, onBeforeUnmount, watch } from "vue";
  import Hls from "hls.js";

  const props = defineProps({
    src: {
      type: String,
      default: () => "",
    },
  });

  const videoPlayer = ref<HTMLVideoElement | null>(null);
  let hls: Hls | null = null;

  const initializePlayer = () => {
    // Clean up existing HLS instance if it exists
    if (hls) {
      hls.destroy();
      hls = null;
    }

    // Check for HLS support
    if (Hls.isSupported() && videoPlayer.value) {
      hls = new Hls();
      hls.loadSource(props.src);
      hls.attachMedia(videoPlayer.value);

      // Play the video when the HLS manifest is parsed
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoPlayer.value?.play().catch((error) => {
          console.error("Autoplay failed:", error);
        });
      });

      // Comprehensive error handling
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error. Retrying...");
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error. Recovering...");
              hls?.recoverMediaError();
              break;
            default:
              console.error("An unrecoverable HLS error occurred.", data);
              hls?.destroy();
              break;
          }
        }
      });
    } else if (
      videoPlayer.value &&
      videoPlayer.value.canPlayType("application/vnd.apple.mpegurl")
    ) {
      // Fallback for browsers with native HLS support (e.g., Safari)
      videoPlayer.value.src = props.src;
      videoPlayer.value.addEventListener(
        "loadedmetadata",
        () => {
          videoPlayer.value?.play().catch((error) => {
            console.error("Autoplay failed:", error);
          });
        },
        { once: true }
      );
    } else {
      console.error("HLS is not supported in this browser.");
    }
  };

  onMounted(() => {
    if (props.src) {
      initializePlayer();
    }
  });

  // Watch for changes in the 'src' prop to re-initialize the player
  watch(
    () => props.src,
    (newSrc) => {
      if (newSrc) {
        initializePlayer();
      }
    }
  );

  onBeforeUnmount(() => {
    if (hls) {
      hls.destroy();
    }
  });
</script>

<template>
  <div class="video-container">
    <video
      ref="videoPlayer"
      class="video-js"
      controls
      muted
    ></video>
  </div>
</template>

<style scoped>
  .video-container {
    width: 100%;
    height: 100%;
    margin: auto;
  }
  .video-js {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
