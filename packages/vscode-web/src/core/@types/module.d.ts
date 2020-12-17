/** 通用或引入的模块 */

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent
  export default component
}

declare module '*.png'
declare module '*.jpg'
declare module '*.svg'
