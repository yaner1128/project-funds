/**
 * 金额格式化
 * 千分位符 保留两位小数
 */
export function numFormat(num: number | null | undefined) {
  if (num !== null && num !== undefined) {
    num = Number(num)
    let newNum = num.toFixed(2)
    let res = newNum.toString().replace(/\d+/, function(n: string) { // 先提取整数部分
      return n.replace(/(\d)(?=(\d{3})+$)/g, function($1: string) {
        return $1 + ",";
      });
    })
    return res
  }
}

/**
 * 元转换成万元 保留两位小数
 */
export function numToTenThousand (num2: number | null | undefined) {
  if (num2 !== null && num2 !== undefined) {
    return numFormat(accDiv(num2, 10000))
  }
}

//除法函数，用来得到精确的除法结果
//说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
//调用：accDiv(arg1,arg2)
//返回值：arg1除以arg2的精确结果
function accDiv(arg1: { toString: () => string; },arg2: number) {
  let t1 = 0,t2 = 0, r1, r2;
  try {
    t1 = arg1.toString().split(".")[1].length
  } catch(e) {}
  try {
    t2 = arg2.toString().split(".")[1].length
  } catch(e) {}
  r1 = Number(arg1.toString().replace(".", ""))
  r2 = Number(arg2.toString().replace(".", ""))
  return (r1 / r2) * Math.pow(10, t2 - t1);
}

/**
 * 将小数转化为百分比
 */
export function rateFormat(value: any) {
  if(!value) return 0;

  const result = (Number(value) * 100).toFixed(2)
  console.log('***', result)
  return result
}

export function booleanFormat(value: any) {
  return Boolean(value) ? '是' : '否'
}

