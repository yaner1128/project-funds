export function formatDate(date: any, fmt: string) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  }
  type stringKey = Record<string, any>
  const o :stringKey = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

export function getFirstDay(date:any, fmt: any) {
  date.setDate(1)
  date.setMonth(0)
  date = formatDate(date, fmt)
  return date
}

function padLeftZero(str: string | any[]) {
  return ('00' + str).substr(str.length)
}
