import { RouteRecordRaw } from 'vue-router'

// import WorkspaceApiDocApiView from '@/views/workspace/apiDoc/apiView'

// 所有路由对应的组件（用于生成菜单等，全局控制主键加载等）
const __routeComponents: Record<string, unknown> = {}

function loadComponent(path: string) {
  const component = () => import(`@/views/${path}`)
  __routeComponents[path] = component

  return component
}

interface ViewTypeMeta extends Record<string, unknown> {
  icon?: string
}

interface ViewTypeItem {
  name: string
  path?: string
  component?: Record<string, unknown> | Function | string // 同步组件或异步组件
  meta?: ViewTypeMeta
}

// 定义viewTypes
const viewTypes: ViewTypeItem[] = [
  { name: 'home', path: '', component: 'home' },
  { name: 'workspace.apiDoc.apiView' }
]

const routes: Array<RouteRecordRaw> = viewTypes.map((item) => {
  const routePath = typeof item.path === 'string' ? item.path : item.name.replace(/\./g, '/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let component: any = item.component

  if (!component) {
    component = loadComponent(routePath)
  } else if (typeof component === 'string') {
    component = loadComponent(component)
  }

  return {
    name: item.name,
    path: `/${routePath}`,
    component
  }
})

// 注意，这段放到最后
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '/:catchAll(.*)',
    component: () => import('@/views/error/40X.vue')
  })
}

export const routeComponents = __routeComponents

export default routes
