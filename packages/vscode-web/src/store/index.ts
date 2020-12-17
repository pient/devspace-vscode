import { createStore } from 'vuex'
import app from './modules/app'
import getters from './getters'

const modules = { app }

const store = createStore({
  getters,
  modules
})

export default store
