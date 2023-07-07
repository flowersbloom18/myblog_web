<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item
      field="create_at"
      label="创建时间"
      :rules="[{ required: true, message: '请输入创建时间' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-date-picker v-model="form.create_at" />
    </a-form-item>
    <a-form-item
      field="bei_an"
      label="备案名称"
      :rules="[{ required: true, message: '请输入备案名称' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.bei_an" placeholder="请输入备案名称" />
    </a-form-item>
    <a-form-item
      field="title"
      label="网站标题"
      :rules="[{ required: true, message: '请输入网站标题' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.title" placeholder="请输入网站标题" />
    </a-form-item>
    <a-form-item
      field="logo_light"
      label="网站白天logo"
      :rules="[{ required: true, message: '请输入网站白天logo' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.logo_light" placeholder="请输入网站白天logo" />
    </a-form-item>
    <a-image
      :src="form.logo_light"
      alt="图片不存在"
      width="200px"
      style="margin: 10px auto"
    />
    <a-form-item field="logo_dark" label="网站夜间logo">
      <a-input v-model="form.logo_dark" placeholder="请输入网站夜间logo" />
    </a-form-item>
    <a-image
      :src="form.logo_dark"
      alt="图片不存在"
      width="200px"
      style="margin: 10px auto"
    />
    <a-form-item
      field="favicon"
      label="网站图标"
      :rules="[{ required: true, message: '请输入网站图标称' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.favicon" placeholder="请输入网站图标" />
    </a-form-item>
    <a-image
      :src="form.favicon"
      alt="图片不存在"
      width="80px"
      style="margin: 10px auto"
    />
    <a-form-item field="copyright_protocol" label="博客许可协议">
      <a-textarea
        v-model="form.copyright_protocol"
        placeholder="Please enter something"
        auto-size
      />
    </a-form-item>
    <a-form-item
      field="copyright_info"
      label="版权信息"
      :rules="[{ required: true, message: '请输入版权信息' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.copyright_info" placeholder="请输入版权信息" />
    </a-form-item>
    <a-form-item field="server_name" label="服务商图标">
      <a-input
        v-model="form.server_name"
        placeholder="请输入服务商图标，多个图标请使用---分隔开"
      />
    </a-form-item>
    <span
      v-for="(value, index) in imgList(form.server_name)"
      :key="index"
      style="margin: 10px auto"
    >
      <a-image :src="value" alt="图片不存在" width="80px" />
    </span>

    <a-form-item field="qq_image" label="QQ图片">
      <a-input v-model="form.qq_image" placeholder="请输入QQ图片地址" />
    </a-form-item>
    <a-image
      :src="form.qq_image"
      alt="图片不存在"
      width="100px"
      style="margin: 10px auto"
    />
    <a-form-item field="gitee_url" label="Gitee地址">
      <a-input v-model="form.gitee_url" placeholder="请输入Gitee地址" />
    </a-form-item>
    <a-form-item field="github_url" label="Github地址">
      <a-input v-model="form.github_url" placeholder="请输入Github地址" />
    </a-form-item>
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
    getSiteInfoAllApi,
    SiteInfoFormType,
    updateSiteInfoApi,
  } from '@/api/settings';

  // 处理服务商图片信息
  const imgList = (data1: string) => {
    const data2 = data1.split('---');
    return data2;
  };
  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: SiteInfoFormType = reactive({
    create_at: '',
    bei_an: '',
    title: '',
    logo_light: '',
    logo_dark: '',
    favicon: '',
    copyright_protocol: '',
    copyright_info: '',
    server_name: '',
    qq_image: '',
    gitee_url: '',
    github_url: '',
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getSiteInfoAllApi();

      if (!res.data.code) {
        form.create_at = res.data.data.create_at;
        form.bei_an = res.data.data.bei_an;
        form.title = res.data.data.title;
        form.logo_light = res.data.data.logo_light;
        form.logo_dark = res.data.data.logo_dark;
        form.favicon = res.data.data.favicon;
        form.copyright_protocol = res.data.data.copyright_protocol;
        form.copyright_info = res.data.data.copyright_info;
        form.server_name = res.data.data.server_name;
        form.qq_image = res.data.data.qq_image;
        form.gitee_url = res.data.data.gitee_url;
        form.github_url = res.data.data.github_url;
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
      const res = await updateSiteInfoApi(form);
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
