<template>
  <a-card class="general-card" title="附件">
    <a-row>
      <a-col :flex="1">
        <a-form
          :model="params"
          :label-col-props="{ span: 7 }"
          :wrapper-col-props="{ span: 16 }"
          label-align="left"
        >
          <a-row :gutter="12">
            <a-col :span="6">
              <a-form-item field="key" label="查询附件">
                <a-input v-model="params.key" placeholder="请输入附件名称" />
              </a-form-item>
            </a-col>
            <a-col :span="6">
              <a-form-item field="image_type" label="存储位置">
                <a-select
                  v-model="params.image_type"
                  :options="locationOptions"
                  :placeholder="$t('请选择存储位置')"
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
        <a-space direction="vertical" :style="{ width: '100%' }">
          <a-upload :custom-request="customRequest" multiple />
        </a-space>
      </a-col>
    </a-row>
  </a-card>

  <a-card :bordered="false">
    <a-card-grid
      v-for="(value, key) in renderData"
      :key="key"
      :style="{ width: '24%', margin: '0 10px 10px 0' }"
    >
      <a-card>
        <div class="name"> <icon-file />&nbsp;&nbsp;{{ value.name }} </div>
        <a-row class="grid-demo" justify="start">
          <a-col :span="4"></a-col>
          <a-col :span="8">
            <a-button type="primary" status="success" @click="getDetail(value)">
              <template #icon>
                <icon-find-replace />
              </template>
              详情
            </a-button>
          </a-col>
          <a-col :span="8">
            <a-popconfirm
              content="确认删除吗?"
              type="warning"
              ok-text="确认"
              cancel-text="取消"
              @ok="deleteDetail(value)"
            >
              <a-button type="primary" status="danger">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-col>
          <a-col :span="4"></a-col>
        </a-row>

        <!--根据不同类型渲染不同内容-->
        <template #cover>
          <span v-if="value.type.includes('image')">
            <div class="actions">
              <a-tag color="arcoblue">
                <template #icon>
                  <icon-image />
                </template>
                图片
              </a-tag>
            </div>

            <a-image
              width="100%"
              height="200px"
              alt="图片不存在"
              :src="`/${value.url}`"
              fit="cover"
              show-loader
            >
            </a-image>
          </span>

          <span v-else-if="value.type.includes('audio')">
            <div class="actions">
              <a-tag color="arcoblue">
                <template #icon>
                  <icon-music />
                </template>
                音乐
              </a-tag>
            </div>

            <a-image
              alt="图片不存在1"
              width="100%"
              height="200px"
              :src="music"
              fit="cover"
              show-loader
            />
          </span>
          <span v-else-if="value.type.includes('video')">
            <div class="actions">
              <a-tag color="arcoblue">
                <template #icon>
                  <icon-file-video />
                </template>
                视频
              </a-tag>
            </div>
            <a-image
              width="100%"
              height="200px"
              alt="图片不存在2"
              :src="video"
              fit="cover"
              show-loader
            />
          </span>
        </template>
      </a-card>
    </a-card-grid>
  </a-card>
  <!--分页信息-->
  <a-card :bordered="false">
    <a-space direction="vertical" fill="true" size="large" align="center">
      <div style="height: 10px"></div>
      <a-pagination
        v-model:page-size="params.limit"
        v-model:current="params.page"
        :total="total"
        show-total
        size="medium"
        @change="changePage"
        @page-size-change="changeLimit"
      />
    </a-space>
  </a-card>

  <!--抽屉-->
  <a-drawer
    :width="550"
    :visible="visible"
    ok-text="修改附件名称"
    unmount-on-close
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title> 附件详情</template>
    <div>
      <img v-if="isImage" class="attachment" :src="detail[2].value" alt="" />
      <video
        v-else
        class="attachment"
        :src="`${detail[2].value}`"
        controls
      ></video>
    </div>
    <!--audio-->
    <div>
      <a-descriptions
        :data="detail"
        size="large"
        :align="{ label: 'left', value: 'left' }"
        :column="1"
      >
        <template #value="{ value, data }">
          <a-tag v-if="data.label === '上传时间'" color="green" size="big">
            {{ getFormatDate(data.value) }}
          </a-tag>
          <a-typography-paragraph
            v-else-if="data.label === '附件链接'"
            type="primary"
            copyable
            :bold="true"
          >
            {{ data.value }}
          </a-typography-paragraph>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </div>
  </a-drawer>

  <!--修改附件名称-->
  <a-modal
    v-model:visible="visible2"
    title="修改附件名称"
    @cancel="handleCancel2"
    @ok="handleOk2"
  >
    <a-form ref="formRef" :model="form">
      <a-form-item
        field="name"
        label="附件名称"
        :rules="[
          {
            required: true,
            message: '请输入附件名称',
          },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="form.name" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
  import QueryParams, { Remove } from '@/types/global';
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import {
    deleteAttachment,
    getAttachment,
    idName,
    updateAttachment,
    uploadAttachment,
  } from '@/api/attachment';
  import getFormatDate from '@/utils/date';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import axios from 'axios';

  const music = '/src/assets/images/attachment-music.png';
  const video = '/src/assets/images/attachment-video.png';
  // 查询参数
  const params: QueryParams = reactive({
    page: 1,
    limit: 8,
    key: '',
    image_type: null,
  });
  // 总共几条数据
  const total = ref(0);
  const renderData = ref([]);

  const { protocol } = window.location; // 获取协议
  const { hostname } = window.location; // 获取域名
  const { port } = window.location; // 获取端口号
  // 复制的时候需要，针对本地文件
  const fullUrl = `${protocol}//${hostname}${port ? `:${port}` : ''}/`;

  // 获取数据
  const getData = async () => {
    try {
      const response = await getAttachment(params);
      const { data } = response.data;

      total.value = data.count;
      renderData.value = data.list;
    } catch (err) {
      Message.error('数据获取出错！');
    }
  };

  const visible2 = ref(false);
  const form: idName = reactive({
    id: 0,
    name: '',
  });
  const formRef = ref<FormInstance>();
  const handleCancel2 = () => {
    visible2.value = false;
  };

  // 抽屉
  const visible = ref(false);
  const handleOk = () => {
    visible2.value = true;
  };
  const handleCancel = () => {
    visible.value = false;
  };

  // 附件详情
  const detail = ref([
    {
      label: '附件名称',
      value: '',
    },
    {
      label: '附件类型',
      value: '',
    },
    {
      label: '附件链接',
      value: '',
    },
    {
      label: '附件大小',
      value: '',
    },
    {
      label: '存储位置',
      value: '',
    },
    {
      label: '上传时间',
      value: '',
    },
  ]);

  // 上传地址
  const locationOptions = [
    {
      value: 1,
      label: '本地',
    },
    {
      value: 2,
      label: '七牛云',
    },
  ];
  // 删除附件数据
  const idList: Remove = reactive({
    id_list: [],
  });

  // 判断是否为照片，来切换不同组件
  const isImage = ref(false);

  const getDetail = async (value: any) => {
    visible.value = true;
    // 如果类型包含图片，则使用图片，否则为音频组件
    if (value.type.includes('image')) {
      isImage.value = true;
    }
    detail.value[0].value = value.name;
    detail.value[1].value = value.type;
    // 判断附件是远程还是本地
    if (value.url.includes('http')) {
      detail.value[2].value = value.url;
    } else {
      detail.value[2].value = fullUrl + value.url;
    }
    detail.value[3].value = value.size;
    detail.value[4].value = value.image_type;
    detail.value[5].value = value.created_at;

    form.id = value.id;
    form.name = value.name;
  };

  // 发送修改数据
  const handleOk2 = async () => {
    // 表单校验
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible2.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 开始提交
      const res = await updateAttachment(form);

      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        Message.error(res.data.msg);
      } else {
        Message.success(res.data.msg);
        await getData();

        // 异步更新表单信息，提升用户体验
        await getDetail({
          id: form.id,
          name: form.name,
          type: detail.value[1].value,
          url: detail.value[2].value,
          size: detail.value[3].value,
          image_type: detail.value[4].value,
          created_at: detail.value[5].value,
        });
        visible2.value = false;
      }
    }
  };

  // 上传操作
  const customRequest = async (option: {
    onProgress: any;
    onError: any;
    onSuccess: any;
    fileItem: any;
  }) => {
    const { onProgress, onError, onSuccess, fileItem } = option;

    const config = {
      onUploadProgress: (progressEvent: {
        lengthComputable: any;
        loaded: number;
        total: number;
      }) => {
        let percent = 0;
        if (progressEvent.lengthComputable) {
          percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        }
        onProgress(percent, progressEvent);
      },
    };

    const formData = new FormData();
    formData.append('attachments', fileItem.file);
    try {
      // 数据和进度
      const uploadResponse = await uploadAttachment(formData, config);

      const { data } = uploadResponse;

      if (!data.code) {
        // 文件上传成功
        if (data.data[0].is_success) {
          onSuccess(data.data.msg);
          Message.success(data.data[0].msg);
        } else {
          Message.warning(data.data[0].msg);
          onError(data.msg);
        }
      } else {
        // 失败
        Message.warning(data.msg);
      }
    } catch (err) {
      // 异常
      Message.error(err as string);
    } finally {
      // 需要异步刷新后稍等片刻关闭表单。
      await getData();
    }
  };

  const deleteDetail = async (value: any) => {
    try {
      idList.id_list[0] = value.id;
      const response = await deleteAttachment(idList);
      const { code, msg } = response.data;
      if (code) {
        Message.error(msg);
      } else {
        Message.success(msg);
      }
      await getData();
    } catch (err) {
      Message.error('数据获取出错！');
    }
  };

  // 分页信息同步
  const changePage = (_page: number) => {
    params.page = _page;
    getData();
  };
  const changeLimit = (_limit: any) => {
    params.limit = _limit;
    params.page = 1; // 数量转换的话需要重置页码
    getData();
  };

  const search = () => {
    getData();
  };

  const reset = () => {
    params.key = '';
    params.image_type = null;
    getData();
  };

  getData();
</script>

<style scoped>
  a-card {
    color: var(--color-fill-2);
  }

  .attachment {
    width: 100%;
    height: 300px;
  }

  .actions {
    position: absolute;
    left: 10px;
    top: 10px;
    z-index: 99;
  }

  .name {
    //height: 20px; font-size: 16px; margin-bottom: 6px;
  }
</style>
