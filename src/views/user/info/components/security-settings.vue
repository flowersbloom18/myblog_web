<template>
  <a-list :bordered="false">
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph> 修改密码</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              觉得密码太简单？赶快点击修改密码吧。
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-button type="primary" @click="handleClick">修改密码</a-button>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
    <a-list-item>
      <a-list-item-meta>
        <template #avatar>
          <a-typography-paragraph> 绑定邮箱</a-typography-paragraph>
        </template>
        <template #description>
          <div class="content">
            <a-typography-paragraph>
              绑定邮箱之后，不仅能够通过邮箱+密码登录，还可以方便的通过邮箱找回密码。
            </a-typography-paragraph>
          </div>
          <div class="operation">
            <a-button type="primary" @click="handleClick2">绑定邮箱</a-button>
          </div>
        </template>
      </a-list-item-meta>
    </a-list-item>
  </a-list>

  <a-modal
    v-model:visible="visible"
    title="修改密码"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="old_pwd"
        label="旧密码"
        :rules="[
          {
            required: true,
            message: '请输入旧密码',
          },
        ]"
      >
        <a-input-password v-model="form.old_pwd" placeholder="请输入旧密码" />
      </a-form-item>

      <a-form-item
        field="pwd"
        label="新密码"
        :rules="[
          {
            required: true,
            message: '请输入新密码',
          },
        ]"
      >
        <a-input-password v-model="form.pwd" placeholder="请输入新密码" />
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    v-model:visible="visible2"
    title="绑定邮箱"
    @cancel="handleCancel2"
    @ok="handleOk2"
  >
    <a-form ref="formRef2" :model="form2">
      <span style="margin: 0px auto 5px; color: rgb(var(--red-6))">{{
        msg
      }}</span>
      <a-form-item
        field="email"
        label="邮箱"
        :rules="[
          {
            required: true,
            message: '请输入邮箱',
          },
        ]"
      >
        <a-input v-model="form2.email" placeholder="请输入邮箱" />
      </a-form-item>

      <a-form-item
        field="code"
        label="验证码"
        :rules="[
          {
            required: true,
            message: '请输入验证码',
          },
        ]"
      >
        <a-input-password v-model="form2.code" placeholder="请输入验证码" />
        <Code
          v-if="email2"
          :is-true="isTrue"
          :email2="email2"
          :case="2"
          @cli="confirmSend"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, toRef, watch } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message } from '@arco-design/web-vue';
  import { userBindEmailApi, userUpdatePwdApi } from '@/api/user';
  import Code from '@/views/forget-password/components/code.vue';

  // 邮箱
  const email2 = ref(''); // 邮箱
  const isTrue = ref(false); // 判断能否发送验证码
  const confirmSend = () => {
    if (!isTrue.value) {
      Message.warning('请输入有效的邮箱地址');
    }
  };

  // 修改表单校验
  const formRef = ref<FormInstance>();
  const formRef2 = ref<FormInstance>();
  const visible = ref(false);
  const visible2 = ref(false);
  const msg = ref('');
  const form = reactive({
    old_pwd: '',
    pwd: '',
  });
  const form2 = reactive({
    email: '',
    code: '',
  });

  // 监控邮箱
  watch(toRef(form2, 'email'), () => {
    // eslint-disable-next-line no-use-before-define
    if (validateEmail(form2.email)) {
      isTrue.value = true;
      email2.value = form2.email; // 传递邮箱信息
    } else {
      isTrue.value = false;
    }
  });
  // 校验邮箱格式
  const validateEmail = (email: string) => {
    // 使用正则表达式进行邮箱校验
    const emailPattern = /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
    if (!emailPattern.test(email)) {
      msg.value = '请输入有效的邮箱地址';
      return false;
    }
    msg.value = '';
    return true;
  };

  // 打开表单
  const handleClick = () => {
    visible.value = true;
  };
  const handleClick2 = () => {
    visible2.value = true;
  };

  // 提交表单
  const handleOk = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 开始提交
      const res = await userUpdatePwdApi(form);
      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        Message.error(res.data.msg);
        visible.value = true;
      } else {
        visible.value = false;
        Message.success(res.data.msg);

        // 清理token
        localStorage.removeItem('userInfo');
      }
    }
  };
  const handleOk2 = async () => {
    // 表单校验
    const state = await formRef2.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible2.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 开始提交
      const res = await userBindEmailApi(form2);
      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        Message.error(res.data.msg);
        visible2.value = true;
      } else {
        visible2.value = false;
        Message.success(res.data.msg);
      }
    }
  };

  const handleCancel = () => {
    visible.value = false;
    form.old_pwd = '';
    form.pwd = '';
  };
  const handleCancel2 = () => {
    visible2.value = false;
    form2.email = '';
    form2.code = '';
  };
</script>

<style scoped lang="less">
  :deep(.arco-list-item) {
    border-bottom: none !important;

    .arco-typography {
      margin-bottom: 20px;
    }

    .arco-list-item-meta-avatar {
      margin-bottom: 1px;
    }

    .arco-list-item-meta {
      padding: 0;
    }
  }

  :deep(.arco-list-item-meta-content) {
    flex: 1;
    border-bottom: 1px solid var(--color-neutral-3);

    .arco-list-item-meta-description {
      display: flex;
      flex-flow: row;
      justify-content: space-between;

      .tip {
        color: rgb(var(--gray-6));
      }

      .operation {
        margin-right: 6px;
      }
    }
  }
</style>
