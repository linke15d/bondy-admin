import request from '@/config/axios'

//姿势列表
export const positionQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/list', data })
}
//姿势新增
export const positionCreate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/create', data })
}
//姿势编辑
export const positionUpdate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/update', data })
}
//姿势删除
export const positionDelete = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/positions/delete', data })
}
//姿势分类列表
export const categoriesQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/categories/list', data })
}
//姿势分类新增
export const categoriesCreate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/categories/create', data })
}
//姿势分类删除
export const categoriesDelete = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/categories/delete', data })
}
//姿势分类编辑
export const categoriesUpdate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/categories/update', data })
}
//地点列表
export const locationsQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/locations/list', data })
}
//地点删除
export const locationsDelete = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/locations/delete', data })
}
//地点新增
export const locationsCreate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/locations/create', data })
}
//地点更新
export const locationsUpdate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/content/locations/update', data })
}