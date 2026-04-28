import request from '@/config/axios'

//统计
export const statsDashboard = (data?): Promise<IResp> => {
  return request.post({ url: '/admin/v1/stats/dashboard', data })
}