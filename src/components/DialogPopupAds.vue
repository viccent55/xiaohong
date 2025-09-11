<script lang="ts" setup>
  import { ref, computed, onMounted, type PropType } from "vue";
  import { ElDialog, ElButton, ElIcon } from "element-plus";
  import { Close } from "@element-plus/icons-vue";
  import AdvertSlot from "./AdvertSlot.vue";
  import { adsClick } from "@/api/advertisment";

  interface Advert {
    id: number | string;
    image: string;
    url: string;
    title?: string;
  }

  const props = defineProps({
    adverts: {
      type: Array as PropType<Advert[]>,
      default: () => [],
    },
  });

  const emit = defineEmits(["allAdsClosed"]);
  const dialog = ref(false);
  const adQueue = ref<Advert[]>([]);
  const currentAdIndexInQueue = ref(0);

  const currentAdvert = computed(
    () => adQueue.value[currentAdIndexInQueue.value]
  );

  const SESSION_KEY_PREFIX = "ads_";
  const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hour

  function getSessionKey(advert: Advert): string {
    if (!advert || !advert.id) {
      console.error("Advertisement is missing an ID.", advert);
      // Fallback to a generic key to avoid errors, though this is not ideal.
      return `${SESSION_KEY_PREFIX}unknown`;
    }
    return `${SESSION_KEY_PREFIX}${advert.id}`;
  }

  function isSessionActive(advert: Advert): boolean {
    try {
      const key = getSessionKey(advert);
      const lastClosed = localStorage.getItem(key);
      if (lastClosed && Date.now() - Number(lastClosed) < SESSION_DURATION) {
        return true;
      }
    } catch (e) {
      console.error("Failed to read localStorage item:", e);
    }
    return false;
  }

  function setSession(advert: Advert) {
    try {
      const key = getSessionKey(advert);
      localStorage.setItem(key, String(Date.now()));
    } catch (e) {
      console.error("Failed to set localStorage item:", e);
    }
  }

  function closeDialog() {
    dialog.value = false;
  }

  function onAfterLeave() {
    if (!currentAdvert.value) {
      return;
    }

    // Set session for the ad that was just closed
    setSession(currentAdvert.value);

    // Move to the next ad in the queue
    currentAdIndexInQueue.value++;

    if (currentAdIndexInQueue.value < adQueue.value.length) {
      // Use a small delay to make the transition smoother
      setTimeout(() => {
        dialog.value = true;
      }, 300);
    } else {
      emit("allAdsClosed");
    }
  }

  onMounted(() => {
    if (!props.adverts || !props.adverts.length) {
      return;
    }

    // Filter ads to create a queue of those that should be shown
    adQueue.value = props.adverts.filter((advert) => {
      // Ensure ad has an ID to be considered
      if (!advert.id) {
        console.warn("Skipping an advert because it has no ID.", advert);
        return false;
      }
      return !isSessionActive(advert);
    });

    if (adQueue.value.length > 0) {
      // If there are ads to show, open the dialog for the first one
      dialog.value = true;
    } else {
      emit("allAdsClosed");
    }
  });
</script>

<template>
  <el-dialog
    v-model="dialog"
    @close="onAfterLeave"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="advert-dialog"
    style="background-color: transparent !important; box-shadow: none"
    align-center
    width="auto"
  >
    <template #header>
      <div class="my-header flex justify-center pb-5">
        <el-button
          circle
          class="close-button"
          size="large"
          @click="closeDialog"
        >
          <el-icon><Close /></el-icon>
        </el-button>
      </div>
    </template>
    <div class="advert-wrapper">
      <AdvertSlot
        v-if="currentAdvert"
        :advert="currentAdvert"
        class="advert-image"
        @click="adsClick(Number(currentAdvert?.id))"
      />
    </div>
  </el-dialog>
</template>

<style scoped>
  :deep(.advert-dialog) {
    background: transparent;
    box-shadow: none;
  }
  :deep(.el-dialog__header) {
    padding: 0;
    margin-right: 0;
    margin-bottom: 10px;
  }
  :deep(.el-dialog__body) {
    padding: 0;
  }
  /* .advert-wrapper {
  position: relative;
  display: inline-block; 
} */

  .advert-image {
    display: block;
    margin: 0 auto;
    max-width: 530px;
    width: 100%;
    aspect-ratio: 530 / 580;
    height: auto;
    max-height: 85vh;
    object-fit: contain;
  }
</style>
