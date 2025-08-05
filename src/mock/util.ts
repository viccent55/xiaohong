import Mock, { Random } from 'mockjs'
import type {
  CommentBlockInfo,
  CommentInfo,
  ExploreFeedInfo,
  MediaInfo,
  NotificationInfo,
  UserDetailInfo,
} from '@/types/info'

export const CONST = {
  VIDEO_URL: 'https://www.w3school.com.cn/example/html5/mov_bbb.mp4',
  TOKEN: 'xxx',
  CAPTCHA: '123456',
  QR_CODE_URL: '这是二维码地址',
  USER_ID: '123456',
  COMMENT_TYPE: ['评论了你的笔记', '回复了你的评论', '在评论中@了你'],
  LIKE_TYPE: ['赞了你的笔记', '赞了你的评论', '收藏了你的笔记'],
}

// 获取参数
export function queryParams(reqeust: any) {
  if (reqeust.type === 'GET') {
    const url_ = new URL(reqeust.url)
    return Object.fromEntries(url_.searchParams)
  } else {
    return JSON.parse(reqeust.body)
  }
}

// 检查token
export function checkToken() {
  /**
   * 因为mockjs的请求体无法获取token，所以这里直接从本地存储中获取，来模拟从请求头中获取token
   */
  const token = localStorage.getItem('jwtToken')

  return token && token == CONST.TOKEN
}

// 生成Feed
export const genFeeds = (
  num: number = 10,
  onlyPic?: boolean,
): ExploreFeedInfo[] => {
  const list = []
  for (let i = 0; i < num; i++) {
    const width = Random.integer(200, 400)
    const height = Random.integer(200, 500)
    list.push({
      id: Mock.mock('@id()'),
      title: Mock.mock('@ctitle(7, 100)'),
      isPic: onlyPic ? true : Mock.mock('@boolean()'),
      mediaUrl: Mock.mock(`@image(${width}x${height})`),
      authorName: Mock.mock('@cname()'),
      authorAvatarUrl: Mock.mock('@image(20x20)'),
      likeCount: Mock.mock('@integer(0, 1000)'),
      isLiked: false,
    })
  }
  return list
}

// 生成单个评论
export const genComment = (replayTo?: boolean): CommentInfo => {
  return {
    id: Mock.mock('@id()'),
    author: {
      id: Mock.mock('@id()'),
      name: Mock.mock('@name()'),
      avatarUrl: Mock.mock('@image(20x20)'),
      isFollow: false,
    },
    content: Mock.mock('@cparagraph()'),
    date: {
      date: '06-01',
      location: '湖南',
    },
    action: {
      commentCount: replayTo ? 0 : Mock.mock('@integer(0, 10)'),
      likeCount: Mock.mock('@integer(0, 100)'),
    },
    replyTo: replayTo ? Mock.mock('@name()') : undefined,
  }
}

// 生成评论块
export const genComments = (): CommentBlockInfo => {
  const top = genComment()

  const num = top.action.commentCount > 3 ? 3 : top.action.commentCount

  let list = [top]

  for (let i = 0; i < num; i++) {
    list.push(genComment(true))
  }

  return {
    commentList: list,
    totalCommentCount: Mock.mock('@integer(0, 10)'),
  }
}

// 生成媒体信息
export const genMedia = (): MediaInfo => {
  const video = Random.boolean()
  const width1 = Random.integer(200, 500)
  const height1 = Random.integer(200, 500)
  const width2 = Random.integer(200, 500)
  const height2 = Random.integer(200, 500)
  return {
    imageUrl: video
      ? []
      : [
          Mock.mock(`@image(${width1}x${height1})`),
          Mock.mock(`@image(${width2}x${height2})`),
        ],
    videoUrl: video ? CONST.VIDEO_URL : undefined,
  }
}

// 生成用户详细信息
export const genUserInfo = (userId: string): UserDetailInfo => {
  return {
    id: userId,
    name: Mock.mock('@name()'),
    avatarUrl: Mock.mock('@image(20x20)'),
    isFollow: false,
    desc: Mock.mock('@cparagraph()'),
    followCount: Mock.mock('@integer(0, 100)'),
    followerCount: Mock.mock('@integer(0, 100)'),
    likedCount: Mock.mock('@integer(0, 100)'),
    noteCount: Mock.mock('@integer(0, 10)'),
    starCount: Mock.mock('@integer(0, 10)'),
  }
}

// 生成通知信息
export const genNotificationInfo = (index: number): NotificationInfo => {
  // 评论
  const idx = Mock.mock('@integer(0, 2)')
  if (index === 0) {
    return {
      id: Mock.mock('@id()'),
      user: {
        id: Mock.mock('@id()'),
        avatarUrl: Mock.mock('@image(20x20)'),
        name: Mock.mock('@name()'),
        isFollow: false,
      },
      content: Mock.mock('@cparagraph()'),
      hint: CONST.COMMENT_TYPE[idx],
      time: '1天前',
      extra: {
        id: Mock.mock('@id()'),
        extraUrl: Mock.mock('@image(20x20)'),
        quote: idx == 1 ? Mock.mock('@cparagraph()') : undefined,
      },
    }
  }
  // 点赞
  else if (index === 1) {
    return {
      id: Mock.mock('@id()'),
      user: {
        id: Mock.mock('@id()'),
        avatarUrl: Mock.mock('@image(20x20)'),
        name: Mock.mock('@name()'),
        isFollow: false,
      },
      hint: CONST.LIKE_TYPE[idx],
      time: '1天前',
      extra: {
        id: Mock.mock('@id()'),
        extraUrl: Mock.mock('@image(20x20)'),
      },
    }
  }
  // 关注
  else {
    return {
      id: Mock.mock('@id()'),
      user: {
        id: Mock.mock('@id()'),
        avatarUrl: Mock.mock('@image(20x20)'),
        name: Mock.mock('@name()'),
        isFollow: false,
      },
      hint: '关注了你',
      time: '1天前',
    }
  }
}
