<template>
  <a-list
    :style="{ width: `800px`, margin: '20px auto' }"
    :virtualListProps="{
      height: '60vh',
    }"
    max-height="100px"
    :split="false"
    :data="list"
  >
    <template #item="{ item, index }">
      <a-list-item :key="index">
        <a-row>
          <a-col :span="2">
            <div v-if="index + 1 === 1" class="image-with-text hot1">
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div v-else-if="index + 1 === 2" class="image-with-text hot2">
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div v-else-if="index + 1 === 3" class="image-with-text hot3">
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div v-else class="image-with-text hot4">
              <span class="text">{{ index + 1 }}</span>
            </div>
          </a-col>

          <a-col :span="18">
            <span class="title">
              {{ item.title }}
            </span>
          </a-col>
          <a-col :span="4">
            <span style="color: #939393">{{ item.lsdate }}</span>
          </a-col>
        </a-row>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { getHistoryDayInfoApi, historyDayInfoType } from '@/api/hot';
  import { ref } from 'vue';

  const list = ref<historyDayInfoType[]>([]);
  // 获取数据
  const getData = async () => {
    try {
      const res = await getHistoryDayInfoApi();

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
  .hot1 {
    background-image: url('@/assets/images/hot1.png');
  }
  .hot2 {
    background-image: url('@/assets/images/hot2.png');
  }
  .hot3 {
    background-image: url('@/assets/images/hot3.png');
  }
  .hot4 {
    background-image: url('@/assets/images/hotDefault.png');
  }

  .image-with-text {
    width: 45px;
    height: 22px;
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center bottom;
    background-size: cover;
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
