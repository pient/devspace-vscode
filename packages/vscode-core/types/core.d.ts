export type LogDebugFn = (msg: any) => void

declare global {
  type DateDataType = string | number | Date
  type DateUnitTypeShort = 'd' | 'M' | 'y' | 'h' | 'm' | 's' | 'ms'
  type DateUnitType =
    | 'millisecond'
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'month'
    | 'year'
    | 'date'
    | DateUnitTypeShort

  type DateOpUnitType = DateUnitType | 'week' | 'w'
  type DateQUnitType = DateUnitType | 'quarter' | 'Q'

  interface Date {
    addDays(days: number | string): Date
    addMonths(months: string | number): Date
    addSeconds(seconds: string | number): Date
    format(fmt?: string): string
    isValid(): boolean
    clearTime(): Date
    diff(date: DateDataType, unit?: DateQUnitType | DateOpUnitType, float?: boolean): number
  }
}