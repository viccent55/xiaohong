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

  import { useNoteDialog, noteDialogVisible } from "@/hooks/useNoteDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import {
    computed,
    defineAsyncComponent,
    ref,
    useTemplateRef,
    nextTick,
    onBeforeUnmount,
    watch,
  } from "vue";
  import type { PluginListenerHandle } from "@capacitor/core";
  import type { CommentBlockInfo } from "@/types/info";
  import * as Api from "@/api/note";
  import { getNoteDetail } from "@/api/getMethod";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { ElMessage } from "element-plus";
  import { useUserStore } from "@/store/user";
  import useVariable from "@/composables/useVariable";

  const { onCopy, route, store } = useVariable();
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
    return article.value?.fields;
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
      const url = `${window.location.origin}/#/user/${id}`;
      window.location.href = url;
      window.location.reload();
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
      onCopy(getCurrentDomain() + route.fullPath);
    },
    // 收藏
    clickStar(item: EmptyObjectType) {
      console.log("收藏");
      checkPermissions(PERMISSION.User, () => {
        const id_ = article.value.id;
        Api.star(id_).then((res) => {
          if (res.errcode == 0) {
            item.isStar = !item.isStar;
            if (item.isStar) {
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
          article.value.comment_count++;
          console.log("res => ", comment);
          getComments();
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
        Api.getComments(Number(noteDialog.id.value)).then((res) => {
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
    getNoteDetail(Number(noteDialog.id.value), storeUser?.visitCode).then(
      (res) => {
        article.value = res.data;
        getComments();
      }
    );
  };
  const swiperInstanceRef = ref<InstanceType<typeof Swiper> | null>(null);
  const mediaContainerRef = ref<HTMLElement | null>(null);
  const onCloseNoteDialog = async () => {
    await nextTick();
    if (swiperInstanceRef.value) {
      swiperInstanceRef.value.closeVideo();
    }
  };
  // onBeforeRouteLeave((to, from, next) => {

  //   if (noteDialog.id.value) return;
  //   next();
  // });
  // keep track of touch start X and Y for swipe gestures
  let startX = 0;
  let startY = 0;
  let isTouchingMedia = false;

  function onTouchStart(e: TouchEvent) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;

    if (
      mediaContainerRef.value &&
      mediaContainerRef.value.contains(e.target as Node)
    ) {
      isTouchingMedia = true;
    } else {
      isTouchingMedia = false;
    }
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

    if (!swiperInstanceRef.value) return;

    // Swipe left/right to navigate the swiper
    if (isHorizontalSwipe) {
      if (deltaX < -50) {
        swiperInstanceRef.value.next();
      } else if (deltaX > 50 && !isEdgeSwipe) {
        // only allow swiper navigation if not from the extreme edge
        swiperInstanceRef.value.prev();
      }
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
        ref="mediaContainerRef"
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
            isFollow: article?.isFollow,
          }"
          @click-close="noteDialog.closeNoteDialog"
          @click-author="handle.clickAuthor"
          @click-follow="handle.clickFollow"
        />

        <!-- 图片/视频区域 -->
        <div
          ref="mediaContainerRef"
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
          @click-ads="adsClick"
        />

        <!-- 评论区域 -->

        <CommentContainer
          :fulled="blockFulled"
          :total="total"
          @more-comments="handle.getMoreComments"
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
       width: 375px;
       border-left: 1px solid var(--border-color);
    });
  }
</style>
