<template>
  <!-- content -->
  <a-form ref="formRef" :model="form" style="width: 80vh; margin: 30px auto">
    <a-form-item
      field="Key"
      label="TianAPIKEY"
      :rules="[{ required: true, message: '请输入TianAPIKEY' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input-password v-model="form.Key" placeholder="请输入TianAPIKEY" />
    </a-form-item>
    <a-form-item
      field="WeiBoHot"
      label="微博热搜API"
      :rules="[{ required: true, message: '请输入微博热搜API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.WeiBoHot" placeholder="请输入微博热搜API" />
    </a-form-item>
    <a-form-item
      field="DouYinHot"
      label="抖音热搜API"
      :rules="[{ required: true, message: '请输入抖音热搜API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.DouYinHot" placeholder="请输入抖音热搜API" />
    </a-form-item>
    <a-form-item
      field="NetWorkHot"
      label="全网热搜API"
      :rules="[{ required: true, message: '请输入全网热搜API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.NetWorkHot" placeholder="请输入全网热搜API" />
    </a-form-item>

    <a-form-item
      field="BulletIn"
      label="每日简报API"
      :rules="[{ required: true, message: '请输入每日简报API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.BulletIn" placeholder="请输入每日简报API" />
    </a-form-item>

    <a-form-item
      field="ZaoAn"
      label="早安语句API"
      :rules="[{ required: true, message: '请输入早安语句API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.ZaoAn" placeholder="请输入早安语句API" />
    </a-form-item>
    <a-form-item
      field="WanAn"
      label="晚安语句API"
      :rules="[{ required: true, message: '请输入晚安语句API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.WanAn" placeholder="请输入晚安语句API" />
    </a-form-item>
    <a-form-item
      field="LiShi"
      label="历史上的今天API"
      :rules="[{ required: true, message: '请输入历史上的今天API' }]"
      :validate-trigger="['change', 'blur']"
    >
      <a-input v-model="form.LiShi" placeholder="请输入历史上的今天API" />
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
    getTianApiInfoApi,
    TianApiFormType,
    updateTianApiInfoApi,
  } from '@/api/settings';
  import { Notification } from '@arco-design/web-vue';

  // 提示
  const handleNotification = () => {
    Notification.info({
      content:
        '该接口主要获取热搜数据，后端会每30分钟获取一次数据，来更新数据库的数据，无需担心次数不够的请情况。\n' +
        '如需使用，请访问https://www.tianapi.com/list/\n' +
        '注册后，申请对应的接口，每个接口每天有100次的免费使用次数。个人完全够用。\n' +
        '注意：请严格按照该例子输入API\n' +
        "例如：https://apis.tianapi.com/wanan/index?key=你的APIKEY'",
      closable: true, // 可关闭
      duration: 20000, // 20秒自动关闭
    });
  };
  // 修改表单校验
  const formRef = ref<FormInstance>();

  // 修改表单
  const form: TianApiFormType = reactive({
    Key: '',
    DouYinHot: '',
    NetWorkHot: '',
    WeiBoHot: '',
    BulletIn: '',
    ZaoAn: '',
    WanAn: '',
    LiShi: '',
  });

  // 获取数据
  const getData = async () => {
    try {
      const res = await getTianApiInfoApi();

      if (!res.data.code) {
        form.Key = res.data.data.Key;
        form.DouYinHot = res.data.data.DouYinHot;
        form.NetWorkHot = res.data.data.NetWorkHot;
        form.WeiBoHot = res.data.data.WeiBoHot;
        form.BulletIn = res.data.data.BulletIn;
        form.ZaoAn = res.data.data.ZaoAn;
        form.WanAn = res.data.data.WanAn;
        form.LiShi = res.data.data.LiShi;
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
      const res = await updateTianApiInfoApi(form);
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
