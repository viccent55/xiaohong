import useVariable from "./useVariable";
import { loadAppUrl, banUrl, newHost } from "@/api/app";

export default function useMobileApp() {
  const { store, storeUser, isNativePlatform, platform, getTypeDevice } =
    useVariable();

  const onLoadApp = async () => {
     const response = await loadAppUrl();
      console.log(response);
    if (isNativePlatform.value) {
      const response = await loadAppUrl();
      console.log(response);
    }
  };

  const sendBanUrl = async () => {
    if (isNativePlatform.value) {
      try {
        await banUrl({
          url: "",
        });
      } catch (error) {
        console.error("Error in firstVisitInApp:", error);
      }
    }
  };

  const getNewHost = async (params: object) => {
    try {
      await newHost(params);
    } catch (error) {
      console.error("Error in firstVisitInApp:", error);
    }
  };
  return {
    onLoadApp,
    getNewHost,
    sendBanUrl,
  };
}
