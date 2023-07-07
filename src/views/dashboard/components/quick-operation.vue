<template>
  <a-card
    class="general-card"
    title="快捷访问"
    :header-style="{ paddingBottom: '0' }"
    :body-style="{ padding: '24px 20px 0 20px' }"
  >
    <div class="split-line" style="margin-bottom: 8vh" />
    <a-row :gutter="8">
      <a-col
        v-for="link in links"
        :key="link.text"
        :span="8"
        class="wrapper"
        @click="skip(link.name)"
        style="width: 200px"
      >
        <div class="icon">
          <component :is="link.icon" style="width: 30px; height: 100%" />
        </div>
        <a-typography-paragraph class="text" style="font-size: 13px">
          {{ link.text }}
        </a-typography-paragraph>
      </a-col>
    </a-row>
    <div class="split-line" style="margin-bottom: 10vh" />
  </a-card>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const links = [
    { text: '用户信息', icon: 'icon-user', name: 'info' },
    { text: '创建博客', icon: 'icon-storage', name: 'create_blog' },
    { text: '查看设置', icon: 'icon-settings', name: 'settings' },
    { text: '上传附件', icon: 'icon-folder', name: 'attachment' },
    { text: '查看音乐', icon: 'icon-music', name: 'music' },
    { text: '查看热搜', icon: 'icon-fire', name: 'hot-info' },
  ];

  const router = useRouter();
  const skip = (link: string) => {
    router.push({ name: link });
  };
</script>

<style scoped lang="less">
  .custom-link {
    /* 设置自定义字体样式 */
    font-family: Arial, sans-serif;
    font-size: 16px;
    /* 其他样式属性... */
    text-decoration: none;
  }
</style>
