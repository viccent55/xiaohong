<script setup lang="ts">
import usePWA from "@/composables/usePWA";
import { Share } from "@element-plus/icons-vue";

// Import all necessary state and methods from the composable
const {
  showInstallPrompt,
  isIOS,
  promptInstall,
  closeInstallPrompt,
  needRefresh,
  updateServiceWorker,
  closeReloadPrompt,
} = usePWA();

// Handler for the install button click
const onInstall = async () => {
  await promptInstall();
  // The prompt will be hidden automatically after t``he user interacts with it.
  closeInstallPrompt();
};

// Handler for the reload button click
const refresh = async () => {
  await updateServiceWorker();
  // Close the prompt after the user clicks to reload.
  closeReloadPrompt();
};
</script>

<template>
  <div>
    <!-- PWA Install Prompt Overlay -->
    <!-- This section is displayed when the PWA is installable -->
    <div
      v-if="showInstallPrompt"
      class="install-pwa-overlay"
      @click.self="closeInstallPrompt"
    >
      <div class="install-pwa-modal" role="alert">
        <div class="banner-content">
          <img
            src="https://picasso-static.xiaohongshu.com/fe-platform/0014d22afee72e538cadbe0be76e06bd1ebe55ec.png"
            alt="App Logo"
            class="app-logo"
          />
          <div class="text-content">
            <p class="title">Install Xiaohongshu!</p>
            <p class="description">Add to home screen for a better experience.</p>
          </div>
        </div>

        <!-- iOS Instructions -->
        <div v-if="isIOS" class="ios-instructions">
          <div class="flex flex-col">
            <p class="ios-text">
              1. 点击“分享”图标
              <el-icon :size="20" style="vertical-align: middle">
                <Share />
              </el-icon>
              在您的浏览器菜单中。
            </p>
            <p class="ios-text pl-4">
              Tap the 'Share' icon
              <el-icon :size="20" style="vertical-align: middle">
                <Share />
              </el-icon>
              in your browser menu.
            </p>
          </div>

          <div class="flex flex-col">
            <p class="ios-text">2. 向下滚动并点击“添加到主屏幕”。</p>
            <p class="ios-text pl-4">Scroll down and tap 'Add to Home Screen'.</p>
          </div>
          <div class="ios-close-button">
            <el-button text bg size="large" @click="closeInstallPrompt">
              I understand
            </el-button>
          </div>
        </div>

        <!-- Android/Desktop Prompt -->
        <div v-else class="buttons">
          <el-button size="small" @click="closeInstallPrompt">
            Not now
          </el-button>
          <el-button type="primary" size="small" @click="onInstall">
            Install
          </el-button>
        </div>
      </div>
    </div>

    <!-- PWA Reload Toast -->
    <!-- This section is displayed when an update is available -->
    <div v-if="needRefresh" class="pwa-toast" role="alert">
      <div class="message">
        A new version is available, click reload to update.
      </div>
      <div class="buttons">
        <el-button type="primary" size="small" @click="refresh">
          Reload
        </el-button>
        <el-button size="small" @click="closeReloadPrompt">
          Close
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
  The CSS below uses Element Plus CSS variables to ensure consistency with the
  Element Plus theme and to minimize the amount of custom styling needed.
*/

/* Styles for the PWA Install Prompt */
.install-pwa-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2100;
}

.install-pwa-modal {
  background-color: var(--el-bg-color);
  width: 100%;
  max-width: 500px;
  padding: 20px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: var(--el-box-shadow-lighter);
  animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.banner-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 20px;
}

.app-logo {
  width: 60px;
  height: 60px;
  border-radius: 8px;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
}

.description {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin: 0;
}

.buttons,
.ios-close-button {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-shrink: 0;
  margin-top: 20px;
}

.ios-instructions {
  border-top: 1px solid var(--el-border-color-light);
  padding-top: 16px;
}

.ios-text {
  font-size: 15px;
  color: var(--el-text-color-primary);
  margin: 0;
  align-items: center;
  gap: 4px;
}

/* Styles for the PWA Reload Toast */
.pwa-toast {
  position: fixed;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 12px 16px;
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
  z-index: 2050;
}

.message {
  color: var(--el-text-color-regular);
  font-size: 14px;
}
</style>
