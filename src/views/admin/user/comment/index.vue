<template>
  <a-card title="我的评论">
    <a-card v-show="empty" style="height: 200px; width: 100%; padding: 30px"
      ><a-empty
    /></a-card>
    <a-card class="acard" v-show="!empty">
      <span v-for="(value2, key2) in renderData" v-show="isOk" :key="key2">
        <a-comment>
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

              <a-link style="float: right" @click="skip(value2)">跳转</a-link>
              <span class="pageType"> {{ value2.page_type }}页面 </span>
            </span>
          </template>

          <template #actions>
            <span>{{ getFormatDate(value2.created_at) }}</span>
            <span v-if="value2.ip_address"
              >&nbsp;·&nbsp;IP&nbsp;属地{{ value2.ip_address }}
            </span>
            <span
              v-show="showDelete(key2)"
              class="actionDelete"
              @click="deleteComment(key2)"
              ><icon-delete /> 删除
            </span>
          </template>
        </a-comment>
      </span>
    </a-card>
  </a-card>
</template>

<script setup lang="ts">
  import {
    CommentListType,
    deleteCommentApi,
    getCurrentUserCommentApi,
  } from '@/api/comment';
  import { ref } from 'vue';
  import getFormatDate from '@/utils/date';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { useRouter } from 'vue-router';

  const isOk = ref(false);
  // 评论渲染的数据
  const renderData = ref<CommentListType[]>([]);

  const empty = ref(false);
  // 请求评论数据
  const getDataMine = async () => {
    try {
      const { data } = await getCurrentUserCommentApi();

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

  // 删除评论
  const deleteComment = async (key: number) => {
    const data = await deleteCommentApi({
      id_list: [renderData.value[key].id],
    });
    Message.success(data.data.msg);
    await getDataMine();
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

  const router = useRouter();
  const skip = (value: any) => {
    // 需要指定链接跳转的具体位置
    // 博客，友链，关于。
    if (value.page_type === '博客') {
      router.push({
        name: 'blog',
        params: { name: value.page },
      });
    } else if (value.page_type === '友链') {
      router.push({ name: 'friendlink_index' });
    } else if (value.page_type === '关于') {
      router.push({ name: 'about_index' });
    } else {
      Message.info('页面不存在');
    }
  };

  getDataMine();
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
  .acard {
    padding: 0 20% 0 20%;
  }
</style>
