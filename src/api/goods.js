import { axios } from '@/utils/request'
const api = {
  create: '/api/goods/create',
  list: '/api/goods/list',
  delete: '/api/goods/delete',
  update: '/api/goods/update',
  some: '/api/goods/some',
}

export function createGoods (data) {
  return axios({
    url: api.create,
    method: 'post',
    data
  })
}

export function getGoodsList (params) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

export function getSomeGoods (data) {
  return axios({
    url: api.some,
    method: 'post',
    data
  })
}

export function deleteGoods (params) {
  return axios({
    url: api.delete,
    method: 'delete',
    params
  })
}

export function updateGoods (data) {
  return axios({
    url: api.update,
    method: 'post',
    data
  })
}
