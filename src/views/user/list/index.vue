<template>
  <div class="container">
    <a-card class="general-card" title="用户列表">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="page"
            :label-col-props="{ span: 7 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="left"
          >
            <a-row :gutter="12">
              <a-col :span="6">
                <a-form-item field="key" label="查询用户">
                  <a-input v-model="page.key" placeholder="请输入用户昵称" />
                </a-form-item>
              </a-col>
              <a-col :span="6">
                <a-form-item field="role" label="权限">
                  <a-select
                    v-model="page.role"
                    :options="roleOptions"
                    :placeholder="$t('请输入用户权限')"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-col>
        <a-divider style="height: 42px" direction="vertical" />
        <a-col :flex="'86px'" style="text-align: right">
          <a-space direction="horizon" :size="18">
            <a-button type="primary" @click="search">
              <template #icon>
                <icon-search />
              </template>
              查询
            </a-button>
            <a-button @click="reset">
              <template #icon>
                <icon-refresh />
              </template>
              重置
            </a-button>
          </a-space>
        </a-col>
      </a-row>
      <a-divider style="margin-top: 0" />

      <a-row style="margin-bottom: 16px">
        <a-col :span="12">
          <a-space>
            <a-button type="primary" @click="addUser">
              <template #icon>
                <icon-plus />
              </template>
              新增用户
            </a-button>
            <a-button type="primary" status="danger" @click="deleteAll"
              >批量删除
            </a-button>
          </a-space>
        </a-col>
      </a-row>

      <a-table
        v-model:selectedKeys="selectedKeys"
        class="a-table"
        :columns="columns"
        :data="renderData"
        :pagination="false"
        :scroll="scroll"
        row-key="id"
        :row-selection="rowSelection"
      >
        <template #avatar="{ rowIndex }">
          <!--      <a-avatar>-->
          <img :src="renderData[rowIndex].avatar" alt="" style="width: 50px" />
          <!--      </a-avatar>-->
        </template>
        <!--配合插槽来使用-->
        <template #created_at="{ rowIndex }">
          <span>{{ getFormatDate(renderData[rowIndex].created_at) }}</span>
        </template>

        <template #operation="{ rowIndex }">
          <a-button
            type="primary"
            style="width: 60px; margin-right: 10px"
            @click="edit(renderData[rowIndex])"
            >编辑
          </a-button>
          <a-popconfirm
            content="确认删除吗?"
            type="warning"
            ok-text="确认"
            cancel-text="取消"
            @ok="isDelete(renderData[rowIndex].id)"
          >
            <a-button type="primary" status="danger" style="width: 60px"
              >删除
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <!--分页信息-->
      <a-space direction="vertical" fill="true" size="large" align="center">
        <div style="height: 10px"></div>
        <a-pagination
          v-model:page-size="page.limit"
          v-model:current="page.page"
          :total="total"
          show-total
          show-page-size
          size="medium"
          @change="changePage"
          @page-size-change="changeLimit"
        />
      </a-space>
    </a-card>
  </div>
  <!--  弹出层表单【编辑】-->
  <a-modal
    v-model:visible="visible"
    title="编辑表单"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form :model="form">
      <a-form-item
        field="nick_name"
        label="用户昵称"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-input v-model="form.nick_name" placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item
        field="role"
        label="权限"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-select
          v-model="form.role"
          :options="roleOptions"
          placeholder="请选择权限"
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  add user-->
  <a-modal
    v-model:visible="visible2"
    title="新增用户"
    @cancel="handleCancel2"
    @ok="handleOk2"
  >
    <a-form :model="userForm" auto-label-width class="a-form">
      <a-form-item
        field="user_name"
        label="用户名"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-input v-model="userForm.user_name" placeholder="请输入用户名" />
      </a-form-item>

      <a-form-item
        field="nick_name"
        label="昵称"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-input v-model="userForm.nick_name" placeholder="请输入用户昵称" />
      </a-form-item>

      <a-form-item
        field="password"
        label="密码"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-input v-model="userForm.password" placeholder="请输入密码" />
      </a-form-item>

      <a-form-item
        field="role"
        label="权限"
        :rules="[{ required: true, message: '请输入完整信息' }]"
      >
        <a-select
          v-model="userForm.role"
          :options="roleOptions"
          placeholder="请选择权限"
          allow-clear
        >
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import {
    AddUserData,
    adminCreateUserApi,
    getUserList,
    removeUserApi,
    UpdateRoleData,
    UserPolicyRecord,
    userUpdateRoleApi,
  } from '@/api/user';
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import getFormatDate from '@/utils/date';
  import QueryParams, { Remove } from '@/types/global';

  // 修改表单，需要验证表单，才能提交
  const form: UpdateRoleData = reactive({
    user_id: null,
    nick_name: '',
    role: null,
  });

  // 分页数据
  const page: QueryParams = reactive({
    page: 1,
    limit: 10,
    key: '', // 模糊查询
    role: null, // 权限查询
  });

  // 创建用户
  const userForm: AddUserData = reactive({
    user_name: '',
    nick_name: '',
    password: '',
    role: null,
  });

  const scroll = {
    x: 1360,
    // y: 200,
  };
  const columns: TableColumnData[] = [
    // {
    //   title: 'ID', // 列标题
    //   dataIndex: 'id', // 对应的数据名称
    //   fixed: 'left',
    //   index: 2,
    //   align: 'center',
    // },
    {
      title: '用户名',
      dataIndex: 'user_name',
      fixed: 'left',
      align: 'center',
      width: 100,
    },
    {
      title: '昵称',
      dataIndex: 'nick_name',
      align: 'center',
      width: 100,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      align: 'center',
      width: 200,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      align: 'center',
      slotName: 'avatar',
      width: 100,
    },
    {
      title: '权限',
      dataIndex: 'role',
      align: 'center',
      width: 80,
    },
    {
      title: '注册来源',
      dataIndex: 'register_origin',
      align: 'center',
      width: 80,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
      width: 100,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      align: 'center',
      width: 100,
    },
    {
      title: '登录设备',
      dataIndex: 'device',
      align: 'center',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      fixed: 'right',
      align: 'center',
      slotName: 'created_at',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      fixed: 'right',
      width: 200,
      align: 'center',
      slotName: 'operation',
    },
  ];

  const roleOptions = [
    {
      value: 1,
      label: '管理员',
    },
    {
      value: 2,
      label: '用户',
    },
    {
      value: 3,
      label: '游客',
    },
  ];
  const renderData = ref<UserPolicyRecord[]>([]);

  // 检测表单数据是否完善
  const validateUserInfo = () => {
    return Object.values(form).every((value) => value !== '');
  };
  const validateCreateUserInfo = () => {
    return Object.values(userForm).every((value) => value !== '');
  };
  // 编辑表单
  const visible = ref(false);
  // 新增表单
  const visible2 = ref(false);

  // 编辑表单
  const edit = (data: any) => {
    visible.value = true;
    // 存储数据
    form.user_id = data.id;
    form.nick_name = data.nick_name;
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < roleOptions.length; i++) {
      if (roleOptions[i].label === data.role) {
        form.role = roleOptions[i].value;
      }
    }
  };
  // 编辑表单取消
  const handleCancel = () => {
    visible.value = false;
  };
  // 编辑表单提交
  const handleOk = async () => {
    // 优先判断表单数据是否被填充完毕
    if (!validateUserInfo()) {
      Message.warning('请将表单数据填充完整！');
      return;
    }
    const data = await userUpdateRoleApi(form);
    if (data.data.code) {
      Message.error(data.data.msg);
      return;
    }
    Message.success(data.data.msg);

    // eslint-disable-next-line no-use-before-define
    await fetchData();
  };

  const idList: Remove = reactive({
    id_list: [],
  });
  // 删除用户
  const isDelete = async (list: number) => {
    idList.id_list[idList.id_list.length] = list;

    const data = await removeUserApi(idList);

    if (data.data.code) {
      Message.error(data.data.msg);
      idList.id_list = [];
      return;
    }
    Message.success(data.data.msg);
    idList.id_list = [];
    // eslint-disable-next-line no-use-before-define
    await fetchData();
  };

  // 管理员创建用户
  const addUser = () => {
    // 展示表单
    visible2.value = true;
  };
  // 创建用户取消
  const handleCancel2 = () => {
    // 关闭并清空表单。
    visible2.value = false;
    userForm.user_name = '';
    userForm.nick_name = '';
    userForm.password = '';
    userForm.role = null;
  };
  // 创建用户提交
  const handleOk2 = async () => {
    // 优先判断表单数据是否被填充完毕
    if (!validateCreateUserInfo()) {
      Message.warning('请将表单数据填充完整！');
      return;
    }
    const data = await adminCreateUserApi(userForm);
    if (data.data.code) {
      Message.error(data.data.msg);
      userForm.user_name = '';
      userForm.nick_name = '';
      userForm.password = '';
      userForm.role = null;
      return;
    }
    Message.success(data.data.msg);
    userForm.user_name = '';
    userForm.nick_name = '';
    userForm.password = '';
    userForm.role = null;
    // eslint-disable-next-line no-use-before-define
    await fetchData();
  };

  // 总共几条数据
  const total = ref(0);

  // 请求数据
  const fetchData = async () => {
    try {
      // page limit
      const { data } = await getUserList(page);
      let result = data.data.list;
      console.log('list');
      // 获取信息总条数，
      total.value = data.data.count;

      // 将数据结构合并到新对象
      result = result.map((item: { user: any; role_id: any }) => ({
        // key: item.user.id,
        ...item.user,
        role_id: item.role_id,
      }));
      data.list = result;
      renderData.value = data.list;
    } catch (err) {
      // 一般错误都为序列化失败，说明登录过期了。
      // 还有可能是其它错误
      Message.error('数据获取出错！');
    }
  };
  // 分页信息同步
  const changePage = (_page: number) => {
    page.page = _page;
    fetchData();
  };
  const changeLimit = (_limit: any) => {
    page.limit = _limit;
    page.page = 1; // 数量转换的话需要重置页码
    fetchData();
  };
  // 列选择器配置
  const rowSelection: UnwrapRef<TableRowSelection> | undefined = {
    onlyCurrent: true,
    type: 'checkbox',
    showCheckedAll: true,
  };
  // 被选到的数据
  const selectedKeys = ref([]);

  // 批量删除用户
  const deleteAll = async () => {
    // 判断数据存在？清空
    if (selectedKeys.value.length === 0) {
      Message.error('请选择数据！');
      return;
    }
    // request
    const data = await removeUserApi({ id_list: selectedKeys.value });
    if (data.data.code) {
      Message.warning(data.data.msg);
      selectedKeys.value = []; // 清空表单。
      return;
    }
    Message.success(data.data.msg);
    selectedKeys.value = []; // 清空表单。

    await fetchData();
  };

  fetchData();

  const search = () => {
    fetchData();
  };

  const reset = () => {
    page.key = '';
    page.role = null;
    fetchData();
  };
</script>

<!--<script lang="ts">-->
<!--  export default {-->
<!--    name: 'SearchTable',-->
<!--  };-->
<!--</script>-->

<style scoped lang="less">
  .a-table {
    z-index: 1;
  }

  .div-form {
    width: 400px;
    height: auto;
    background-color: #ffffff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;

    border: 2px solid #575c64;
    border-radius: 10px;

    .a-form {
      border-top: 1px solid #a8adab;
      padding: 10px 10px 0 10px;
      margin-top: 10px;
    }

    .a-cancel {
      float: right;
      margin-bottom: 10px;
    }
  }

  .container {
    padding: 0 20px 20px 20px;
  }

  :deep(.arco-table-th) {
    &:last-child {
      .arco-table-th-item-title {
        margin-left: 16px;
      }
    }
  }

  .action-icon {
    margin-left: 12px;
    cursor: pointer;
  }

  .active {
    color: #0960bd;
    background-color: #e3f4fc;
  }

  .setting {
    display: flex;
    align-items: center;
    width: 200px;

    .title {
      margin-left: 12px;
      cursor: pointer;
    }
  }
</style>
