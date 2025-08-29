import { gePostionAds } from "@/api/advertisment";
import { useStore } from "@/store";
export default function useHome() {
  const store = useStore();
  const getAdsPosition = async (position = 1) => {
    const respnse = await gePostionAds(position);
    const data = respnse.data ?? [];
    if (position === 1) {
      store.homePopupAds = data;
    } else if (position === 2) {
      store.recommendAds = data;
    }
  };
  return {
    getAdsPosition,
  };
}
