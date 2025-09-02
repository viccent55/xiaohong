<script setup lang="ts">
  import CommentBlock from "./comp/Comment/CommentBlock.vue";
  import Content from "./comp/Article/Content.vue";
  import CommentContainer from "./comp/Comment/CommentContainer.vue";
  import AuthorHeader from "./comp/Article/AuthorHeader.vue";
  import BottomAction from "./comp/BottomAction.vue";

  import { useNoteDialog, noteDialogVisible } from "@/hooks/useNoteDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import {
    computed,
    defineAsyncComponent,
    nextTick,
    ref,
    useTemplateRef,
  } from "vue";
  import type { CommentBlockInfo } from "@/types/info";
  import * as Api from "@/api/note";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { openPage } from "@/service";
  import { ElMessage } from "element-plus";
  import { useUserStore } from "@/store/user";

  const bottomRef = useTemplateRef("bottomActions");
  const noteDIalogRef = useTemplateRef("note-dialog");
  const Swiper = defineAsyncComponent(
    () => import("./comp/Article/Swiper.vue")
  );

  const noteDialog = useNoteDialog();

  // 文章信息
  const article = ref<EmptyObjectType>({});
  // 评论块列表
  const commentBlocks = ref<CommentBlockInfo[]>([]);

  // 全部评论
  const total = computed(() => {
    return article.value?.comment_count;
  });
  // 媒体信息
  const media = computed(() => {
    return article.value.fields;
  });
  const getComments = async () => {
    if (!noteDialog.id.value) return;
    Api.getComments(noteDialog.id.value).then((res) => {
      if (res.errcode !== 0) return;
      commentBlocks.value = res.data;
    });
  };
  // 评论块是否加载我完
  const blockFulled = computed(() => {
    return article.value?.action?.commentCount <= commentBlocks.value?.length;
  });

  // 事件处理
  const handle = {
    // 查看作者主页
    clickAuthor(id: string) {
      const url = `${window.location.origin}/user/${id}`;
      openPage(url);
    },
    // 关注
    clickFollow(id: number) {
      console.log("关注", id);
      checkPermissions(PERMISSION.User, () => {
        Api.follow(id).then((res) => {
          if (res.errcode !== 0) return;
          article.value.isFollow = !article.value.isFollow;
        });
      });
    },
    // 点赞
    clickLike(item: EmptyObjectType) {
      console.log("点赞");
      checkPermissions(PERMISSION.User, () => {
        const id_ = item.id;
        Api.like(id_).then((res) => {
          if (res.errcode == 0) {
            item.isLike = !item.isLike;
            if (!item.isLike) {
              item.like_count++;
            } else {
              item.like_count--;
            }
          }
        });
      });
    },
    // 分享
    clickShare() {
      console.log("分享");
      // TODO: 实现分享功能
    },
    // 收藏
    clickStar(item: EmptyObjectType) {
      console.log("收藏");
      checkPermissions(PERMISSION.User, () => {
        const id_ = article.value.id;
        Api.like(id_).then((res) => {
          if (res.errcode == 0) {
            item.isStar = !item.isStar;
            if (!item.isStar) {
              item.collect_count++;
            } else {
              item.collect_count--;
            }
          }
        });
      });
    },
    // 举报
    clickReport(id: number) {
      console.log("举报");
      checkPermissions(PERMISSION.User, () => {
        Api.report(id).then((res) => {
          if (res.code !== 200) return;

          ElMessage.warning(res.msg);
        });
      });
    },
    // 评论
    clickReply(id: string, to: string | null) {
      checkPermissions(PERMISSION.User, () => {
        bottomRef.value?.inputFocus(id, to);
      });
    },
    // 提交评论
    clickReplyTo(id: string, content: string, to = {}) {
      checkPermissions(PERMISSION.User, () => {
        Api.reply(id, content, 0).then((res) => {
          if (res.errcode != 0) return;
          const comment = res.data;
          console.log("res => ", comment);
          // if (comment.replyTo) {
          //   commentBlocks.value.forEach((block) => {
          //     let index = block.commentList.findIndex((c) => c.id == id);
          //     if (index !== -1) block.commentList.splice(index + 1, 0, comment);
          //   });
          // }
          // else {
          //   const block = {
          //     commentList: [comment],
          //     totalCommentCount: 1,
          //   };
          //   // 新评论块插入最前面
          //   commentBlocks.value = [block, ...commentBlocks.value];
          // }

          article.value.totalCommentCount += 1;
        });
      });
    },
    // 获取更多评论
    getMoreComments() {
      console.log("更多评论");
      checkPermissions(PERMISSION.User, () => {
        // 获取当前评论块数量
        const curr_num = commentBlocks.value.length;
        // 获取文章的总评论块数
        const total_num = article.value.action.commentCount;
        // 将获取的评论数限制在5内
        const num_ = curr_num + 5 > total_num ? total_num - curr_num : 5;
        Api.getComments(Number(noteDialog.id.value), num_).then((res) => {
          if (res.code !== 200) return;

          const list = res.data;
          // 将评论列表添加到评论列表中
          commentBlocks.value.push(...list);
        });
      });
    },
    // 获取更多回复
    clickMoreReplies(id: string, num: number) {
      console.log("更多回复");
      checkPermissions(PERMISSION.User, () => {
        // 限制获取的回复数
        const num_ = num > 5 ? 5 : num;
        Api.getReplies(id, num_).then((res) => {
          if (res.code !== 200) return;

          const list = res.data;

          commentBlocks.value.forEach((block) => {
            if (block.commentList[0].id == id) {
              block.commentList.push(...list);
            }
          });
        });
      });
    },
  };
  const storeUser = useUserStore();
  // 打开弹窗时执行
  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    Api.getNoteDetail(Number(noteDialog.id.value), storeUser?.visitCode).then(
      (res) => {
        article.value = res.data;
        getComments();
      }
    );
  };
  const swiperInstanceRef = ref<InstanceType<typeof Swiper> | null>(null);
  const onCloseNoteDialog = async () => {
    await nextTick();
    if (swiperInstanceRef.value) {
      swiperInstanceRef.value.closeVideo();
    }
  };
</script>

<template>
  <el-dialog
    @open="onOpenNoteDialog"
    @close="onCloseNoteDialog"
    v-model="noteDialogVisible"
    :fullscreen="screenMode !== 'pc'"
    width="80%"
    style="max-width: 1100px; padding: 0; border-radius: 16px"
    :show-close="false"
    align-center
  >
    <div class="note-dialog">
      <div
        class="media-container"
        v-if="screenMode === 'pc'"
      >
        <Swiper
          ref="swiperInstanceRef"
          :media-info="media"
        />
      </div>

      <!-- 文章内容区域 -->
      <div
        class="container"
        ref="note-dialog"
      >
        <!-- 作者信息 -->
        <AuthorHeader
          :author="{
            ...article?.author,
            isFollow: article.isFollow,
          }"
          @click-close="noteDialog.closeNoteDialog"
          @click-author="handle.clickAuthor"
          @click-follow="handle.clickFollow"
        />

        <!-- 图片/视频区域 -->
        <div
          class="media-container"
          v-if="screenMode !== 'pc'"
        >
          <Swiper
            ref="swiperInstanceRef"
            :media-info="media"
          />
        </div>

        <!-- 文章内容 -->
        <Content
          :article="article"
          @click-report="handle.clickReport"
        />

        <!-- 评论区域 -->

        <CommentContainer
          :fulled="blockFulled"
          :total="total"
          @more-comments="handle.getMoreComments"
        >
          <template v-for="block in commentBlocks">
            <CommentBlock
              :comments="block"
              @click-author="handle.clickAuthor"
              @click-like="handle.clickLike"
              @click-replay="handle.clickReply"
              @click-report="handle.clickReport"
              @expand-reply="handle.clickMoreReplies"
            />
          </template>
        </CommentContainer>

        <!-- 评论区域 -->
        <BottomAction
          ref="bottomActions"
          :action="article"
          :total="total"
          @click-like="handle.clickLike"
          @click-star="handle.clickStar"
          @click-reply="handle.clickReply"
          @click-share="handle.clickShare"
          @click-reply-to="handle.clickReplyTo"
        />
      </div>
    </div>
  </el-dialog>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .note-dialog {
    position: relative;
    display: flex;
    overflow: hidden;

    .mobile-mode({
      height: 100vh;
      flex-direction: column;
    });

    .pc-mode({
      height: 90vh;
    });
  }

  .media-container {
    width: 100%;
    // display: flex;

    .pc-mode({
      flex: 1;
    });
  }

  .container {
    width: 100%;
    height: 100%;
    overflow: auto;
    scrollbar-width: none;
    display: flex;
    flex-direction: column;

    .pc-mode({
       width: 375px;
       border-left: 1px solid var(--border-color);
    });
  }
</style>
