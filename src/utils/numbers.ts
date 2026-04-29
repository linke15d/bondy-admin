export function sanitizePositive(
    input: string,
    { allowZero = false, decimals = 1 as number | 'any' } = {}
): string {
    let s = String(input ?? '');

    // 只留数字和一个小数点（先清理非法字符，再合并多余的点）
    s = s.replace(/[^\d.]/g, '');
    if (s.startsWith('.')) s = '0' + s; // 以点开头补 0
    const i = s.indexOf('.');
    if (i !== -1) s = s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, '');

    // 整数模式（decimals = 0）
    if (decimals === 0) {
        s = s.replace(/\./g, '');
        s = s.replace(/^0+(\d)/, '$1').replace(/^0+$/, '0');
        if (!allowZero && (s === '' || s === '0')) return '';
        return s;
    }

    // 小数模式
    if (s.includes('.')) {
        const [intPart, decRaw = ''] = s.split('.');
        const ip = intPart.replace(/^0+(\d)/, '$1').replace(/^0+$/, '0');
        // 允许中间态 “整数 + .”
        if (decRaw === '') {
            s = ip + '.';
        } else {
            let dec = decRaw;
            if (typeof decimals === 'number' && Number.isFinite(decimals)) {
                const n = Math.max(0, Math.trunc(decimals));
                dec = n === 0 ? '' : decRaw.slice(0, n);
            }
            // 'any'：不裁剪
            s = dec.length ? `${ip}.${dec}` : ip;
        }
    } else {
        // 纯整数：去前导 0（保留单个 0）
        s = s.replace(/^0+(\d)/, '$1').replace(/^0+$/, '0');
    }

    if (!allowZero) {
        // 允许中间态 0 / 0.
        if (s === '0' || s === '0.') return s;
        if (Number(s) === 0) return '';
    }
    return s;
}


// >0，按 decimals 控制位数（0=整数，正整数=最多 n 位，'any'=不限）
export function isPositiveByDecimals(s: string, decimals: number | 'any' = 1): boolean {
    const str = String(s);
    if (decimals === 0) return /^(?:[1-9]\d*)$/.test(str);
    if (decimals === 'any' || !Number.isFinite(decimals)) {
        return /^(?:[1-9]\d*)(?:\.\d+)?$/.test(str);
    }
    const n = Math.max(0, Math.trunc(decimals));
    return n === 0
        ? /^(?:[1-9]\d*)$/.test(str)
        : new RegExp(`^(?:[1-9]\\d*)(?:\\.\\d{1,${n}})?$`).test(str);
}

// 正整数去前导零
export function sanitizeIntPositive(input: string | number): string {
    let s = String(input ?? '').replace(/[^\d]/g, '');
    s = s.replace(/^0+(\d)/, '$1');
    if (s === '' || s === '0') return '';
    return String(Math.trunc(Number(s)));
}

//数组去重-根据id
export const uniqueById = (arr) => Object.values(Object.fromEntries(arr.map(item => [item.id, item])));

//竖排
const COLUMN_SIZE = 10

export const splitToColumns = (list: any[]) => {
    if (!Array.isArray(list)) return []
    const cols: any[][] = []
    for (let i = 0; i < list.length; i += COLUMN_SIZE) {
        cols.push(list.slice(i, i + COLUMN_SIZE))
    }
    return cols
}
