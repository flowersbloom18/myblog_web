<template>
  <div class="container">
    <a-card class="general-card" title="音乐">
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
                <a-form-item field="key" label="查询音乐">
                  <a-input v-model="page.key" placeholder="请输入音乐名称" />
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
        <a-col :span="22">
          <a-space>
            <a-button type="primary" @click="addMusic">
              <template #icon>
                <icon-plus />
              </template>
              新增音乐
            </a-button>
            <a-button type="primary" status="danger" @click="deleteAll"
              >批量删除
            </a-button>
          </a-space>
        </a-col>
        <a-col :span="2">
          <a-button @click="attachmentOpen">选择附件</a-button>
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
        <!--配合插槽来使用-->
        <template #cover="{ rowIndex }">
          <a-image
            height="80px"
            width="100%"
            :src="renderData[rowIndex].cover"
            alt="封面不存在"
            show-loader
          />
        </template>
        <template #created_at="{ rowIndex }">
          <span>{{ getFormatDate(renderData[rowIndex].created_at) }}</span>
        </template>

        <template #status="{ rowIndex }">
          <a-switch v-model="renderData[rowIndex].status" disabled>
            <template #checked-icon>
              <icon-check />
            </template>
            <template #unchecked-icon>
              <icon-close />
            </template>
          </a-switch>
        </template>
        <template #url="{ rowIndex }">
          <a-link :href="renderData[rowIndex].url" icon>点击跳转 </a-link>
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
    title="修改音乐"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef2" :model="form">
      <a-form-item
        field="name"
        label="音乐名称"
        :rules="[{ required: true, message: '请输入音乐名称' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.name" placeholder="请输入音乐名称" />
      </a-form-item>
      <a-form-item
        field="author"
        label="作者"
        :rules="[{ required: true, message: '请输入作者' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.author" placeholder="请输入作者" />
      </a-form-item>
      <a-form-item
        field="cover"
        label="封面"
        :rules="[{ required: true, message: '请输入封面' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.cover" placeholder="请输入封面" />
      </a-form-item>
      <a-form-item
        field="url"
        label="音乐链接"
        :rules="[{ required: true, message: '请输入音乐链接' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.url" placeholder="请输入音乐链接" />
      </a-form-item>

      <a-form-item field="status" label="状态">
        <a-switch v-model="form.status" />
      </a-form-item>

      <a-form-item
        field="sort"
        label="排序"
        :rules="[{ required: true, message: '请输入序号' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-number
          v-model="form.sort"
          placeholder="请输入序号"
          :min="1"
          :max="9999"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!--  add -->
  <a-modal
    v-model:visible="visible2"
    title="新增音乐"
    @cancel="handleCancel2"
    @ok="handleOk2"
  >
    <a-form ref="formRef1" :model="musicForm" auto-label-width class="a-form">
      <a-form-item
        field="name"
        label="音乐名称"
        :rules="[{ required: true, message: '请输入音乐名称' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="musicForm.name" placeholder="请输入音乐名称" />
      </a-form-item>
      <a-form-item
        field="author"
        label="作者"
        :rules="[{ required: true, message: '请输入作者' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="musicForm.author" placeholder="请输入作者" />
      </a-form-item>
      <a-form-item
        field="cover"
        label="封面"
        :rules="[{ required: true, message: '请输入封面' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="musicForm.cover" placeholder="请输入封面" />
      </a-form-item>
      <a-form-item
        field="url"
        label="音乐链接"
        :rules="[{ required: true, message: '请输入音乐链接' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="musicForm.url" placeholder="请输入音乐链接" />
      </a-form-item>

      <a-form-item field="status" label="状态">
        <a-switch v-model="musicForm.status" />
      </a-form-item>

      <a-form-item
        field="sort"
        label="排序"
        :rules="[{ required: true, message: '请输入序号' }]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-number
          v-model="form.sort"
          placeholder="请输入序号"
          :min="1"
          :max="9999"
        />
      </a-form-item>
    </a-form>
  </a-modal>

  <!--attachment-->
  <a-modal
    v-model:visible="visibleAttachment"
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
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import getFormatDate from '@/utils/date';
  import QueryParams, { Remove } from '@/types/global';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import {
    createMusicApi,
    deleteMusicApi,
    getMusicApi,
    MusicForm,
    musicFormType,
    updateMusicApi,
  } from '@/api/music';
  import Attachment from '@/views/admin/attachment/index.vue';

  // 附件可见
  const visibleAttachment = ref(false);
  // 打开附件
  const handleOK3 = () => {
    // 关闭
    visibleAttachment.value = false;
  };
  const attachmentOpen = () => {
    visibleAttachment.value = true;
  };

  // 修改表单
  const form: musicFormType = reactive({
    name: '',
    author: '',
    url: '',
    cover: '',
    status: false,
    sort: 1,
  });

  // 分页数据
  const page: QueryParams = reactive({
    page: 1,
    limit: 10,
    key: '', // 模糊查询
  });

  // 创建音乐
  const musicForm: musicFormType = reactive({
    name: '',
    author: '',
    url: '',
    cover: '',
    status: false,
    sort: 1,
  });

  const scroll = {
    x: 1360,
    // y: 200,
  };
  const columns: TableColumnData[] = [
    {
      title: '音乐名称',
      dataIndex: 'name',
      fixed: 'left',
      align: 'center',
      width: 100,
    },
    {
      title: '作者',
      dataIndex: 'author',
      align: 'center',
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
      title: '音乐链接',
      dataIndex: 'url',
      align: 'center',
      slotName: 'url',
      width: 300,
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      slotName: 'status',
      width: 100,
    },
    {
      title: '排序',
      dataIndex: 'sort',
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
  const renderData = ref<MusicForm[]>([]);

  // 音乐id
  const id = ref(null);
  // 编辑表单
  const visible = ref(false);
  // 新增表单
  const visible2 = ref(false);
  // 表单校验
  const formRef1 = ref<FormInstance>();
  const formRef2 = ref<FormInstance>();

  // 编辑表单
  const edit = (data: any) => {
    visible.value = true;

    // 存储数据
    id.value = data.id;
    form.name = data.name;
    form.author = data.author;
    form.cover = data.cover;
    form.url = data.url;
    form.status = data.status;
    form.sort = data.sort;
  };
  // 编辑表单取消
  const handleCancel = () => {
    visible.value = false;
  };
  // 编辑表单提交
  const handleOk = async () => {
    // 表单校验
    const state = await formRef2.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 音乐id的获取
      const data = await updateMusicApi(id.value, form);
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
  // 删除
  const isDelete = async (list: number) => {
    idList.id_list[idList.id_list.length] = list;

    const data = await deleteMusicApi(idList);

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

  // 管理员创建音乐
  const addMusic = () => {
    // 展示表单
    visible2.value = true;
  };
  // 创建取消
  const handleCancel2 = () => {
    // 关闭并清空表单。
    visible2.value = false;
  };
  // 创建音乐提交
  const handleOk2 = async () => {
    // 表单校验
    const state = await formRef1.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible2.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      const data = await createMusicApi(musicForm);
      if (data.data.code) {
        Message.error(data.data.msg);
        // 提交失败这里不给清空，成功才清空
        return;
      }
      Message.success(data.data.msg);
      musicForm.name = '';
      musicForm.author = '';
      musicForm.cover = '';
      musicForm.url = '';
      musicForm.status = false;
      musicForm.sort = 0;
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
      const { data } = await getMusicApi(page);
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
    const data = await deleteMusicApi({ id_list: selectedKeys.value });
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
