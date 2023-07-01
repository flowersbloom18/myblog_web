<template>
  <div class="login-form-wrapper">
    <div class="login-form-title">{{ t('login.form.title') }}</div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
    >
      <!--      @submit="handleSubmit"-->
      <!--    >-->
      <a-form-item
        field="user_name"
        :rules="[{ required: true, message: t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input
          v-model="userInfo.user_name"
          :placeholder="t('login.form.userName.placeholder')"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        field="password"
        :rules="[{ required: true, message: t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="t('login.form.password.placeholder')"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-link @click="goToForgetPassword">{{
            t('login.form.forgetPassword')
          }}</a-link>
        </div>
        <a-trigger trigger="click" position="top">
          <a-button
            type="primary"
            html-type="button"
            long
            :loading="loading"
            @click="handleLogin"
          >
            {{ t('login.form.login') }}
          </a-button>
          <template #content>
            <div class="slider">
              <Slider
                v-if="showSquare"
                :img-urls="imgUrls"
                @success="handleVerifySuccess"
              />
            </div>
          </template>
        </a-trigger>

        <a-button
          type="text"
          long
          class="login-form-register-btn"
          @click="goToRegister"
        >
          {{ t('login.form.register') }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';
  import { useUserStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import Slider from '@/components/slider/index.vue';

  import A from '@/assets/slider/0.jpg';
  import B from '@/assets/slider/1.png';
  import C from '@/assets/slider/2.jpeg';
  import D from '@/assets/slider/3.jpg';
  import E from '@/assets/slider/4.jpg';
  import F from '@/assets/slider/5.jpg';
  import G from '@/assets/slider/6.png';
  import H from '@/assets/slider/7.png';
  import { userLogin } from '@/api/user';
  import parseToken from '@/utils/jwt';

  const imgUrls = [A, B, C, D, E, F, G, H]; // 滑动验证码

  const router = useRouter(); // 路由
  const { t } = useI18n(); // 国际化
  const errorMessage = ref(''); // 错误信息
  const { loading, setLoading } = useLoading(); // 登录加载状态,默认false
  const userStore = useUserStore(); // 状态管理
  const isVerified = ref(false); //  isVerified 验证成功触发
  const showSquare = ref(false); // 判断是否开启验证码
  // 流程是，验证码输入成功后，再调用表单的代码开始登录。否则依然要等待输入
  const handleVerifySuccess = () => {
    isVerified.value = true;
    // eslint-disable-next-line no-use-before-define
    handleLogin();
  };
  const goToRegister = () => {
    // 跳转到注册界面
    router.push('/console/register');
  };

  const goToForgetPassword = () => {
    // 跳转到忘记密码界面
    router.push('/console/forgetPassword');
  };
  // 表单数据
  const userInfo = reactive({
    user_name: '',
    password: '',
  });
  // 检测表单数据是否完善
  const validateUserInfo = () => {
    return Object.values(userInfo).every((value) => value !== '');
  };

  const handleLogin = async () => {
    // 优先判断表单数据是否被填充完毕
    if (!validateUserInfo()) {
      Message.warning('请将表单数据填充完整！');
      return;
    }
    showSquare.value = true; // 此刻开启。
    if (loading.value || !isVerified.value) return; // 如果表单加载中，或者验证码未正确则禁止登录

    setLoading(true);
    try {
      const response = await userLogin(userInfo);
      const res = response.data;

      if (res.code) {
        // 非0则执行
        Message.error(res.msg);
        isVerified.value = false; // 在登录信息输入错误后，需要重新验证表单。
        showSquare.value = false; // 此刻关闭。
        return;
      }

      // 解析Token并转为需要的信息
      const userIDInfo = parseToken(res.data);
      userIDInfo.token = res.data;
      userStore.setUserInfo(userIDInfo);
      // 获取重定向的目标位置和查询参数
      const { redirect, ...othersQuery } = router.currentRoute.value.query;

      router.push({
        name: (redirect as string) || 'Workplace',
        query: {
          ...othersQuery,
        },
      });

      isVerified.value = false; // 在登录信息输入错误后，需要重新验证表单。
      showSquare.value = false; // 此刻关闭。
      Message.success(t('login.form.login.success'));
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
