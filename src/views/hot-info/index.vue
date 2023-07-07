<template>
  <div class="container">
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="微博热搜">
            <WeiboHot />
          </a-tab-pane>
          <a-tab-pane key="2" title="抖音热搜">
            <DouYinHot />
          </a-tab-pane>
          <a-tab-pane key="3" title="全网热搜">
            <AllwebHot />
          </a-tab-pane>
          <a-tab-pane key="4" title="每日简报">
            <EverydayInfo />
          </a-tab-pane>
          <a-tab-pane key="5" title="早安信息">
            <ZaoanInfo />
          </a-tab-pane>
          <a-tab-pane key="6" title="晚安信息">
            <WananInfo />
          </a-tab-pane>
          <a-tab-pane key="7" title="历史上的今天">
            <HistorydayInfo />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import DouYinHot from '@/views/hot-info/components/douyin-hot.vue';
  import WeiboHot from '@/views/hot-info/components/weibo-hot.vue';
  import AllwebHot from '@/views/hot-info/components/allweb-hot.vue';
  import EverydayInfo from '@/views/hot-info/components/everyday-info.vue';
  import ZaoanInfo from '@/views/hot-info/components/zaoan-info.vue';
  import WananInfo from '@/views/hot-info/components/wanan-info.vue';
  import HistorydayInfo from '@/views/hot-info/components/historyday-info.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
