import request from '@/config/axios'

//用户列表
export const userQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/users/list', data })
}
//用户禁用
export const userBlock = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/users/block', data })
}
//用户启用
export const userUnblock = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/users/unblock', data })
}
//用户详情
export const userDetail = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/users/detail', data })
}