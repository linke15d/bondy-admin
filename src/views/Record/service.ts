import request from '@/config/axios'

//记录管理列表
export const recordsQuery = (data): Promise<IResp> => {
  return request.post({ url: '/admin/v1/records/list', data })
}