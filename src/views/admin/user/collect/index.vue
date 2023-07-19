<template>
  <div class="container">
    <a-card class="general-card" title="我的收藏">
      <a-table
        class="a-table"
        :columns="columns"
        :data="renderData"
        :pagination="false"
        :scroll="scroll"
        row-key="id"
      >
        <template #cover="{ rowIndex }">
          <img :src="renderData[rowIndex].cover" alt="" style="width: 50px" />
        </template>

        <!--配合插槽来使用-->
        <template #link="{ rowIndex }">
          <a-link icon @click="linkSkip(renderData[rowIndex].link)"
            >点击跳转
          </a-link>
        </template>

        <template #operation="{ rowIndex }">
          <a-popconfirm
            content="确认取消吗?"
            type="warning"
            ok-text="确认"
            cancel-text="取消"
            @ok="isDelete(renderData[rowIndex].id)"
          >
            <a-button type="primary" status="danger" style="width: 60px"
              >取消收藏
            </a-button>
          </a-popconfirm>
        </template>
      </a-table>
      <a-space direction="vertical" fill="true" size="large" align="center">
        <div style="margin-top: 10px">共 {{ total }} 条</div>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { getCollectApi, getUserCollectApi } from '@/api/user';
  import { reactive, ref, UnwrapRef } from 'vue';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const scroll = {
    x: 1360,
  };
  const columns: TableColumnData[] = [
    {
      title: '博客标题',
      dataIndex: 'title',
      fixed: 'left',
      align: 'center',
      width: 100,
    },
    {
      title: '博客摘要',
      dataIndex: 'abstract',
      align: 'center',
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
      title: '阅读数量',
      dataIndex: 'read_num',
      align: 'center',
      width: 80,
    },
    {
      title: '评论数量',
      dataIndex: 'comment_num',
      align: 'center',
      width: 80,
    },
    {
      title: '点赞数量',
      dataIndex: 'like_num',
      align: 'center',
      width: 80,
    },
    {
      title: '收藏数量',
      dataIndex: 'collect_num',
      align: 'center',
      width: 80,
    },
    {
      title: '博客链接',
      dataIndex: 'link',
      fixed: 'right',
      align: 'center',
      slotName: 'link',
      width: 100,
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

  const renderData = ref([]);
  const router = useRouter();
  // 删除收藏
  const isDelete = async (blogID: number) => {
    const data = await getCollectApi(blogID);
    if (data.data.code) {
      Message.error(data.data.msg);
      return;
    }
    Message.success(data.data.msg);
    // eslint-disable-next-line no-use-before-define
    await fetchData();
  };

  const linkSkip = (link: any) => {
    router.push({
      name: 'blog',
      params: { name: link },
    });
  };

  // 总共几条数据
  const total = ref(0);

  // 请求数据
  const fetchData = async () => {
    try {
      const { data } = await getUserCollectApi();

      const result = data.data.list;
      // 获取信息总条数，
      total.value = data.data.count;

      renderData.value = result;
    } catch (err) {
      // 一般错误都为序列化失败，说明登录过期了。
      // 还有可能是其它错误
      Message.error('数据获取出错！');
    }
  };
  fetchData();
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
