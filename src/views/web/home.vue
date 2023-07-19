<template>
  <div class="container">
    <div class="main">
      <div class="left">
        <Content />
      </div>
      <div class="right">
        <Aside />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Content from '@/components/web/content/index.vue';
  import Aside from '@/components/web/aside/index.vue';
</script>

<style lang="less" scoped>
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
        background-color: var(--color-bg-2);
        width: 880px;
        border: 1px solid rgba(30, 3, 3, 0.2);
        border-radius: 15px;
        margin: 20px 0 20px 0;
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
