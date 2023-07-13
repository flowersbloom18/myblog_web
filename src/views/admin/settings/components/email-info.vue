<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item
      field="host"
      label="邮箱服务器端地址"
      :rules="[{ required: true, message: '请输入邮箱服务器端地址' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.host" placeholder="邮箱服务器端地址" />
    </a-form-item>
    <a-form-item
      field="port"
      label="邮箱服务器端口号"
      :rules="[{ required: true, message: '请输入邮箱服务器端口号' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-number
        v-model="form.port"
        placeholder="请输入邮箱服务器端口号"
        :min="1"
        :max="9999"
      />
    </a-form-item>
    <a-form-item
      field="send_email"
      label="发送人邮箱"
      :rules="[{ required: true, message: '请输入发送人邮箱' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.send_email" placeholder="请输入发送人邮箱" />
    </a-form-item>
    <a-form-item
      field="password"
      label="邮箱密钥"
      :rules="[{ required: true, message: '请输入邮箱密钥' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password v-model="form.password" placeholder="请输入邮箱密钥" />
    </a-form-item>
    <a-form-item
      field="send_name"
      label="发送人名称"
      :rules="[{ required: true, message: '请输入发送人名称' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.send_name" placeholder="请输入发送人名称" />
    </a-form-item>
    <a-form-item
      field="logo_email"
      label="邮箱内容的logo"
      :rules="[{ required: true, message: '请输入邮箱内容的logo' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.logo_email" placeholder="请输入邮箱内容的logo" />
    </a-form-item>
    <a-image
      :src="form.logo_email"
      alt="图片不存在"
      width="200px"
      style="margin: 10px auto"
    />
  </a-form>
  <a-button class="a-button" type="primary" @click="handleSubmit">
    更新信息
  </a-button>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getUserInfo, userUpdateNickNameApi } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import getFormatDate from '@/utils/date';
  import { friendLinkFormType } from '@/api/friendLink';
  import {
    EmailFormType,
    getEmailInfoApi,
    getSiteInfoAllApi,
    SiteInfoFormType,
    updateEmailInfoApi,
    updateSiteInfoApi,
  } from '@/api/settings';

  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: EmailFormType = reactive({
    host: '',
    port: 1234,
    send_email: '',
    password: '',
    send_name: '',
    logo_email: '',
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getEmailInfoApi();

      if (!res.data.code) {
        form.host = res.data.data.host;
        form.port = res.data.data.port;
        form.send_email = res.data.data.send_email;
        form.password = res.data.data.password;
        form.send_name = res.data.data.send_name;
        form.logo_email = res.data.data.logo_email;
      }
    } catch (err) {
      Message.error('数据获取错误！');
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      Message.warning('请输入完整信息！');
    } else {
      // 开始提交
      const res = await updateEmailInfoApi(form);
      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        Message.error('信息修改失败');
      }
      Message.success(res.data.msg);
      await getData();
    }
  };

  getData();
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }

  .a-button {
    float: right;
    margin: 0 20px 20px 0;
  }
</style>
