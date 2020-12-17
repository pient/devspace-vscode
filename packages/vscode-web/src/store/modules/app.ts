import { MutationTree, ActionTree } from 'vuex'
import { RootState, AppState } from '@/core/@types/store'

const state: AppState = {
  count: 0,
  viewType: '',
  viewData: {}
}

const mutations: MutationTree<AppState> = {
  setView(state, payload: ViewMessage) {
    const { viewType, data } = payload

    if (viewType && viewType !== state.viewType) {
      state.viewType = viewType
    }

    if (data !== undefined) {
      state.viewData = data
    }
  }
}

const actions: ActionTree<AppState, RootState> = {
  loadView({ commit }, payload: ViewMessage) {
    commit('setView', payload)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
