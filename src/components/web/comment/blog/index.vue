<template>
  <div class="comment">
    <a-textarea
      v-model="commentValue"
      class="input"
      placeholder="善语结善缘，恶言伤人心"
      allow-clear
      auto-size
      max-length="999"
    />
    <a-row style="margin-bottom: 10px">
      <a-col :span="2" :offset="22">
        <span>
          <a-button type="primary" @click="reply">提交</a-button>
        </span>
      </a-col>
    </a-row>

    <a-card v-show="empty" style="height: 200px; width: 100%; padding: 30px"
      ><a-empty
    /></a-card>

    <a-card v-show="!empty" class="acard">
      <span v-for="(value, key) in renderData" v-show="isOk" :key="key">
        <a-comment v-if="value.panel_id === 0">
          <template #avatar>
            <a-avatar :image-url="value.avatar"> </a-avatar>
          </template>
          <template #content>
            <span style="margin: 10px; font-size: 16px">
              {{ value.content }}</span
            >
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
                >&nbsp;·&nbsp;IP&nbsp;属地{{ value.ip_address }}
              </span>
              <span class="action" @click="showReply1(key)">
                <IconMessage /> 回复
              </span>
              <a-popconfirm
                content="确认删除吗?"
                type="warning"
                ok-text="确认"
                cancel-text="取消"
                @ok="deleteComment(key)"
              >
                <span v-show="showDelete(key)" class="actionDelete"
                  ><icon-delete /> 删除
                </span>
              </a-popconfirm>
            </div>
          </template>

          <!--1评论回复组件-->
          <a-comment
            v-show="isOpen1(key)"
            align="right"
            :avatar="currentUserAvatar"
          >
            <template #actions>
              <a-button key="0" type="secondary" @click="cancel1">
                取消
              </a-button>
              <a-button key="1" type="primary" @click="reply1"> 回复 </a-button>
            </template>
            <template #content>
              <a-input
                v-model="content1"
                @change="focusConfirm"
                :placeholder="placeholder"
                style="border: 2px solid #165dff; padding-left: 10px"
              />
            </template>
          </a-comment>
          <span v-for="(value2, key2) in renderData" :key="key2">
            <a-comment
              v-if="value2.panel_id !== 0 && value2.panel_id === value.id"
            >
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
                  >&nbsp;·&nbsp;IP&nbsp;属地{{ value2.ip_address }}
                </span>
                <span class="action" @click="showReply2(key, key2)">
                  <IconMessage /> 回复
                </span>
                <a-popconfirm
                  content="确认删除吗?"
                  type="warning"
                  ok-text="确认"
                  cancel-text="取消"
                  @ok="deleteComment(key2)"
                >
                  <span v-show="showDelete(key2)" class="actionDelete"
                    ><icon-delete /> 删除
                  </span>
                </a-popconfirm>
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
                  <a-button key="1" type="primary" @click="reply2">
                    回复
                  </a-button>
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
    </a-card>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { isLogin } from '@/utils/auth';
  import { useRouter } from 'vue-router';
  import {
    CommentFormType,
    CommentListType,
    createCommentApi,
    deleteCommentApi,
    getAboutCommentApi,
    getBlogCommentApi,
  } from '@/api/comment';
  import getFormatDate from '@/utils/date';
  import { useUserStore } from '@/store';

  const router = useRouter();
  const commentValue = ref('');

  // 在这里添加 props 部分
  const props = defineProps({
    link: String,
  });
  // const props = defineProps(['isTrue', 'email2', 'case']); // 判断是否可以发送

  const form: CommentFormType = reactive({
    content: '',
    page_type: 1,
    page: props.link as string,
    father_id: 0,
    panel_id: 0,
  });

  // 数据是否存在
  const empty = ref(false);
  // 是否获取到数据
  const isOk = ref(false);
  // 评论渲染的数据
  const renderData = ref<CommentListType[]>([]);

  // 请求评论数据
  const getDataAbout = async () => {
    try {
      const { data } = await getBlogCommentApi({ key: props.link as string });
      // 如果数据存在，则获取数据。
      if (data.data.count !== 0) {
        empty.value = false;
      } else {
        empty.value = true;
        isOk.value = false;
        return;
      }
      renderData.value = data.data.list;
      // 加载完成
      isOk.value = true;
    } catch (err) {
      Message.warning('数据数据请求出错');
    }
  };

  const reply = async () => {
    if (!isLogin()) {
      Message.info('请登录后在进行评论！');
      await router.push({ name: 'login' });
      return;
    }

    if (commentValue.value.length === 0) {
      Message.info('请输入有效内容');
    } else {
      form.content = commentValue.value;
      form.father_id = 0;
      form.panel_id = 0;
      // 提交数据
      const data = await createCommentApi(form);
      Message.success(data.data.msg);

      // 提交后清空表单
      commentValue.value = '';

      await getDataAbout();
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

  // input获取焦点
  const inputRef = ref(null);
  const focusConfirm = () => {
    const inputElement = inputRef.value as HTMLInputElement | null;
    if (inputElement) {
      inputElement.focus();
    }
  };
  // 点击回复评论，判断回复需要先看用户是否登录。
  const showReply1 = (key: number) => {
    if (!isLogin()) {
      Message.info('您还未登录，请先登录。');
      return;
    }
    keyNumber0.value = key;

    keyNumber1.value = null;
    keyNumber2.value = null;

    focusConfirm();

    placeholder.value = `@${renderData.value[key].nick_name}`;
  };

  const showReply2 = (key1: number, key2: number) => {
    if (!isLogin()) {
      Message.info('您还未登录，请先登录。');
      return;
    }
    keyNumber1.value = key1;
    keyNumber2.value = key2;

    keyNumber0.value = null;
    placeholder.value = `@${renderData.value[key2].nick_name}`;
  };

  // 1、2级评论内容
  const content1 = ref('');
  const content2 = ref('');

  // 真正回复，是否登录，否则需要登录
  // 并且，先考虑对已经存在的评论进行评论。
  // 之后在从空开始评论
  const reply1 = async () => {
    // 判断是否登录

    // 获取数据

    form.content = content1.value;
    form.page = renderData.value[keyNumber0.value].page;
    form.father_id = 0;
    form.panel_id = renderData.value[keyNumber0.value].id;

    // 提交数据
    const data = await createCommentApi(form);
    Message.success(data.data.msg);
    // 清空表单======
    content1.value = '';
    await getDataAbout();
  };
  const cancel1 = () => {
    keyNumber0.value = null;
  };
  const reply2 = async () => {
    // 获取数据

    // form.content = '这是一条测试评论';
    form.content = content2.value;
    form.page = renderData.value[keyNumber2.value].page;
    form.father_id = renderData.value[keyNumber2.value].id;
    form.panel_id = renderData.value[keyNumber2.value].panel_id;
    // 提交数据
    const data = await createCommentApi(form);
    Message.success(data.data.msg);
    // 清空表单======
    content2.value = '';
    await getDataAbout();
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
    await getDataAbout();
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

  getDataAbout();
</script>

<style lang="less" scoped>
  .comment {
    background-color: var(--color-bg-2);
    padding: 20px;
    border: 1px solid rgba(30, 3, 3, 0.2);

    .input {
      border: 1px solid rgba(30, 3, 3, 0.2);
      margin-bottom: 20px;
    }
  }

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
    transition: all 0.3s ease;
  }
  .action:hover {
    background: var(--color-fill-3);
  }
  .pageType {
    display: inline-block;
    padding: 0 4px;
    color: var(--color-text-2);
    line-height: 24px;
    background: transparent;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease;
    font-size: 14px;
    float: right;
  }
</style>
