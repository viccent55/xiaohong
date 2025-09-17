import { gePostionAds } from "@/api/advertisment";
import { useStore } from "@/store";
import { firstVisitInApp } from "@/api/app";
import { generateCode } from "@/utils/toolsValidate";
import { newVisitor, activeVisitor } from "@/api/explore";
import useVariable from "./useVariable";

export default function useHome() {
  const store = useStore();
  const { getTypeDevice, route, storeUser } = useVariable();

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

  const checkNewVisitor = async () => {
    generateVisitCode();
    const deviceType = getTypeDevice();
    try {
      const param = route.query.chan || "";
      const urlParams = new URLSearchParams(window.location.search);
      const chan = String(urlParams.get("chan") || param);
      const cleanedChan = chan.replace(/\/+$/, "");
      const request = {
        visitor: storeUser.visitCode,
        chan: cleanedChan,
        platform: deviceType,
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

  const getFirstVisitInApp = async () => {
    const deviceType = getTypeDevice();
    const lastCalledKey = "lastGetFirstVisitInApp";
    const lastCalled = localStorage.getItem(lastCalledKey);
    const now = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    if (!lastCalled || now - parseInt(lastCalled, 10) > twentyFourHours) {
      const param = route.query.chan || "";
      const urlParams = new URLSearchParams(window.location.search);
      const chan = String(urlParams.get("chan") || param);
      const cleanedChan = chan.replace(/\/+$/, "");
      const request = {
        chan: cleanedChan,
        visitor: storeUser.visitCode,
        type: deviceType,
      };
      await firstVisitInApp(request);
      localStorage.setItem(lastCalledKey, now.toString());
    }
  };
  return {
    getAdsPosition,
    generateVisitCode,
    checkNewVisitor,
    getActiveUser,
    getFirstVisitInApp,
  };
}
