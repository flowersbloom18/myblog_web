import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login', // 登录
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/register', // 注册
      name: 'register',
      component: () => import('@/views/register/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/test', // 测试
      name: 'test',
      component: () => import('@/views/test.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/forgetPassword', // 找回密码
      name: 'forgetPassword',
      component: () => import('@/views/forget-password/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/console', // 根路径
      name: 'console',
      redirect: '/console/dashboard',
      component: () => import('@/layout/default.vue'),
      children: [
        // 1、仪表盘
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/dashboard/workplace/index.vue'),
          meta: {
            locale: '仪表盘',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 2、博客相关
        {
          path: 'content',
          name: 'content',
          redirect: '/console/content/blog/blog_list',
          meta: {
            locale: '博客相关',
            icon: 'icon-user',
            requiresAuth: true,
          },
          children: [
            {
              path: 'blog',
              name: 'blog',
              redirect: '/console/content/blog/blog_list',
              meta: {
                locale: '博客',
                requiresAuth: true,
                roles: ['*'],
              },
              children: [
                {
                  path: 'blog_list',
                  name: 'blog_list',
                  component: () => import('@/views/blog/index.vue'),
                  meta: {
                    locale: '博客列表',
                    requiresAuth: true,
                    roles: ['*'],
                  },
                },
                {
                  path: 'create_blog',
                  name: 'create_blog',
                  component: () =>
                    import('@/views/blog/component/create/index.vue'),
                  meta: {
                    locale: '新增博客',
                    requiresAuth: true,
                    roles: ['*'],
                  },
                },
                {
                  path: 'edit_blog/:id',
                  name: 'edit_blog',
                  // 如果没有携带参数是否重定向
                  component: () =>
                    import('@/views/blog/component/edit/index.vue'),
                  meta: {
                    locale: '编辑博客',
                    requiresAuth: true,
                    roles: ['*'],
                  },
                },
              ],
            },
            {
              path: 'category',
              name: 'category',
              component: () => import('@/views/category/index.vue'),
              meta: {
                locale: '分类',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'tag',
              name: 'tag',
              component: () => import('@/views/tag/index.vue'),
              meta: {
                locale: '标签',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'comment',
              name: 'comment',
              component: () => import('@/views/user/collect/index.vue'),
              meta: {
                locale: '评论',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'attachment',
              name: 'attachment',
              component: () => import('@/views/attachment/index.vue'),
              meta: {
                locale: '附件',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        // 3、用户相关
        {
          path: 'user',
          name: 'user',
          redirect: '/console/user/list',
          meta: {
            locale: '用户相关',
            icon: 'icon-user',
            requiresAuth: true,
          },
          children: [
            {
              path: 'list',
              name: 'list',
              component: () => import('@/views/user/list/index.vue'),
              meta: {
                locale: '用户列表',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'info',
              name: 'info',
              component: () => import('@/views/user/info/index.vue'),
              meta: {
                locale: '我的信息',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'collect',
              name: 'collect',
              component: () => import('@/views/user/collect/index.vue'),
              meta: {
                locale: '我的收藏',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        // 4、其它内容
        {
          path: 'other',
          name: 'other',
          redirect: '/console/other/hot-msg',
          meta: {
            locale: '其它内容',
            icon: 'icon-user',
            requiresAuth: true,
          },
          children: [
            {
              path: 'hot-msg',
              name: 'hot-msg',
              component: () => import('@/views/user/list/index.vue'),
              meta: {
                locale: '热搜信息',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'music',
              name: 'music',
              component: () => import('@/views/user/info/index.vue'),
              meta: {
                locale: '音乐',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'friend-link',
              name: 'friend-link',
              component: () => import('@/views/user/collect/index.vue'),
              meta: {
                locale: '友链',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'about',
              name: 'about',
              component: () => import('@/views/about/index.vue'),
              meta: {
                locale: '关于',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        // 5、系统相关
        {
          path: 'system',
          name: 'system',
          redirect: '/console/system/announcement',
          meta: {
            locale: '系统相关',
            icon: 'icon-user',
            requiresAuth: true,
          },
          children: [
            {
              path: 'announcement',
              name: 'announcement',
              component: () => import('@/views/announcement/index.vue'),
              meta: {
                locale: '系统公告',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'log',
              name: 'log',
              component: () => import('@/views/user/info/index.vue'),
              meta: {
                locale: '系统日志',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'info',
              name: 'info',
              component: () => import('@/views/user/info/index.vue'),
              meta: {
                locale: '系统信息',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
        // 异常
        {
          path: 'exception',
          name: 'exception',
          redirect: '403',
          meta: {
            locale: '异常',
            requiresAuth: true,
            icon: 'icon-exclamation-circle',
            order: 6,
          },
          children: [
            {
              path: '403',
              name: '403',
              component: () => import('@/views/exception/403/index.vue'),
              meta: {
                locale: '403',
                requiresAuth: true,
                // roles: ['admin'],
                roles: ['*'],
              },
            },
            {
              path: '404',
              name: '404',
              component: () => import('@/views/exception/404/index.vue'),
              meta: {
                locale: '404',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: '500',
              name: '500',
              component: () => import('@/views/exception/500/index.vue'),
              meta: {
                locale: '500',
                requiresAuth: true,
                roles: ['*'],
              },
            },
          ],
        },
      ],
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/not-found/index.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
