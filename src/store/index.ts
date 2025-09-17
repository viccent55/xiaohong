import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    isDarkmode: "dark",
    configuration: <EmptyObjectType>{
      name: "",
      logo: "",
      home_description: "",
      home_keywords: "",
      home_title: "",
      home_url: "http://www.honglou.com",
      domain_latest: "honglou.tv",
      domain_next: "honglou.fun",
      email: "url@honglou.com",
      github: "",
      gitlab: "",
      tg_business: "",
      categories: [],
    },
    homePopupAds: [] as EmptyArrayType,
    recommendAds: [] as EmptyArrayType,
    channel: "001",
    mode: "0",
    search: "",
  }),
  actions: {
    initMode() {
      console.log("Mode => ", this.isDarkmode);
      if (this.isDarkmode == "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    // Toggle Darkmode
    async toggleDarkMode() {
      // To enable dark mode
      this.isDarkmode = this.isDarkmode === "light" ? "dark" : "light";

      const root = document.documentElement;
      if (this.isDarkmode === "dark") {
        root.classList.add("dark"); // Tailwind
        root.classList.add("el-theme-dark"); // Element Plus
      } else {
        root.classList.remove("dark");
        root.classList.remove("el-theme-dark");
      }
    },
  },

  // persist: true,
  persist: {
    pick: ["isDarkmode", "configuration", "homePopupAds", "homePopupAds"],
  },
});
