<template>
  <div>
    <a-button
      type="primary"
      :status="status1"
      :loading="loading"
      :disabled="countdown"
      @click="sendEmail"
      shape="round"
      >{{ info }}
    </a-button>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue';

  const info = ref('发送邮箱验证码');
  const loading = ref(false); // 选取状态(false可选取，true不可选取）
  const countdown = ref(0);
  const sendCount = ref(2); // 最多可发送次数
  const status1 = ref(''); // 按钮状态

  let timer;
  const sendEmail = () => {
    loading.value = !loading.value;
    if (countdown.value === 0) {
      countdown.value = 3; // 限定的时间，单位s
      timer = setInterval(() => {
        // eslint-disable-next-line no-plusplus
        countdown.value--;
        if (countdown.value < 0) return; // bug

        info.value = `${countdown.value}秒后可重新发送`;
        if (countdown.value === 0) {
          // 发送次数减1
          sendCount.value -= 1;
          loading.value = !loading.value;
          info.value = '发送邮箱验证码';
          clearInterval(timer);
        }
      }, 1000);
      // TODO: 发送邮箱逻辑
    }
  };
  // 监听 sendCount 的变化
  watch(sendCount, () => {
    if (sendCount.value === 0) {
      info.value = '发送次数已上限';
      loading.value = true;
      countdown.value = 0;
      status1.value = 'danger';
    }
  });
</script>
