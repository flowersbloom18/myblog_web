<template>
  <a-card
    class="general-card"
    :title="$t('workplace.announcement')"
    :header-style="{ paddingBottom: '0' }"
  >
    <template #extra>
      <a-link @click="skip()">修改公告</a-link>
    </template>

    <MdPreview :editor-id="id" :model-value="text" :theme="theme1" />
  </a-card>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { getAnnouncementApi } from '@/api/announcement';
  import { ref, watch } from 'vue';
  import { MdPreview } from 'md-editor-v3';
  // preview.css相比style.css少了编辑器那部分样式
  import 'md-editor-v3/lib/preview.css';
  import { useAppStore } from '@/store';
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const id = 'preview-only';
  const text = ref('');

  const appStore = useAppStore();
  // 预览器的主题颜色
  const theme1 = ref();

  // 获取默认值，基本上只会执行一次
  if (appStore.theme === 'dark') {
    theme1.value = 'dark';
  } else {
    theme1.value = 'light';
  }

  // 监视 appStore 的变化,从而实现动态更换编辑器的背景颜色;
  watch(appStore, (newValue) => {
    if (newValue.theme === 'dark') {
      theme1.value = 'dark';
    } else {
      theme1.value = 'light';
    }
  });
  const skip = () => {
    router.push({ name: 'announcement' });
  };

  const getData = async () => {
    try {
      const data = await getAnnouncementApi();
      text.value = data.data.data.content;
    } catch (err) {
      Message.warning(err as string);
    }
  };

  getData();
</script>

<style scoped lang="less">
  .item {
    display: flex;
    align-items: center;
    width: 100%;
    height: 24px;
    margin-bottom: 4px;
    .item-content {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-left: 4px;
      color: var(--color-text-2);
      text-decoration: none;
      font-size: 13px;
      cursor: pointer;
    }
  }

  // 夜间模式的颜色配置
  .md-editor-dark {
    //--md-bk-color: #333 !important;
    background-color: rgba(0, 0, 0, 0);
  }
</style>
