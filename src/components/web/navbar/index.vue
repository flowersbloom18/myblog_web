<template>
  <div class="navbar">
    <div class="nav">
      <div class="menu-demo1">
        <!--导航栏-->
        <a-menu
          :selected-keys="[currentRoute]"
          style="height: 60px; line-height: 60px"
          mode="horizontal"
          :default-selected-keys="['home']"
          :default-open-keys="['home']"
          @menu-item-click="onClickMenuItem"
        >
          <a-menu-item
            key="0"
            class="menu-item"
            :style="{ padding: 0, marginRight: '3px' }"
            disabled
          >
            <div class="logo">
              <img :src="logo" alt="logo" style="width: 100%; height: 40px" />
            </div>
          </a-menu-item>
          <a-menu-item key="home" class="menu-item"
            ><icon-home />首页</a-menu-item
          >
          <a-menu-item key="category_index" class="menu-item"
            ><icon-list />分类</a-menu-item
          >
          <a-menu-item key="tag_index" class="menu-item"
            ><icon-tags />标签</a-menu-item
          >
          <a-menu-item key="info_index" class="menu-item"
            ><icon-fire />信息</a-menu-item
          >
          <a-menu-item key="friendlink_index" class="menu-item">
            <icon-user-group />友链</a-menu-item
          >
          <a-menu-item key="about_index" class="menu-item"
            ><icon-info-circle />关于</a-menu-item
          >
        </a-menu>
      </div>
      <div class="search-container">
        <icon-search
          size="18"
          style="cursor: pointer; padding-left: 2px; color: var(--color-text-1)"
          @click="showSearchBox"
        />
        <input
          id="searchBox"
          v-model="info"
          type="text"
          class="search-box"
          placeholder="请输入关键字..."
        />
      </div>

      <div class="menu-demo2">
        <ul class="right-side">
          <!--    昼夜模式切换-->
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
          <!--    用户未登录-->
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
          <!--    用户登录成功-->
          <li v-show="isLogin()">
            <a-dropdown trigger="hover">
              <a-space>
                <span style="cursor: pointer; color: var(--color-text-1)">{{
                  nickName
                }}</span>
                <a-avatar
                  :size="32"
                  :style="{
                    marginRight: '8px',
                    cursor: 'pointer',
                    fontSize: 0,
                  }"
                >
                  <img alt="avatar" :src="avatar" />
                </a-avatar>
              </a-space>

              <template #content>
                <a-doption>
                  <a-space @click="$router.push({ name: 'dashboard' })">
                    <icon-home />
                    <span> 控制台 </span>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, watch } from 'vue';
  import { useDark, useToggle } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import { isLogin } from '@/utils/auth';
  import { useRoute, useRouter } from 'vue-router';

  const route = useRoute();
  const router = useRouter();
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

  const info = ref('');
  const showSearchBox = () => {
    // const searchBox = document.getElementById('searchBox');
    router.push({ name: 'search' });

    // 如果没有数据则可以关闭，否则提交数据。
    // if (!info.value) {
    //   searchBox?.classList.toggle('show');
    // } else {
    //   // 发送请求
    // }
  };

  const onClickMenuItem = (event: any) => {
    // 1、路由跳转
    router.push({
      name: event,
    });
  };

  // 2、解决刷新页面后，左侧菜单选中值为默认值的情况。【执行一次】
  const currentRoute = computed(() => route.name);
</script>

<style scoped lang="less">
  .navbar {
    width: 100%;
    background-color: var(--color-bg-2);
    border-bottom: 1px solid var(--color-border);
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
  }

  .nav {
    margin: 0 auto;
    width: 1300px;
  }

  .menu-demo1 {
    box-sizing: border-box;
    width: 1000px;
    display: inline-block;

    .menu-item {
      font-size: 16px;
    }
  }

  .menu-demo2 {
    height: 60px;
    display: inline-block;
  }

  .search-container {
    display: inline-block;
    position: relative;
  }

  .search-box {
    position: absolute;
    top: -5px;
    left: -180px;
    opacity: 0;
    height: 30px;
    width: 150px;
    transition: opacity 0.5s, left 0.5s;

    border: 1px solid #999;
    border-radius: 15px;
    padding: 5px 10px;
  }

  .show {
    opacity: 1;
    left: -150px;
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
