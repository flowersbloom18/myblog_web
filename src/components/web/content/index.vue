<template>
  <!--1、轮播图-->

  <div style="padding: 20px 20px 0 20px">
    <SlideShow />
  </div>
  <!--2、分类-->

  <div style="margin: 20px 10px 0 10px">
    <span class="category1"><b>分类</b></span>
    <span class="category2">
      <a-link style="color: gray" @click="more"
        ><icon-command />&nbsp;全部分类</a-link
      >
    </span>
  </div>

  <div style="width: 860px; margin: 0 auto; height: 30px"> <a-divider /> </div>

  <ul class="image-list">
    <a-space wrap size="medium" align="center">
      <li
        v-for="(group, index) in imageGroups"
        :key="index"
        style="cursor: pointer"
        @mouseover="scaleImage(index)"
        @mouseleave="resetImage()"
        @click="skip(group.title)"
      >
        <div class="image-container">
          <img
            v-if="group.image"
            :src="group.image"
            :alt="group.title"
            :class="{ scaled: scaledImage === index }"
          />
          <img
            v-else
            :src="loadingImg"
            :alt="group.title"
            :class="{ scaled: scaledImage === index }"
          />
          <div class="image-overlay">
            <div class="overlay-content">
              <h3>{{ group.title }}</h3>
            </div>
          </div>
        </div>
      </li>
    </a-space>
  </ul>

  <!--3、博客列表(分割线)-->
  <div style="margin: 0 10px">
    <span class="category1"><b>全部博客</b></span>
  </div>

  <div style="width: 860px; margin: 0 auto; height: 30px"> <a-divider /> </div>
  <List />
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import SlideShow from '@/components/web/slideshow/index.vue';
  import List from '@/components/web/blog-list/list.vue';
  import { getCategoryApi } from '@/api/category';
  import loadingImg from '@/assets/images/loading.gif';
  import { useRouter } from 'vue-router';

  const imageGroups = ref([
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/cd7a1aaea8e1c5e3d26fe2591e561798.png~tplv-uwbnlip3yd-webp.webp',
      title: '山',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/6480dbc69be1b5de95010289787d64f1.png~tplv-uwbnlip3yd-webp.webp',
      title: '河',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/0265a04fddbd77a19602a15d9d55d797.png~tplv-uwbnlip3yd-webp.webp',
      title: '湖',
    },
    {
      image:
        'https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/24e0dd27418d2291b65db1b21aa62254.png~tplv-uwbnlip3yd-webp.webp',
      title: '海',
    },
  ]);

  const scaledImage = ref(null);

  const scaleImage = (index: any) => {
    scaledImage.value = index;
  };

  const resetImage = () => {
    scaledImage.value = null;
  };

  const getData = async () => {
    const { data } = await getCategoryApi({ page: 1, limit: 4 });
    const result = data.data.list;

    if (data.data.count) {
      // 清空
      imageGroups.value.length = 0;

      imageGroups.value = result.map(
        (item: { category: any; blog_num: number }) => ({
          title: item.category.name,
          image: item.category.cover,
        })
      );
    }
  };

  const router = useRouter();
  const more = () => {
    router.push({ name: 'category_index' });
  };

  // 搜索分类对应的博客列表界面
  const skip = (name: string) => {
    router.push({
      name: 'lists',
      params: { type: 'category' },
      query: { name },
    });
  };

  getData();
</script>

<style scoped>
  .image-list {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin-left: 16px;
  }

  .image-list li {
    width: 190px;
    height: 120px;
    margin-right: 10px;
    position: relative;
    overflow: hidden;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .image-container img.scaled {
    transform: scale(1.05);
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(35, 32, 32, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .image-list li:hover .image-overlay {
    opacity: 1;
  }

  .overlay-content {
    text-align: center;
    color: #fff;
    padding: 10px;
  }

  .category1 {
    font-size: 16px;
    margin-left: 20px;
    color: var(--color-text-2);
  }
  .category2 {
    float: right;
    font-size: 14px;
    margin-right: 20px;
  }
</style>
