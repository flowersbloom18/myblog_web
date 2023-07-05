<template>
  <!-- content -->
  <div style="width: 400px; margin: 100px auto">
    <a-descriptions
      :data="data"
      size="large"
      :align="{ label: 'left', value: 'left' }"
      :column="1"
    >
      <template #label="{ label }">{{ $t(label) }} :</template>
      <template #value="{ value, data }">
        <a-avatar v-if="data.label === '头像'" :size="80">
          <img :src="value" alt="" />
        </a-avatar>
        <a-tag v-else-if="data.label === '注册时间:'" color="green" size="big">
          {{ getFormatDate(data.value) }}
        </a-tag>
        <span v-else>{{ value }}</span>
      </template>
    </a-descriptions>
  </div>
  <a-button class="a-button" type="primary" @click="handleClick"
    >修改昵称和头像
  </a-button>

  <a-modal
    v-model:visible="visible"
    title="修改昵称和头像"
    @cancel="handleCancel"
    @ok="handleSubmit"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="nick_name"
        label="昵称"
        :rules="[
          {
            required: true,
            message: '请输入用户昵称',
          },
        ]"
      >
        <a-input v-model="form.nick_name" placeholder="请输入你的昵称" />
      </a-form-item>
      <a-form-item
        field="avatar"
        label="头像"
        :rules="[
          {
            required: true,
            message: '请输入用户邮箱',
          },
        ]"
      >
        <a-input v-model="form.avatar" placeholder="请输入你的头像" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { getUserInfo, userUpdateNickNameApi } from '@/api/user';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import getFormatDate from '@/utils/date';

  const data = ref([
    {
      label: '用户名',
      value: '',
    },
    {
      label: '昵称',
      value: '',
    },
    {
      label: '头像',
      value: '',
    },
    {
      label: '邮箱',
      value: '',
    },
    {
      label: '权限',
      value: '',
    },
    {
      label: '登录IP',
      value: '',
    },
    {
      label: '登录地址',
      value: '',
    },
    {
      label: '登录设备',
      value: '',
    },
    {
      label: '注册来源',
      value: '',
    },
    {
      label: '注册时间:',
      value: '',
    },
  ]);

  // 修改表单校验
  const formRef = ref<FormInstance>();
  const visible = ref(false);

  const form = reactive({
    nick_name: '',
    avatar: '',
  });
  const getData = async () => {
    try {
      const res = await getUserInfo();

      if (!res.data.code) {
        data.value[0].value = res.data.data.user_name;
        data.value[1].value = res.data.data.nick_name;
        data.value[2].value = res.data.data.avatar;
        // form.avatar = res.data.data.avatar;
        data.value[3].value = res.data.data.email;
        data.value[4].value = res.data.data.role;
        data.value[5].value = res.data.data.ip;
        data.value[6].value = res.data.data.address;
        data.value[7].value = res.data.data.device;
        data.value[8].value = res.data.data.register_origin;
        data.value[9].value = res.data.data.created_at;

        form.nick_name = res.data.data.nick_name;
        form.avatar = res.data.data.avatar;
      }
    } catch (err) {
      Message.error('数据获取错误！');
    }
  };
  // 点击打开表单
  const handleClick = () => {
    visible.value = true;
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 开始提交
      const res = await userUpdateNickNameApi(form);
      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        Message.error('信息修改失败');
        visible.value = false;
      }
      Message.success(res.data.msg);
      await getData();
    }
  };

  const handleCancel = () => {
    visible.value = false;
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
