import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import { basicRoutes } from '@/router/routers';
import Router from 'vue-router';
//应用配置
let appOptions = {
    router: undefined,
    store: undefined,
};

/**
 * 设置应用配置
 */
function setAppOptions(options) {
    const { router, store } = options;
    appOptions.router = router;
    appOptions.store = store;
}
/**
 * 格式化 router.options.routes，生成 fullPath
 */
function formatFullPath(routes, parentPath = '') {
    routes.forEach((route) => {
        let isFullPath = route.path.substring(0, 1) === '/';
        route.fullPath = isFullPath
            ? route.path
            : parentPath === '/'
            ? parentPath + route.path
            : parentPath + '/' + route.path;
        if (route.children) {
            formatFullPath(route.children, route.fullPath);
        }
    });
}

/**
 * 加载路由
 * @param routesConfig {RouteConfig[]} 路由配置
 */
function loadRoutes(routesConfig) {
    // 应用配置 存放了所有路由  页面初始化会获取一次数据一次 储存非异步是所有权限页面
    const { router, store } = appOptions;
    // 如果 routesConfig 有值，则更新到本地，否则从本地获取
    if (routesConfig) {
        store.commit('account/setRoutesConfig', routesConfig);
    } else {
        routesConfig = store.getters['account/routesConfig'];
    }
    // 如果开启了异步路由，则加载异步路由配置
    const asyncRoutes = store.state.setting.asyncRoutes;
    const routes = transformObjToRoute(routesConfig);
    // 添加openkeys 展开
    const finalRoutes = mergeRoutes(basicRoutes, routes);
    formatRoutes(finalRoutes);
    if (asyncRoutes) {
        if (routesConfig && routesConfig.length > 0) {
            // 将多级路由转换为二级路由
            let routeList = flatMultiLevelRoutes(finalRoutes);
            // router 应用的路由实例
            router.options = { ...router.options, routes: routeList };
            router.matcher = new Router({ ...router.options, routes: [] }).matcher;
            router.addRoutes(routeList);
            console.log(router.getRoutes());
        }
    }
    // 格式化生成后台菜单
    const backMenuList = transformRouteToMenu(finalRoutes.filter((item) => item.path === '/'));
    formatFullPath(backMenuList);
    // 初始化Admin后台菜单数据 获取当前首页下的所有菜单
    const menuRoutes = backMenuList.length && backMenuList[0].children;
    //设置菜单栏
    if (menuRoutes) {
        store.commit('setting/setMenuData', menuRoutes);
    }
}

/**
 * 合并路由
 * @param target {Route[]} 本地配置的路由
 * @param source {Route[]} 接口的异步路由
 * @returns {Route[]}
 */
function mergeRoutes(target, source) {
    const routesMap = {};
    target.forEach((item) => (routesMap[item.path] = item));
    source.forEach((item) => (routesMap[item.path] = item));
    return Object.values(routesMap);
}

/**
 * 格式化路由
 * @param routes 路由配置
 */
function formatRoutes(routes) {
    routes.forEach((route) => {
        const { path } = route;
        if (!path.startsWith('/') && path !== '*') {
            route.path = '/' + path;
        }
    });
    formatAuthority(routes);
}

/**
 * 格式化路由的权限配置
 * @param routes 路由
 * @param pAuthorities 父级路由权限配置集合
 */
function formatAuthority(routes, pAuthorities = [],openKeys = [], parentPath = '') {
    routes.forEach((route) => {
        const meta = route.meta;
        const defaultAuthority = pAuthorities[pAuthorities.length - 1] || { permission: '*' };
        if (meta) {
            let authority = {};
            if (!meta.authority) {
                //权限不存在 设置默认值
                authority = defaultAuthority;
            } else if (typeof meta.authority === 'string') {
                //当权限为字符串的时候把直接赋予 当前的权限
                authority.permission = meta.authority;
            } else if (typeof meta.authority === 'object') {
                //当权限为对象的时候 //直接赋予当前对象
                authority = meta.authority;
                const { role } = authority;
                if (typeof role === 'string') {
                    //权限所分配的角色
                    authority.role = [role];
                }
                if (!authority.permission && !authority.role) {
                    //当权限不存在 角色也不存在的时候赋予默认值
                    authority = defaultAuthority;
                }
            }
            meta.authority = authority; //最终把值返回当前路由
            let isFullPath = route.path.substring(0, 1) === '/';
            meta.fullPath = isFullPath
                ? route.path
                : parentPath === '/'
                ? parentPath + route.path
                : parentPath + '/' + route.path;

            meta.openKeys = openKeys.length ? [...openKeys,meta.fullPath]:[meta.fullPath]
        } else {
            const authority = defaultAuthority;
            route.meta = { authority,openKeys:[],fullPath:'' }; //当前meta元信息不存在的时候 直接赋值默认权限
        }
        route.meta.pAuthorities = pAuthorities; //父级路由权限配置集合 获取父级路由权限
        if (route.children) {
            //给子集路由赋予当前权限
            formatAuthority(route.children, [...pAuthorities, route.meta.authority],route.meta.openKeys,route.meta.fullPath);
        }
    });
}

/**
 * 加载导航守卫
 * @param guards
 * @param options
 */
function loadGuards(guards, options) {
    const { beforeEach, afterEach } = guards;
    const { router } = options;
    beforeEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.beforeEach((to, from, next) => guard(to, from, next, options));
        }
    });
    afterEach.forEach((guard) => {
        if (guard && typeof guard === 'function') {
            router.afterEach((to, from) => guard(to, from, options));
        }
    });
}

export { loadRoutes, formatAuthority, loadGuards, formatRoutes, setAppOptions, formatFullPath };
