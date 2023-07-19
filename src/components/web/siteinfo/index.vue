<template>
  <a-card>
    <template #title>
      <span style="float: left; font-size: 16px">
        <a-space>
          <img
            src="../../../assets/images/siteinfo.svg"
            style="width: 23px"
            alt="tag"
          />
          <span>站点信息</span>
        </a-space>
      </span>
    </template>

    <a-space v-show="loading" direction="vertical">
      <a-typography-text> <b>网站标题：</b>{{ info.title }} </a-typography-text>
      <a-typography-text>
        <b>建站时间：</b>{{ info.create_at }}
      </a-typography-text>

      <a-typography-text>
        <b>运行时间：</b>{{ timeDifference }}
      </a-typography-text>
      <a-typography-text>
        <b>博客总访问量：</b>{{ viewCount }}
      </a-typography-text>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
  import { getSiteInfoAllApi, SiteInfoFormType } from '@/api/settings';
  import { reactive, ref, onMounted, watch } from 'vue';
  import useLoading from '@/hooks/loading';
  import { getBlogViewsApi } from '@/api/blog';

  const { loading, setLoading } = useLoading();

  let info: SiteInfoFormType = reactive<SiteInfoFormType>({
    create_at: '',
    bei_an: '',
    title: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    copyright_protocol: '',
    copyright_info: '',
    server_name: '',
    qq_image: '',
    gitee_url: '',
    github_url: '',
  });
  const viewCount = ref(0);

  const getData = async () => {
    const { data } = await getSiteInfoAllApi();
    info = data.data;

    const data2 = await getBlogViewsApi();
    viewCount.value = data2.data.data; // 博客访问量

    setLoading(true);
  };

  const timeDifference = ref('');

  onMounted(() => {
    watch(loading, () => {
      const startDate = new Date(info.create_at);
      // eslint-disable-next-line no-use-before-define
      updateDifference();

      setInterval(() => {
        // eslint-disable-next-line no-use-before-define
        updateDifference();
      }, 1000);

      function updateDifference() {
        const currentDate = new Date();
        const diff = currentDate.getTime() - startDate.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        timeDifference.value = `${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
      }
    });
  });

  getData();
</script>

<style lang="less" scoped></style>
