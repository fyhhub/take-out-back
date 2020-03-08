import { axios } from '@/utils/request'
const api = {
  category: '/api/business/category',
  create: '/api/business/create',
  list: '/api/business/list',
  update: '/api/business/update',
  delete: '/api/business/delete'
}

export function getCategory () {
  return axios({
    url: api.category,
    method: 'get'
  })
}

export function createBusiness (data) {
  return axios({
    url: api.create,
    method: 'post',
    data
  })
}

export function getBusinessList (params = {}) {
  return axios({
    url: api.list,
    method: 'get',
    params
  })
}

export function updateBusiness (data = {}) {
  return axios({
    url: api.update,
    method: 'put',
    data
  })
}

export function deleteBusiness (params = {}) {
  return axios({
    url: api.delete,
    method: 'get',
    params
  })
}
