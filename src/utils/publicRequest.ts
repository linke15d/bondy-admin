import request from '@/config/axios'


/**
 * 用户登录
 * @param data
 * @returns
 */
export const loginOutApi = (data?): Promise<IResp> => {
  return request.post({ url: '/api/userinfo/changepassword', data })
}

/**
 * 修改用户登录密码
 * @param data
 * @returns
 */
export const changePwd = (data): Promise<IResp> => {
  return request.post({ url: '/api/userinfo/changepassword', data })
}
