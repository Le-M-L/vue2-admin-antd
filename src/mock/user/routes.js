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
                        title: 'routes.dashboard.dashboard',
                        hideChildrenInMenu: true,
                        icon: 'bx:bx-home',
                    },
                    children: [
                        {
                            path: 'workplace',
                            name: 'Workplace',
                            component: '/dashboard/workplace/WorkPlace',
                            meta: {
                                hideMenu: true,
                                hideBreadcrumb: true,
                                title: 'routes.dashboard.analysis',
                                currentActiveMenu: '/dashboard',
                                icon: 'bx:bx-home',
                            },
                        },
                        {
                            path: 'demo',
                            name: 'demo',
                            component: '/dashboard/demo/index',
                            meta: {
                                hideMenu: true,
                                hideBreadcrumb: true,
                                title: 'routes.dashboard.analysis',
                                currentActiveMenu: '/dashboard',
                                icon: 'bx:bx-home',
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
