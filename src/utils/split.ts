// 将数组里含','的字符串分割，形成新数组
export function splitArr(selectArr: any) {
  if (!selectArr) {
    return []
  }
  const newArr = []
  if (Array.isArray(selectArr)) {
    selectArr.forEach(item => {
      if (item.includes(',')) {
        item.split(',').forEach((item1: any) => {
          newArr.push(item1)
        })
      } else {
        newArr.push(item)
      }
    })
  } else {
    newArr.push(...selectArr.split(','))
  }
  return newArr
}
