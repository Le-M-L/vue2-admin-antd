import Mock from 'mockjs'

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/routes`, 'get', () => {
  let result = {}
  result.code = 0
  result.data = [{
    address: 'root',
    pkId:'1',
    children: [
      {
        address: 'dashboard',
        pkId:'2',
        children: ['workplace'],
      },
      {
        address: 'form',
        pkId:'3',
        children: ['basicForm', 'stepForm', 'advanceForm']
      },
      {
        address: 'basicForm',
        name: '验权表单',
        icon: 'file-excel',
        authority: 'queryForm',
        pkId:'4',
      },
      {
        address: 'antdv',
        name: 'Ant Design Vue',
        icon: 'ant-design',
        pkId:'5',
        link: 'https://www.antdv.com/docs/vue/introduce-cn/'
      },
      {
        address: 'document',
        name: '使用文档',
        icon: 'file-word',
        pkId:'6',
        link: 'https://iczer.gitee.io/vue-antd-admin-docs/'
      }
    ]
  }]
  return result
})
