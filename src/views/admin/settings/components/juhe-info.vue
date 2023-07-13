<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item
      field="Key"
      label="JuheAPIKEY"
      :rules="[{ required: true, message: '请输入JuheAPIKEY' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password v-model="form.Key" placeholder="请输入JuheAPIKEY" />
    </a-form-item>
  </a-form>
  <a-row style="margin-bottom: 30px">
    <a-col :span="3" offset="21">
      <a-space>
        <a-button @click="handleNotification"> 提示 </a-button>
        <a-button type="primary" @click="handleSubmit"> 更新信息 </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    getJuheInfoApi,
    JuheFormType,
    updateJuheInfoApi,
  } from '@/api/settings';
  import { Notification } from '@arco-design/web-vue';

  // 提示
  const handleNotification = () => {
    Notification.info({
      content:
        '该接口主要将IP转为物理地址。\n' +
        '如需使用，请访问https://dashboard.juhe.cn/\n' +
        '注册后，进入https://dashboard.juhe.cn/data/index/apply界面，找到并申请ip接口，每个接口每天有50次的免费使用次数。个人基本够用。\n',
      closable: true, // 可关闭
      duration: 20000, // 20秒自动关闭
    });
  };
  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: JuheFormType = reactive({
    Key: '',
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getJuheInfoApi();

      if (!res.data.code) {
        form.Key = res.data.data.Key;
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
      const res = await updateJuheInfoApi(form);
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
