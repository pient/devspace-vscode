// 深拷贝
export function cloneDeep(obj: any, cache: any[] = []) {
  function find(list: any[], f: (param: any) => boolean) {
    return list.filter(f)[0]
  }

  // just return if obj is immutable value
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  // if obj is hit, it is in circular structure
  const hit = find(cache, (c) => c.original === obj)
  if (hit) {
    return hit.copy
  }

  const copy: any = Array.isArray(obj) ? [] : {}

  // put the copy into cache at first
  // because we want to refer it in recursive deepCopy
  cache.push({
    original: obj,
    copy
  })

  Object.keys(obj).forEach((key) => {
    copy[key] = cloneDeep(obj[key], cache)
  })

  return copy
}
