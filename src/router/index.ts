import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/console', // 根路径
      name: 'console',
      redirect: '/console/login', // 重定向到登录
      children: [
        {
          path: 'login', // 登录
          name: 'login',
          component: () => import('@/views/login/index.vue'),
          meta: {
            requiresAuth: false,
          },
        },
        {
          path: 'register', // 注册
          name: 'register',
          component: () => import('@/views/register/index.vue'),
          meta: {
            requiresAuth: false,
          },
        },
        {
          path: 'forgetPassword', // 找回密码
          name: 'forgetPassword',
          component: () => import('@/views/forget-password/index.vue'),
          meta: {
            requiresAuth: false,
          },
        },
        {
          path: 'test',
          name: 'test',
          component: () => import('@/views/login/test.vue'),
          meta: {
            requiresAuth: false,
          },
        },
        ...appRoutes,
        REDIRECT_MAIN,
        NOT_FOUND_ROUTE,
      ],
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
