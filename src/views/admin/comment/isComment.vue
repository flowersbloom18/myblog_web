<template>
  <a-card title="评论列表">
    <a-space direction="vertical">
      <a-button type="primary" @click="checkAll">查看所用评论</a-button>
      <a-button type="primary" @click="checkAll"
        >123查看某一个博客下的评论</a-button
      >
      <a-button type="primary" @click="checkFriendLink"
        >查看友链页面的评论</a-button
      >
      <a-button type="primary" @click="checkAbout">查看关于页面的评论</a-button>

      <span style="color: red">我的评论</span>
    </a-space>
    <h1>评论组件</h1>
  </a-card>
  <!--
展示评论的思路是
  0、设置信息展示位置（昵称，头像，ip属地）
  1、查看面板id=0的所有评论
  2、查询面板id不为0且面板id等于当前评论的id，放到当前评论列表下
  3、展示子评论之间的关系
-->
  <span v-for="(value, key) in renderData" v-show="isOk" :key="key">
    <a-comment v-if="value.panel_id === 0">
      <template #avatar>
        <a-avatar :image-url="value.avatar"> </a-avatar>
      </template>
      <template #content>
        <span style="margin: 10px; font-size: 16px"> {{ value.content }}</span>
      </template>
      <template #author>
        <a-tag v-show="value.is_admin" color="arcoblue">博主</a-tag>
      </template>
      <template #datetime>
        <span style="color: var(--color-text-2); font-size: 14px">
          {{ value.nick_name }}
        </span>
      </template>

      <template #actions>
        <div style="padding-top: -20px">
          <span>{{ getFormatDate(value.created_at) }}</span>
          <span v-if="value.ip_address"
            >·&nbsp;IP&nbsp;属地{{ value.ip_address }}
          </span>
          <span class="action" @click="showReply1(key)">
            <IconMessage /> 回复
          </span>
          <span
            v-show="showDelete(key)"
            class="actionDelete"
            @click="deleteComment(key)"
            ><icon-delete /> 删除
          </span>
        </div>
      </template>

      <!--1评论回复组件-->
      <a-comment
        v-show="isOpen1(key)"
        align="right"
        :avatar="currentUserAvatar"
      >
        <template #actions>
          <a-button key="0" type="secondary" @click="cancel1"> 取消 </a-button>
          <a-button key="1" type="primary" @click="reply1"> 回复 </a-button>
        </template>
        <template #content>
          <a-input
            v-model="content1"
            :placeholder="placeholder"
            style="border: 2px solid #165dff; padding-left: 10px"
          />
        </template>
      </a-comment>
      <span v-for="(value2, key2) in renderData" :key="key2">
        <a-comment v-if="value2.panel_id !== 0 && value2.panel_id === value.id">
          <template #avatar>
            <a-avatar :image-url="value2.avatar"> </a-avatar>
          </template>
          <template #content>
            <span style="margin: 10px; font-size: 16px">
              {{ value2.content }}</span
            >
          </template>
          <template #author>
            <a-tag v-show="value2.is_admin" color="arcoblue">博主</a-tag>
          </template>
          <template #datetime>
            <span style="color: var(--color-text-2); font-size: 14px">
              <span v-if="value2.father_nick_name !== ''">
                {{ value2.nick_name }} ► {{ value2.father_nick_name }}
              </span>
              <span v-else>
                {{ value2.nick_name }}
              </span>
            </span>
          </template>

          <template #actions>
            <span>{{ getFormatDate(value2.created_at) }}</span>
            <span v-if="value2.ip_address"
              >·&nbsp;IP&nbsp;属地{{ value2.ip_address }}
            </span>
            <span class="action" @click="showReply2(key, key2)">
              <IconMessage /> 回复
            </span>
            <span
              v-show="showDelete(key2)"
              class="actionDelete"
              @click="deleteComment(key2)"
              ><icon-delete /> 删除
            </span>
          </template>
          <!--2评论回复组件-->
          <a-comment
            v-show="isOpen2(key, key2)"
            align="right"
            :avatar="currentUserAvatar"
          >
            <template #actions>
              <a-button key="0" type="secondary" @click="cancel2">
                取消
              </a-button>
              <a-button key="1" type="primary" @click="reply2"> 回复 </a-button>
            </template>
            <template #content>
              <a-input
                v-model="content2"
                :placeholder="placeholder"
                style="border: 2px solid #165dff; padding-left: 10px"
              />
            </template>
          </a-comment>
        </a-comment>
      </span>
    </a-comment>
  </span>
</template>

<script setup lang="ts">
  import {
    CommentFormType,
    CommentListType,
    createCommentApi,
    deleteCommentApi,
    getAboutCommentApi,
    getAllCommentApi,
    getFiendLinkCommentApi,
  } from '@/api/comment';
  import { reactive, ref } from 'vue';
  import getFormatDate from '@/utils/date';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';

  const isOk = ref(false);
  // 评论渲染的数据
  const renderData = ref<CommentListType[]>([]);
  // 请求评论数据
  const getData = async () => {
    try {
      const { data } = await getAllCommentApi();

      renderData.value = data.data.list;
      // 加载完成
      isOk.value = true;
    } catch (err) {
      Message.warning('数据数据请求出错');
    }
  };

  // 获取当前用户登录的信息
  const userStore = useUserStore();
  // 注意更新用户信息后的数据更新问题。
  // 展示评论头像
  const currentUserAvatar = ref();
  // 获取登录用户id
  const currentUserID = ref();
  // 获取登录用户的role
  const currentUserRole = ref();
  currentUserAvatar.value = userStore.userInfo.avatar;
  currentUserID.value = userStore.userInfo.user_id;
  currentUserRole.value = userStore.userInfo.role;

  // 评论回复按钮，控制显示
  const keyNumber0 = ref();
  const keyNumber1 = ref();
  const keyNumber2 = ref();
  const isOpen1 = (key: number) => {
    return key === keyNumber0.value;
  };
  const isOpen2 = (key1: number, key2: number) => {
    return key1 === keyNumber1.value && key2 === keyNumber2.value;
  };

  // 当前回复用户的@标识
  const placeholder = ref('');
  // 点击回复评论
  const showReply1 = (key: number) => {
    keyNumber0.value = key;

    keyNumber1.value = null;
    keyNumber2.value = null;

    placeholder.value = `@${renderData.value[key].nick_name}`;
  };

  const showReply2 = (key1: number, key2: number) => {
    keyNumber1.value = key1;
    keyNumber2.value = key2;

    keyNumber0.value = null;
    placeholder.value = `@${renderData.value[key2].nick_name}`;
  };
  // 判断页面类型,字符串转数字
  const pageType = (name: string) => {
    if (name === '博客') {
      return 1;
    }
    if (name === '友链') {
      return 2;
    }
    if (name === '关于') {
      return 3;
    }

    // 不存在
    return 0;
  };

  // 1、2级评论内容
  const content1 = ref('');
  const content2 = ref('');
  const form: CommentFormType = reactive({
    content: '',
    page_type: 0,
    page: '',
    father_id: 0,
    panel_id: 0,
  });

  // 真正回复，是否登录，否则需要登录
  // 并且，先考虑对已经存在的评论进行评论。
  // 之后在从空开始评论
  const reply1 = async () => {
    // 判断是否登录

    // 获取数据

    form.content = content1.value;
    form.page_type = pageType(renderData.value[keyNumber0.value].page_type);
    form.page = renderData.value[keyNumber0.value].page;
    form.father_id = 0;
    form.panel_id = renderData.value[keyNumber0.value].id;

    // 提交数据
    const data = await createCommentApi(form);
    Message.success(data.data.msg);
    // 清空表单======
    content1.value = '';
    await getData();
  };
  const cancel1 = () => {
    keyNumber0.value = null;
  };
  const reply2 = async () => {
    // 获取数据

    // form.content = '这是一条测试评论';
    form.content = content2.value;
    form.page_type = pageType(renderData.value[keyNumber2.value].page_type);
    form.page = renderData.value[keyNumber2.value].page;
    form.father_id = renderData.value[keyNumber2.value].id;
    form.panel_id = renderData.value[keyNumber2.value].panel_id;
    // 提交数据
    const data = await createCommentApi(form);
    Message.success(data.data.msg);
    // 清空表单======
    content2.value = '';
    await getData();
  };
  const cancel2 = () => {
    keyNumber1.value = null;
    keyNumber2.value = null;
  };

  // 删除评论
  const deleteComment = async (key: number) => {
    const data = await deleteCommentApi({
      id_list: [renderData.value[key].id],
    });
    Message.success(data.data.msg);
    await getData();
  };

  // 展示删除评论的按钮
  const showDelete = (key: number) => {
    // 如果当前登录用户的id=该评论行内容的id则可以
    if (currentUserID.value === renderData.value[key].user_id) {
      return true;
    }
    // 如果当前登录用户的权限=1最高权限，则可以删除
    return currentUserRole.value === 1;
  };

  // 请求评论数据
  const getDataFriendLink = async () => {
    try {
      const { data } = await getFiendLinkCommentApi();

      renderData.value = data.data.list;
      // 加载完成
      isOk.value = true;
    } catch (err) {
      Message.warning('数据数据请求出错');
    }
  };
  // 请求评论数据
  const getDataAbout = async () => {
    try {
      const { data } = await getAboutCommentApi();

      renderData.value = data.data.list;
      // 加载完成
      isOk.value = true;
    } catch (err) {
      Message.warning('数据数据请求出错');
    }
  };

  const checkAll = () => {
    isOk.value = false;
    getData();
  };
  const checkFriendLink = () => {
    isOk.value = false;
    getDataFriendLink();
  };
  const checkAbout = () => {
    isOk.value = false;
    getDataAbout();
  };

  getData();
</script>

<style scoped>
  .action {
    display: inline-block;
    padding: 0 4px;
    color: var(--color-text-1);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
  }
  .actionDelete {
    display: inline-block;
    padding: 0 4px;
    color: red;
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
  }
  .action:hover {
    background: var(--color-fill-3);
  }
</style>
