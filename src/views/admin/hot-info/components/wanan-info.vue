<template>
  <a-list :style="{ width: `800px`, margin: '20px auto' }" :bordered="false">
    <a-row>
      <a-col :span="2">
        <div class="image-with-text hot2">
          <span class="text">1</span>
        </div>
      </a-col>
      <a-col :span="19">
        <span class="title">
          {{ list }}
        </span>
      </a-col>
    </a-row>
  </a-list>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { getWanAnInfoApi, wanAnInfoType } from '@/api/hot';
  import { ref } from 'vue';

  const list = ref<wanAnInfoType>();
  // 获取数据
  const getData = async () => {
    try {
      const res = await getWanAnInfoApi();

      if (!res.data.code) {
        list.value = res.data.data;
      }
    } catch (err) {
      Message.error('数据获取错误！');
    }
  };

  getData();
</script>

<style scoped lang="less">
  .image-with-text {
    width: 45px;
    height: 22px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: cover;
  }
  .hot2 {
    background-image: url('@/assets/images/hot2.png');
  }

  .text {
    display: block;
    text-align: center;
    padding: 1px 0 0 6px;
    color: var(--color-text-2);
  }

  .title {
    margin: 0 6px 0 8px;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    font-size: 18px;
  }
  .title2 {
    margin: 0 6px 0 8px;
    height: 20px;
    line-height: 20px;
    font-weight: 500;
    font-size: 15px;
  }
</style>
