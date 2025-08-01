import { defineStore } from "pinia";

export const useStore = defineStore("store", {
  state: () => ({
    isDarkmode: "light",
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
