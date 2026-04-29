import request from '@/config/axios'

//语言列表
export const langQuery = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/i18n/languages/list', data })
}
//语言新增
export const langCreate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/i18n/languages/create', data })
}
//语言编辑
export const langUpdate = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/i18n/languages/update', data })
}
//语言删除
export const langDelete = (data?): Promise<IResp> => {
    return request.post({ url: '/admin/v1/i18n/languages/delete', data })
}