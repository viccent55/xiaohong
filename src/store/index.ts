import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    isDarkmode: "light",
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
  }),
  actions: {
    initMode() {
      if (this.isDarkmode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    // Toggle Darkmode
    async toggleDarkMode() {
      // To enable dark mode
      this.isDarkmode === "light"
        ? (this.isDarkmode = "dark")
        : (this.isDarkmode = "light");
      if (this.isDarkmode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
  },
  persist: true,
});
