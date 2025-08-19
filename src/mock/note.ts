import Mock from 'mockjs'
Mock.setup({ timeout: '50-250' })

import './user'

import type { ArticleInfo } from '@/types/info'
import {
  genComment,
  genComments,
  genMedia,
  queryParams,
  CONST,
  checkToken,
  genFeeds,
} from './util'

// 获取feeds
Mock.mock(/feeds/, 'get', reqeust => {
  const params = queryParams(reqeust)

  const onlyPic = JSON.parse(params['only_pic']) || false
  const num = parseInt(params.num) || 10

  return {
    code: 200,
    msg: '获取成功',
    data: {
      list: genFeeds(num, onlyPic),
      total: num,
    },
  }
})

Mock.mock(/qrcode/, 'get', () => {
  return {
    code: 200,
    msg: '获取成功',
    data: CONST.QR_CODE_URL,
  }
})

Mock.mock(/captcha/, 'post', () => {
  return {
    code: 200,
    msg: '获取成功',
    data: null,
  }
})

Mock.mock(/logins/, 'post', reqeust => {
  const params = queryParams(reqeust)

  // 检查token
  if (checkToken()) {
    return {
      code: 200,
      msg: 'token登录成功',
      data: {
        id: CONST.USER_ID,
        token: CONST.TOKEN,
      },
    }
  }

  // 检查验证码
  if (params && params.captcha == CONST.CAPTCHA) {
    return {
      code: 200,
      msg: '验证码登录成功',
      data: {
        id: CONST.USER_ID,
        token: CONST.TOKEN,
      },
    }
  } else {
    return {
      code: 400,
      msg: '验证码错误',
      data: null,
    }
  }
})

// 获取笔记细节
Mock.mock(/noteDetail/, 'get', () => {
  const article: ArticleInfo = {
    id: Mock.mock('@id()'),
    title: Mock.mock('@ctitle()'),
    content: Mock.mock('@cparagraph()'),
    author: {
      id: Mock.mock('@id()'),
      name: Mock.mock('@name()'),
      avatarUrl: Mock.mock('@image(20x20)'),
      isFollow: Mock.mock('@boolean()'),
    },
    action: {
      commentCount: Mock.mock('@integer(0, 10)'),
      likeCount: Mock.mock('@integer(0, 100)'),
      favoriteCount: Mock.mock('@integer(0, 100)'),
      isLiked: Mock.mock('@boolean()'),
      isFavorited: Mock.mock('@boolean()'),
    },
    date: {
      date: '06-01',
      location: '湖南',
    },
    mediaInfo: genMedia(),
    totalCommentCount: Mock.mock('@integer(0, 100)'),
  }

  const num = article.action.commentCount > 5 ? 5 : article.action.commentCount

  const commentBlocks = []

  for (let i = 0; i < num; i++) {
    commentBlocks.push(genComments())
  }

  return {
    code: 200,
    msg: '获取成功',
    data: {
      article,
      commentBlocks,
    },
  }
})

// 获取评论
Mock.mock(/comments/, 'get', reqeust => {
  const params = queryParams(reqeust)

  const num = parseInt(params.num) || 5

  const list = []

  for (let i = 0; i < num; i++) {
    list.push(genComments())
  }

  return {
    code: 200,
    msg: '获取成功',
    data: list,
  }
})

// 获取回复
Mock.mock(/replies/, 'get', reqeust => {
  const params = queryParams(reqeust)

  const num = parseInt(params.num) || 10

  const list = []

  for (let i = 0; i < num; i++) {
    list.push(genComment(true))
  }

  return {
    code: 200,
    msg: '获取成功',
    data: list,
  }
})

// 评论
Mock.mock(/reply/, 'post', reqeust => {
  const params = queryParams(reqeust)

  const content = params.content
  const replayTo = params.to
  console.log(replayTo.name)

  const comment = genComment(replayTo ? true : false)
  comment.replyTo = replayTo ? replayTo.name : undefined
  comment.content = content
  comment.action = {
    commentCount: 0,
    likeCount: 0,
  }

  return {
    code: 200,
    msg: '评论成功',
    data: comment,
  }
})

Mock.mock(/unfollow/, 'post', () => {
  return {
    code: 200,
    msg: '取消关注成功',
    data: null,
  }
})

Mock.mock(/follow/, 'post', () => {
  return {
    code: 200,
    msg: '关注成功',
    data: null,
  }
})

Mock.mock(/unlike/, 'post', () => {
  return {
    code: 200,
    msg: '取消点赞成功',
    data: null,
  }
})

Mock.mock(/like/, 'post', () => {
  return {
    code: 200,
    msg: '点赞成功',
    data: null,
  }
})

Mock.mock(/unstar/, 'post', () => {
  return {
    code: 200,
    msg: '取消收藏成功',
    data: null,
  }
})

Mock.mock(/star/, 'post', () => {
  return {
    code: 200,
    msg: '收藏成功',
    data: null,
  }
})

Mock.mock(/report/, 'post', () => {
  return {
    code: 200,
    msg: '举报成功',
    data: null,
  }
})
