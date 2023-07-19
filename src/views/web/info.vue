<template>
  <div class="container">
    <div class="main">
      <div class="left">
        <div class="about">
          <div class="header">
            <h2>热搜信息🔥</h2>
          </div>
          <!--          <div class="info">-->
          <!--            <span><icon-schedule />&nbsp;&nbsp;{{ getDate(time) }}</span>-->
          <!--          </div>-->
          <div style="width: 860px; margin: 0 auto; height: 30px">
            <a-divider />
          </div>

          <div class="content">
            <HotInfo />
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
  // import { getDate } from '@/utils/date';
  import HotInfo from '@/views/admin/hot-info/index.vue';
  // import { getWeiBoHotApi } from '@/api/hot';

  // const time = ref('');
  // const getData = async () => {
  //   const { data } = await getWeiBoHotApi();
  //   // console.log(data);
  //   time.value = data.data.created_at;
  // };

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

  // getData();
</script>

<style lang="less" scoped>
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
      padding: 0;
      margin: 0;
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
