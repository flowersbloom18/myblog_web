<template>
  <div class="container">
    <a-card class="general-card" title="系统日志">
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
                <a-form-item field="key" label="日志水平">
                  <a-select
                    v-model="page.key"
                    style="width: 180px"
                    :options="levelOptions"
                    :placeholder="$t('请输入日志水平')"
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
            <a-button type="primary" status="danger" @click="deleteAll"
              >批量删除
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12"> </a-col>
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
        <!--配合插槽来使用-->
        <template #created_at="{ rowIndex }">
          <span>{{ getFormatDate(renderData[rowIndex].created_at) }}</span>
        </template>

        <template #level="{ rowIndex }">
          <span v-if="renderData[rowIndex].level == 'Info'">
            <a-tag color="blue" bordered
              >{{ renderData[rowIndex].level }}
            </a-tag>
          </span>
          <span v-else-if="renderData[rowIndex].level == 'Email'">
            <a-tag color="orange" bordered
              >{{ renderData[rowIndex].level }}
            </a-tag>
          </span>
          <span v-else-if="renderData[rowIndex].level == 'Warn'">
            <a-tag color="red" bordered
              >{{ renderData[rowIndex].level }}
            </a-tag>
          </span>
        </template>

        <template #operation="{ rowIndex }">
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
</template>

<script lang="ts" setup>
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import getFormatDate from '@/utils/date';
  import QueryParams, { Remove } from '@/types/global';

  import { deleteLogApi, getLogApi, LogForm } from '@/api/log';

  // 分页数据
  const page: QueryParams = reactive({
    page: 1,
    limit: 10,
    key: '', // 模糊查询
  });

  const scroll = {
    x: 1360,
    // y: 200,
  };
  const columns: TableColumnData[] = [
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
      width: 100,
    },
    {
      title: 'IP',
      dataIndex: 'ip',
      align: 'center',
      width: 100,
    },
    {
      title: 'IP 属地',
      dataIndex: 'address',
      align: 'center',
      width: 100,
    },
    {
      title: '设备',
      dataIndex: 'device',
      align: 'center',
      width: 100,
    },
    {
      title: '日志水平',
      dataIndex: 'level',
      align: 'center',
      slotName: 'level',
      width: 100,
    },
    {
      title: '内容',
      dataIndex: 'content',
      align: 'center',
      width: 200,
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
  const renderData = ref<LogForm[]>([]);

  const levelOptions = [
    {
      value: 'Info',
      label: 'Info',
    },
    {
      value: 'Email',
      label: 'Email',
    },
    {
      value: 'Warn',
      label: 'Warn',
    },
  ];

  const idList: Remove = reactive({
    id_list: [],
  });
  // 删除
  const isDelete = async (list: number) => {
    idList.id_list[idList.id_list.length] = list;

    const data = await deleteLogApi(idList);

    if (data.data.code) {
      Message.error(data.data.msg);
      idList.id_list = [];
      return;
    }
    Message.success(data.data.msg);
    idList.id_list = [];
    // eslint-disable-next-line no-use-before-define
    await getData();
  };

  // 总共几条数据
  const total = ref(0);

  // 请求数据
  const getData = async () => {
    try {
      // page limit
      const { data } = await getLogApi(page);
      // 获取信息总条数，
      total.value = data.data.count;
      data.list = data.data.list;
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
    getData();
  };
  const changeLimit = (_limit: any) => {
    page.limit = _limit;
    page.page = 1; // 数量转换的话需要重置页码
    getData();
  };
  // 列选择器配置
  const rowSelection: UnwrapRef<TableRowSelection> | undefined = {
    onlyCurrent: true,
    type: 'checkbox',
    showCheckedAll: true,
  };
  // 被选到的数据
  const selectedKeys = ref([]);

  // 批量删除
  const deleteAll = async () => {
    // 判断数据存在？清空
    if (selectedKeys.value.length === 0) {
      Message.error('请选择数据！');
      return;
    }
    // request
    const data = await deleteLogApi({ id_list: selectedKeys.value });
    if (data.data.code) {
      Message.warning(data.data.msg);
      selectedKeys.value = []; // 清空表单。
      return;
    }
    Message.success(data.data.msg);
    selectedKeys.value = []; // 清空表单。

    await getData();
  };

  getData();

  const search = () => {
    getData();
  };

  const reset = () => {
    page.key = '';
    page.role = null;
    getData();
  };
</script>

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
