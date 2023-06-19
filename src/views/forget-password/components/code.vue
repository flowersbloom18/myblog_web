<template>
  <div>
    <a-button
      type="primary"
      :status="status1"
      :loading="loading2"
      :disabled="countdown"
      @click="sendEmail"
      shape="round"
      >{{ info }}
    </a-button>
  </div>
</template>

<script setup>
  import { ref, watch, defineProps, reactive } from 'vue';
  import { userForgetPassword } from '@/api/user';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps(['isTrue', 'email2']); // 判断是否可以发送

  const info = ref('发送邮箱验证码');
  const loading2 = ref(false); // 选取状态(false可选取，true不可选取）
  const countdown = ref(0);
  const sendCount = ref(3); // 最多可发送次数
  const status1 = ref(''); // 按钮状态
  // 限制60秒发送一次，最多发送3次，如果超过，则禁止发送。
  let timer;
  const sendEmail = async () => {
    if (!props.isTrue) return; // 如果不满足条件，则不发送
    loading2.value = !loading2.value;
    if (countdown.value === 0) {
      countdown.value = 60; // 限定的时间，单位s
      timer = setInterval(() => {
        // eslint-disable-next-line no-plusplus
        countdown.value--;
        if (countdown.value < 0) return; // bug
        info.value = `${countdown.value}秒后可重新发送`;
        if (countdown.value === 0) {
          // 发送次数减1
          sendCount.value -= 1;
          loading2.value = !loading2.value;
          info.value = '发送邮箱验证码';
          clearInterval(timer);
        }
      }, 1000);
    }
    // 响应式对象的方法来实现。
    const emailInfo = reactive({
      email: '',
      code: null,
      password: null,
    });
    emailInfo.email = props.email2;
    // TODO: 发送邮箱逻辑
    const response = await userForgetPassword(emailInfo);
    if (!response.data.code) {
      Message.success(response.data.msg);
    } else {
      Message.warning(response.data.msg);
    }
  };

  // 监听 sendCount 的变化
  watch(sendCount, () => {
    if (sendCount.value === 0) {
      info.value = '发送次数已上限';
      loading2.value = true;
      countdown.value = 0;
      status1.value = 'danger';
    }
  });
</script>
