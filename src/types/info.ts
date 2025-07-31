// 浏览推荐信息
export interface ExploreFeedInfo {
  id: string // ID
  title: string // 标题
  isPic: boolean // 是否图片
  mediaUrl: string // 媒体地址
  authorName: string // 作者名称
  authorAvatarUrl: string // 作者头像
  likeCount: number // 点赞数
  isLiked: boolean // 是否点赞
}

// 用户信息
export interface UserInfo {
  id: string // 用户ID
  name: string // 用户名
  avatarUrl: string // 用户头像
  isFollow: boolean // 是否关注
}

// 用户详情信息
export interface UserDetailInfo extends UserInfo {
  desc: string // 简介
  followCount: number // 关注数
  followerCount: number // 粉丝数
  likedCount: number // 获赞和收藏
  noteCount: number // 笔记数
  starCount: number // 收藏数
}

// 日期信息
export interface DateInfo {
  date: string
  location: string
}

// 操作信息
export interface ActionInfo {
  commentCount: number // 评论数
  likeCount: number // 点赞数
  favoriteCount?: number // 收藏数
  isLiked?: boolean // 是否点赞
  isFavorited?: boolean // 是否收藏
}

// 媒体信息
export interface MediaInfo {
  videoUrl?: string // 视频地址
  imageUrl: string[] // 图片地址
}

// 评论信息
export interface CommentInfo {
  id: string // ID
  author: UserInfo // 作者信息
  content: string // 内容
  date: DateInfo // 日期信息
  action: ActionInfo // 操作信息
  replyTo?: string // 被回复者名称
}

// 文章信息
export interface ArticleInfo extends CommentInfo {
  title: string // 标题
  mediaInfo: MediaInfo // 媒体信息
  totalCommentCount: number // 总评论数
}

// 评论块信息
export interface CommentBlockInfo {
  commentList: CommentInfo[] // 评论列表
  totalCommentCount: number // 总评论数
}

// 笔记信息
export interface NoteDetailInfo {
  article: ArticleInfo // 文章
  commentBlocks: CommentBlockInfo[] // 评论块列表
}

////////////////////////////////////////////////////////////////////////////////
// 通知信息
////////////////////////////////////////////////////////////////////////////////

// 通知-评论信息
export interface NotificationInfo {
  id: string // ID
  user: UserInfo // 评论者信息
  hint: string // 提示信息
  time: string // 日期信息
  content?: string // 评论内容
  extra?: {
    id: string // 笔记ID
    extraUrl: string // 跳转链接
    quote?: string // 引用内容
  }
}
