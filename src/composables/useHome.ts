import { gePostionAds } from "@/api/getMethod";
import { useStore } from "@/store";
import { firstVisitInApp } from "@/api/app";
import { generateCode } from "@/utils/toolsValidate";
import { newVisitor, activeVisitor } from "@/api/explore";
import { getMemberActive } from "@/api/member";
import useVariable from "./useVariable";

export default function useHome() {
  const store = useStore();
  const { getTypeDevice, route, storeUser, isNativePlatform } = useVariable();

  const getAdsPosition = async (position = 1) => {
    const respnse = await gePostionAds(position);
    const data = respnse.data ?? [];
    if (position === 1) {
      store.homePopupAds = data;
    } else if (position === 2) {
      store.recommendAds = data;
    } else if (position === 3) {
      store.detailAppAds = data;
    } else if (position === 4) {
      store.detailAds = data;
    }
  };

  const checkNewVisitor = async () => {
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
      store.chan = cleanedChan;
      await firstVisitInApp(request);
      localStorage.setItem(lastCalledKey, now.toString());
    }
  };

  const getActiveUser = async () => {
    try {
      const lastCalledKey = "activeTimeUser";
      const lastCalled = localStorage.getItem(lastCalledKey);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (storeUser.useId == -1) return;
      if (!lastCalled || now - parseInt(lastCalled, 10) > twentyFourHours) {
        const request = {
          mid: storeUser.useId,
          platform: getTypeDevice(),
        };
        await getMemberActive(request);
        localStorage.setItem(lastCalledKey, now.toString());
      }
      // console.log(response);
    } catch (e) {
      console.error(e);
    }
  };
  const getActiveVisitor = async () => {
    try {
      const lastCalledKey = "activeVisitor";
      const lastCalled = localStorage.getItem(lastCalledKey);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      if (!lastCalled || now - parseInt(lastCalled, 10) > twentyFourHours) {
        const request = {
          visitor: storeUser.visitCode,
          platform: getTypeDevice(),
        };
        await activeVisitor(request);
        localStorage.setItem(lastCalledKey, now.toString());
      }
      // console.log(response);
    } catch (e) {
      console.error(e);
    }
  };

  const generateVisitCode = () => {
    storeUser.visitCode = generateCode();
    if (!isNativePlatform.value) {
      checkNewVisitor();
    }
    if (isNativePlatform.value) {
      getFirstVisitInApp();
    }
  };

  const initVisitor = () => {
    getActiveVisitor();
    getActiveUser();
  };
  return {
    getAdsPosition,
    generateVisitCode,
    initVisitor,
    getFirstVisitInApp,
  };
}
