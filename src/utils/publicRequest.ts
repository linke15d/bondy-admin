import request from '@/config/axios'


/**
 * 修改用户登录密码
 * @param data
 * @returns
 */
export const changePwd = (data): Promise<IResp> => {
  return request.post({ url: '/api/userinfo/changepassword', data })
}
