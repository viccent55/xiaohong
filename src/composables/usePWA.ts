import { useRegisterSW } from "virtual:pwa-register/vue";
import { onMounted, ref } from "vue";
import useVariable from "./useVariable";
import { installPwa } from "@/api/explore";
// This will hold the event from 'beforeinstallprompt'
let installPromptEvent: (Event & { prompt: () => Promise<void> }) | null = null;

export default function usePWA() {
  const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker registered at: ${swUrl}`);
    },
    onRegisterError(error) {
      console.error("SW registration error:", error);
    },
  });

  const showInstallPrompt = ref(false);
  const isIOS = ref(false);

  const promptInstall = async () => {
    if (!installPromptEvent) return;
    await installPromptEvent.prompt();
  };

  const closeInstallPrompt = () => {
    showInstallPrompt.value = false;
  };

  const closeReloadPrompt = () => {
    offlineReady.value = false;
    needRefresh.value = false;
  };

  onMounted(() => {
    // Detect if the user is on an iOS device
    const ua = window.navigator.userAgent;
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const isIosDevice = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    isIOS.value = isIosDevice;

    // Don't show the prompt if the app is already installed
    if (isStandalone) {
      return;
    }

    if (isIosDevice) {
      // On iOS, we just show the instruction prompt.
      showInstallPrompt.value = true;
    } else {
      window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        installPromptEvent = e as any;
        // Update UI to notify the user they can install the PWA
        showInstallPrompt.value = true;
        console.log("`beforeinstallprompt` event was fired.");
      });
    }
  });

  const { getDeviceInfo, route } = useVariable();

  // Handler for the install button click
  const onInstall = async () => {
    await promptInstall();
    const device = getDeviceInfo();
    let type = 0;
    switch (true) {
      case device.isAndroid:
        type = 1; // Android
        break;
      case device.isIos:
        type = 2; // iOS
        break;
      case device.isMac:
        type = 3; // macOS
        break;
      case device.isWindows:
        type = 4; // Windows
        break;
      default:
        type = 0; // Unknown
    }
    const request = {
      chan: route.query.chan,
      type: type,
    };
    await installPwa(request);
    closeInstallPrompt();
  };
  const dialogIosGuide = ref();
  const openDialogIos = () => {
    closeInstallPrompt();
    dialogIosGuide.value.openDialog();
  };
  return {
    // For updates
    needRefresh,
    updateServiceWorker,
    closeReloadPrompt,
    // For installation
    showInstallPrompt,
    isIOS,
    promptInstall,
    closeInstallPrompt,
    onInstall,
    dialogIosGuide,
    openDialogIos,
  };
}
