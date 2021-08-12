
// 异步路由配置  //不需要权限的路由
const routesConfig = [
    {
        path: '/login',
        name: '登录页',
        component: () => import('@/pages/login'),
        meta: {
            title: 'ErrorPage',
            hideBreadcrumb: true,
            hideMenu: true,
        },
    },
];

//默认赋予权限 *  基础路由
const options = {
    routes: routesConfig,
};
export default options;
