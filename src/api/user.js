import { axios } from '@/utils/request'
const api = {
  delete: '/api/user/delete',
  update: '/api/user/update',
}

export function deleteUser (user_id, business_id) {
  return axios({
    url: api.delete,
    method: 'get',
    params: {
      user_id,
      business_id
    }
  })
}

export function update (data) {
  return axios({
    url: api.update,
    method: 'post',
    data
  })
}

