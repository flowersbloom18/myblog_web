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
      component: () => import('@/views/admin/login/index.vue'),
    },
    {
      path: '/register', // 注册
      name: 'register',
      component: () => import('@/views/admin/register/index.vue'),
    },
    {
      path: '/test', // 测试
      name: 'test',
      component: () => import('@/views/test.vue'),
    },
    {
      path: '/forgetPassword', // 找回密码
      name: 'forgetPassword',
      component: () => import('@/views/admin/forget-password/index.vue'),
    },
    {
      path: '/',
      name: 'index_base',
      component: () => import('../views/web/web.vue'),
      children: [
        {
          path: '',
          name: 'index',
          component: () => import('../views/web/index.vue'),
        },
        // {
        //   path: 'news',
        //   name: 'news',
        //   component: () => import('../views/web/news.vue'),
        // },
        // {
        //   path: 'search',
        //   name: 'search',
        //   component: () => import('../views/web/search.vue'),
        // },
        // {
        //   path: 'chat',
        //   name: 'chat',
        //   component: () => import('../views/web/chat_group.vue'),
        // },
        // {
        //   path: 'article/:id',
        //   name: 'article',
        //   component: () => import('../views/web/article.vue'),
        // },
      ],
    },
    // 后台管理界面
    {
      path: '/console',
      name: 'console',
      redirect: '/console/dashboard',
      component: () => import('@/layout/default.vue'),
      children: [
        // 1、仪表盘
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/admin/dashboard/index.vue'),
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
            roles: ['1', '3'],
          },
          children: [
            {
              path: 'blog',
              name: 'blog',
              redirect: '/console/content/blog/blog_list',
              meta: {
                locale: '博客',
                requiresAuth: true,
                roles: ['1', '3'],
              },
              children: [
                {
                  path: 'blog_list',
                  name: 'blog_list',
                  component: () => import('@/views/admin/blog/index.vue'),
                  meta: {
                    locale: '博客列表',
                    requiresAuth: true,
                    roles: ['1', '3'],
                  },
                },
                {
                  path: 'create_blog',
                  name: 'create_blog',
                  component: () =>
                    import('@/views/admin/blog/component/create/index.vue'),
                  meta: {
                    locale: '新增博客',
                    requiresAuth: true,
                    roles: ['1', '3'],
                  },
                },
                {
                  path: 'edit_blog/:id',
                  name: 'edit_blog',
                  // 如果没有携带参数是否重定向
                  component: () =>
                    import('@/views/admin/blog/component/edit/index.vue'),
                  meta: {
                    locale: '编辑博客',
                    requiresAuth: true,
                    roles: ['1', '3'],
                  },
                },
              ],
            },
            {
              path: 'category',
              name: 'category',
              component: () => import('@/views/admin/category/index.vue'),
              meta: {
                locale: '分类',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'tag',
              name: 'tag',
              component: () => import('@/views/admin/tag/index.vue'),
              meta: {
                locale: '标签',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'comment',
              name: 'comment',
              component: () => import('@/views/admin/comment/index.vue'),
              meta: {
                locale: '评论',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'attachment',
              name: 'attachment',
              component: () => import('@/views/admin/attachment/index.vue'),
              meta: {
                locale: '附件',
                requiresAuth: true,
                roles: ['1', '3'],
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
            requiresAuth: true,
          },
          children: [
            {
              path: 'list',
              name: 'list',
              component: () => import('@/views/admin/user/list/index.vue'),
              meta: {
                locale: '用户列表',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'info',
              name: 'info',
              component: () => import('@/views/admin/user/info/index.vue'),
              meta: {
                locale: '我的信息',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'collect',
              name: 'collect',
              component: () => import('@/views/admin/user/collect/index.vue'),
              meta: {
                locale: '我的收藏',
                requiresAuth: true,
                roles: ['*'],
              },
            },
            {
              path: 'my_comment',
              name: 'my_comment',
              component: () => import('@/views/admin/user/comment/index.vue'),
              meta: {
                locale: '我的评论',
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
            requiresAuth: true,
          },
          children: [
            {
              path: 'hot-info',
              name: 'hot-info',
              component: () => import('@/views/admin/hot-info/index.vue'),
              meta: {
                locale: '热搜信息',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'music',
              name: 'music',
              component: () => import('@/views/admin/music/index.vue'),
              meta: {
                locale: '音乐',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'friend-link',
              name: 'friend-link',
              component: () => import('@/views/admin/friend-link/index.vue'),
              meta: {
                locale: '友链',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'about',
              name: 'about',
              component: () => import('@/views/admin/about/index.vue'),
              meta: {
                locale: '关于',
                requiresAuth: true,
                roles: ['1', '3'],
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
            requiresAuth: true,
          },
          children: [
            {
              path: 'announcement',
              name: 'announcement',
              component: () => import('@/views/admin/announcement/index.vue'),
              meta: {
                locale: '系统公告',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'log',
              name: 'log',
              component: () => import('@/views/admin/log/index.vue'),
              meta: {
                locale: '系统日志',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
            {
              path: 'settings',
              name: 'settings',
              component: () => import('@/views/admin/settings/index.vue'),
              meta: {
                locale: '系统信息',
                requiresAuth: true,
                roles: ['1', '3'],
              },
            },
          ],
        },
      ],
    },
    // 权限错误
    {
      path: '/403',
      name: '403',
      component: () => import('@/views/admin/exception/403/index.vue'),
    },
    // 服务器出了点问题
    {
      path: '/500',
      name: '500',
      component: () => import('@/views/admin/exception/500/index.vue'),
    },
    // 404 Not Found
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () => import('@/views/admin/not-found/index.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
