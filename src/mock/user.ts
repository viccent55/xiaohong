import Mock from 'mockjs'
import { genFeeds, genUserInfo, queryParams } from './util'
Mock.setup({ timeout: '50-250' })

// 获取用户信息
Mock.mock(/user\/info/, 'get', request => {
  const userId = queryParams(request).id

  return {
    code: 200,
    msg: '获取用户信息成功',
    data: genUserInfo(userId),
  }
})

// 获取笔记
Mock.mock(/user\/notefeeds/, 'get', request => {
  const num = queryParams(request).num

  return {
    code: 200,
    msg: '获取用户笔记成功',
    data: {
      list: genFeeds(num),
      total: num,
    },
  }
})

// 获取收藏
Mock.mock(/user\/starfeeds/, 'get', request => {
  const num = queryParams(request).num

  return {
    code: 200,
    msg: '获取用户收藏成功',
    data: {
      list: genFeeds(num),
      total: num,
    },
  }
})
