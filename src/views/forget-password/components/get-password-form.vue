<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ t('forget.form.title') }}</div>
    <a-tooltip content="Tips：重置密码需要先绑定邮箱哦" position="top">
      <span
        :style="{
          position: 'absolute',
          top: '5px',
          right: '6px',
          fontSize: '18px',
        }"
      >
        <icon-exclamation-circle />
      </span>
    </a-tooltip>

    <div class="login-form-title"></div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="forgetForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
    >
      <a-form-item
        field="email"
        :rules="[{ required: true, message: t('forget.form.email.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.email"
          :placeholder="t('forget.form.email.placeholder')"
        >
          <template #prefix>
            <icon-email />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        field="code"
        :rules="[{ required: true, message: t('forget.form.code.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.code"
          :placeholder="t('forget.form.code.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
        <Code
          v-if="email2"
          :is-true="isTrue"
          :email2="email2"
          :case="1"
          @click="confirmSend"
        />
        <!--只有存在，才会显示-->
      </a-form-item>

      <a-form-item
        field="password"
        :rules="[{ required: true, message: t('forget.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="t('forget.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item
        field="password"
        :rules="[
          { required: true, message: t('forget.form.password2.errMsg') },
        ]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.confirmPwd"
          :placeholder="t('forget.form.password2.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>

      <a-space :size="16" direction="vertical">
        <a-button
          type="primary"
          html-type="button"
          long
          :loading="loading"
          @click="handleRegister"
        >
          {{ t('forget.form.forget') }}
        </a-button>
        <div class="slider">
          <Slider
            v-if="showSquare"
            :img-urls="imgUrls"
            @success="handleVerifySuccess"
          />
        </div>

        <div class="login-form-password-actions">
          <a-link @click="goToLogin">{{ t('forget.form.login') }}</a-link>
        </div>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, toRef, reactive, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';

  import A from '@/assets/slider/0.jpg';
  import B from '@/assets/slider/1.png';
  import C from '@/assets/slider/2.jpeg';
  import D from '@/assets/slider/3.jpg';
  import E from '@/assets/slider/4.jpg';
  import F from '@/assets/slider/5.jpg';
  import G from '@/assets/slider/6.png';
  import H from '@/assets/slider/7.png';
  import { userForgetPassword } from '@/api/user';
  import Slider from '@/components/slider/index.vue';
  import Code from './code.vue';

  const imgUrls = [A, B, C, D, E, F, G, H]; // 滑动验证码

  const isTrue = ref(false); // 判断能否发送验证码
  const router = useRouter(); // 路由
  const { t } = useI18n(); // 国际化
  const errorMessage = ref(''); // 错误信息
  const { loading, setLoading } = useLoading(); // 登录加载状态,默认false
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userStore = useUserStore(); // 状态管理
  const isVerified = ref(false); //  isVerified 验证成功触发，才能真正开始请求
  const showSquare = ref(false); // 判断是否开启验证码
  // 流程是，验证码输入成功后，再调用表单的代码开始登录。否则依然要等待输入
  const handleVerifySuccess = () => {
    isVerified.value = true;
    // eslint-disable-next-line no-use-before-define
    handleRegister();
  };
  const goToLogin = () => {
    router.push('/console/login');
  };
  const confirmSend = () => {
    if (!isTrue.value) {
      Message.warning('请输入有效的邮箱地址');
    }
  };
  // 表单数据
  const userInfo = reactive({
    email: '',
    code: '',
    password: '',
    confirmPwd: '',
  });
  const email2 = ref('');
  watch(toRef(userInfo, 'email'), () => {
    // eslint-disable-next-line no-use-before-define
    if (validateEmail(userInfo.email)) {
      isTrue.value = true;
      email2.value = userInfo.email; // 传递邮箱信息
    } else {
      isTrue.value = false;
    }
  });
  // 校验邮箱格式
  const validateEmail = (email: string) => {
    // 使用正则表达式进行邮箱校验
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    if (!emailPattern.test(email)) {
      errorMessage.value = '请输入有效的邮箱地址';
      return false;
    }
    errorMessage.value = '';
    return true;
  };
  // 检测表单数据是否完善
  const validateUserInfo = () => {
    return Object.values(userInfo).every((value) => value !== '');
  };

  const isEqual = () => {
    return userInfo.password === userInfo.confirmPwd;
  };
  const handleRegister = async () => {
    // 优先判断表单数据是否被填充完毕
    if (!validateUserInfo()) {
      Message.warning('请将表单数据填充完整！');
      return;
    }
    if (!isEqual()) {
      Message.warning('两次密码输入不一致，请重新输入');
      return;
    } // 如果两次密码不一致，则返回
    showSquare.value = true; // 此刻开启。
    if (loading.value || !isVerified.value) return; // 如果表单加载中，或者验证码未正确则禁止登录
    setLoading(true);

    try {
      const response = await userForgetPassword(userInfo);
      const res = response.data;

      if (res.code) {
        // 非0则执行
        Message.error(res.msg);
        isVerified.value = false; // 在登录信息输入错误后，需要重新验证表单。
        showSquare.value = false; // 此刻关闭。
        return;
      }
      Message.success('重置密码成功');
      // 注册之后呢，要登录
      await router.push('/console/login');
      showSquare.value = false; // 此刻关闭。
    } catch (err) {
      isVerified.value = false; // 在登录信息输入错误后，需要重新验证表单。
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  };
</script>

<style lang="less" scoped>
  .login-form-title {
    text-align: center;
  }

  .slider {
    position: absolute;
    top: 46px;
    margin-bottom: 10px;
  }

  .login-form-password-actions {
    float: right;
  }

  .login-form {
    &-wrapper {
      // &-wrapper中&表示已-wrapper结尾的所有类
      width: 320px;
    }

    &-title {
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 24px;
      line-height: 32px;
    }

    &-sub-title {
      color: var(--color-text-3);
      font-size: 16px;
      line-height: 24px;
    }

    &-error-msg {
      height: 32px;
      color: rgb(var(--red-6));
      line-height: 32px;
    }

    &-password-actions {
      display: flex;
      justify-content: space-between;
    }

    &-register-btn {
      color: var(--color-text-3) !important;
    }
  }
</style>
