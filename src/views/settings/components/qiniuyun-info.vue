<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item field="enable" label="是否开启">
      <a-switch v-model="form.enable" />
    </a-form-item>
    <a-form-item
      field="access_key"
      label="Access Key"
      :rules="[{ required: true, message: '请输入Access Key' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password
        v-model="form.access_key"
        placeholder="请输入Access Key"
      />
    </a-form-item>
    <a-form-item
      field="secret_key"
      label="Secret Key"
      :rules="[{ required: true, message: '请输入Secret Key' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password
        v-model="form.secret_key"
        placeholder="请输入Secret Key"
      />
    </a-form-item>
    <a-form-item
      field="bucket"
      label="存储桶名称"
      :rules="[{ required: true, message: '请输入存储桶名称' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.bucket" placeholder="请输入存储桶名称" />
    </a-form-item>
    <a-form-item
      field="cdn"
      label="图片地址域名"
      :rules="[{ required: true, message: '请输入图片地址域名' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.cdn" placeholder="请输入图片地址域名" />
    </a-form-item>
    <a-form-item
      field="zone"
      label="上传的区域"
      :rules="[{ required: true, message: '请输入上传的区域' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.zone" placeholder="请输入上传的区域" />
    </a-form-item>

    <a-form-item
      field="prefix"
      label="上传的文件夹名称"
      :rules="[{ required: true, message: '请输入上传的文件夹名称' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.prefix" placeholder="请输入上传的文件夹名称" />
    </a-form-item>

    <a-form-item
      field="size"
      label="上传文件大小"
      :rules="[{ required: true, message: '请输入上传文件大小' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-number
        v-model="form.size"
        placeholder="请输入上传文件大小，单位（MB）"
        :min="1"
        :max="10240"
      >
        <template #suffix>
          <a-popover title="单位：MB">
            <icon-info-circle />&nbsp;&nbsp;&nbsp;&nbsp;
          </a-popover>
        </template>
      </a-input-number>
    </a-form-item>
  </a-form>
  <a-button class="a-button" type="primary" @click="handleSubmit">
    更新信息
  </a-button>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    getQiNiuYunInfoApi,
    QiNiuFormType,
    updateQiNiuYunInfoApi,
  } from '@/api/settings';

  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: QiNiuFormType = reactive({
    enable: false,
    access_key: '',
    secret_key: '',
    bucket: '',
    cdn: '',
    zone: '',
    prefix: '',
    size: 5,
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getQiNiuYunInfoApi();

      if (!res.data.code) {
        form.enable = res.data.data.enable;
        form.access_key = res.data.data.access_key;
        form.secret_key = res.data.data.secret_key;
        form.bucket = res.data.data.bucket;
        form.cdn = res.data.data.cdn;
        form.zone = res.data.data.zone;
        form.prefix = res.data.data.prefix;
        form.size = res.data.data.size;
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
      const res = await updateQiNiuYunInfoApi(form);
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
