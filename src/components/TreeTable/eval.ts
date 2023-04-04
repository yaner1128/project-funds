/**
* @Author: jianglei
* @Date:   2017-10-12 12:06:49
*/
'use strict'
export default function treeToArray(flag: boolean, data: any, expandAll: any, parent = null, level:any = null) {
  let tmp: any[] = []
  Array.from(data).forEach(function (record: any) {
    if (expandAll && flag) {
      record._expanded = expandAll;
    };
    // if (record._expanded === undefined) {
    //   record._expanded = expandAll
    // }
    // record._expanded = expandAll
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level! + 1
    }
    record._level=_level
    // 如果有父元素
    if (parent) {
      record.parent = parent
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToArray(flag, record.children, expandAll, record, _level)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}
