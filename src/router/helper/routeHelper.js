import { getParentLayout, LAYOUT } from '@/router/constant';
import { cloneDeep, omit } from 'lodash-es';
import VueRouter from 'vue-router';

const IFRAME = () => import('@/pages/sys/iframe/FrameBlank.vue');
const BlankView = () => import('@/layouts/BlankView.vue');

const LayoutMap = new Map();

LayoutMap.set('LAYOUT', LAYOUT);
LayoutMap.set('IFRAME', IFRAME);
LayoutMap.set('BlankView', BlankView);

let dynamicViewsModules;

// function importRoute() {
//     let pages = require.context('../../pages', true, /\.vue$/);
//     let map = {};
//     for (let key of pages.keys()) {
//         let k = key.replace(/^\./, '');
//         const lastIndex = k.lastIndexOf('.');
//         k = k.substring(0, lastIndex);
//         map[k] = pages(key).default;
//     }
//     return map;
// }

// 动态引入
function asyncImportRoute(routes) {
    dynamicViewsModules = dynamicViewsModules || require.context('../../pages', true, /\.vue$/);
    if (!routes) return;
    routes.forEach((item) => {
        if (!item.component && item.meta?.frameSrc) {
            item.component = 'IFRAME';
        }
        const { component, name } = item;
        const { children } = item;
        if (component) {
            const layoutFound = LayoutMap.get(component);
            if (layoutFound) {
                item.component = layoutFound;
            } else {
                item.component = dynamicImport(dynamicViewsModules, component);
              }
        } else if (name) {
            item.component = getParentLayout();
        }
        children && asyncImportRoute(children);
    });
}

function dynamicImport(dynamicViewsModules, component) {
    let matchKeys = [];
    for (let key of dynamicViewsModules.keys()) {
        let k = key.replace(/^\./, '');
        const lastIndex = k.lastIndexOf('.');
        k = k.substring(0, lastIndex);
        if(k == component){
          matchKeys.push(dynamicViewsModules(key).default);
        }
    }

    if (matchKeys?.length === 1) {
        return matchKeys[0];
    }
    if (matchKeys?.length > 1) {
        console.warn('请不要创造.vue和.jsx在views文件夹下的相同层次目录下具有相同文件名文件.这将导致动态引入失败  ');
        return;
    }
}

// 将后台对象转换为路由对象
export function transformObjToRoute(routeList) {
    routeList.forEach((route) => {
        if (route.component) {
            if (route.component.toUpperCase() === 'LAYOUT') {
                route.component = LayoutMap.get(route.component.toUpperCase());
            } else {
                route.children = [cloneDeep(route)];
                route.component = LAYOUT;
                route.name = `${route.name}Parent`;
                route.path = '';
                const meta = route.meta || {};
                meta.single = true;
                meta.affix = false;
                route.meta = meta;
            }
        }
        route.children && asyncImportRoute(route.children);
    });
    return routeList;
}

/**
 * 将多级路由转换为二级路由
 */
export function flatMultiLevelRoutes(routeModules) {
    const modules = cloneDeep(routeModules);
    for (let index = 0; index < modules.length; index++) {
        const routeModule = modules[index];
        // 判断 路由是否超过二级    不超过二级 跳过本次操作
        if (!isMultipleRoute(routeModule)) {
            continue;
        }
        promoteRouteLevel(routeModule);
    }
    return modules;
}

// 路由等级提升
function promoteRouteLevel(routeModule) {
    // 使用vue-router来拼接菜单
    let router = new VueRouter({
        routes: [routeModule],
    });

    const routes = router.getRoutes();
    addToChildren(routes, routeModule.children || [], routeModule);
    router = null;

    routeModule.children = routeModule.children?.map((item) => omit(item, 'children'));
}

// 将所有子路由添加到 二级路由中
function addToChildren(routes, children, routeModule) {
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        const route = routes.find((item) => item.name === child.name);
        if (!route) {
            continue;
        }
        routeModule.children = routeModule.children || [];
        if (!routeModule.children.find((item) => item.name === route.name)) {
            routeModule.children?.push(route);
        }
        if (child.children?.length) {
            addToChildren(routes, child.children, routeModule);
        }
    }
}

// 判断级别是否超过2级
function isMultipleRoute(routeModule) {
    if (!routeModule || !Reflect.has(routeModule, 'children') || !routeModule.children?.length) {
        return false;
    }

    const children = routeModule.children;

    let flag = false;
    for (let index = 0; index < children.length; index++) {
        const child = children[index];
        if (child.children?.length) {
            flag = true;
            break;
        }
    }
    return flag;
}
