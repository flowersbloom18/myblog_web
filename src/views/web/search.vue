<template>
  <div class="container">
    <div class="main">
      <div class="header">
        <a-input
          v-model="inputValue"
          class="input"
          placeholder="请输入搜索内容"
        ></a-input>
        <a-button type="primary" class="btn" @click="search">搜索</a-button>
      </div>

      <a-divider />

      <div class="content">
        <a-list
          class="list-demo-action-layout"
          :bordered="false"
          :data="dataList"
        >
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
                    ><span style="font-size: 16px; color: black">{{
                      item.title
                    }}</span></a-link
                  >
                </template>
                <template #description>
                  {{ item.abstract }}
                </template>
                <template #avatar>
                  <div className="image-area">
                    <img alt="arco-design" :src="item.cover" />
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { BlogList, getBlogApi } from '@/api/blog';
  import { getDate } from '@/utils/date';
  import { useRouter } from 'vue-router';

  const dataList = ref<BlogList[]>([]);

  const inputValue = ref('');
  // 每次限制多少数据。
  const limit = ref(10);
  const hasValue = ref(true);

  const getData = async () => {
    const { data } = await getBlogApi({
      page: 1,
      limit: limit.value,
      key: inputValue.value,
    });
    // 只导出发布的
    // dataList.value = data.data.list.filter((item: any) => item.is_publish);

    dataList.value = data.data.list;
    // 只有数据的长度=响应数据的长度，才取消显示更多。
    hasValue.value = dataList.value.length !== data.data.count;
  };

  const more = () => {
    limit.value += 10;
    getData();
  };

  const search = () => {
    // 重置
    limit.value = 10;
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

<style lang="less" scoped>
  .about {
    color: var(--color-text-2);
  }
  .header {
    text-align: center;
    padding: 20px 0;
    //display: flex;

    .input {
      width: 400px;
      border: 1px solid rgba(30, 3, 3, 0.2);
    }
    .btn {
      margin-left: 20px;
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
    }
  }

  .loading {
    margin: 20px auto;
    text-align: center;
    padding-bottom: 20px;
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
  .list-demo-item {
    background-color: var(--color-bg-2);
    margin-bottom: 20px;
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
