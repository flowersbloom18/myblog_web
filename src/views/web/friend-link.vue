<template>
  <div class="container">
    <div class="main">
      <div class="left">
        <div class="about">
          <div class="header">
            <h2>友情链接</h2>
          </div>

          <div style="width: 860px; margin: 0 auto; height: 30px">
            <a-divider />
          </div>

          <a-row>
            <a-col :span="1"></a-col>
            <a-col :span="4"
              ><span style="font-size: 18px"><b>友链列表</b></span>
              &nbsp;
              <a-tag>{{ count }}条</a-tag>
            </a-col>
          </a-row>
          <!--置顶与否-->
          <div class="content">
            <a-row>
              <a-col :span="2"></a-col>
              <a-col
                :span="2"
                style="font-size: 16px; margin-top: 20px; margin-left: -30px"
                ><a-tag color="blue">置顶组</a-tag></a-col
              >
            </a-row>
            <ul class="flex1">
              <li v-for="(value, index) in renderData" :key="index">
                <a-card
                  v-show="value.is_top"
                  hoverable
                  :style="{
                    width: '260px',
                    height: '126px',
                    marginBottom: '20px',
                  }"
                >
                  <div
                    :style="{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }"
                  >
                    <span
                      :style="{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#1D2129',
                      }"
                    >
                      <a-avatar
                        style="
                          margin-right: 8px;
                          background-color: var(--color-bg-2);
                        "
                        :size="40"
                      >
                        <img alt="avatar" :src="value.logo" />
                      </a-avatar>
                      <a-typography>
                        <a-typography-title
                          :ellipsis="{
                            rows: 1,
                            showTooltip: true,
                          }"
                          :heading="5"
                          style="font-size: 20px"
                          >{{ value.name }}</a-typography-title
                        >
                        <a-typography-paragraph
                          :ellipsis="{
                            rows: 1,
                            showTooltip: true,
                          }"
                          >{{ value.description }}</a-typography-paragraph
                        >
                      </a-typography>
                    </span>
                    <a-link :href="value.url">More</a-link>
                  </div>
                </a-card>
              </li>
            </ul>
            <a-row>
              <a-col :span="2"></a-col>
              <a-col
                :span="2"
                style="font-size: 16px; margin-top: 20px; margin-left: -30px"
                ><a-tag color="blue">默认组</a-tag></a-col
              >
            </a-row>
            <ul class="flex2">
              <li v-for="(value, index) in renderData" :key="index">
                <a-card
                  v-show="!value.is_top"
                  hoverable
                  :style="{
                    width: '260px',
                    height: '126px',
                    marginBottom: '20px',
                  }"
                >
                  <div
                    :style="{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }"
                  >
                    <span
                      :style="{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#1D2129',
                      }"
                    >
                      <a-avatar
                        style="
                          margin-right: 8px;
                          background-color: var(--color-bg-2);
                        "
                        :size="40"
                      >
                        <img alt="avatar" :src="value.logo" />
                      </a-avatar>
                      <a-typography>
                        <a-typography-title
                          :ellipsis="{
                            rows: 1,
                            showTooltip: true,
                          }"
                          :heading="5"
                          style="font-size: 20px"
                          >{{ value.name }}</a-typography-title
                        >
                        <a-typography-paragraph
                          :ellipsis="{
                            rows: 1,
                            showTooltip: true,
                          }"
                          >{{ value.description }}</a-typography-paragraph
                        >
                      </a-typography>
                    </span>
                    <a-link :href="value.url">More</a-link>
                  </div>
                </a-card>
              </li>
            </ul>

            <div style="width: 860px; margin: 0 auto; height: 30px">
              <a-divider />
            </div>
            <a-card style="border: none; padding-left: 30px">
              <a-descriptions
                align="left"
                style="margin: 0 auto"
                :data="data"
                size="large"
                :column="1"
              >
                <template #title>
                  <span style="font-size: 18px; color: #4e5969"
                    ><b>申请格式:&nbsp;&nbsp;{{ value }}</b></span
                  >
                </template>
              </a-descriptions>
            </a-card>
          </div>
        </div>

        <Comment class="comment" />
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
  import Comment from '@/components/web/comment/friendlink/index.vue';
  import { friendLinkListForm, getFriendlinkApi } from '@/api/friendLink';

  const count = ref(0);
  const renderData = ref<friendLinkListForm[]>([]);
  const getData = async () => {
    const { data } = await getFriendlinkApi();
    count.value = data.data.count;

    const data2 = await getFriendlinkApi({
      page: 1,
      limit: data.data.count,
    });
    renderData.value = data2.data.data.list;
  };

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

  const value = '<博客名称 + 博客地址 + 博客Logo + 博客简介>';

  const data = [
    {
      label: '博客名称:',
      value: 'FlowersBloom的前端Blog',
    },
    {
      label: '博客简介:',
      value: '一个分享前后端技术的博客',
    },
    {
      label: '博客地址:',
      value: 'https://www.flowersbloom.com.cn',
    },
    {
      label: '博客Logo:',
      value: 'http://img.flowersbloom.com.cn/myblog/logo-light.png',
    },
  ];

  getData();
</script>

<style lang="less" scoped>
  .flex1 {
    padding: 0;
    margin-left: 30px;
    /* 弹性布局+换行*/
    display: flex;
    flex-wrap: wrap;

    gap: 6px; /* 添加每一行之间的间距 */

    li {
      list-style: none;
      box-sizing: border-box; /* 确保padding不会改变元素的尺寸 */
    }
  }

  .flex2 {
    padding: 0;
    margin-left: 30px;
    list-style: none;

    gap: 1px;

    /* 弹性布局+换行*/
    display: flex;
    flex-wrap: wrap;

    li {
      list-style: none;
    }
  }

  .about {
    color: var(--color-text-2);

    .header {
      text-align: center;
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
