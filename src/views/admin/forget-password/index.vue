<template>
  <div class="container">
    <div class="content">
      <div class="content-inner">
        <GetPasswordForm />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import GetPasswordForm from '@/views/admin/forget-password/components/get-password-form.vue';
</script>

<style lang="less" scoped>
  .container {
    // 背景图
    background: url('@/assets/images/login.jpg') 50% / cover no-repeat;
    width: 100%;
    height: 100vh;
    display: flex;
    // 子绝父相，盒子居中
    position: relative;

    .content {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      padding: 30px 0 0 40px;
      width: 400px;
      height: 400px;

      border-radius: 10px; // 圆角
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.2); //阴影
      background-color: rgba(255, 255, 255, 0.8);
    }
  }
</style>

<style lang="less" scoped>
  // responsive 移动端响应式布局
  @media (max-width: @screen-md) {
    .container {
      .content {
        padding: 8px 0 0 8px;
        width: 339px;
        height: auto;
      }
    }
  }
</style>
