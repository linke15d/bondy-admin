import CryptoJS from 'crypto-js'

/*
 * 默认的 KEY IV
 */

const KEY = CryptoJS.enc.Utf8.parse('1111111111111111') //  密钥
const IV = CryptoJS.enc.Utf8.parse('0000000000000000') //  偏移量

/*
 * AES加密 ：字符串 key iv  返回base64
 */
export function EncryptData(str) {
  let key = KEY
  let iv = IV

  // if (keyStr && ivStr) {
  //   key = CryptoJS.enc.Utf8.parse(keyStr)
  //   iv = CryptoJS.enc.Utf8.parse(ivStr)
  // }

  let srcs = CryptoJS.enc.Utf8.parse(str)
  let encrypt = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC, // 这里可以选择AES加密的模式
    padding: CryptoJS.pad.Pkcs7
  })

  // return CryptoJS.enc.Base64.stringify(encrypt.ciphertext)
  return encrypt.toString()
}

/*
 * AES 解密 ：字符串 key iv  返回base64
 */
export function DecryptData(str) {
  let key = KEY
  let iv = IV

  // if (keyStr && ivStr) {
  //   key = CryptoJS.enc.Utf8.parse(keyStr)
  //   iv = CryptoJS.enc.Utf8.parse(ivStr)
  // }

  let decrypt = CryptoJS.AES.decrypt(str, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC, // 这里可以选择AES解密的模式
    padding: CryptoJS.pad.Pkcs7
  })

  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}
