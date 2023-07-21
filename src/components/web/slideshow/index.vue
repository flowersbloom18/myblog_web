<template>
  <a-carousel
    :auto-play="true"
    indicator-position="bottom"
    indicator-type="line"
    :style="{
      height: '460px',
    }"
    :default-current="2"
  >
    <a-carousel-item
      v-for="(value, index) in dataList"
      :key="index"
      style="height: 440px"
    >
      <a-image
        :src="value?.cover"
        :title="value?.title"
        style="cursor: pointer"
        :description="value?.abstract"
        width="100%"
        height="400"
        footer-position="outer"
        :preview-visible="visible"
        @click="skip(value?.link as string)"
        @preview-visible-change="
          () => {
            visible = false;
          }
        "
      >
      </a-image>
    </a-carousel-item>
  </a-carousel>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BlogList, getBlogApi } from '@/api/blog';
  import { useRouter } from 'vue-router';

  const visible = ref(false);

  const dataList = ref<BlogList[]>([]);

  dataList.value = [
    {
      cover:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
    },
    {
      cover:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
    },
    {
      cover:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
    },
  ];

  const getData = async () => {
    const { data } = await getBlogApi({ page: 1, limit: 10 });

    if (data.data.count) {
      // dataList.value = [];

      // 找出发布的五篇
      dataList.value = data.data.list.filter((item: any) => item.is_publish);

      // 如果长度大于5,则长度为5,否则为2，但是尽量不要为2.
      if (dataList.value.length > 5) {
        dataList.value.length = 5;
        return;
      }
      dataList.value.length = 2;
    }
  };

  const router = useRouter();
  const skip = (name: string) => {
    router.push({
      name: 'blog',
      params: { name },
    });
  };

  getData();
</script>

<style scoped>
  .carousel {
    position: relative;
    width: 100%;
    height: 300px; /* 调整轮播图的高度 */
    overflow: hidden;
  }

  .slides {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    list-style-type: none;
    margin: 0;
    padding: 0;
    display: flex;
    transition: transform 0.5s ease-in-out;
  }

  .slide {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.5s ease-in-out;
  }

  .slide.active {
    opacity: 1;
  }
</style>
