import request from '@/config/axios'

/**
 * 获取角色列表
 * @param data
 * @returns
 */
export const roleList = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/query', data })
}

/**
 * 获取角色列表-无分页
 * @param data
 * @returns
 */
export const roleinfoList = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/list', data })
}

/**
 * 获取角色用户列表
 * @param data
 * @returns
 */
export const roleUserList = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/listuser', data })
}

/**
 * 获取角色下用户
 * @param data
 * @returns
 */
export const roleIdDetail = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/listmenu', data })
}

/**
 * 添加角色 权限
 * @param data
 * @returns
 */
export const roleCreate = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/create', data })
}

/**
 * 编辑角色 权限
 * @param data
 * @returns
 */
export const roleUpdate = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/update', data })
}

/**
 * 删除角色
 * @param data
 * @returns
 */
export const removeRole = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/remove', data })
}

/**
 * 保存/删除角色用户
 * @param data
 * @returns
 */
export const saveRoleUser = (data): Promise<IResp> => {
  return request.post({ url: '/api/roleinfo/saveuser', data })
}

/**
 * 菜单查询
 * @param data
 * @returns
 */
export const menuList = (data): Promise<IResp> => {
  return request.post({ url: '/api/menuinfo/list', data })
}

/**
 * 删除菜单
 * @param id
 * @returns
 */
export const deleteMenu = (data): Promise<IResp> => {
  return request.post({ url: `/api/menuinfo/remove`, data })
}

/**
 * 修改菜单
 * @param data
 * @returns
 */
export const menuUpdate = (data): Promise<IResp> => {
  return request.post({ url: '/api/menuinfo/update', data })
}

/**
 * 添加菜单
 * @param data
 * @returns
 */
export const menuCreate = (data): Promise<IResp> => {
  return request.post({ url: '/api/menuinfo/create', data })
}
