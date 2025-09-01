<script setup lang="ts">
  import { ref, useTemplateRef, watchEffect } from "vue";

  const props = defineProps<{
    action: EmptyObjectType;
    total: number;
  }>();

  const replayTo = ref<{ id: string; name?: string }>({
    id: "",
    name: "",
  });
  watchEffect(() => {
    const item = props.action;
    if (item) {
      replayTo.value.id = item.id;
      replayTo.value.name = item.author?.name || "";
    }
  });
  const emits = defineEmits([
    "click-like",
    "click-star",
    "click-reply",
    "click-share",
    "click-reply-to",
  ]);

  const inputFocus = (id: string, to: string | null) => {
    replayTo.value = { id };
    if (to) {
      replayTo.value.name = to;
    }
    inputRef.value?.focus();
  };

  defineExpose({
    inputFocus,
  });

  const inputRef = useTemplateRef("input");
  const inputValue = ref("");
  const isFocusing = ref(false);

  const clickReply = () => {
    // 没有输入内容就不发出事件
    if (inputValue.value === "") return;
    emits(
      "click-reply-to",
      replayTo.value.id,
      inputValue.value,
      replayTo.value
    );
    inputValue.value = "";
  };

  const cancelInput = () => {
    isFocusing.value = false;
    inputValue.value = "";
    replayTo.value = {
      id: "",
    };
  };
</script>

<template>
  <div class="bottom-action rounded-br-2xl">
    <div class="flex align-center items-center gap-2">
      <div class="input-wrapper">
        <input
          v-model="inputValue"
          ref="input"
          type="text"
          :placeholder="replayTo.name ? '回复@' + replayTo.name : '输入评论'"
          @focus="isFocusing = true"
        />
      </div>
      <el-button
        type="danger"
        round
        v-if="isFocusing"
        @click="clickReply"
      >
        提交
      </el-button>
      <el-button
        round
        style="margin: 0"
        v-if="isFocusing"
        @click="cancelInput"
      >
        取消
      </el-button>
    </div>
    <div
      class="actions-container"
      v-if="!isFocusing"
    >
      <div
        class="action"
        :class="{ 'like-active': action?.isLike }"
        @click="$emit('click-like', action)"
      >
        <Heart />
        <span>{{ action?.like_count }}</span>
      </div>
      <div
        class="action"
        :class="{ 'star-active': action?.isStar }"
        @click="$emit('click-star', action)"
      >
        <Star />
        <span>{{ action?.collect_count }}</span>
      </div>
      <div
        class="action"
        @click="$emit('click-reply')"
      >
        <ChatSquare />
        <span>{{ action?.comment_count }}</span>
      </div>
      <div
        class="action"
        @click="$emit('click-share')"
      >
        <Share />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .bottom-action {
    background-color: var(--background-color);
    position: sticky;
    bottom: 0;
    padding: 16px;
    display: flex;
    margin-top: auto;
    height: max-content;

    border-top: 1px solid var(--border-color);

    .pc-mode({
      width: 375px;
    });

    .mobile-mode({
      width: 100%;
    });

    input {
      background-color: transparent;
    }
  }

  .input-wrapper {
    .btn-base();
    // display: flex;

    flex: 1;
    background-color: var(--background-color-dark);

    input {
      width: 100%;
      height: 100%;
    }
  }

  .actions-container {
    width: fit-content;
    display: flex;
  }

  .action {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    svg {
      margin: 8px;
      width: 24px;
      height: 24px;
    }

    span {
      font-size: 16px;
      color: var(--text-color-dark);
      transform: translateX(-4px);
    }
  }
</style>
