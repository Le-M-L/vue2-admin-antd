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
