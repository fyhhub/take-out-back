import { axios } from '@/utils/request'
const api = {
  list: '/api/assess/list',
  reply: '/api/assess/reply',
  delete: '/api/assess/delete'
}

export function getAssessList (id) {
  return axios({
    url: api.list,
    method: 'get',
    params: {
      id
    }
  })
}

export function replyAssess (data) {
  return axios({
    url: api.reply,
    method: 'post',
    data
  })
}

export function deleteAssess (id) {
  return axios({
    url: api.delete,
    method: 'get',
    params: {
      id
    }
  })
}
