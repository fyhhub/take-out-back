import { axios } from '@/utils/request'
const api = {
  delete: '/api/upload/delete',
}

export function deleteImage (params) {
  return axios({
    url: api.delete,
    method: 'get',
    params
  })
}
