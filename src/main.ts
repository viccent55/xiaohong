import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import "element-plus/dist/index.css";
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/assets/styles/styles.css";
import App from "@/App.vue";
import router from "@/router";
import { useElementPlus, setElementPlusNamespace } from "@/utils/element";
import Heart from "./components/global/Heart.vue";

// mock
import "@/mock";

const app = createApp(App);

useElementPlus(app);
setElementPlusNamespace();

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.component("Heart", Heart);
app.use(pinia);
app.use(router);``
app.mount("#app");
