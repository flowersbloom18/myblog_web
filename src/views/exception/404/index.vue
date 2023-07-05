<template>
  <div class="container">
    <Breadcrumb :items="['菜单异常', '404错误']" />
    <div class="content">
      <a-result
        class="result"
        status="404"
        subtitle="抱歉，您所访问的数据不存在～"
      >
      </a-result>
      <div class="operation-row">
        <a-button @click="back" type="primary"> 返回 </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  const router = useRouter();
  const back = () => {
    router.push({ name: 'dashboard' });
  };
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
    height: calc(100% - 40px);
    :deep(.content) {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      text-align: center;
      background-color: var(--color-bg-1);
      border-radius: 4px;
    }
  }
</style>
