<template>
  <!--  <a-layout-footer class="footer">FlowersBloom</a-layout-footer>-->
  <div class="footer"> FlowersBloom </div>
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: var(--color-text-2);
    // 变量失效的原因:有时候放到a-layout会失效。
    text-align: center;
  }
</style>
