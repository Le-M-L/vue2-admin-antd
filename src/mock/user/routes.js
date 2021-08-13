import Mock from 'mockjs';

// const backRoute = {
//   path: 'back',
//   name: 'PermissionBackDemo',
//   meta: {
//       title: 'routes.demo.permission.back',
//   },

//   children: [
//       {
//           path: 'page',
//           name: 'BackAuthPage',
//           component: '/dashboard/workplace/Api',
//           meta: {
//               title: 'routes.demo.permission.backPage',
//           },
//       },
//       {
//           path: 'btn',
//           name: 'BackAuthBtn',
//           component: '/dashboard/workplace/WorkPlace',
//           meta: {
//               title: 'routes.demo.permission.backBtn',
//           },
//       },
//   ],
// };

Mock.mock(`${process.env.VUE_APP_API_BASE_URL}/routes`, 'get', () => {
    let result = {};
    result.code = 0;
    // result.data = [{
    //   router: 'root',
    //   children: [
    //     {
    //       router: 'dashboard',
    //       children: ['workplace'],
    //     },
    //     {
    //       router: 'exception',
    //       children: ['404','403'],
    //     },
    //     {
    //       router:'demo',
    //       children:['table']
    //     }
    //   ]
    // }]
    result.data = {
        component: {
            path: '/',
            name: '首页',
            component: 'LAYOUT',
            children: [
                {
                    path: '/dashboard',
                    name: 'dashboard',
                    component: 'BlankView',
                    redirect: '/dashboard/workplace',
                    meta: {
                        title: '首页',
                    },
                    children: [
                        {
                            path: 'workplace',
                            name: '工作台',
                            component: '/dashboard/workplace/WorkPlace',
                            meta: {
                                title: '工作台',
                            },
                        },
                        {
                            path: 'demo',
                            name: '测试',
                            component: '/dashboard/demo/index',
                            meta: {
                                title: '测试',
                            },
                        },
                    ],
                },
            ],
        },
        router: [
            {
                router: 'root',
                children: [
                    {
                        router: 'dashboard',
                        children: ['workplace'],
                    },
                    {
                        router: 'exception',
                        children: ['404', '403'],
                    },
                    {
                        router: 'demo',
                        children: ['table'],
                    },
                ],
            },
        ],
    };
    return result;
});
