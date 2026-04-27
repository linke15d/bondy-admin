import request from '@/config/axios'

/**
 * 获取验证码
 * @param data
 * @returns
 */
export const captcha = (): Promise<IResp> => {
    return request.post({ url: '/admin/captcha' })
}
/**
 * 获取验证码
 * @param data
 * @returns
 */
export const login = (data): Promise<IResp> => {
    return request.post({ url: '/admin/login', data })
}