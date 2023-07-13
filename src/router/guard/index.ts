import type { Router } from 'vue-router';
import setupPermissionGuard from './permission';

export default function createRouteGuard(router: Router) {
  setupPermissionGuard(router);
}
