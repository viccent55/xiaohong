<script setup lang="ts">
  import { useStore } from "@/store";
  import { ElCard } from "element-plus";

  const store = useStore();
</script>

<template>
  <el-card
    shadow="never"
    class="rounded-xl border card"
  >
    <div class="space-y-2">
      <h1 class="text-lg no-underline text-center mt-0">
        {{ store.configuration?.name || "最新地址" }}
      </h1>
      <div class="text-sm">
        最新地址：
        <el-link
          :href="store.configuration?.home_url"
          target="_blank"
          rel="noopener noreferrer"
          type="primary"
        >
          <span class="text-xs">
            {{ store.configuration?.domain_latest }}
          </span>
        </el-link>
      </div>
      <div class="text-sm">
        备用地址：
        <el-link
          :href="store.configuration?.domain_next"
          target="_blank"
          rel="noopener noreferrer"
          type="primary"
        >
          <span class="text-xs">
            {{ store.configuration?.domain_next }}
          </span>
        </el-link>
      </div>
      <div class="text-sm">
        永久域名：
        <el-link
          :href="store.configuration?.domain_latest"
          target="_blank"
          rel="noopener noreferrer"
          type="primary"
        >
          <span class="text-xs">
            {{ store.configuration?.domain_latest }}
          </span>
        </el-link>
      </div>
      <div class="text-sm">
        防失联邮箱：
        <el-link
          :href="`mailto:` + store.configuration?.email"
          rel="noopener noreferrer"
          type="primary"
        >
          <span class="text-xs">
            {{ store.configuration?.email }}
          </span>
        </el-link>
      </div>
    </div>

    <!-- icons row -->
    <div class="flex justify-center gap-6 mt-4 text-gray-600">
      <a
        :href="store?.configuration?.github"
        target="_blank"
        aria-label="GitHub"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <rect
            width="16"
            height="16"
            fill="none"
          />
          <path
            fill="currentColor"
            d="M8 0c4.42 0 8 3.58 8 8a8.01 8.01 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38c0-.27.01-1.13.01-2.2c0-.75-.25-1.23-.54-1.48c1.78-.2 3.65-.88 3.65-3.95c0-.88-.31-1.59-.82-2.15c.08-.2.36-1.02-.08-2.12c0 0-.67-.22-2.2.82c-.64-.18-1.32-.27-2-.27s-1.36.09-2 .27c-1.53-1.03-2.2-.82-2.2-.82c-.44 1.1-.16 1.92-.08 2.12c-.51.56-.82 1.28-.82 2.15c0 3.06 1.86 3.75 3.64 3.95c-.23.2-.44.55-.51 1.07c-.46.21-1.61.55-2.33-.66c-.15-.24-.6-.83-1.23-.82c-.67.01-.27.38.01.53c.34.19.73.9.82 1.13c.16.45.68 1.31 2.69.94c0 .67.01 1.3.01 1.49c0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8"
          />
        </svg>
      </a>
      <a
        :href="store?.configuration?.twitter"
        target="_blank"
        aria-label="Twitter"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          height="209"
          viewBox="0 0 256 209"
        >
          <rect
            width="256"
            height="209"
            fill="none"
          />
          <path
            fill="#55acee"
            d="M256 25.45a105 105 0 0 1-30.166 8.27c10.845-6.5 19.172-16.793 23.093-29.057a105.2 105.2 0 0 1-33.351 12.745C205.995 7.201 192.346.822 177.239.822c-29.006 0-52.523 23.516-52.523 52.52c0 4.117.465 8.125 1.36 11.97c-43.65-2.191-82.35-23.1-108.255-54.876c-4.52 7.757-7.11 16.78-7.11 26.404c0 18.222 9.273 34.297 23.365 43.716a52.3 52.3 0 0 1-23.79-6.57q-.004.33-.003.661c0 25.447 18.104 46.675 42.13 51.5a52.6 52.6 0 0 1-23.718.9c6.683 20.866 26.08 36.05 49.062 36.475c-17.975 14.086-40.622 22.483-65.228 22.483c-4.24 0-8.42-.249-12.529-.734c23.243 14.902 50.85 23.597 80.51 23.597c96.607 0 149.434-80.031 149.434-149.435q0-3.417-.152-6.795A106.8 106.8 0 0 0 256 25.45"
          />
        </svg>
      </a>
      <a
        :href="store?.configuration?.gitlab"
        target="_blank"
        aria-label="GitLab"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="256"
          height="247"
          viewBox="0 0 256 247"
        >
          <rect
            width="256"
            height="247"
            fill="none"
          />
          <path
            fill="#e24329"
            d="m251.845 97.642l-.328-.986l-34.85-90.903c-.657-1.808-1.972-3.287-3.616-4.274Q210.586 0 207.627 0c-1.973 0-3.78.822-5.26 1.973a8.73 8.73 0 0 0-3.124 4.767l-23.506 71.999H80.56l-23.506-72c-.493-1.808-1.644-3.451-3.123-4.766C52.45.822 50.643 0 48.67 0s-3.781.329-5.425 1.48c-1.644.986-2.96 2.465-3.617 4.273L4.781 96.656l-.33.986c-10.355 26.959-1.479 57.37 21.535 74.794h.328c0 .164 53.096 39.944 53.096 39.944l26.3 19.89l15.946 12c3.78 2.96 9.205 2.96 12.986 0l15.945-12l26.3-19.89l53.424-39.944c23.014-17.425 31.726-47.835 21.37-74.794z"
          />
          <path
            fill="#fc6d26"
            d="m251.845 97.642l-.328-.986c-17.26 3.616-33.205 10.85-46.849 21.04c-.164 0-41.424 31.398-76.602 57.863a18377 18377 0 0 0 48.657 36.821l53.424-39.944c23.013-17.425 31.726-47.835 21.37-74.794z"
          />
          <path
            fill="#fca326"
            d="m79.245 212.38l26.301 19.89l15.945 12c3.78 2.96 9.206 2.96 12.986 0l15.945-12l26.301-19.89s-22.684-17.095-48.657-36.82c-26.136 19.725-48.82 36.82-48.82 36.82"
          />
          <path
            fill="#fc6d26"
            d="M51.465 117.697c-13.644-10.192-29.589-17.589-46.849-21.04l-.329.985c-10.356 26.959-1.479 57.37 21.534 74.794h.33c0 .164 53.094 39.944 53.094 39.944s22.685-17.095 48.821-36.82c-35.013-26.466-76.272-57.699-76.601-57.863"
          />
        </svg>
      </a>
    </div>
  </el-card>
</template>
<style>
  .card .el-card__body {
    padding: 16px 10px;
  }
</style>
