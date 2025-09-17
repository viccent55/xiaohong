<script setup lang="ts">
  import usePWA from "@/composables/usePWA";
  import GuideIos from "./GuideIos.vue";

  // Import all necessary state and methods from the composable
  const {
    showInstallPrompt,
    isIOS,
    closeInstallPrompt,
    updateServiceWorker,
    closeReloadPrompt,
    onInstall,
    dialogIosGuide,
    openDialogIos,
  } = usePWA();

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
      <div
        class="install-pwa-modal"
        role="alert"
      >
        <div class="banner-content">
          <img
            src="/logo-a2.png"
            alt="App Logo"
            class="app-logo"
          />
          <div class="text-content">
            <p class="title">添加到主屏幕</p>
            <p class="description">有更好的使用体验</p>
          </div>
        </div>

        <!-- iOS Instructions -->
        <div
          v-if="isIOS"
          class="ios-instructions"
        >
          <el-button
            type="danger"
            @click="openDialogIos"
            class="w-full"
          >
            好的
          </el-button>
        </div>

        <!-- Android/Desktop Prompt -->
        <div
          v-else
          class="buttons"
        >
          <el-button
            size="small"
            @click="closeInstallPrompt"
          >
            稍后安装
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="onInstall"
          >
            立刻安装
          </el-button>
        </div>
      </div>
    </div>

    <!-- PWA Reload Toast -->
    <!-- This section is displayed when an update is available -->
    <!-- <div
      v-if="needRefresh"
      class="pwa-toast"
      role="alert"
    >
      <div class="message">发现最新版本</div>
      <div class="buttons">
        <el-button
          type="primary"
          size="small"
          @click="refresh"
        >
          更新
        </el-button>
        <el-button
          size="small"
          @click="closeReloadPrompt"
        >
          关闭
        </el-button>
      </div>
    </div> -->
    <GuideIos ref="dialogIosGuide" />
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
