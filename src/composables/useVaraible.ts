import { useWindowSize } from "@vueuse/core";
import { useStore } from "@/store";
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";

const useVaraible = () => {
  const { width } = useWindowSize();
  const store = useStore();
  const route = useRoute();
  const router = useRouter();
  const isMobileSm = computed(() => width.value < 467);
  const isMobile = computed(() => width.value < 768);
  const isIpad = computed(() => width.value <= 1024 && width.value >= 768);

  const onCopy = (text: string) => {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
  };
  const formatTime = (timestamp: string | number | Date) => {
    const createdAt =
      typeof timestamp === "number"
        ? new Date(timestamp * 1000) // seconds → ms
        : typeof timestamp === "string" && /^\d+$/.test(timestamp)
          ? new Date(parseInt(timestamp) * 1000)
          : new Date(timestamp);

    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} 分钟前 `;
    } else if (diffHours < 24) {
      return `${diffHours} 小时前 `;
    } else if (diffDays < 7) {
      return `${diffDays} 天前 `;
    } else {
      return createdAt.toLocaleDateString();
    }
  };
  return {
    isMobileSm,
    isMobile,
    isIpad,
    store,
    route,
    router,
    onCopy,
    formatTime,
    width,
  };
};
export default useVaraible;
