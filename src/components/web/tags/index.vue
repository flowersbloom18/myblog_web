<template>
  <a-card>
    <template #title>
      <span style="float: left; font-size: 16px">
        <a-space>
          <img
            src="../../../assets/images/tag.svg"
            style="width: 23px"
            alt="tag"
          />
          <span>标签云</span>
        </a-space>
      </span>
    </template>
    <template #extra>
      <a-link style="color: grey" @click="more"
        >更多<icon-double-right
      /></a-link>
    </template>

    <a-space wrap>
      <a-tag v-for="(tag, index) of renderData" :key="index">
        <a-link style="color: grey" @click="skip(tag['name'])">
          <span class="hover-yellow">{{ tag['name'] }}</span>
        </a-link>
      </a-tag>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
  import { getTagApi } from '@/api/tag';
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const renderData = reactive<{ name: string }[]>([]);
  const getData = async () => {
    const { data } = await getTagApi({ page: 1, limit: 20 });
    const result = data.data.list;

    renderData.length = 0; // 清空 renderData

    result.forEach((item: { tag: any; blog_num: number }) => {
      renderData.push({
        name: item.tag.name,
      });
    });
  };

  // 搜索标签对应的博客列表界面
  const skip = (name: string) => {
    router.push({
      name: 'lists',
      params: { type: 'tag' },
      query: { name },
    });
  };

  const more = () => {
    router.push({ name: 'tag_index' });
  };

  getData();
</script>

<style lang="less" scoped>
  .hover-yellow:hover {
    color: orange;
  }
</style>
