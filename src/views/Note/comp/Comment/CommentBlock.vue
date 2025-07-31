<script setup lang="ts">
  import { computed } from 'vue'
  import Comment from './Comment.vue'
  import { type ActionInfo, type CommentBlockInfo } from '@/types/info'

  const emits = defineEmits([
    'expand-reply',
    'click-like',
    'click-author',
    'click-report',
    'click-replay',
  ])

  const props = defineProps<{
    comments: CommentBlockInfo
  }>()

  // 剩下的未显示的评论数
  const expandNum = computed(() => {
    return props.comments.totalCommentCount - props.comments.commentList.length
  })

  const handle = {
    clickLike(item: ActionInfo, id: number) {
      emits('click-like', item, id)
    },
    clickAvatar(id: number) {
      emits('click-author', id)
    },
    clickReplay(id: number, name: string) {
      emits('click-replay', id, name)
    },
    clickReport(id: number) {
      emits('click-report', id)
    },
    expandReply() {
      emits('expand-reply', props.comments.commentList[0].id, expandNum.value)
    },
  }
</script>

<template>
  <div class="comment-block">
    <template
      v-for="comment in comments.commentList"
      :key="comment.id">
      <Comment
        :comment="comment"
        @click-avatar="handle.clickAvatar"
        @click-like="handle.clickLike"
        @click-reply="handle.clickReplay"
        @click-report="handle.clickReport" />
    </template>
    <span
      class="expand"
      v-if="expandNum > 0"
      @click="handle.expandReply"
      >展开 {{ expandNum }} 条回复</span
    >
  </div>
</template>

<style scoped lang="less">
  .comment-block {
    margin-bottom: 16px;

    & > :not(:first-child) {
      margin-left: 48px;
    }

    .expand {
      font-size: 14px;
      margin-left: 48px;
      cursor: pointer;
      color: rgb(19, 56, 108);
    }
  }
</style>
