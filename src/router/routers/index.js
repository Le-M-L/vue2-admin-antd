import { importAll } from '@/utils';
const modules = importAll(require.context('./modules', false, /\.js$/));

const routeModuleList = [];

Object.keys(modules).forEach((key) => {
    const mod = modules[key].default || {};
    const modList = Array.isArray(mod) ? [...mod] : [mod];
    routeModuleList.push(...modList);
});

// 总路由
export const asyncRoutes = [...routeModuleList];

export const RootRoute = {
    path: '/',
    name: 'Root',
    redirect: '/login',
    meta: {
        title: 'Root',
    },
};

export const LoginRoute = {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login'),
    meta: {
        title: '登录页',
    },
};

// 404页面
const PAGE_NOT_FOUND_ROUTE = {
    path: '*',
    name: 'ErrorPage',
    component: () => import('@/pages/exception/404'),
    meta: {
        title: 'ErrorPage',
        hideBreadcrumb: true,
        hideMenu: true,
    },
};

export const basicRoutes = [LoginRoute, RootRoute, PAGE_NOT_FOUND_ROUTE];
