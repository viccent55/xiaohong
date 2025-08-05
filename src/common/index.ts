import type { NoteDetailInfo, UserDetailInfo } from '@/types/info'
import {
  type DropdownItem,
  type NavigationItem,
  type ExploreChannelItem,
  type ExploreFLoatSetItem,
} from '@/types/item'

export const dropDownItems1: DropdownItem[] = [
  {
    label: '创作服务',
  },
  {
    label: '直播管理',
  },
  {
    label: '电脑直播助手',
  },
]

export const dropDownItems2: DropdownItem[] = [
  {
    label: '专业号',
  },
  {
    label: '推广合作',
  },
  {
    label: '蒲公英',
  },
  {
    label: '商家入驻',
  },
  {
    label: 'MCN入驻',
  },
]

export const dropDownItems3: DropdownItem[] = [
  {
    label: '关于小红书',
  },
  {
    label: '隐私、协议',
  },
  {
    label: '帮助与客服',
  },
  {
    divided: true,
    type: 'text',
    label: '设置',
    loginRequired: true,
  },
  {
    label: '退出登录',
    loginRequired: true,
  },
]

export const dropDownItems4: DropdownItem[] = [
  ...dropDownItems1,
  ...dropDownItems2,
  ...dropDownItems3,
]

export const NavigationItems: NavigationItem[] = [
  {
    label: '发现',
    icon: 'House',
    type: 'router-link',
    href: '/explore',
  },
  {
    label: '发布',
    icon: 'VideoPlay',
    type: 'external-link',
    href: 'https://creator.xiaohongshu.com/',
  },
  {
    label: '通知',
    icon: 'Picture',
    type: 'router-link',
    href: '/notification',
  },
  {
    label: '我的',
    icon: 'User',
    type: 'router-link',
    href: '/user',
  },
  {
    label: '会员中心',
    icon: 'Setting',
    type: 'router-link',
    href: '/member',
  },
]

export const ExploreChannelItems: ExploreChannelItem[] = [
  {
    label: '推荐',
    value: 'recommend',
  },
  {
    label: '穿搭',
    value: 'clothing',
  },
  {
    label: '美食',
    value: 'food',
  },
  {
    label: '彩妆',
    value: 'cosmetics',
  },
  {
    label: '影视',
    value: 'entertainment',
  },
  {
    label: '职场',
    value: 'career',
  },
  {
    label: '情感',
    value: 'love',
  },
  {
    label: '家居',
    value: 'home',
  },
  {
    label: '游戏',
    value: 'game',
  },
  {
    label: '旅行',
    value: 'travel',
  },
  {
    label: '健身',
    value: 'fitness',
  },
]

export const ExploreFloatSetItems: ExploreFLoatSetItem[] = [
  {
    icon: 'Top',
    label: 'goto-top',
    active: false,
  },
  {
    icon: 'Refresh',
    label: 'refresh',
    active: false,
  },
]

export const DefaultNoteDetailInfo: NoteDetailInfo = {
  article: {
    id: '-1',
    title: '',
    content: '',
    mediaInfo: {
      imageUrl: [],
    },
    action: {
      likeCount: 0,
      commentCount: 0,
    },
    author: {
      id: '-1',
      name: '',
      avatarUrl: '',
      isFollow: false,
    },
    date: {
      date: '',
      location: '',
    },
    totalCommentCount: 0,
  },
  commentBlocks: [],
}

export const DefaultUserDetailInfo: UserDetailInfo = {
  id: '',
  name: '',
  avatarUrl: '',
  desc: '',
  followCount: 0,
  followerCount: 0,
  likedCount: 0,
  isFollow: false,
  noteCount: 0,
  starCount: 0,
}

export const NotificationChannelItems: ExploreChannelItem[] = [
  {
    label: '评论和@',
    value: 'comment',
  },
  {
    label: '赞和收藏',
    value: 'like',
  },
  {
    label: '新增关注',
    value: 'follow',
  },
]

export const UserChannelItems: ExploreChannelItem[] = [
  {
    label: '笔记',
    value: 'note',
  },
  {
    label: '收藏',
    value: 'star',
  },
]
