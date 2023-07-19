<template>
  <a-card class="border" align="left" :bordered="false">
    <span v-show="loading" style="text-align: left; font-size: 18px"
      >&nbsp;&nbsp;{{ info }}</span
    >
  </a-card>

  <a-card class="border" style="margin-top: 20px">
    <a-space style="font-size: 16px">
      <template #split>
        <a-divider direction="vertical" />
      </template>
      <a-space direction="vertical" align="center">
        <span>{{ categoryCount }}</span>
        <span>分类数</span>
      </a-space>
      <a-space direction="vertical" align="center">
        <span>{{ blogCount }}</span>
        <span>博客数</span>
      </a-space>
      <a-space direction="vertical" align="center">
        <span>{{ commentCount }}</span>
        <span>评论数</span>
      </a-space>
    </a-space>
  </a-card>

  <Announcement
    class="border"
    style="text-align: left; margin: 20px 0 20px 0"
  />

  <Music style="margin: 0 0 20px 0" />

  <Tags class="border" />

  <SiteInfo class="border" style="text-align: left; margin: 20px 0 20px 0" />
</template>

<script setup lang="ts">
  import { getWanAnInfoApi, getZaoAnInfoApi } from '@/api/hot';
  import { ref, watch } from 'vue';
  import { useAppStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import { getBlogApi } from '@/api/blog';
  import { getAllCommentApi } from '@/api/comment';
  import { getCategoryApi } from '@/api/category';
  import Announcement from '@/views/admin/dashboard/components/announcement.vue';
  import Music from '@/components/web/music/index.vue';
  import Tags from '@/components/web/tags/index.vue';
  import SiteInfo from '@/components/web/siteinfo/index.vue';

  const { loading, setLoading } = useLoading();
  // 获取全局日夜状态来更换语句
  const appStore = useAppStore();
  const info = ref('');
  const info1 = ref('');
  const info2 = ref('');

  const blogCount = ref(0);
  const commentCount = ref(0);
  const categoryCount = ref(0);

  // 监视 appStore 的主题变化,来更换info 。动态执行
  watch(appStore, (newValue) => {
    if (newValue.theme === 'dark') {
      info.value = info2.value;
    } else {
      info.value = info1.value;
    }
  });

  const getData = async () => {
    try {
      const data1 = await getZaoAnInfoApi();
      info1.value = data1.data.data;

      const data2 = await getWanAnInfoApi();
      info2.value = data2.data.data;

      setLoading(true);

      if (appStore.theme === 'dark') {
        info.value = info2.value;
      } else {
        info.value = info1.value;
      }

      const data3 = await getBlogApi();
      const data4 = await getAllCommentApi();
      const data5 = await getCategoryApi();
      blogCount.value = data3.data.data.count; // 博客总个数
      commentCount.value = data4.data.data.count; // 评论量
      categoryCount.value = data5.data.data.count; // 分类数
    } catch (err) {
      Message.warning('获取数据出错');
    }
  };

  getData();
</script>

<style lang="less" scoped>
  .border {
    border-radius: 15px;
  }
</style>
