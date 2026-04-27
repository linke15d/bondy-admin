/**
 * 权限字段
 * add：添加  edit：修改  distribute：分配  delete：删除
 * 'add','edit','distribute','delete'
 */
const accessItem = [
  { label: '详情权限', value: 'Detail' },
  { label: '新增权限', value: 'Add' },
  { label: '编辑权限', value: 'Edit' },
  { label: '删除权限', value: 'Delete' },
  { label: '绑定机器人权限', value: 'Robot' },
  { label: '绑定归集地址权限', value: 'Collection' },
  { label: '币种配置权限', value: 'CurrencyConfig' },
  { label: '质押权限', value: 'Staking' },
  { label: 'RPC查询权限', value: 'RPCQuery' },
  { label: 'RPC编辑权限', value: 'RPCEdit' },
  { label: 'RPC删除权限', value: 'RPCDelete' },
  { label: '回调权限', value: 'CallBack' },
  { label: '重置谷歌密钥权限', value: 'ResetGoogleCode' },
  { label: '分配用户权限', value: 'DisUser' },
  { label: '审核权限', value: 'Audit' },
  { label: '人工转账权限', value: 'Transfer' },
  { label: '重新生成权限', value: 'Regenerate' },
  { label: '人工到账确认权限', value: 'Suspicious' }
]

export { accessItem }
