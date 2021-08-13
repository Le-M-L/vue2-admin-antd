// 重定向
export const REDIRECT_NAME = 'Redirect';

export const PARENT_LAYOUT_NAME = 'ParentLayout';

export const PAGE_NOT_FOUND_NAME = 'PageNotFound';

// export const EXCEPTION_COMPONENT = () => import('@/views/sys/exception');

/**
 * @description: layou布局
 */
 export const LAYOUT = () => import('@/layouts/default/tabs');


/**
 * @description: 父级布局
 */
 export const getParentLayout = () => {
    return () =>
      new Promise((resolve) => {
        resolve({
          name: PARENT_LAYOUT_NAME,
        });
      });
  };
  


