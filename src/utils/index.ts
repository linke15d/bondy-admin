// import type { Plugin } from 'vue'

/**
 *
 * @param component 需要注册的组件
 * @param alias 组件别名
 * @returns any
 */
export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any
  comp.install = (app: any) => {
    app.component(comp.name || comp.displayName, component)
    if (alias) {
      app.config.globalProperties[alias] = component
    }
  }
  return component as T & Plugin
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
  if (!str) return ''
  return str.replace(/\-(\w)/g, (_, letter: string) => {
    return letter.toUpperCase()
  })
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
// eslint-disable-next-line
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param {Date | number | string} time 需要转换的时间
 * @param {String} fmt 需要转换的格式 如 yyyy-MM-dd、yyyy-MM-dd HH:mm:ss
 */
export function formatTime(time: Date | number | string, fmt: string) {
  if (!time) return ''
  else {
    const date = new Date(time)
    const o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'H+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds(),
      'q+': Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (const k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
        )
      }
    }
    return fmt
  }
}

/**
 * 生成随机字符串
 */
export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}

export function exportFile(content, name) {
  const blob = new Blob([content])
  const fileName = name + '.xls'
  if ('download' in document.createElement('a')) {
    const elink = document.createElement('a')
    elink.download = fileName
    elink.style.display = 'none'
    elink.href = URL.createObjectURL(blob)
    document.body.appendChild(elink)
    elink.click()
    URL.revokeObjectURL(elink.href)
    document.body.removeChild(elink)
  } else {
    navigator?.msSaveBlob(blob, fileName)
  }
}

/**
 * 余额处理
 */
export function toThousands(money, symbol = "", decimals = 2) {
  if (typeof money !== 'number') {
    money = Number(money)
  }
  let result = money
    .toFixed(decimals)
    .replace(/\B(?=(\d{3})+\b)/g, ",")
    .replace(/^/, `${symbol}`);
  return result;
};

/**
 * 银行卡格式化
 */
export function formatBankList(str: string) {
  if (!str) return '-'
  return str.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 *  格式化手机区号
 */
export const formatArea = (area: string, bol: boolean = false) => {
  if (!area) return ''
  const fArea = area.split('+')
  if (bol) {
    return fArea[fArea.length - 1]
  } else {
    return `+${fArea[fArea.length - 1]}`
  }

}
// 保留2位小数
// export const floorNum = (num1:string | number) =>{
//   let count=Number(num1)
//   const fixedNum = (Math.floor(count * 100) / 100 + 0.0001).toFixed(2);
//   // const result = fixedNum.slice(0, -1);
//   return fixedNum
// }
// 保留2位小数 (新)
export const floorNum = (num: string | number) => {
  if (Number(num) >= 0) {
    let numIndex: string
    if (typeof num === 'number') {
      numIndex = String(num)
    } else if (typeof num === 'object') {
      numIndex = String(0)
    } else {
      numIndex = num
    }
    // 先将数字转换为字符串，然后使用正则表达式匹配小数点前后的数字
    const count = numIndex.match(/^(\d+)\.?(\d{0,2})/);
    console.log(count)
    if (count == null) return 0
    // 如果小数部分不足两位，则在末尾补0
    const paddedDecimalPart = count[2].padEnd(2, '0');
    // 拼接整数部分和小数部分
    const result = `${count[1]}.${paddedDecimalPart}`;
    return result;
  }else{
    return Number(num).toFixed(2)
  }
}

// 限制时间
export const limitedTimer = (startTime: string, endTime: string, limit: number = 3) => {
  if (endTime && startTime) {
    // const sTime = new Date(startTime).getTime()
    // const eTime = new Date(endTime).getTime()
    // const count = Math.floor((eTime - sTime)/(24*3600*1000))
    // const fixedNum = parseInt((Math.floor(count * 100) / 100 + 0.0001).toFixed(0));
    // if(fixedNum>limit){
    //     return false
    // }
    const d1 = new Date(startTime);
    const d2 = new Date(endTime);
    const diffMonths = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth()) + 1;
    if (diffMonths > limit) {
      return false
    }
  }
  return true
}

// 
export const arrayTransferObject = (array) => {
  const objTemplate = {};
  array.forEach((ele) => {
    objTemplate[ele] = "";
  });

  return objTemplate;
};

//
export const objectSetValue = (origin, data = [], number) => {
  const target = {};
  data.forEach((ele) => {
    target[ele.value] = ele.key;
  });

  for (const [KEY] of Object.entries(origin)) {
    for (const [KEY1, VALUE] of Object.entries(target)) {
      if (KEY === KEY1) {
        origin[KEY] = VALUE;
      }
    }
  }

  return Object.entries(origin).map((ele) => ele[number]);
};