import { defineConfig, ConfigEnv, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
const viteConfig = defineConfig((mode: ConfigEnv) => {
  const env = loadEnv(mode.mode, process.cwd());
  return {
    root: process.cwd(),
    plugins: [
      vue(),
      Components({ resolvers: [ElementPlusResolver()] }),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "masked-icon.svg",
        ],
        manifest: {
          name: "Xiaohongshu",
          short_name: "Xiaohongshu",
          description: "A PWA for Xiaohongshu",
          orientation: "portrait",
          theme_color: "#ffffff",
          background_color: "#ffffff",
          display: "standalone",
          scope: "/",
          start_url: "/",
          icons: [
            {
              src: "https://picasso-static.xiaohongshu.com/fe-platform/a69c624a60147845bad3798489ff0cc1a7cfca03.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "https://picasso-static.xiaohongshu.com/fe-platform/0014d22afee72e538cadbe0be76e06bd1ebe55ec.png",
              sizes: "256x256",
              type: "image/png",
            },
            {
              src: "https://picasso-static.xiaohongshu.com/fe-platform/fbd46ec8a907ca6a8cacc9596f18ff495c639feb.png",
              sizes: "128x128",
              type: "image/png",
            },
          ],
        },

        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        },
        devOptions: {
          enabled: process.env.NODE_ENV === "development",
          type: "module",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      open: false,
      hmr: true,
      proxy: {
        "/apiv1": {
          target:
            mode.command === "serve"
              ? env.VITE_API_URL_PROD
              : env.VITE_API_URL_LOC,
          changeOrigin: true,
        },
      },
      allowedHosts: true,
    },
  };
});

export default viteConfig;
