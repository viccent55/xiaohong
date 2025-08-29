<script setup lang="ts">
  import type { DropdownItem } from "@/types/item";
  import Dropdown from "../global/Dropdown.vue";
  import { useStore } from "@/store";

  import { dropDownItems1, dropDownItems2, dropDownItems4 } from "@/common";

  const store = useStore();
  const emits = defineEmits(["click-menu-item"]);

  const clickMenuItem = (item: DropdownItem) => {
    console.log(item)
    emits("click-menu-item", item);
  };

  const toggleDarkMode = () => {
    store.toggleDarkMode();
  };
</script>

<template>
  <div class="header">
    <!-- prettier-ignore -->
    <a><img src="/logo.png" alt="logo" /></a>

    <div class="input-wrapper">
      <input
        type="text"
        placeholder="搜索"
      />
      <div class="search-icon">
        <el-icon><Search /></el-icon>
      </div>
    </div>
    <div class="button-wrapper">
      <!-- Dark mode toggle -->
      <el-button
        circle
        @click="toggleDarkMode"
        title="切换主题"
        style="width: 40px"
      >
        <el-icon v-if="store.isDarkmode === 'light'"><Moon /></el-icon>
        <el-icon v-else><Sunny /></el-icon>
      </el-button>
      <!-- >960 -->
      <Dropdown
        @click-item="clickMenuItem"
        :items="dropDownItems1"
        placement="bottom"
      >
        <button>创作中心</button>
      </Dropdown>

      <Dropdown
        @click-item="clickMenuItem"
        :items="dropDownItems2"
        placement="bottom-end"
      >
        <button>业务合作</button>
      </Dropdown>

      <!-- <960 -->
      <Dropdown
        @click-item="clickMenuItem"
        :items="store.configuration.categories"
        placement="bottom-end"
        trigger="click"
      >
        <button class="more-btn">
          <el-icon><MoreFilled /></el-icon>
        </button>
      </Dropdown>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .header {
    z-index: 16px;
    width: 100%;
    height: 72px;
    background-color: var(--background-color);
    display: flex;
    padding: 0 16px 0 24px;
    align-items: center;
    position: absolute;
    top: 0;
    justify-content: space-between;
  }

  a {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      height: 32px;
    }
  }

  .input-wrapper {
    width: 50%;
    min-width: 200px;
    max-width: 500px;
    height: 40px;
    .btn-base();
    background-color: var(--background-color-dark);
    display: flex;

    input {
      width: 100%;
      height: 100%;
      border: none;
      background-color: transparent;
      outline: none;
      cursor: text;
    }

    .search-icon {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 20px;
      margin-left: 20px;
      cursor: pointer;

      :hover {
        color: var(--text-color-dark);
      }
    }
  }

  button {
    .btn-base();

    &:hover {
      color: var(--text-color-dark);
      background-color: var(--background-color-dark);
    }
  }

  .dark-mode-btn {
    border-radius: 50%;
    padding: 8px;
    margin-right: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    .el-icon {
      font-size: 18px;
    }
  }

  .more-btn {
    border-radius: 50%;
    padding: 12px;
  }

  .button-wrapper {
    display: flex;
    align-items: center;

    > :nth-child(2),
    > :nth-child(3) {
      .mobile-mode({
        display: none;
      });
    }

    > :nth-child(4) {
      .pc-mode({
        display: none;
      });
    }
  }
</style>
