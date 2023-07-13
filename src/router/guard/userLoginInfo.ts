import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { useUserStore } from '@/store';
import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // 需要登录才能访问的路由名称
    const requireAuth = [
      'console',
      'dashboard',
      'content',
      'blog',
      'blog_list',
      'created_blog',
      'edit_blog',
      'category',
      'tag',
      'comment',
      'attachment',
      'user',
      'list',
      'info',
      'collect',
      'other',
      'music',
      'hot-info',
      'friend-link',
      'about',
      'system',
      'announcement',
      'log',
      'settings',
    ];
    // 如果未登录，要访问关键位置则需要登录，否则通过。
    // 否则登录，都通行

    if (!isLogin()) {
      if (requireAuth.includes(to.name as string)) {
        next({
          // 登录处理
          name: 'login',
          query: {
            redirect: to.name,
            ...to.query,
          } as LocationQueryRaw,
        });
      } else {
        next();
      }
    } else {
      next();
    }

    // // 路由前置守卫拦截，没有登录无法进入关键位置。
    // if (to.name === 'index') {
    // }
    // if (to.name === 'login') {
    //   next();
    //   return;
    // }
    // if (to.name === 'test') {
    //   next();
    //   return;
    // }
    // if (to.name === 'register') {
    //   // 注册
    //   next();
    //   return;
    // }
    // if (to.name === 'forgetPassword') {
    //   // 忘记密码
    //   next();
    //   return;
    // }
    // next({
    //   // 其它统统都要登录处理
    //   name: 'login',
    //   query: {
    //     redirect: to.name,
    //     ...to.query,
    //   } as LocationQueryRaw,
    // });
  });
}
