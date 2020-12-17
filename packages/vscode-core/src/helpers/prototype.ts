// 定义对象属性
export function defineObjectProperty(target: any, name: string, value: any) {
  if (!target.prototype.hasOwnProperty(name)) {
    let prop = value
    if (typeof value === 'function') prop = { value }

    Object.defineProperty(target.prototype, name, prop)
  }
}

// 添加填
defineObjectProperty(Date, 'addDays', function (days: string | number) {
  if (days === undefined || days === '') days = 1;
  this.setDate(this.getDate() + days);
  return this;
})

// 添加月
defineObjectProperty(Date, 'addMonths', function (months: string | number) {
  if (months === undefined || months === '') months = 1;
  this.setMonth(this.getMonth() + months);
  return this;
})

// 判断是否有效日期
defineObjectProperty(Date, 'isValid', function () {
  return !!this.getTime() && !isNaN(this.getTime());
})

// 清除时间
defineObjectProperty(Date, 'clearTime', function () {
  this.setHours(0, 0, 0, 0);
  return this;
})

// 清除时间
defineObjectProperty(Date, 'diff', function (start: Date | string | number, unit: string) {
  var startTime = new Date(start); // 开始时间

  // 作为除数的数字
  var timeType = 1;

  switch (unit) {
    case 'second':
    case 's':
      timeType = 1000;
      break;
    case 'minute':
    case 'm':
      timeType = 1000 * 60;
      break;
    case 'hour':
    case 'h':
      timeType = 1000 * 3600;
      break;
    case 'day':
    case 'd':
      timeType = 1000 * 3600 * 24;
      break;
    case 'month':
    case 'M':
      let startMonths = startTime.getFullYear() * 12 + startTime.getMonth();
      let endMonths = this.getFullYear() * 12 + this.getMonth();
      return Math.abs(startMonths - endMonths);
  }

  return Math.floor((this.getTime() - startTime.getTime()) / timeType);
})

// 日期格式化
defineObjectProperty(Date, 'format', function (fmt: string) {
  fmt = fmt || 'yyyy-MM-dd';
  var o = {
    'M+': this.getMonth() + 1,  // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(),  // 小时
    'm+': this.getMinutes(),  // 分
    's+': this.getSeconds(),  // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3),  // 季度
    S: this.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  }

  return fmt;
})
