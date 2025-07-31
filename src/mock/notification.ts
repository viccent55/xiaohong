import Mock from 'mockjs'
import { genNotificationInfo, queryParams } from './util'
Mock.setup({ timeout: '50-250' })

Mock.mock(/notification\/count/, 'get', () => {
  return {
    code: 200,
    msg: 'ok',
    data: [
      Mock.Random.integer(5, 20),
      Mock.Random.integer(5, 20),
      Mock.Random.integer(5, 20),
    ],
  }
})

Mock.mock(/notification\/info/, 'get', reqeust => {
  const params = queryParams(reqeust)

  const index = parseInt(params.index)
  const num = parseInt(params.num) || 10

  const list = []

  for (let i = 0; i < num; i++) {
    list.push(genNotificationInfo(index))
  }

  return {
    code: 200,
    msg: 'ok',
    data: { total: num, list },
  }
})
