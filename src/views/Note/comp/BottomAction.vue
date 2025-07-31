<script setup lang="ts">
  import { type ActionInfo } from '@/types/info'
  import { ref, useTemplateRef } from 'vue'

  defineProps<{
    action: ActionInfo
    total: number
  }>()

  const replayTo = ref<{ id: string; name?: string }>({ id: '' })

  const emits = defineEmits([
    'click-like',
    'click-star',
    'click-reply',
    'click-share',
    'click-reply-to',
  ])

  const inputFocus = (id: string, to: string | null) => {
    replayTo.value = { id }
    if (to) {
      replayTo.value.name = to
    }
    inputRef.value?.focus()
  }

  defineExpose({
    inputFocus,
  })

  const inputRef = useTemplateRef('input')
  const inputValue = ref('')
  const isFocusing = ref(false)

  const clickReply = () => {
    // 没有输入内容就不发出事件
    if (inputValue.value === '') return
    emits('click-reply-to', replayTo.value.id, inputValue.value, replayTo.value)
    inputValue.value = ''
  }

  const cancelInput = () => {
    isFocusing.value = false
    inputValue.value = ''
    replayTo.value = {
      id: '',
    }
  }
</script>

<template>
  <div class="bottom-action">
    <div class="input-wrapper">
      <input
        v-model="inputValue"
        ref="input"
        type="text"
        :placeholder="replayTo.name ? '回复@' + replayTo.name : '输入评论'"
        @focus="isFocusing = true" />
    </div>
    <button
      v-if="isFocusing"
      @click="clickReply">
      提交
    </button>
    <button
      v-if="isFocusing"
      @click="cancelInput">
      取消
    </button>
    <div
      class="actions-container"
      v-if="!isFocusing">
      <div
        class="action"
        :class="{ 'like-active': action.isLiked }"
        @click="$emit('click-like', action)">
        <Heart /><span>{{ action.likeCount }}</span>
      </div>
      <div
        class="action"
        :class="{ 'star-active': action.isFavorited }"
        @click="$emit('click-star', action)">
        <Star /><span>{{ action.favoriteCount }}</span>
      </div>
      <div
        class="action"
        @click="$emit('click-reply')">
        <ChatSquare /><span>{{ total }}</span>
      </div>
      <div
        class="action"
        @click="$emit('click-share')">
        <Share />
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import '@/assets/styles/base.less';

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

  button {
    white-space: nowrap;
    line-height: 40px;
    padding: 0 16px;
    border-radius: 20px;
    color: var(--background-color);
    background-color: var(--primary-color);
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
