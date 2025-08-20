<script setup lang="ts">
  import CommentBlock from "./comp/Comment/CommentBlock.vue";
  import Content from "./comp/Article/Content.vue";
  import CommentContainer from "./comp/Comment/CommentContainer.vue";
  import AuthorHeader from "./comp/Article/AuthorHeader.vue";
  import BottomAction from "./comp/BottomAction.vue";
  

  import { useNoteDialog, noteDialogVisible } from "@/hooks/useNoteDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { computed, defineAsyncComponent, nextTick, ref, useTemplateRef } from "vue";
  import type { ActionInfo, CommentBlockInfo } from "@/types/info";
  import * as Api from "@/api/note";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { openPage } from "@/service";
  import { ElMessage } from "element-plus";

  const bottomRef = useTemplateRef("bottomActions");
  const noteDIalogRef = useTemplateRef("note-dialog");
  const Swiper = defineAsyncComponent(() => import("./comp/Article/Swiper.vue"));

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
  // 评论块是否加载我完
  const blockFulled = computed(() => {
    return article.value?.action?.commentCount <= commentBlocks.value?.length;
  });

  // 事件处理
  const handle = {
    // 查看作者主页
    clickAuthor(id: string) {
      console.log("点击作者");
      openPage(`http://localhost:5173/user/${id}`);
    },
    // 关注
    clickFollow(id: string) {
      console.log("关注");
      checkPermissions(PERMISSION.User, () => {
        if (article.value?.author.isFollow) {
          Api.follow(id).then((res) => {
            if (res.code !== 200) return;
            article.value.author.isFollow = false;
          });
        } else {
          Api.unfollow(id).then((res) => {
            if (res.code !== 200) return;
            article.value.author.isFollow = true;
          });
        }
      });
    },
    // 点赞
    clickLike(item: ActionInfo, id?: string) {
      console.log("点赞");
      checkPermissions(PERMISSION.User, () => {
        const id_ = id || article.value.id;

        if (item.isLiked) {
          Api.like(id_).then((res) => {
            if (res.code !== 200) return;
            item.isLiked = false;
            item.likeCount -= 1;
          });
        } else {
          Api.unlike(id_).then((res) => {
            if (res.code !== 200) return;
            item.isLiked = true;
            item.likeCount += 1;
          });
        }
      });
    },
    // 分享
    clickShare() {
      console.log("分享");
      // TODO: 实现分享功能
    },
    // 收藏
    clickStar(item: ActionInfo) {
      console.log("收藏");
      checkPermissions(PERMISSION.User, () => {
        const id = article.value.id;

        if (item.isFavorited) {
          Api.unstar(id).then((res) => {
            if (res.code !== 200) return;
            item.isFavorited = false;
            if (item.favoriteCount) item.favoriteCount -= 1;
          });
        } else {
          Api.star(id).then((res) => {
            if (res.code !== 200) return;
            item.isFavorited = true;
            if (item.favoriteCount) item.favoriteCount += 1;
          });
        }
      });
    },
    // 举报
    clickReport(id: string) {
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
    clickReplyTo(id: string, content: string, to?: string) {
      checkPermissions(PERMISSION.User, () => {
        Api.reply(id, content, to || undefined).then((res) => {
          if (res.code !== 200) return;

          const comment = res.data;

          // 回复
          if (comment.replyTo) {
            commentBlocks.value.forEach((block) => {
              // 找到对应评论块
              let index = block.commentList.findIndex((c) => c.id == id);

              // 将评论插入对应评论后面
              if (index !== -1) block.commentList.splice(index + 1, 0, comment);
            });
          }
          // 评论
          else {
            const block = {
              commentList: [comment],
              totalCommentCount: 1,
            };
            // 新评论块插入最前面
            commentBlocks.value = [block, ...commentBlocks.value];
          }

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
        Api.getComments(noteDialog.id.value, num_).then((res) => {
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

  // 打开弹窗时执行
  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    Api.getNoteDetail(Number(noteDialog.id.value)).then((res) => {
      article.value = res.data;
      commentBlocks.value = res.data.commentBlocks;
    });
  };
  const swiperInstanceRef = ref<InstanceType<typeof Swiper> | null>(null);
  const onCloseNoteDialog =async () => {
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
    style="max-width: 1100px"
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
          :author="article?.author"
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
          :action="article?.action"
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
