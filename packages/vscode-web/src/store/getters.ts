import { GetterTree } from 'vuex'
import { RootState } from '@/core/@types/store'

const getters: GetterTree<RootState, RootState> = {
  viewType: (state) => state.app.viewType,
  viewData: (state) => state.app.viewData
}

export default getters
