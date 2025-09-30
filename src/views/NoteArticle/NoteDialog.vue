<script setup lang="ts">
  import CommentBlock from "./comp/Comment/CommentBlock.vue";
  import Content from "./comp/Article/Content.vue";
  import CommentContainer from "./comp/Comment/CommentContainer.vue";
  import AuthorHeader from "./comp/Article/AuthorHeader.vue";
  import { Keyboard } from "@capacitor/keyboard";
  import BottomAction from "./comp/BottomAction.vue";
  import { getCurrentDomain } from "@/service";
  import { App } from "@capacitor/app";
  import { Capacitor } from "@capacitor/core";
  import { adsClick } from "@/api/advertisment";
  import { articleDtail, like, star, comment, comments } from "@/api/article";
  import {
    useNoteArticleDialog,
    noteDialogVisible,
  } from "@/hooks/useNoteArticleDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import { computed, ref, useTemplateRef, onBeforeUnmount, watch } from "vue";
  import type { PluginListenerHandle } from "@capacitor/core";
  import type { CommentBlockInfo } from "@/types/info";
  import * as Api from "@/api/note";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { ElMessage } from "element-plus";
  import useVariable from "@/composables/useVariable";

  const {
    onCopy,
    route,
    store,
    disableHorizontalSwipe,
    enableHorizontalSwipe,
  } = useVariable();
  const bottomRef = useTemplateRef("bottomActions");
  const noteDIalogRef = useTemplateRef("note-dialog");

  const noteDialog = useNoteArticleDialog();

  // 文章信息
  const article = ref<EmptyObjectType>({});
  // 评论块列表
  const commentBlocks = ref<CommentBlockInfo[]>([]);

  // 全部评论
  const total = computed(() => {
    return article.value?.comment_count;
  });

  const getComments = async () => {
    if (!noteDialog.id.value) return;
    comments(Number(noteDialog.id.value)).then((res) => {
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
    clickAuthor(id: string) {
      const url = `${window.location.origin}/#/user/${id}`;
      window.location.href = url;
      window.location.reload();
    },

    // 点赞
    clickLike(item: EmptyObjectType) {
      console.log("点赞");
      checkPermissions(PERMISSION.User, () => {
        const id_ = item.id;
        like(id_).then((res) => {
          if (res.errcode == 0) {
            item.isLike = !item.isLike;
            if (item.isLike) {
              item.like_count++;
            } else {
              item.like_count--;
            }
          }
        });
      });
    },
    // 分享`
    clickShare() {
      ElMessage.success("链接已复制!");
      onCopy(getCurrentDomain() + "/#" + route.fullPath);
    },
    // 收藏
    clickStar(item: EmptyObjectType) {
      console.log("收藏");
      checkPermissions(PERMISSION.User, () => {
        const id_ = article.value.id;
        star(id_).then((res) => {
          if (res.errcode == 0) {
            item.isStar = !item.isStar;
            if (item.isStar) {
              item.star_count++;
            } else {
              item.star_count--;
            }
          }
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
        const request = {
          id: id,
          content: content,
        };
        comment(request).then((res) => {
          if (res.errcode != 0) return;
          const comment = res.data;
          article.value.comment_count++;
          console.log("res => ", comment);
          getComments();

          article.value.totalCommentCount += 1;
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
  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    articleDtail(Number(noteDialog.id.value)).then((res) => {
      article.value = res.data;
      getComments();
    });
    disableHorizontalSwipe();
  };

  let startX = 0;
  let startY = 0;
  let isTouchingMedia = false;

  function onTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }

  function onTouchEnd(e: TouchEvent) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const isHorizontalSwipe = Math.abs(deltaX) > Math.abs(deltaY);

    // Edge swipe threshold (avoid iOS system gesture zone)
    const isEdgeSwipe = startX < 30;

    if (
      screenMode.value !== "pc" &&
      isHorizontalSwipe &&
      deltaX > 50 &&
      (isEdgeSwipe || !isTouchingMedia)
    ) {
      e.preventDefault(); // 🚀 block default back-swipe
      noteDialog.closeNoteDialog();
      return;
    }
  }

  let keyboardWillShowListener: PluginListenerHandle | null = null;
  let keyboardWillHideListener: PluginListenerHandle | null = null;
  let backButtonListener: PluginListenerHandle | null = null;

  watch(noteDialogVisible, async (isVisible) => {
    if (!Capacitor.isNativePlatform()) return;

    await removeAllListeners();

    if (isVisible) {
      const noteDialogEl = noteDIalogRef.value;
      if (!noteDialogEl) return;

      const platform = Capacitor.getPlatform();
      const showEvent: any =
        platform === "ios" ? "keyboardWillShow" : "keyboardDidShow";
      const hideEvent: any =
        platform === "ios" ? "keyboardWillHide" : "keyboardDidHide";

      keyboardWillShowListener = await Keyboard.addListener(
        showEvent,
        (info) => {
          noteDialogEl.style.setProperty(
            "--keyboard-height",
            `${info.keyboardHeight}px`
          );
          setTimeout(() => {
            bottomRef.value?.$el.scrollIntoView({
              behavior: "smooth",
              block: "end",
            });
          }, 20); // Increased delay slightly for Android
        }
      );

      keyboardWillHideListener = await Keyboard.addListener(hideEvent, () => {
        noteDialogEl.style.removeProperty("--keyboard-height");
      });

      if (platform === "android") {
        backButtonListener = await App.addListener(
          "backButton",
          ({ canGoBack }) => {
            if (noteDialog.id.value) {
              noteDialog.closeNoteDialog();
            } else if (canGoBack) {
              window.history.back();
            } else {
              App.exitApp();
            }
          }
        );
      }
    }
  });
  const onCloseNoteDialog = () => {
    noteDialog.closeNoteDialog();
    enableHorizontalSwipe();
  };
  const removeAllListeners = async () => {
    await keyboardWillShowListener?.remove();
    await keyboardWillHideListener?.remove();
    await backButtonListener?.remove();
  };

  onBeforeUnmount(removeAllListeners);
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
    <div
      class="note-dialog"
      @touchstart="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        class="container"
        ref="note-dialog"
      >
        <AuthorHeader @click-close="noteDialog.closeNoteDialog" />

        <Content
          :article="article"
          @click-ads="adsClick"
        />

        <!-- 评论区域 -->

        <CommentContainer
          :fulled="blockFulled"
          :total="total"
        >
          <el-card
            v-for="(app, index) in store.detailAds"
            :key="index"
            body-style="padding: 0;"
            class="my-2"
          >
            <a
              :href="app.url"
              target="_blank"
              rel="noopener noreferrer"
              class=""
              @click="adsClick(app.id)"
            >
              <AdvertSlot
                :advert="{
                  title: app.name,
                  image: app.image,
                  url: app?.url,
                }"
                fit="cover"
              />
            </a>
          </el-card>
          <template
            v-for="block in commentBlocks"
            :key="block.id"
          >
            <CommentBlock
              :comment="block"
              @click-author="handle.clickAuthor"
              @click-like="handle.clickLike"
              @click-replay="handle.clickReply"
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
      // height: calc(100vh - 100px);
      flex-direction: column;
      padding-top: var(--safe-area-inset-top, 0px);
      padding-bottom: var(--safe-area-inset-bottom, 0px);
      padding-left: var(--safe-area-inset-left, 0px);
      padding-right: var(--safe-area-inset-right, 0px);
      padding-bottom: calc(var(--safe-area-inset-bottom, 0px) + var(--keyboard-height, 0px)) !important;
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
      //  width: 375px;
       border-left: 1px solid var(--border-color);
    });
  }
</style>
