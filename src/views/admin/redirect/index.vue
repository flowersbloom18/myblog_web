<template>
  <h1>未知的天空</h1>
  <div>？？？</div>
</template>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const gotoPath = route.params.path as string;
  router.replace({ path: gotoPath });
</script>

<style scoped lang="less"></style>
