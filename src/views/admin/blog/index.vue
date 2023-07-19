<template>
  <div class="container">
    <a-card class="general-card" title="博客列表">
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
                <a-form-item field="key" label="查询博客">
                  <a-input v-model="page.key" placeholder="请输入博客的标题" />
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
            <a-button type="primary" @click="addBlog">
              <template #icon>
                <icon-plus />
              </template>
              新增博客
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
        <!--配合插槽来使用，处理特殊列-->
        <template #read_num="{ rowIndex }">
          <a-space direction="vertical">
            <span>
              <a-space>
                <template #split>
                  <a-divider direction="vertical" />
                </template>
                <a-space>
                  <icon-eye /> {{ renderData[rowIndex].read_num }}
                </a-space>
                <a-space>
                  <icon-message />{{ renderData[rowIndex].comment_num }}
                </a-space>
              </a-space>
            </span>
            <span>
              <a-space>
                <template #split>
                  <a-divider direction="vertical" />
                </template>

                <a-space>
                  <icon-thumb-up />{{ renderData[rowIndex].like_num }}
                </a-space>
                <a-space>
                  <icon-star />{{ renderData[rowIndex].collect_num }}
                </a-space>
              </a-space>
            </span>
          </a-space>
          <a-space> </a-space>
        </template>

        <template #is_publish="{ rowIndex }">
          <a-switch v-model="renderData[rowIndex].is_publish" disabled>
            <template #checked-icon>
              <icon-check />
            </template>
            <template #unchecked-icon>
              <icon-close />
            </template>
          </a-switch>
        </template>

        <template #is_top="{ rowIndex }">
          <a-switch v-model="renderData[rowIndex].is_top" disabled>
            <template #checked-icon>
              <icon-check />
            </template>
            <template #unchecked-icon>
              <icon-close />
            </template>
          </a-switch>
        </template>

        <template #tags="{ rowIndex }">
          <a-space wrap>
            <!--这里如果使用随机函数会出现，函数随着左右侧滑动频繁调用的情况，暂时改为此-->
            <a-tag
              v-for="(value, index) in renderData[rowIndex].tags"
              :key="index"
              immediate
              :color="Colors[index]"
              >{{ value }}</a-tag
            >
          </a-space>
        </template>

        <template #link="{ rowIndex }">
          <a-link icon @click="linkSkip(renderData[rowIndex].link)"
            >点击跳转
          </a-link>
        </template>

        <template #cover="{ rowIndex }">
          <a-image
            v-if="renderData[rowIndex].cover"
            height="100%"
            width="100px"
            :src="renderData[rowIndex].cover"
            alt="封面不存在"
            show-loader
          />
          <a-image
            v-else
            height="100%"
            width="100px"
            :src="defaultCover"
            alt="封面不存在"
            show-loader
          />
        </template>

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
</template>

<script lang="ts" setup>
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import getFormatDate from '@/utils/date';
  import QueryParams, { Remove, Colors } from '@/types/global';
  import { BlogList, deleteBlogApi, getBlogApi } from '@/api/blog';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // 默认封面
  const defaultCover = ref('');
  defaultCover.value = '/src/assets/slider/0.jpg';
  // 分页数据
  const page: QueryParams = reactive({
    page: 1,
    limit: 10,
    key: '', // 模糊查询
    sort: 'top_time desc,created_at desc', // 优先按照置顶时间进行降序排序，其次是发布时间降序排序。
  });

  const scroll = {
    x: 1500,
    // y: 200,
  };
  const columns: TableColumnData[] = [
    {
      title: '标题',
      dataIndex: 'title',
      fixed: 'left',
      align: 'center',
      width: 200,
    },
    {
      title: '摘要',
      dataIndex: 'abstract',
      align: 'center',
      ellipsis: true, // 省略超出的文本
      tooltip: true, // 鼠标经过显示省略的文本
      width: 200,
    },
    {
      title: '封面',
      dataIndex: 'cover',
      align: 'center',
      slotName: 'cover',
      width: 100,
    },
    {
      title: '作者',
      dataIndex: 'author',
      align: 'center',
      width: 100,
    },

    {
      title: '分类',
      dataIndex: 'category',
      align: 'center',
      width: 100,
    },
    {
      title: '标签',
      dataIndex: 'tags',
      align: 'center',
      slotName: 'tags',
      width: 200,
    },
    {
      title: '相关数据',
      dataIndex: 'read_num',
      align: 'center',
      slotName: 'read_num',
      width: 180,
    },
    {
      title: '是否发布',
      dataIndex: 'is_publish',
      align: 'center',
      slotName: 'is_publish',
      width: 100,
    },
    {
      title: '是否置顶',
      dataIndex: 'is_top',
      align: 'center',
      slotName: 'is_top',
      width: 100,
    },

    {
      title: '链接',
      dataIndex: 'link',
      fixed: 'right',
      align: 'center',
      slotName: 'link',
      width: 150,
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

  const renderData = ref<BlogList[]>([]);

  // 链接跳转
  const linkSkip = (link: any) => {
    // 路由跳转了那么博客也随之出现吗？
    // router.push(`/blog/${link}`);

    router.push({
      name: 'blog',
      params: { name: link },
    });
  };
  // 编辑表单
  const edit = (data: any) => {
    router.push({
      name: 'edit_blog',
      params: { id: data.id },
    });
  };

  const idList: Remove = reactive({
    id_list: [],
  });
  // 删除
  const isDelete = async (list: number) => {
    idList.id_list[idList.id_list.length] = list;

    const data = await deleteBlogApi(idList);

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

  // 管理员创建博客
  const addBlog = () => {
    router.push({ name: 'create_blog' });
  };

  // 总共几条数据
  const total = ref(0);

  // 请求数据
  const getData = async () => {
    try {
      // page limit
      const { data } = await getBlogApi(page);
      // 获取信息总条数，
      total.value = data.data.count;

      renderData.value = data.data.list;
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
    const data = await deleteBlogApi({ id_list: selectedKeys.value });
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
