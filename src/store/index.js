import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    order_list: {}
  },
  mutations: {
    SET_ORDER_LIST (state, list) {
      state.order_list = list.reduce((obj, item) => (obj[item.id] = item, obj), {})
    }
  },
  actions: {

  },
  getters
})
