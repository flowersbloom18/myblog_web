<template>
  <router-view />
</template>

<script setup>
  import { useUserStore } from '@/store';

  const store = useUserStore();
  // 加载用户信息
  store.loadUserInfo();
</script>

<style lang="less">
  .base_view {
    background-color: var(--bg);

    .gvb_base_container {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;

      .gvb_inner_container {
        width: 1200px;
        margin-top: 20px;
      }
    }
  }
</style>
