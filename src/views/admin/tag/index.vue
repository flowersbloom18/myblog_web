<template>
  <div class="container">
    <a-card class="general-card" title="标签">
      <a-row>
        <a-col :flex="1">
          <a-form
            :model="page"
            :label-col-props="{ span: 7 }"
            :wrapper-col-props="{ span: 16 }"
            label-align="left"
          >
            <a-row :gutter="12">
              <a-col :span="8">
                <a-form-item field="key" label="查询标签">
                  <a-input v-model="page.key" placeholder="请输入标签名称" />
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
            <a-button type="primary" @click="addtag">
              <template #icon>
                <icon-plus />
              </template>
              新增标签
            </a-button>
            <a-button type="primary" status="danger" @click="deleteAll"
              >批量删除
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="12">
          <div style="float: right">
            <a-button type="primary" @click="attachmentOpen"
              >选择附件
            </a-button>
          </div>
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
        <template #cover="{ rowIndex }">
          <a-image
            v-if="renderData[rowIndex].cover"
            height="80px"
            width="100%"
            :src="renderData[rowIndex].cover"
            alt="封面不存在"
            show-loader
          />
          <a-image
            v-else
            height="80px"
            width="100%"
            :src="defaultCover"
            alt="封面不存在"
            show-loader
          />
        </template>
        <!--配合插槽来使用-->
        <template #created_at="{ rowIndex }">
          <span>{{ getFormatDate(renderData[rowIndex].created_at) }}</span>
        </template>

        <template #tag="{ rowIndex }">
          <a-tag :color="RandomColor()" bordered
            >{{ renderData[rowIndex].name }}
          </a-tag>
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
  <!-- update -->
  <a-modal
    v-model:visible="visible"
    title="修改标签"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="name"
        label="标签名称"
        :rules="[{ required: true, message: '请输入标签名称' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.name" placeholder="请输入标签名称" />
      </a-form-item>
    </a-form>

    <a-form :model="form">
      <a-form-item field="cover" label="封面">
        <a-input v-model="form.cover" placeholder="请输入封面" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  add -->
  <a-modal
    v-model:visible="visible2"
    title="新增标签"
    @cancel="handleCancel2"
    @ok="handleOk2"
  >
    <a-form ref="formRef" :model="tagForm" auto-label-width class="a-form">
      <a-form-item
        field="name"
        label="标签名称"
        :rules="[{ required: true, message: '请输入标签名称' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="tagForm.name" placeholder="请输入标签名称" />
      </a-form-item>

      <a-form-item field="cover" label="封面">
        <a-input v-model="tagForm.cover" placeholder="请输入封面" allow-clear />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--attachment-->
  <a-modal
    v-model:visible="isOpen"
    width="70%"
    title="选择附件"
    hide-cancel="true"
    ok-text="取消"
    @ok="handleOK3"
  >
    <Attachment />
  </a-modal>
</template>

<script lang="ts" setup>
  import Attachment from '@/views/admin/attachment/index.vue';
  import { computed, reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import getFormatDate from '@/utils/date';
  import QueryParams, {
    FormRecord,
    nameCoverType,
    Remove,
  } from '@/types/global';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    createTagApi,
    deleteTagApi,
    getTagApi,
    updateTagApi,
  } from '@/api/tag';
  import { RandomColor } from '@/types/global';

  // 打开附件
  const isOpen = ref(false);
  const handleOK3 = () => {
    isOpen.value = false;
  };
  const attachmentOpen = () => {
    isOpen.value = true;
  };
  // 修改表单
  const form: nameCoverType = reactive({
    name: '',
    cover: '',
  });

  // 默认封面
  const defaultCover = ref('');
  defaultCover.value = '/src/assets/slider/0.jpg';
  // 分页数据
  const page: QueryParams = reactive({
    page: 1,
    limit: 10,
    key: '', // 模糊查询
  });

  // 创建标签
  const tagForm: nameCoverType = reactive({
    name: '',
    cover: '',
  });

  const scroll = {
    x: 1360,
    // y: 200,
  };
  const columns: TableColumnData[] = [
    {
      title: '标签名称',
      dataIndex: 'name',
      fixed: 'left',
      align: 'center',
      slotName: 'tag',
      width: 100,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      align: 'center',
      slotName: 'cover',
      width: 100,
    },
    {
      title: '博客数量',
      dataIndex: 'blog_num',
      align: 'center',
      slotName: 'blog_num',
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
  const renderData = ref<FormRecord[]>([]);

  // 标签id
  const id = ref(null);
  // 编辑表单
  const visible = ref(false);
  // 新增表单
  const visible2 = ref(false);
  // 表单校验
  const formRef = ref<FormInstance>();

  // 编辑表单
  const edit = (data: any) => {
    visible.value = true;
    // 存储数据
    id.value = data.id;
    form.name = data.name;
    form.cover = data.cover;
  };
  // 编辑表单取消
  const handleCancel = () => {
    visible.value = false;
  };
  // 编辑表单提交
  const handleOk = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 标签id的获取
      const data = await updateTagApi(id.value, form);
      if (data.data.code) {
        Message.error(data.data.msg);
        return;
      }
      Message.success(data.data.msg);

      // eslint-disable-next-line no-use-before-define
      await getData();
    }
  };

  const idList: Remove = reactive({
    id_list: [],
  });
  // 删除用户
  const isDelete = async (list: number) => {
    idList.id_list[idList.id_list.length] = list;

    const data = await deleteTagApi(idList);

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

  // 管理员创建标签
  const addtag = () => {
    // 展示表单
    visible2.value = true;
  };
  // 创建用户取消
  const handleCancel2 = () => {
    // 关闭并清空表单。
    visible2.value = false;
    tagForm.name = '';
    tagForm.cover = '';
  };
  // 创建标签提交
  const handleOk2 = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible2.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      const data = await createTagApi(tagForm);
      if (data.data.code) {
        Message.error(data.data.msg);
        tagForm.name = '';
        tagForm.cover = '';
        return;
      }
      Message.success(data.data.msg);
      tagForm.name = '';
      tagForm.cover = '';
      // eslint-disable-next-line no-use-before-define
      await getData();
    }
  };

  // 总共几条数据
  const total = ref(0);

  // 请求数据
  const getData = async () => {
    try {
      // page limit
      const { data } = await getTagApi(page);
      let result = data.data.list;
      // 获取信息总条数，
      total.value = data.data.count;
      // 如果获取不到数据，不在对数据进行处理了。
      if (result != null) {
        // 将数据结构合并到新对象
        result = result.map((item: { tag: any; blog_num: number }) => ({
          // key: item.user.id,
          ...item.tag,
          blog_num: item.blog_num,
        }));
      }

      renderData.value = result;
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

  // 批量删除用户
  const deleteAll = async () => {
    // 判断数据存在？清空
    if (selectedKeys.value.length === 0) {
      Message.error('请选择数据！');
      return;
    }
    // request
    const data = await deleteTagApi({ id_list: selectedKeys.value });
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
