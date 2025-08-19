<script setup lang="ts">
  import { type DropdownItem } from "@/types/item";
  import { useUserStore } from "@/store/user";
  const userStore = useUserStore();

  defineProps<{
    items: DropdownItem[];
    placement?:
      | "bottom-start"
      | "bottom-end"
      | "top-start"
      | "top-end"
      | "bottom"
      | "top"
      | "left"
      | "right";
    trigger?: "hover" | "click";
  }>();

  defineEmits([
    "click-item", // 点击菜单项时触发
  ]);
</script>

<template>
  <el-dropdown
    :placement="placement"
    :trigger="trigger"
  >
    <slot></slot>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item in items"
          :divided="item.divided"
        >
          <template v-if="!item.loginRequired || userStore.isLogin">
            <span
              v-if="item.type === 'text'"
              class="text"
            >
              {{ item.label }}
            </span>
            <div
              v-else
              class="link"
              @click="$emit('click-item', item)"
            >
              {{ item.label }}
              <span>
                <el-icon class="icon"><TopRight /></el-icon>
              </span>
            </div>
          </template>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";
  :deep(.el-dropdown-menu__item) {
    border-radius: var(--button-border-radius);
    height: fit-content;

    &:hover {
      color: var(--text-color-dark);
      background-color: var(--background-color-dark);
    }
  }

  .text {
    font-size: 12px;
    margin-left: 12px;
  }

  .link {
    min-width: 184px;
    height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;
    background-color: var(--background-color-dark);

    .btn-base();

    .icon {
      display: none;
    }

    &:hover .icon {
      display: block;
    }
  }
</style>
