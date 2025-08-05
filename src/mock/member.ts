import Mock from 'mockjs'
import { queryParams } from './util'
import type { 
  MemberCenterInfo, 
  MyCommentInfo, 
  MyCollectionInfo, 
  MyLikeInfo, 
  SystemMessageInfo 
} from '@/types/info'

Mock.setup({ timeout: '50-250' })

// 生成我的评论数据
const genMyComments = (count: number): MyCommentInfo[] => {
  return Array.from({ length: count }, (_, index) => {
    const width = Mock.Random.integer(200, 300)
    const height = Mock.Random.integer(200, 400)
    return {
      id: `comment_${index + 1}`,
      content: Mock.Random.sentence(10, 30),
      noteId: `note_${Mock.Random.integer(1, 100)}`,
      noteTitle: Mock.Random.sentence(3, 8),
      noteCover: `https://picsum.photos/${width}/${height}?random=${index}`,
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      likeCount: Mock.Random.integer(0, 50),
      replyCount: Mock.Random.integer(0, 10),
    }
  })
}

// 生成我的收藏数据
const genMyCollections = (count: number): MyCollectionInfo[] => {
  return Array.from({ length: count }, (_, index) => {
    const width = Mock.Random.integer(200, 300)
    const height = Mock.Random.integer(200, 400)
    return {
      id: `collection_${index + 1}`,
      noteId: `note_${Mock.Random.integer(1, 100)}`,
      noteTitle: Mock.Random.sentence(3, 8),
      noteCover: `https://picsum.photos/${width}/${height}?random=${index + 100}`,
      authorName: Mock.Random.cname(),
      authorAvatar: `https://i.pravatar.cc/40?img=${index + 1}`,
      collectTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      likeCount: Mock.Random.integer(10, 500),
    }
  })
}

// 生成我的点赞数据
const genMyLikes = (count: number): MyLikeInfo[] => {
  return Array.from({ length: count }, (_, index) => {
    const width = Mock.Random.integer(200, 300)
    const height = Mock.Random.integer(200, 400)
    return {
      id: `like_${index + 1}`,
      noteId: `note_${Mock.Random.integer(1, 100)}`,
      noteTitle: Mock.Random.sentence(3, 8),
      noteCover: `https://picsum.photos/${width}/${height}?random=${index + 200}`,
      authorName: Mock.Random.cname(),
      authorAvatar: `https://i.pravatar.cc/40?img=${index + 20}`,
      likeTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
    }
  })
}

// 生成系统消息数据
const genSystemMessages = (count: number): SystemMessageInfo[] => {
  const messageTypes: SystemMessageInfo['type'][] = ['welcome', 'comment_approved', 'system_notice', 'account_update']
  const messageTitles = {
    welcome: '欢迎来到小红书',
    comment_approved: '您的评论已通过审核',
    system_notice: '系统通知',
    account_update: '账户信息更新'
  }
  const messageContents = {
    welcome: '欢迎加入小红书大家庭！在这里发现美好生活，分享你的精彩瞬间。',
    comment_approved: '您在笔记《${noteTitle}》下的评论已通过审核并发布成功。',
    system_notice: '系统将于今晚进行维护升级，预计维护时间为2小时，给您带来的不便敬请谅解。',
    account_update: '您的账户信息已成功更新，如有疑问请联系客服。'
  }

  return Array.from({ length: count }, (_, index) => {
    const type = messageTypes[index % messageTypes.length]
    return {
      id: `message_${index + 1}`,
      type,
      title: messageTitles[type],
      content: messageContents[type],
      createTime: Mock.Random.datetime('yyyy-MM-dd HH:mm:ss'),
      isRead: Mock.Random.boolean(),
      icon: type === 'welcome' ? '🎉' : type === 'comment_approved' ? '✅' : type === 'system_notice' ? '📢' : '🔄'
    }
  })
}

// 获取会员中心完整信息
Mock.mock(/\/member\/center/, 'get', request => {
  const { userId } = queryParams(request)
  
  return {
    code: 200,
    msg: '获取会员中心信息成功',
    data: {
      userInfo: {
        id: userId,
        name: Mock.Random.cname(),
        avatarUrl: `https://i.pravatar.cc/100?img=${userId}`,
        desc: Mock.Random.sentence(5, 15),
        followCount: Mock.Random.integer(10, 500),
        followerCount: Mock.Random.integer(50, 1000),
        likedCount: Mock.Random.integer(100, 2000),
        isFollow: false,
        noteCount: Mock.Random.integer(20, 200),
        starCount: Mock.Random.integer(30, 300),
      },
      myComments: genMyComments(5),
      myCollections: genMyCollections(5),
      myLikes: genMyLikes(5),
      systemMessages: genSystemMessages(5),
    } as MemberCenterInfo
  }
})

// 获取我的评论列表
Mock.mock(/\/member\/comments/, 'get', request => {
  const { page = 1, limit = 10 } = queryParams(request)
  const comments = genMyComments(parseInt(limit))
  
  return {
    code: 200,
    msg: '获取我的评论成功',
    data: {
      list: comments,
      total: 50,
      page: parseInt(page),
      limit: parseInt(limit),
    }
  }
})

// 获取我的收藏列表
Mock.mock(/\/member\/collections/, 'get', request => {
  const { page = 1, limit = 10 } = queryParams(request)
  const collections = genMyCollections(parseInt(limit))
  
  return {
    code: 200,
    msg: '获取我的收藏成功',
    data: {
      list: collections,
      total: 80,
      page: parseInt(page),
      limit: parseInt(limit),
    }
  }
})

// 获取我的点赞列表
Mock.mock(/\/member\/likes/, 'get', request => {
  const { page = 1, limit = 10 } = queryParams(request)
  const likes = genMyLikes(parseInt(limit))
  
  return {
    code: 200,
    msg: '获取我的点赞成功',
    data: {
      list: likes,
      total: 120,
      page: parseInt(page),
      limit: parseInt(limit),
    }
  }
})

// 获取系统消息列表
Mock.mock(/\/member\/messages/, 'get', request => {
  const { page = 1, limit = 10 } = queryParams(request)
  const messages = genSystemMessages(parseInt(limit))
  
  return {
    code: 200,
    msg: '获取系统消息成功',
    data: {
      list: messages,
      total: 25,
      page: parseInt(page),
      limit: parseInt(limit),
    }
  }
})

// 标记消息为已读
Mock.mock(/\/member\/messages\/read/, 'post', () => {
  return {
    code: 200,
    msg: '标记已读成功',
    data: true
  }
})

// 批量标记消息为已读
Mock.mock(/\/member\/messages\/read-all/, 'post', () => {
  return {
    code: 200,
    msg: '全部标记已读成功',
    data: true
  }
})

// 删除评论
Mock.mock(/\/member\/comments/, 'delete', () => {
  return {
    code: 200,
    msg: '删除评论成功',
    data: true
  }
})

// 取消收藏
Mock.mock(/\/member\/collections/, 'delete', () => {
  return {
    code: 200,
    msg: '取消收藏成功',
    data: true
  }
})

// 取消点赞
Mock.mock(/\/member\/likes/, 'delete', () => {
  return {
    code: 200,
    msg: '取消点赞成功',
    data: true
  }
})