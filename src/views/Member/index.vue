<script setup lang="ts">
  import { ref, onMounted, computed } from "vue";
  import { useStore } from "@/store";
  import { useUserStore } from "@/store/user";
  import {
    getMemberCenterInfo,
    getMyComments,
    getMyCollections,
    getMyLikes,
    getSystemMessages,
  } from "@/api/member";
  import type {
    MemberCenterInfo,
    MyCommentInfo,
    MyCollectionInfo,
    MyLikeInfo,
    SystemMessageInfo,
  } from "@/types/info";
  import type { ExploreChannelItem } from "@/types/item";
  import ExploreChannelBar from "../Explore/comp/ExploreChannelBar.vue";
  import UserInfo from "../User/UserInfo.vue";

  const store = useStore();
  const userStore = useUserStore();

  // 会员中心数据
  const memberInfo = ref<MemberCenterInfo | null>({
    userInfo: {
      id: "1221", // 用户ID
      name: "John Doe", // 用户名
      avatarUrl:
        "https://sm.ign.com/t/ign_pk/cover/a/avatar-gen/avatar-generations_rpge.600.jpg", // 用户头像
      isFollow: true, // 是否关注
      desc: "这个人很懒，什么都没有留下...",
      followCount: 222, // 关注数
      followerCount: 1111, // 粉丝数
      likedCount: 1233, // 获赞和收藏
      noteCount: 4332, // 笔记数
      starCount: 1223, // 收藏数
    },
    myCollections: [] as MyCollectionInfo[],
    myComments: [] as MyCommentInfo[],
    myLikes: [] as MyLikeInfo[],
    systemMessages: [] as SystemMessageInfo[],
  });
  const loading = ref(true);

  // 当前选中的标签页
  const activeTab = ref("info");

  // 标签页配置
  const tabItems: ExploreChannelItem[] = [
    { label: "个人信息", value: "info" },
    { label: "我的评论", value: "comments" },
    { label: "我的收藏", value: "collections" },
    { label: "我的点赞", value: "likes" },
    { label: "系统消息", value: "messages" },
  ];

  // 计算属性
  const currentTabData = computed(() => {
    if (!memberInfo.value) return [];

    switch (activeTab.value) {
      case "comments":
        return memberInfo.value.myComments;
      case "collections":
        return memberInfo.value.myCollections;
      case "likes":
        return memberInfo.value.myLikes;
      case "messages":
        return memberInfo.value.systemMessages;
      default:
        return [];
    }
  });

  const unreadMessageCount = computed(() => {
    if (!memberInfo.value) return 0;
    return memberInfo.value.systemMessages.filter((msg) => !msg.isRead).length;
  });

  // 事件处理
  const handleTabClick = (item: ExploreChannelItem) => {
    activeTab.value = item.value;
  };

  const handleNoteClick = (noteId: string) => {
    // 跳转到笔记详情
    console.log("跳转到笔记:", noteId);
  };

  const handleDeleteComment = (commentId: string) => {
    if (memberInfo.value) {
      memberInfo.value.myComments = memberInfo.value.myComments.filter(
        (comment) => comment.id !== commentId
      );
    }
  };

  const handleRemoveCollection = (collectionId: string) => {
    if (memberInfo.value) {
      memberInfo.value.myCollections = memberInfo.value.myCollections.filter(
        (collection) => collection.id !== collectionId
      );
    }
  };

  const handleRemoveLike = (likeId: string) => {
    if (memberInfo.value) {
      memberInfo.value.myLikes = memberInfo.value.myLikes.filter(
        (like) => like.id !== likeId
      );
    }
  };

  const handleMarkMessageRead = (messageId: string) => {
    if (memberInfo.value) {
      const message = memberInfo.value.systemMessages.find(
        (msg) => msg.id === messageId
      );
      if (message) {
        message.isRead = true;
      }
    }
  };

  // 获取会员中心数据
  const fetchMemberData = async () => {
    try {
      loading.value = true;

      if (!userStore.isLogin || userStore.useId === -1) {
        console.error("用户未登录");
        loading.value = false;
        return;
      }

      const response = await getMemberCenterInfo(userStore.useId.toString());
      if (response.code === 200) {
        memberInfo.value = response.data;
      }
    } catch (error) {
      console.error("获取会员中心数据失败:", error);
    } finally {
      loading.value = false;
    }
  };
  const onInit = async () => {
    fetchMemberData();
    const comments = await getMyComments("1", 10, 100);
    const collections = await getMyCollections("1", 10, 100);
    const messages = await getSystemMessages("1", 10, 100);
    const likes = await getMyLikes("1", 10, 100);

    memberInfo.value?.myCollections.push(...collections.data.list);
    memberInfo.value?.myComments.push(...comments.data.list);
    memberInfo.value?.myLikes.push(...likes.data.list);
    memberInfo.value?.systemMessages.push(...messages.data.list);
  };
  onMounted(() => {
    onInit();
  });
</script>

<template>
  <div class="member-center">
    <div class="member-container">
      <!-- 加载状态 -->
      <div
        v-if="loading"
        class="loading-container"
      >
        <el-skeleton
          :rows="5"
          animated
        />
      </div>

      <!-- 会员中心内容 -->
      <div
        v-else-if="memberInfo"
        class="member-content"
      >
        <!-- 用户信息区域 -->
        <div class="user-section">
          <UserInfo :user="memberInfo.userInfo" />
        </div>
        <!-- 标签页导航 -->
        <div class="tab-navigation">
          <ExploreChannelBar
            :items="tabItems"
            :active-value="activeTab"
            @click-item="handleTabClick"
          />
          <div
            v-if="unreadMessageCount > 0 && activeTab !== 'messages'"
            class="message-badge"
          >
            {{ unreadMessageCount }} 条未读消息
          </div>
        </div>

        <el-divider />

        <!-- 内容区域 -->
        <div class="content-section">
          <!-- 个人信息 -->
          <div
            v-if="activeTab === 'info'"
            class="info-content"
          >
            <div class="info-stats">
              <div class="stat-item">
                <div class="stat-number text-primary">
                  {{ memberInfo.userInfo.noteCount }}
                </div>
                <div class="stat-label">笔记</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  {{ memberInfo.userInfo.starCount }}
                </div>
                <div class="stat-label">收藏</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  {{ memberInfo.userInfo.likedCount }}
                </div>
                <div class="stat-label">获赞</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  {{ memberInfo.userInfo.followCount }}
                </div>
                <div class="stat-label">关注</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">
                  {{ memberInfo.userInfo.followerCount }}
                </div>
                <div class="stat-label">粉丝</div>
              </div>
            </div>
            <div class="user-desc">
              <h3>个人简介</h3>
              <p>
                {{
                  memberInfo.userInfo.desc || "这个人很懒，什么都没有留下..."
                }}
              </p>
            </div>
          </div>

          <!-- 我的评论 -->
          <div
            v-else-if="activeTab === 'comments'"
            class="comments-content"
          >
            <div
              v-if="memberInfo.myComments.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无评论" />
            </div>
            <div
              v-else
              class="comment-list"
            >
              <div
                v-for="comment in memberInfo.myComments"
                :key="comment.id"
                class="comment-item"
              >
                <div class="comment-header">
                  <img
                    :src="comment.noteCover"
                    :alt="comment.noteTitle"
                    class="note-cover"
                    @click="handleNoteClick(comment.noteId)"
                  />
                  <div class="comment-info">
                    <h4 @click="handleNoteClick(comment.noteId)">
                      {{ comment.noteTitle }}
                    </h4>
                    <p class="comment-content">{{ comment.content }}</p>
                    <div class="comment-meta">
                      <span class="time">{{ comment.createTime }}</span>
                      <span class="stats">
                        {{ comment.likeCount }} 赞 ·
                        {{ comment.replyCount }} 回复
                      </span>
                    </div>
                  </div>
                  <el-button
                    type="danger"
                    size="small"
                    text
                    @click="handleDeleteComment(comment.id)"
                  >
                    删除
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的收藏 -->
          <div
            v-else-if="activeTab === 'collections'"
            class="collections-content"
          >
            <div
              v-if="memberInfo.myCollections.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无收藏" />
            </div>
            <div
              v-else
              class="collection-grid"
            >
              <div
                v-for="collection in memberInfo.myCollections"
                :key="collection.id"
                class="collection-item"
              >
                <div
                  class="collection-cover"
                  @click="handleNoteClick(collection.noteId)"
                >
                  <img
                    :src="collection.noteCover"
                    :alt="collection.noteTitle"
                  />
                  <div class="collection-overlay">
                    <el-button
                      type="danger"
                      size="small"
                      @click.stop="handleRemoveCollection(collection.id)"
                    >
                      取消收藏
                    </el-button>
                  </div>
                </div>
                <div class="collection-info">
                  <h4 @click="handleNoteClick(collection.noteId)">
                    {{ collection.noteTitle }}
                  </h4>
                  <div class="author-info">
                    <img
                      :src="collection.authorAvatar"
                      :alt="collection.authorName"
                    />
                    <span>{{ collection.authorName }}</span>
                  </div>
                  <div class="collection-meta">
                    <span>{{ collection.likeCount }} 赞</span>
                    <span>{{ collection.collectTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 我的点赞 -->
          <div
            v-else-if="activeTab === 'likes'"
            class="likes-content"
          >
            <div
              v-if="memberInfo.myLikes.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无点赞" />
            </div>
            <div
              v-else
              class="like-grid"
            >
              <div
                v-for="like in memberInfo.myLikes"
                :key="like.id"
                class="like-item"
              >
                <div
                  class="like-cover"
                  @click="handleNoteClick(like.noteId)"
                >
                  <img
                    :src="like.noteCover"
                    :alt="like.noteTitle"
                  />
                  <div class="like-overlay">
                    <el-button
                      type="warning"
                      size="small"
                      @click.stop="handleRemoveLike(like.id)"
                    >
                      取消点赞
                    </el-button>
                  </div>
                </div>
                <div class="like-info">
                  <h4 @click="handleNoteClick(like.noteId)">
                    {{ like.noteTitle }}
                  </h4>
                  <div class="author-info">
                    <img
                      :src="like.authorAvatar"
                      :alt="like.authorName"
                    />
                    <span>{{ like.authorName }}</span>
                  </div>
                  <div class="like-meta">
                    <span>{{ like.likeTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 系统消息 -->
          <div
            v-else-if="activeTab === 'messages'"
            class="messages-content"
          >
            <div
              v-if="memberInfo.systemMessages.length === 0"
              class="empty-state"
            >
              <el-empty description="暂无消息" />
            </div>
            <div
              v-else
              class="message-list"
            >
              <div
                v-for="message in memberInfo.systemMessages"
                :key="message.id"
                class="message-item"
                :class="{ unread: !message.isRead }"
                @click="handleMarkMessageRead(message.id)"
              >
                <div class="message-icon">{{ message.icon }}</div>
                <div class="message-content">
                  <div class="message-header">
                    <h4>{{ message.title }}</h4>
                    <span class="message-time">{{ message.createTime }}</span>
                  </div>
                  <p class="message-text">{{ message.content }}</p>
                  <div
                    v-if="!message.isRead"
                    class="unread-dot"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 错误状态 -->
      <div
        v-else
        class="error-state"
      >
        <el-empty description="加载失败，请重试" />
        <el-button @click="fetchMemberData">重新加载</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
  @import "@/assets/styles/base.less";

  .member-center {
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding-top: 72px;
  }

  .member-container {
    width: 100%;
    max-width: 1200px;
    padding: 20px;
  }

  .loading-container {
    padding: 40px;
  }

  .member-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .user-section {
    display: flex;
    justify-content: center;
  }

  .tab-navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: relative;
  }

  .message-badge {
    background: var(--el-color-danger);
    color: white;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    position: absolute;
    right: 0;
  }

  .content-section {
    min-height: 400px;
  }

  // 个人信息样式
  .info-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;
  }

  .info-stats {
    display: flex;
    gap: 40px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 24px;
      font-weight: bold;
      color: var(--el-color-primary);
    }

    .stat-label {
      font-size: 14px;
      color: var(--el-text-color-regular);
      margin-top: 4px;
    }
  }

  .user-desc {
    max-width: 600px;
    text-align: center;

    h3 {
      margin-bottom: 10px;
      color: var(--el-text-color-primary);
    }

    p {
      color: var(--el-text-color-regular);
      line-height: 1.6;
    }
  }

  // 评论列表样式
  .comment-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .comment-item {
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    padding: 16px;
    background: var(--el-bg-color);
  }

  .comment-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }

  .note-cover {
    width: 60px;
    height: 60px;
    border-radius: 6px;
    object-fit: cover;
    cursor: pointer;
    flex-shrink: 0;
  }

  .comment-info {
    flex: 1;

    h4 {
      margin: 0 0 8px 0;
      cursor: pointer;
      color: var(--el-text-color-primary);

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .comment-content {
      margin: 0 0 8px 0;
      color: var(--el-text-color-regular);
      line-height: 1.5;
    }

    .comment-meta {
      display: flex;
      gap: 16px;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  // 收藏和点赞网格样式
  .collection-grid,
  .like-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }

  .collection-item,
  .like-item {
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-bg-color);
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .collection-cover,
  .like-cover {
    position: relative;
    height: 150px;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .collection-overlay,
    .like-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover .collection-overlay,
    &:hover .like-overlay {
      opacity: 1;
    }
  }

  .collection-info,
  .like-info {
    padding: 12px;

    h4 {
      margin: 0 0 8px 0;
      font-size: 14px;
      cursor: pointer;
      color: var(--el-text-color-primary);

      &:hover {
        color: var(--el-color-primary);
      }
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;

      img {
        width: 20px;
        height: 20px;
        border-radius: 50%;
      }

      span {
        font-size: 12px;
        color: var(--el-text-color-regular);
      }
    }

    .collection-meta,
    .like-meta {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }

  // 消息列表样式
  .message-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .message-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    background: var(--el-bg-color);
    cursor: pointer;
    position: relative;
    transition: background-color 0.2s;

    &:hover {
      background: var(--el-fill-color-light);
    }

    &.unread {
      border-color: var(--el-color-primary);
      background: var(--el-color-primary-light-9);
    }
  }

  .message-icon {
    font-size: 24px;
    flex-shrink: 0;
  }

  .message-content {
    flex: 1;

    .message-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h4 {
        margin: 0;
        color: var(--el-text-color-primary);
      }

      .message-time {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .message-text {
      margin: 0;
      color: var(--el-text-color-regular);
      line-height: 1.5;
    }
  }

  .unread-dot {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 8px;
    height: 8px;
    background: var(--el-color-danger);
    border-radius: 50%;
  }

  .empty-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
  }

  // 响应式设计
  @media (max-width: 768px) {
    .member-container {
      padding: 10px;
    }

    .info-stats {
      gap: 20px;
    }

    .collection-grid,
    .like-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .comment-header {
      flex-direction: column;
      align-items: stretch;
    }

    .note-cover {
      width: 100%;
      height: 120px;
    }
  }
</style>
