<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item
      field="size"
      label="本地上传文件大小"
      :rules="[{ required: true, message: '请输入本地上传文件大小' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-number
        v-model="form.size"
        placeholder="请输入本地上传文件大小"
        :min="1"
        :max="999"
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
    getUploadInfoApi,
    updateUploadInfoApi,
    UploadFormType,
  } from '@/api/settings';

  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: UploadFormType = reactive({
    size: 5,
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getUploadInfoApi();

      if (!res.data.code) {
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
      const res = await updateUploadInfoApi(form);
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
