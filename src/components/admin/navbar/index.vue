<template>
  <div class="navbar">
    <div class="left-side"> </div>

    <ul class="right-side">
      <!--主页-->
      <li>
        <a-tooltip content="点击进入前台页面">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleHome"
          >
            <template #icon>
              <icon-home />
            </template> </a-button
        ></a-tooltip>
      </li>
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
      <!--全屏-->
      <li>
        <a-tooltip
          :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!--用户-->
      <li>
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
              <a-space @click="$router.push('/')">
                <icon-home />
                <span> 前台页面 </span>
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
  import { useDark, useToggle, useFullscreen } from '@vueuse/core';
  import { useAppStore, useUserStore } from '@/store';
  import useUser from '@/hooks/user';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();

  const avatar = ref('');
  const nickName = ref('');

  userStore.loadUserInfo();
  avatar.value = userStore.avatar as string;
  nickName.value = userStore.nick_name as string;

  watch(userStore, () => {
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
  const handleHome = () => {
    router.push('/');
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
