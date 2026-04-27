//过滤空值
export function cleanEmptyParams<T extends Record<string, any>>(params: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '' && value !== undefined),
    ) as Partial<T>;
}

//格式化金额
export const formatAmount = (amount) => {
  if (amount) {
    amount = Number(amount)
    if (amount >= 1000) {
      let divisor = 1000
      let formattedAmount = `${(amount / divisor).toFixed(3)}K`
      return formattedAmount
    } else {
      return amount.toFixed(3)
    }
  }
}
//格式化长地址 xxxxxxxx...xxxxxxxx
export const formatAddress = (address) => {
  if (address)
    return `${address.substring(0, 8)}...${address.substring(address.length - 8, address.length)}`
}

//小数保留位数
export const numberFormat = (num, digits) => {
  num = num ? Number(num) : 0
  return (Math.floor(num * 1000000) / 1000000).toFixed(digits)
}
/**
 * @func tableFormatterFn
 * @param {*} e
 * @desc 表格内容格式化 直接作用于 table
 */
export const tableFormatterFn = (row: any, column: any) => {
    const value = row[column.property];

    if (value == null) return '--';

    if (typeof value === 'string' && value.trim() === '') return '--';

    if (Array.isArray(value)) {
        if (value.length === 0) return '--';
        return value.join(', ');
    }

    if (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0) {
        return '--';
    }

    return value;
};