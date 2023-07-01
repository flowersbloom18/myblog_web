import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();
    if (isLogin()) {
      // 如果登录
      if (userStore.role) {
        next(); // 如果权限不为0
      } else {
        try {
          await userStore.loadUserInfo();
          next();
        } catch (error) {
          await userStore.logout();
          next({
            name: 'login',
            query: {
              redirect: to.name,
              ...to.query,
            } as LocationQueryRaw,
          });
        }
      }
    } else {
      // 路由前置守卫拦截，如果没有登录，则要进行登录，或注册，或忘记密码处理
      if (to.name === 'login') {
        // 路由要去的地方如果是login，则进入
        next();
        return;
      }
      if (to.name === 'test') {
        next();
        return;
      }
      if (to.name === 'register') {
        // 注册
        next();
        return;
      }
      if (to.name === 'forgetPassword') {
        // 忘记密码
        next();
        return;
      }
      next({
        // 其它统统都要登录处理
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
