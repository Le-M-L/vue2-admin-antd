import { findPath, treeMap } from '@/utils/helper/treeHelper';
import { cloneDeep } from 'lodash-es';
import { isUrl } from '@/utils/is';
 
export function getAllParentPath(treeData, path) {
  const menuList = findPath(treeData, (n) => n.path === path);
  return (menuList || []).map((item) => item.path);
}

/**
 * config menu with given params
 */
 const menuParamRegex =  /(?::)([\s\S]+?)((?=\/)|$)/g;
 export function configureDynamicParamsMenu(menu, params) {
   const { path, paramPath } = menu;
   let realPath = paramPath ? paramPath : path;
   const matchArr = realPath.match(menuParamRegex);
   matchArr?.forEach((it) => {
    const realIt = it.substr(1);
    if (params[realIt]) {
      realPath = realPath.replace(`:${realIt}`, params[realIt]);
     }
   });
   // save original param path.
   if (!paramPath && matchArr && matchArr.length > 0) {
     menu.paramPath = path;
   }
   menu.path = realPath;
   // children
   menu.children?.forEach((item) => configureDynamicParamsMenu(item, params));
 }

// 拼接父级路径
// hidePathForChildren子集 隐藏本级
function joinParentPath(menus, parentPath = '') {
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index];
    // 注意，以/开头的嵌套路径将被视为根路径。
    // 这允许您在不必使用嵌套URL的情况下利用组件嵌套。
    if (!(menu.path.startsWith('/') || isUrl(menu.path))) {
      // Path不是以/开头的，也不是url, 拼接父路径
      menu.path = `${parentPath}/${menu.path}`;
    }
    if (menu?.children?.length) {
        joinParentPath(menu.children, menu.meta?.hidePathForChildren ? parentPath : menu.path);
    }
  }
}

// 解析菜单模块
export function transformMenuModule(menuModule) {
  const { menu } = menuModule;

  const menuList = [menu];

  joinParentPath(menuList);
  return menuList[0];
}

export function transformRouteToMenu(routeModList, routerMapping = false) {
  const cloneRouteModList = cloneDeep(routeModList);
  const routeList = [];

  cloneRouteModList.forEach((item) => {
    if (routerMapping && item.meta.hideChildrenInMenu && typeof item.redirect === 'string') {
        item.path = item.redirect;
    }
    if (item.meta?.single) {
      const realItem = item?.children?.[0];
      realItem && routeList.push(realItem);
    } else {
      routeList.push(item);
    }
  });
  const list = treeMap(routeList, {
    conversion: (node) => {
      const { meta: { title, hideMenu = false } = {} } = node;

      return {
        ...(node.meta || {}),
        meta: node.meta,
        name: title,
        hideMenu,
        path: node.path,
        ...(node.redirect ? { redirect: node.redirect } : {}),
      };
    },
  });
  joinParentPath(list);
  return cloneDeep(list);
}
