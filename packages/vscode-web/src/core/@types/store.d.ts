/** Store相关类型 */

// 根state
export interface RootState {
  app: AppState
}

// 应用相关state
export interface AppState {
  count: number // 测试用count
  viewType: string  // 当前视图类型
  viewData: any // 当前视图数据
}
