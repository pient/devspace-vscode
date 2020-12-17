import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 用于控制路由跳转
router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
