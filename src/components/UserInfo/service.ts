
import request from '@/config/axios'

//清除缓存
export const clearCache = (): Promise<IResp> => {
    return request.post({ url: '/admin/clearCache' })
}
//修改帐号密码
export const accountUpdate = (data): Promise<IResp> => {
    return request.post({ url: '/admin/account/update',data })
}