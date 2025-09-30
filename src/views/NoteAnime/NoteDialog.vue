<script setup lang="ts">
  import CommentBlock from "./comp/Comment/CommentBlock.vue";
  import CommentContainer from "./comp/Comment/CommentContainer.vue";
  import AuthorHeader from "./comp/Article/AuthorHeader.vue";
  import { Keyboard } from "@capacitor/keyboard";
  import BottomAction from "./comp/BottomAction.vue";
  import { getCurrentDomain } from "@/service";
  import { App } from "@capacitor/app";
  import { Capacitor } from "@capacitor/core";
  import { adsClick } from "@/api/advertisment";
  import { animeDetail, like, star } from "@/api/anime";
  import {
    useNoteAnimeDialog,
    noteDialogVisible,
  } from "@/hooks/useNoteAnimeDialog";
  import { screenMode } from "@/hooks/useScreenMode";
  import Date from "./comp/Date.vue";

  import {
    computed,
    ref,
    useTemplateRef,
    onBeforeUnmount,
    watch,
    defineAsyncComponent,
    nextTick,
  } from "vue";
  import type { PluginListenerHandle } from "@capacitor/core";
  import type { CommentBlockInfo } from "@/types/info";
  import { checkPermissions } from "@/hooks/usePermisions";
  import { PERMISSION } from "@/common/permision";
  import { ElMessage } from "element-plus";
  import useVariable from "@/composables/useVariable";

  const VideoPlayer = defineAsyncComponent(
    () => import("@/components/Video.vue")
  );

  const videoPlayerRef = ref();
  const {
    onCopy,
    route,
    store,
    disableHorizontalSwipe,
    enableHorizontalSwipe,
  } = useVariable();
  const bottomRef = useTemplateRef("bottomActions");
  const noteDIalogRef = useTemplateRef("note-dialog");
  const noteDialog = useNoteAnimeDialog();

  // 文章信息
  const article = ref<EmptyObjectType>({});
  // 评论块列表
  const commentBlocks = ref<CommentBlockInfo[]>([]);

  // 全部评论
  const total = computed(() => {
    return article.value?.comment_count;
  });

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
  };

  const onOpenNoteDialog = async () => {
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    if (noteDIalogRef.value) noteDIalogRef.value.scrollTop = 0;
    animeDetail(Number(noteDialog.id.value)).then((res) => {
      article.value = res.data;
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
  const onCloseNoteDialog = async () => {
    noteDialog.closeNoteDialog();
    await nextTick();
    if (videoPlayerRef.value) {
      videoPlayerRef.value?.closeVideo();
    }
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
        <el-row
          :gutter="24"
          class="px-5"
        >
          <el-col
            :span="24"
            :md="16"
          >
            <div class="title">{{ article?.title }}</div>
            <div>
              <VideoPlayer
                v-if="article?.m3u8"
                :src="article?.m3u8"
                ref="videoPlayerRef"
              ></VideoPlayer>
            </div>
          </el-col>
          <el-col
            :span="24"
            :md="8"
          >
            <div class="date-wrapper">
              <Date
                isAuthor
                :date="{
                  date: article?.created_at,
                  location: article?.author?.location,
                }"
                class="date"
              />
            </div>
            <div class="mt-2 grid grid-cols-3 gap-3">
              <a
                v-for="(app, index) in store?.detailAppAds"
                :key="index"
                :href="app.url || '#'"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 hover:opacity-80"
                @click="adsClick(app.id)"
              >
                <AdvertSlot
                  :advert="{
                    title: app.name,
                    image: app.image,
                    url: app?.url,
                  }"
                  fit="cover"
                  style="width: 28px; height: 28px"
                />
                <span class="text-xs info">{{ app.name }}</span>
              </a>
            </div>
            <CommentContainer
              class="mt-5"
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
                />
              </template>
            </CommentContainer>
          </el-col>
        </el-row>

        <!-- 评论区域 -->
        <BottomAction
          ref="bottomActions"
          :action="article"
          :total="total"
          @click-like="handle.clickLike"
          @click-star="handle.clickStar"
          @click-share="handle.clickShare"
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
  }
  .date {
    font-size: 14px;
  }

  .date-wrapper {
    margin-top: 12px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .title {
    font-size: 22px;
    color: var(--text-color-dark);
    margin-bottom: 8px;
    font-weight: 800;
  }

  .content {
    font-size: 14px;
  }
</style>
