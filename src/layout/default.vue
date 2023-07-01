<template>
  <div class="layout">
    <a-layout class="layout-demo">
      <a-layout-sider collapsible breakpoint="xl">
        <div class="logo">
          <img :src="logo" alt="logo" style="width: 100%; height: 50px" />
        </div>
        <a-menu
          :default-open-keys="['dashboard']"
          :default-selected-keys="['dashboard']"
          :style="{ width: '100%' }"
          @menu-item-click="onClickMenuItem"
        >
          <a-menu-item key="dashboard">
            <IconHome></IconHome>
            仪表盘
          </a-menu-item>

          <a-sub-menu key="content">
            <template #title>
              <IconCalendar></IconCalendar>
              博客相关
            </template>
            <a-menu-item key="blog">博客</a-menu-item>
            <a-menu-item key="category">分类</a-menu-item>
            <a-menu-item key="tag">标签</a-menu-item>
            <a-menu-item key="comment">评论</a-menu-item>
            <a-menu-item key="attachment">附件</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="user">
            <template #title>
              <IconCalendar></IconCalendar>
              用户相关
            </template>
            <a-menu-item key="list">用户列表</a-menu-item>
            <a-menu-item key="info">我的信息</a-menu-item>
            <a-menu-item key="collect">我的收藏</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="other">
            <template #title>
              <IconCalendar></IconCalendar>
              其它内容
            </template>
            <a-menu-item key="hot-msg">热搜信息</a-menu-item>
            <a-menu-item key="music">音乐</a-menu-item>
            <a-menu-item key="friend-link">友链</a-menu-item>
            <a-menu-item key="about">关于</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="system">
            <template #title>
              <IconCalendar></IconCalendar>
              系统相关
            </template>
            <a-menu-item key="announcement">系统公告</a-menu-item>
            <a-menu-item key="log">系统日志</a-menu-item>
            <a-menu-item key="info">系统信息</a-menu-item>
          </a-sub-menu>

          <a-sub-menu key="exception">
            <template #title>
              <IconCalendar></IconCalendar>
              异常页面
            </template>
            <a-menu-item key="403">403</a-menu-item>
            <a-menu-item key="404">404</a-menu-item>
            <a-menu-item key="500">500</a-menu-item>
          </a-sub-menu>
        </a-menu>

        <!-- trigger -->
        <template #trigger="{ collapsed }">
          <span style="font-size: 23px">
            <icon-menu-unfold v-if="collapsed"></icon-menu-unfold>
            <icon-menu-fold v-else></icon-menu-fold>
          </span>
        </template>
      </a-layout-sider>
      <a-layout>
        <a-layout-header>
          <NavBar />
        </a-layout-header>

        <a-layout style="padding: 0 24px">
          <a-breadcrumb :style="{ margin: '16px 0' }">
            <a-breadcrumb-item>首页</a-breadcrumb-item>
            <a-breadcrumb-item v-if="item1">{{ item1 }}</a-breadcrumb-item>
            <a-breadcrumb-item v-if="item2">{{ item2 }}</a-breadcrumb-item>
          </a-breadcrumb>

          <router-view :key="$route.fullPath" />

          <a-layout-footer>
            <footerContent />
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
  import { IconHome, IconCalendar } from '@arco-design/web-vue/es/icon';
  import NavBar from '@/components/navbar/index.vue';
  import footerContent from '@/components/footer/index.vue';
  import { useRouter } from 'vue-router';
  import { ref, watch } from 'vue';
  import { useAppStore } from '@/store';

  const router = useRouter();
  const appStore = useAppStore();

  const item1 = ref<string | undefined>('仪表盘'); // 父导航
  const item2 = ref<string | undefined>(''); // 子导航

  const logo = ref();
  const dark = '/src/assets/logo-dark.png';
  const light = '/src/assets/logo-light.png';

  // 获取默认值，基本上只会执行一次
  if (appStore.theme === 'dark') {
    logo.value = dark;
  } else {
    logo.value = light;
  }

  // 监视 appStore 的变化,来更换logo 。动态执行
  watch(appStore, (newValue) => {
    if (newValue.theme === 'dark') {
      logo.value = dark;
    } else {
      logo.value = light;
    }
  });

  const onClickMenuItem = (event: any) => {
    // 1、路由跳转
    router.push({
      name: event,
    });

    // 2、导航信息展示
    // 跳转到的下一个页面的路由名称
    const routeA = router.getRoutes().find((route) => route.name === event);
    item2.value = routeA?.meta.locale;
    if (routeA) {
      const parentRoute = router.resolve(routeA.path).matched[1];

      if (router.resolve(routeA.path).matched.length !== 2) {
        item1.value = parentRoute?.meta.locale;
      } else {
        item1.value = '';
      }
    }
  };
</script>

<style scoped lang="less">
  .layout {
    width: 100%;
    height: 100%;
  }

  .layout-demo {
    //height: 500px;
    height: 100vh;
    width: 100%;
    background: var(--color-fill-2);
    border: 1px solid var(--color-border);
  }

  .layout-demo :deep(.arco-layout-sider) .logo {
    height: 32px;
    margin: 12px 8px;
    background: rgba(255, 255, 255, 0.2);
  }

  .layout-demo :deep(.arco-layout-sider-light) .logo {
    background: var(--color-fill-2);
  }

  .layout-demo :deep(.arco-layout-header) {
    height: 64px;
    line-height: 64px;
    background: var(--color-bg-3);
  }

  .layout-demo :deep(.arco-layout-footer) {
    height: 48px;
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    line-height: 48px;
  }

  .layout-demo :deep(.arco-layout-content) {
    color: var(--color-text-2);
    font-weight: 400;
    font-size: 14px;
    background: var(--color-bg-3);
  }

  .layout-demo :deep(.arco-layout-footer),
  .layout-demo :deep(.arco-layout-content) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: var(--color-white);
    font-size: 16px;
    font-stretch: condensed;
    text-align: center;
  }
</style>
