import request from '@/config/axios'

//统计
export const dataOverview = (data): Promise<IResp> => {
  return request.post({ url: '/admin/user/stats', data })
}
//app下载量统计
export const downloadCount = (data): Promise<IResp> => {
  return request.post({ url: '/admin/download/count', data })
}
