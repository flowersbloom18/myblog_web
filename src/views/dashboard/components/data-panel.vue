<template>
  <a-grid :cols="24" :row-gap="16" class="panel">
    <a-grid-item class="panel-col" :span="6">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <svg
            t="1688642171967"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="12137"
            width="40px"
            height="100%"
          >
            <path
              d="M708.266667 725.333333H298.666667c-17.066667 0-32-14.933333-32-32S281.6 661.333333 298.666667 661.333333h409.6c17.066667 0 32 14.933333 32 32s-12.8 32-32 32zM708.266667 544H298.666667c-17.066667 0-32-14.933333-32-32s14.933333-32 32-32h409.6c17.066667 0 32 14.933333 32 32s-12.8 32-32 32zM550.4 362.666667H298.666667c-17.066667 0-32-14.933333-32-32S281.6 298.666667 298.666667 298.666667h251.733333c17.066667 0 32 14.933333 32 32s-14.933333 32-32 32z"
              fill="#0000FF"
              p-id="12138"
            ></path>
            <path
              d="M782.933333 938.666667H241.066667c-76.8 0-138.666667-61.866667-138.666667-138.666667v-576C102.4 147.2 164.266667 85.333333 241.066667 85.333333h541.866666c76.8 0 138.666667 61.866667 138.666667 138.666667v576c0 76.8-61.866667 138.666667-138.666667 138.666667zM241.066667 149.333333c-40.533333 0-74.666667 34.133333-74.666667 74.666667v576c0 40.533333 34.133333 74.666667 74.666667 74.666667h541.866666c40.533333 0 74.666667-34.133333 74.666667-74.666667v-576c0-40.533333-34.133333-74.666667-74.666667-74.666667H241.066667z"
              fill="#0000FF"
              p-id="12139"
            ></path>
          </svg>
        </a-avatar>
        <a-statistic
          title="博客"
          :value="blogCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">个</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="6">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <svg
            t="1688641843801"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3322"
            width="40px"
            height="100%"
          >
            <path
              d="M632 344m-120 0a120 120 0 1 0 240 0 120 120 0 1 0-240 0Z"
              fill="#A9D8FF"
              p-id="3323"
            ></path>
            <path
              d="M809 800H503c-48.1 0-87-39-87-87 0-111 90-201 201-201h78c111 0 201 90 201 201 0 48-39 87-87 87z"
              fill="#A9D8FF"
              p-id="3324"
            ></path>
            <path
              d="M440 296m-168 0a168 168 0 1 0 336 0 168 168 0 1 0-336 0Z"
              fill="#298DF7"
              p-id="3325"
            ></path>
            <path
              d="M638.2 896H241.8C179 896 128 845 128 782.2 128 633 249 512 398.2 512h83.6C631 512 752 633 752 782.2 752 845 701 896 638.2 896z"
              fill="#298DF7"
              p-id="3326"
            ></path>
          </svg>
        </a-avatar>
        <a-statistic
          title="用户"
          :value="userCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">位</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="6">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <svg
            t="1688641949150"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7040"
            width="40px"
            height="100%"
          >
            <path
              d="M193 317h-29a6 6 0 0 0-6 6v408a6 6 0 0 0 6 6h83.806v121.532a6 6 0 0 0 10.195 4.29L386.698 737h200.66l60.159 58.815A66.346 66.346 0 0 1 635 797H411.154L299.945 905.725c-26.064 25.482-67.85 25.01-93.332-1.054a66 66 0 0 1-18.807-46.14V797H164c-36.45 0-66-29.55-66-66V323c0-36.45 29.55-66 66-66h29v60z m642.194 449.532a66 66 0 0 1-18.807 46.139c-25.482 26.064-67.268 26.536-93.332 1.054L582.183 676H299c-36.45 0-66-29.55-66-66V164c0-36.45 29.55-66 66-66h560c36.45 0 66 29.55 66 66v446c0 36.45-29.55 66-66 66h-23.806v90.532z m-60-150.532H859a6 6 0 0 0 6-6V164a6 6 0 0 0-6-6H299a6 6 0 0 0-6 6v446a6 6 0 0 0 6 6h307.64L765 770.822a6 6 0 0 0 10.194-4.29V616z"
              fill="#2F54EB"
              p-id="7041"
            ></path>
            <path
              d="M757.5 384.5m0-49.5a49.5 49.5 0 1 0 0 99 49.5 49.5 0 1 0 0-99Z"
              fill="#85A5FF"
              p-id="7042"
            ></path>
            <path
              d="M575.5 384.5m0-49.5a49.5 49.5 0 1 0 0 99 49.5 49.5 0 1 0 0-99Z"
              fill="#85A5FF"
              p-id="7043"
            ></path>
            <path
              d="M392.5 384.5m0-49.5a49.5 49.5 0 1 0 0 99 49.5 49.5 0 1 0 0-99Z"
              fill="#85A5FF"
              p-id="7044"
            ></path>
          </svg>
        </a-avatar>
        <a-statistic
          title="评论"
          :value="commentCount"
          :value-from="0"
          animation
          show-group-separator
        >
          <template #suffix>
            <span class="unit">个</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item class="panel-col" :span="6" style="border-right: none">
      <a-space>
        <a-avatar :size="54" class="col-avatar">
          <svg
            t="1688642562188"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="26109"
            width="40px"
            height="100%"
          >
            <path
              d="M512 405.333333c59.733333 0 106.666667 46.933333 106.666667 106.666667s-46.933333 106.666667-106.666667 106.666667-106.666667-46.933333-106.666667-106.666667 46.933333-106.666667 106.666667-106.666667m0-64c-93.866667 0-170.666667 76.8-170.666667 170.666667s76.8 170.666667 170.666667 170.666667 170.666667-76.8 170.666667-170.666667-76.8-170.666667-170.666667-170.666667z"
              fill="#4562C5"
              p-id="26110"
            ></path>
            <path
              d="M512 234.666667c288 0 381.866667 215.466667 403.2 277.333333-21.333333 61.866667-115.2 277.333333-403.2 277.333333C224 789.333333 130.133333 573.866667 108.8 512c21.333333-61.866667 117.333333-277.333333 403.2-277.333333m0-64C128 170.666667 42.666667 512 42.666667 512s85.333333 341.333333 469.333333 341.333333 469.333333-341.333333 469.333333-341.333333S896 170.666667 512 170.666667z"
              fill="#4562C5"
              p-id="26111"
            ></path>
          </svg>
        </a-avatar>
        <a-statistic
          title="博客总浏览量"
          :value="viewCount"
          :value-from="0"
          animation
          ><template #suffix>
            <span class="unit">次</span>
          </template>
        </a-statistic>
      </a-space>
    </a-grid-item>
    <a-grid-item :span="24">
      <a-divider class="panel-border" />
    </a-grid-item>
  </a-grid>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { getUserList } from '@/api/user';
  import { getBlogApi, getBlogViewsApi } from '@/api/blog';
  import { getAllCommentApi } from '@/api/comment';
  import { Message } from '@arco-design/web-vue';

  const blogCount = ref(0);
  const userCount = ref(0);
  const commentCount = ref(0);
  const viewCount = ref(0);

  const getData = async () => {
    try {
      const data1 = await getBlogApi();
      const data2 = await getUserList();
      const data3 = await getAllCommentApi();
      const data4 = await getBlogViewsApi();

      blogCount.value = data1.data.data.count; // 博客总个数
      userCount.value = data2.data.data.count; // 用户量
      commentCount.value = data3.data.data.count; // 评论量
      viewCount.value = data4.data.data; // 博客访问量
    } catch (err) {
      Message.warning(err as string);
    }
  };
  getData();
</script>

<style lang="less" scoped>
  .arco-grid.panel {
    margin-bottom: 0;
    padding: 16px 20px 0 20px;
  }
  .panel-col {
    //padding-left: 43px;
    margin: 0 auto;
    //border-right: 1px solid rgb(var(--gray-2));
  }
  .col-avatar {
    margin-right: 12px;
    background-color: var(--color-fill-2);
  }
  .up-icon {
    color: rgb(var(--red-6));
  }
  .unit {
    margin-left: 8px;
    color: rgb(var(--gray-8));
    font-size: 12px;
  }
  :deep(.panel-border) {
    margin: 4px 0 0 0;
  }
</style>
