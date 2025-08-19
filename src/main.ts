import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/assets/styles/styles.css";
import App from "@/App.vue";
import router from "@/router";
import { setupElementPlus } from "@/utils/element";
import ElementPlus from "element-plus";
import Heart from "./components/global/Heart.vue";

// mock
import "@/mock";

const app = createApp(App);

setupElementPlus(app);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.component("Heart", Heart);
app.use(ElementPlus);
app.use(pinia);
app.use(router);
app.mount("#app");
