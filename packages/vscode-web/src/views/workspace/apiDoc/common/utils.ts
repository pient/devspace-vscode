import core from '@/core'

// 格式化日期
export function formatDate(val: number, fmt?: string) {
  if (typeof val === 'number' && String(val).length === 10) val = val * 1000
  return new Date(val).format(fmt)
}
