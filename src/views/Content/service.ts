import request from '@/config/axios'

//姿势列表
export const positionQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/list', data })
}
//姿势新增
export const positionCreate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/create', data })
}
//姿势删除
export const positionDelete = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/delete', data })
}