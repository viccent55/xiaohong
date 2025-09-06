import { gePostionAds } from "@/api/advertisment";
import { useStore } from "@/store";
import { useUserStore } from "@/store/user";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { generateCode } from "@/utils/toolsValidate";
import { newVisitor, activeVisitor } from "@/api/explore";

export default function useHome() {
  const store = useStore();
  const route = useRoute();
  const storeUser = useUserStore();

  const getAdsPosition = async (position = 1) => {
    const respnse = await gePostionAds(position);
    const data = respnse.data ?? [];
    if (position === 1) {
      store.homePopupAds = data;
    } else if (position === 2) {
      store.recommendAds = data;
    }
  };

  const generateVisitCode = () => {
    if (!storeUser.visitCode) {
      storeUser.visitCode = generateCode();
    }
  };

  const chanId = computed(() => route.query.chan);
  const checkNewVisitor = async () => {
    generateVisitCode();
    try {
      const request = {
        visitor: storeUser.visitCode,
        chan: chanId.value,
      };
      await newVisitor(request);
      // console.log(response);
    } catch (e) {
      console.error(e);
    }
  };
  const getActiveUser = async () => {
    try {
      const request = {
        visitor: storeUser.visitCode,
      };
      await activeVisitor(request);
      // console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    getAdsPosition,
    generateVisitCode,
    checkNewVisitor,
    getActiveUser,
  };
}
