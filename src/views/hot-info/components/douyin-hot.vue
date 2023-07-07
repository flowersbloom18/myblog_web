<template>
  <a-list
    :style="{ width: `800px`, margin: '20px auto' }"
    :virtualListProps="{
      height: '60vh',
    }"
    :split="false"
    :data="list"
  >
    <template #item="{ item, index }">
      <a-list-item :key="index">
        <a-row>
          <a-col :span="2">
            <div
              v-if="index + 1 === 1"
              class="image-with-text"
              style="background-image: url('/src/assets/images/hot1.png')"
            >
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div
              v-else-if="index + 1 === 2"
              class="image-with-text"
              style="background-image: url('/src/assets/images/hot2.png')"
            >
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div
              v-else-if="index + 1 === 3"
              class="image-with-text"
              style="background-image: url('/src/assets/images/hot3.png')"
            >
              <span class="text">{{ index + 1 }}</span>
            </div>
            <div
              v-else
              class="image-with-text"
              style="background-image: url('/src/assets/images/hotDefault.png')"
            >
              <span class="text">{{ index + 1 }}</span>
            </div>
          </a-col>
          <a-col :span="20">
            &nbsp;&nbsp;
            <span class="title">
              {{ item.word }}
            </span>
          </a-col>
          <a-col :span="2">
            <span style="color: #939393">{{ item.hotindex }}</span>
          </a-col>
        </a-row>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { douYinHotType, getDouYinHotApi } from '@/api/hot';
  import { ref } from 'vue';

  const list = ref<douYinHotType[]>([]);
  // 获取数据
  const getData = async () => {
    try {
      const res = await getDouYinHotApi();

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

  .text {
    display: block;
    text-align: center;
    padding: 1px 0 0 6px;
    color: white;
  }

  .title {
    margin: 0 6px 0 8px;
    height: 25px;
    line-height: 25px;
    font-weight: 700;
    font-size: 18px;
  }
</style>
