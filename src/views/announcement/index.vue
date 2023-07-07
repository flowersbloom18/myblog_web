<template>
  <a-card :bordered="false" :style="{ width: '100%', marginBottom: '20px' }">
    <a-row>
      <a-col :span="2" style="line-height: 28px">
        <span style="font-size: 16px"> 系统公告 </span>
      </a-col>
      <a-col :span="2" offset="20">
        <a-space>
          <a-button @click="onSave">
            <svg
              t="1688545539771"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="8848"
              width="26px"
              height="100%"
            >
              <path
                d="M919.466667 264.533333V832c0 46.933333-38.4 85.333333-85.333334 85.333333h-640c-46.933333 0-85.333333-38.4-85.333333-85.333333V192c0-46.933333 38.4-85.333333 85.333333-85.333333h567.466667c6.4 0 10.666667 2.133333 14.933333 6.4l136.533334 136.533333c4.266667 4.266667 6.4 8.533333 6.4 14.933333z"
                fill="#1890FF"
                p-id="8849"
              ></path>
              <path
                d="M322.133333 106.666667h384v213.333333h-384zM258.133333 640h512v277.333333h-512z"
                fill="#FFFFFF"
                p-id="8850"
              ></path>
              <path
                d="M599.466667 149.333333h64v128h-64zM364.8 725.333333h298.666667v21.333334h-298.666667zM364.8 810.666667h298.666667v21.333333h-298.666667z"
                fill="#69C0FF"
                p-id="8851"
              ></path>
            </svg>
            &nbsp;&nbsp;保存
          </a-button>
        </a-space>
      </a-col>
    </a-row>
  </a-card>

  <MdEditor
    v-model="aboutForm.content"
    style="height: 70vmin"
    :theme="theme1"
    preview-theme="default"
    code-theme="atom"
    show-code-row-number="true"
    :toolbars="toolBars"
  />
</template>

<script setup lang="ts">
  import { MdEditor, ToolbarNames } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { reactive, ref, watch } from 'vue';
  import { useAppStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';
  import {
    getAnnouncementApi,
    updateAnnouncementApi,
  } from '@/api/announcement';
  import { Notification } from '@arco-design/web-vue';

  // 全局提示
  const handleNotification = () => {
    Notification.info({
      title: '系统提示',
      content: '公告内容需要简单明了，输入文字内容即可!',
      duration: 5000,
      closable: true,
    });
  };
  handleNotification();

  // 获取路由转来的参数
  const router = useRouter();
  const aboutForm = reactive({
    content: '',
  });

  const appStore = useAppStore();
  // 编辑器的主题颜色
  const theme1 = ref();

  // 获取默认值，基本上只会执行一次
  if (appStore.theme === 'dark') {
    theme1.value = 'dark';
  } else {
    theme1.value = 'light';
  }

  // 监视 appStore 的变化,从而实现动态更换编辑器的背景颜色;
  watch(appStore, (newValue) => {
    if (newValue.theme === 'dark') {
      theme1.value = 'dark';
    } else {
      theme1.value = 'light';
    }
  });

  // 编辑器的工具栏
  const toolBars = [
    'bold',
    'underline',
    'italic',
    'title',
    'quote',
    'unorderedList',
    'orderedList',
    'link',

    '=',
    'pageFullscreen',
    'preview',
    'catalog',
  ] as ToolbarNames[];

  // 发布【修改各种数据】
  const getData = async () => {
    const { data } = await getAnnouncementApi();
    // 如果不为0则失败
    if (data.data.code) {
      Message.error(data.data.msg);
    } else {
      aboutForm.content = data.data.content;
    }
  };

  // 保存数据
  const onSave = async () => {
    // 开始提交
    const res = await updateAnnouncementApi(aboutForm);
    // 判断是否成功
    if (res.data.code) {
      // 如果不为0则失败
      Message.error(res.data.msg);
    } else {
      Message.success(res.data.msg);
    }
  };

  getData();
</script>

<style scoped lang="less">
  // 夜间模式的颜色配置
  .md-editor-dark {
    --md-bk-color: #333 !important;
  }
</style>
