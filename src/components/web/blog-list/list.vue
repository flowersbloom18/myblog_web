<template>
  <a-list class="list-demo-action-layout" :bordered="false" :data="dataList">
    <template #item="{ item }">
      <a-list-item
        v-if="item.is_publish"
        class="list-demo-item"
        style="cursor: pointer"
        action-layout="vertical"
        @click="skip(item.link as string)"
      >
        <template #actions>
          <div class="container-bottom">
            <div class="meta">
              <a-space size="small">
                <template #split> / </template>
                <span>{{ getDate(item.created_at) }}</span>
                <span><icon-eye />{{ item.read_num }}</span>
                <span><icon-message />{{ item.comment_num }}</span>
                <span><icon-thumb-up />{{ item.like_num }}</span>
                <span><icon-star />{{ item.collect_num }}</span>
              </a-space>
            </div>
            <div class="tags">
              <span v-for="tag in item.tags" :key="tag">
                <icon-tag />{{ tag }}
              </span>
            </div>
          </div>
        </template>

        <a-list-item-meta :title="item.title">
          <template #title>
            <a-link
              ><span style="font-size: 16px; color: var(--color-text-2)">{{
                item.title
              }}</span></a-link
            >
          </template>
          <template #description>
            {{ item.abstract }}
          </template>
          <template #avatar>
            <div className="image-area" class="image-area">
              <img alt="arco-design" :src="item.cover" />
              <span v-if="item.is_top" class="top">
                <a-tag color="#165dff" size="medium">置顶</a-tag>
              </span>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
  <div v-show="hasValue" class="loading">
    <a-link @click="more">
      <div class="more">加载更多</div>
    </a-link>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BlogList, getBlogApi } from '@/api/blog';
  import { getDate } from '@/utils/date';
  import { useRouter } from 'vue-router';

  const dataList = ref<BlogList[]>([]);

  // 每次限制多少数据。
  const limit = ref(10);
  const hasValue = ref(true);

  const sort = 'top_time desc,created_at desc'; // 优先按照置顶时间进行降序排序，其次是发布时间降序排序。
  const getData = async () => {
    const { data } = await getBlogApi({ page: 1, limit: limit.value, sort });
    dataList.value = data.data.list;

    // 只有数据的长度=响应数据的长度，才取消显示更多。
    if (dataList.value.length === data.data.count) {
      hasValue.value = false;
    }
  };

  const more = () => {
    limit.value += 10;
    getData();
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

<style scoped lang="less">
  .loading {
    margin: 20px auto;
    text-align: center;
  }
  .more {
    font-size: 16px;
    color: var(--color-text-2);
    border: 1px solid rgba(30, 3, 3, 0.3);
    padding: 8px 20px;
    border-radius: 15px;
    box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.2);
  }
  .container-bottom {
    position: relative;
    color: #909399;
    font-size: 13px;
  }

  .meta,
  .tags {
    display: inline-block;
    position: relative;
  }

  .tags {
    margin-left: 20px;
  }

  .image-area {
    position: relative;

    .top {
      position: absolute;
      top: 3px;
      left: 3px;
    }
  }

  .list-demo-action-layout .image-area {
    width: 183px;
    height: 119px;
    border-radius: 2px;
    overflow: hidden;
  }

  .list-demo-action-layout .list-demo-item {
    padding: 20px 0;
    border-bottom: 1px solid var(--color-fill-3);
  }

  .list-demo-action-layout .image-area img {
    width: 100%;
  }

  .list-demo-action-layout .arco-list-item-action .arco-icon {
    margin: 0 4px;
  }
</style>
