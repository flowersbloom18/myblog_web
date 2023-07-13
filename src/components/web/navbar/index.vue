<template>
  <div class="navbar">
    <div class="left-side">
      <div class="logo">
        <img :src="logo" alt="logo" style="width: 100%; height: 60px" />
      </div>
    </div>

    <ul class="center-side">
      <!--导航栏-->
      <li style="flex: 0 0 auto">
        <a-menu mode="horizontal" :default-selected-keys="['1']">
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">分类</a-menu-item>
          <a-menu-item key="3">标签</a-menu-item>
          <a-menu-item key="4">热搜</a-menu-item>
          <a-menu-item key="5">友链</a-menu-item>
          <a-menu-item key="6">关于</a-menu-item>
        </a-menu>
      </li>
    </ul>

    <ul class="right-side">
      <!--昼夜模式切换-->
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--用户未登录-->
      <li v-show="!isLogin()">
        <a-dropdown trigger="hover">
          <span
            :style="{ cursor: 'pointer' }"
            @click="$router.push({ name: 'login' })"
          >
            登录
          </span>
          <template #content>
            <a-doption>
              <a-space @click="$router.push({ name: 'register' })">
                <span> 注册 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <!--用户登录成功-->
      <li v-show="isLogin()">
        <a-dropdown trigger="hover">
          <a-space>
            <span style="cursor: pointer">{{ nickName }}</span>
            <a-avatar
              :size="32"
              :style="{ marginRight: '8px', cursor: 'pointer', fontSize: 0 }"
            >
              <img alt="avatar" :src="avatar" />
            </a-avatar>
          </a-space>

          <template #content>
            <a-doption>
              <a-space @click="$router.push({ name: 'dashboard' })">
                <icon-home />
                <span> 后台页面 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="$router.push({ name: 'info' })">
                <icon-user />
                <span> 我的信息 </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span> 退出登录 </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import { isLogin } from '@/utils/auth';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();

  const logo = ref();
  const dark2 = '/src/assets/logo-dark.png';
  const light2 = '/src/assets/logo-light.png';

  // 获取默认值，基本上只会执行一次
  if (appStore.theme === 'dark') {
    logo.value = dark2;
  } else {
    logo.value = light2;
  }

  // 监视 appStore 的变化,来更换logo 。动态执行
  watch(appStore, (newValue) => {
    if (newValue.theme === 'dark') {
      logo.value = dark2;
    } else {
      logo.value = light2;
    }
  });

  const avatar = ref('');
  const nickName = ref('');

  avatar.value = userStore.avatar as string;
  nickName.value = userStore.nick_name as string;

  watch(appStore, () => {
    avatar.value = userStore.avatar as string;
    nickName.value = userStore.nick_name as string;
  });

  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
    },
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const handleLogout = () => {
    logout();
  };
</script>

<style scoped lang="less">
  .navbar {
    display: flex;
    justify-content: space-between;
    height: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
  }

  .left-side {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }

  .center-side {
    flex: 1;
    list-style: none;
    float: right;
  }

  .right-side {
    display: flex;
    padding-right: 20px;
    list-style: none;

    :deep(.locale-select) {
      border-radius: 20px;
    }

    li {
      display: flex;
      align-items: center;
      padding: 0 10px;
    }

    a {
      color: var(--color-text-1);
      text-decoration: none;
    }

    .nav-btn {
      border-color: rgb(var(--gray-2));
      color: rgb(var(--gray-8));
      font-size: 16px;
    }

    .trigger-btn,
    .ref-btn {
      position: absolute;
      bottom: 14px;
    }

    .trigger-btn {
      margin-left: 14px;
    }
  }
</style>

<style lang="less">
  .message-popover {
    .arco-popover-content {
      margin-top: 0;
    }
  }
</style>
