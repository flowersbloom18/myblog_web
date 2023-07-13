import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import { isLogin } from '@/utils/auth';
import { useUserStore } from '@/store';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();

    // 前台和后台
    // 前台不需要认证，除了收藏和评论模块
    // 后台需要认证，且登录，还有根据权限来判断是否可以访问。
    const userStore = useUserStore();
    userStore.loadUserInfo();

    const { requiresAuth } = to.meta;
    const isAuthenticated = isLogin();

    // 1、如果需要认证，且未登录，则返回登录
    // 2、如果需要认证，则判断权限是否合适，若合适则可，否则返回403
    // 3、不需要认证，直接通过。
    if (requiresAuth && !isAuthenticated) {
      next('login');
    } else if (requiresAuth) {
      // 检查角色权限,跟用户登录后的权限进行比较来执行。

      // 如果*则都可查看
      // 如果1则管理员查看 // 如果3则访客查看//管理员和访客看到的是一样的，但是权限和关键信息看不到。
      // 如果2则用户查看

      const { roles } = to.meta;
      if (roles && roles.includes('*')) {
        next();
      } else if (
        roles &&
        roles.includes('1') &&
        userStore.userInfo.role === 1
      ) {
        // 管理员
        next();
      } else if (
        roles &&
        roles.includes('3') &&
        userStore.userInfo.role === 3
      ) {
        // 访客
        next();
      } else if (
        roles &&
        roles.includes('2') &&
        userStore.userInfo.role === 2
      ) {
        // 用户
        next();
      } else {
        // 权限错误
        next('/403');
      }
    } else {
      next();
    }
    NProgress.done();
  });
}
