import type { Router } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);

    // eslint-disable-next-line no-console
    console.log('1');
    // eslint-disable-next-line no-lonely-if
    if (permissionsAllow) next();
    else {
      // eslint-disable-next-line no-console
      console.log('2');
      // const destination =
      // Permission.findFirstPermissionRoute(appRoutes, '1') || NOT_FOUND;
      // const destination = Permission.findFirstPermissionRoute(appRoutes, userStore.role) || NOT_FOUND;
      // next(destination);
    }

    NProgress.done();
  });
}
