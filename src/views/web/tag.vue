<template>
  <div class="container">
    <div class="main">
      <div class="left">
        <div class="about">
          <div class="header">
            <h2>标签列表</h2>
          </div>

          <div class="content">
            <!--loading-->
            <a-spin
              v-show="loading"
              style="height: 200px; width: 100%; padding: 80px"
              :loading="loading"
              tip="数据正在加载中..."
            ></a-spin>
            <!--empty-->
            <a-card
              v-show="empty"
              style="height: 200px; width: 100%; padding: 30px"
              ><a-empty
            /></a-card>
            <!--exist-->
            <a-card v-show="!empty">
              <ul class="image-list">
                <a-space wrap size="mini" align="center">
                  <li
                    v-for="(group, index) in renderData"
                    :key="index"
                    style="cursor: pointer"
                    @mouseover="scaleImage(index)"
                    @mouseleave="resetImage()"
                    @click="skip(group.name)"
                  >
                    <div class="image-container">
                      <img
                        v-if="group.cover"
                        :src="group.cover"
                        style="height: 120px; width: 190px"
                        :alt="group.name"
                        :class="{ scaled: scaledImage === index }"
                      />
                      <img
                        v-else
                        :src="loadingImg"
                        style="height: 120px; width: 190px"
                        :alt="group.name"
                        :class="{ scaled: scaledImage === index }"
                      />

                      <div class="div-name">{{ group.name }}</div>

                      <div class="div-number">
                        <a-tag color="arcoblue"
                          >{{ group?.blog_num }}&nbsp;篇</a-tag
                        >
                      </div>
                    </div>
                  </li>
                </a-space>
              </ul>
            </a-card>
          </div>
        </div>
      </div>
      <div class="right">
        <Aside />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Aside from '@/components/web/aside/index.vue';
  import { ref, watch } from 'vue';
  import { useAppStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { getTagApi } from '@/api/tag';
  import loadingImg from '@/assets/images/loading.gif';
  import { useRouter } from 'vue-router';

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

  // 数据加载中
  const loading = ref(true);
  // 数据不存在
  const empty = ref(false);

  const total = ref(0);
  const renderData = ref([]);

  // 获取数据
  const getData = async () => {
    try {
      const data0 = await getTagApi();
      const response = await getTagApi({
        page: 1,
        limit: data0.data.data.count,
      });
      const { data } = response.data;

      // // 首先进行加载，关闭空组件
      // loading.value = false;
      // empty.value = false;

      total.value = data.count;
      renderData.value = data.list.map(
        (item: { tag: any; blog_num: number }) => ({
          ...item.tag,
          blog_num: item.blog_num,
        })
      );

      // 如果数据存在，则获取数据。
      if (total.value !== 0) {
        loading.value = false;
        empty.value = false;
      } else {
        empty.value = true;
        loading.value = false;
      }
    } catch (err) {
      Message.error('数据获取出错！');
    }
  };

  const scaledImage = ref(null);

  const scaleImage = (index: any) => {
    scaledImage.value = index;
  };

  const resetImage = () => {
    scaledImage.value = null;
  };

  const router = useRouter();
  // 搜索标签对应的博客列表界面
  const skip = (name: string) => {
    router.push({
      name: 'lists',
      params: { type: 'tag' },
      query: { name },
    });
  };

  getData();
</script>

<style lang="less" scoped>
  .image-list {
    display: flex;
    list-style-type: none;
    padding: 0;
    margin-left: 16px;
  }

  .image-list li {
    width: 190px;
    height: 150px;
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
    text-align: center;

    img {
      display: block;
    }
    .div-name {
      height: 30px;
      line-height: 30px;
      font-size: 15px;
      color: #909399;
      background-color: rgba(225, 217, 217, 0.35);
    }

    .div-number {
      position: absolute;
      font-size: 18px;
      right: 5px;
      top: 5px;
    }
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

  .about {
    color: var(--color-text-2);

    .header {
      text-align: center;
    }
    .info {
      float: right;
      margin-right: 20px;
      margin-bottom: 5px;
    }

    .content {
      width: 100%;
    }
  }
  .container {
    height: auto !important;
    //background-color: var(--color-bg-2);
    background-color: #a193932b;
    background-image: linear-gradient(
        90deg,
        rgba(60, 10, 30, 0.04) 3%,
        transparent 0
      ),
      linear-gradient(1turn, rgba(60, 10, 30, 0.04) 3%, transparent 0);
    background-size: 20px 20px;
    background-position: 50%;
    background-repeat: repeat;

    .main {
      width: 1200px;
      margin: 0 auto;
      display: flex;

      .left {
        //background-color: var(--color-bg-2);
        width: 880px;

        margin: 20px 0 20px 0;

        .about {
          background-color: var(--color-bg-2);
          border: 1px solid rgba(30, 3, 3, 0.2);
          border-radius: 15px;
        }

        .comment {
          margin-top: 20px;
          border: 1px solid rgba(30, 3, 3, 0.2);
          border-radius: 15px;
        }
      }

      .right {
        width: 300px;
        height: 100%;
        padding: 0 10px 0 10px;
        //background-color: var(--color-bg-2);
        margin: 20px 0 20px 10px;
        //border: 1px solid red;
      }
    }
  }
</style>
