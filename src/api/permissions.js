import { axios } from '@/utils/request'
const api = {
  delete: '/api/permissions/delete',
}

export function deletePermission (id) {
  return axios({
    url: api.delete,
    method: 'get',
    params: {
      id
    }
  })
}
