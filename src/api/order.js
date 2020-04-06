import { axios } from '@/utils/request'
const api = {
  list: '/api/order/list',
  delete: '/api/order/delete',
}

export function getOrderList (business_id) {
  console.log(business_id)
  return axios({
    url: api.list,
    method: 'get',
    params: {
      business_id
    }
  })
}

export function deleteOrder (id) {
  return axios({
    url: api.delete,
    method: 'get',
    params: {
      id
    }
  })
}

