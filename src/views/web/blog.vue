<template>
  <div class="container">
    <div class="main">
      <div class="left">
        <div class="about">
          <div class="header">
            <h2>{{ blogForm.title }}</h2>
          </div>
          <div class="info">
            <a-list :bordered="false">
              <a-list-item v-for="idx in 1" :key="idx">
                <a-list-item-meta>
                  <template #title>{{ blogForm.author }}</template>
                  <template #description>
                    <a-space>
                      <template #split>/</template>
                      <span>{{ getDate(blogForm.created_at) }}</span>
                      <span>{{ blogForm.read_num }}&nbsp;阅读</span>
                      <span>{{ blogForm.comment_num }}&nbsp;评论</span>
                      <span>{{ blogForm.like_num }}&nbsp;点赞</span>
                      <span>{{ blogForm.collect_num }}&nbsp;收藏</span>
                    </a-space>
                  </template>
                  <template #avatar>
                    <a-avatar>
                      <img alt="avatar" :src="blogForm.avatar" />
                    </a-avatar>
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </div>
          <div style="width: 860px; margin: 0 auto; height: 30px">
            <a-divider />
          </div>

          <div class="content">
            <div class="fixed">
              <a-space direction="vertical" :size="40">
                <a-badge :count="blogForm.comment_num">
                  <a-button
                    shape="circle"
                    class="btn1"
                    size="large"
                    @click="skipComment"
                  >
                    <span><icon-message /></span>
                  </a-button>
                </a-badge>

                <a-badge :count="blogForm.like_num" max-count="999">
                  <a-button
                    shape="circle"
                    class="btn1"
                    size="large"
                    @click="like(blogForm.id)"
                  >
                    <span><icon-thumb-up /></span>
                  </a-button>
                </a-badge>

                <a-badge :count="blogForm.collect_num">
                  <a-button
                    shape="circle"
                    class="btn1"
                    size="large"
                    @click="collect(blogForm.id)"
                  >
                    <span v-if="isCollect"><icon-star-fill /></span>

                    <span v-else><icon-star /></span>
                  </a-button>
                </a-badge>

                <a-button
                  shape="circle"
                  class="btn1"
                  size="large"
                  @click="toTop"
                >
                  <span><icon-to-top /></span>
                </a-button>
              </a-space>
            </div>

            <MdPreview
              :editor-id="blogForm.link"
              :model-value="blogForm.content"
              :theme="theme1"
            />
          </div>
          <a-back-top
            target-container="content"
            :style="{ position: 'absolute' }"
          />
        </div>

        <Comment v-if="loading" class="comment" :link="link" />
      </div>
      <div class="right">
        <a-card class="border" style="margin-bottom: 20px">
          <div>
            <img class="img" :src="blogForm.cover" alt="cover" />
          </div>
          <div class="shadow"></div>

          <a-card class="card-bg" style="border: none" align="center">
            <a-space direction="vertical">
              <a-avatar style="width: 66px; height: 66px">
                <img alt="avatar" :src="blogForm.avatar" />
              </a-avatar>

              <div class="author">{{ blogForm.author }}</div>
              <div style="color: var(--color-text-1)"
                >韶光易逝，愿君惜取少年时。</div
              >
            </a-space>
          </a-card>

          <a-card style="border: none" align="center">
            <a-space direction="vertical">
              <template #split>
                <div
                  style="width: 70%; border: 1px solid rgba(30, 3, 3, 0.05)"
                ></div>
              </template>
              <a-space>
                <template #split>
                  <a-divider direction="vertical" />
                </template>
                <a-space direction="vertical" align="center">
                  <span class="font1">{{ categoryCount }}</span>
                  <span class="font2">分类数</span>
                </a-space>
                <a-space direction="vertical" align="center">
                  <span class="font1">{{ blogCount }}</span>
                  <span class="font2">博客数</span>
                </a-space>
                <a-space direction="vertical" align="center">
                  <span class="font1">{{ commentCount }}</span>
                  <span class="font2">评论数</span>
                </a-space>
              </a-space>

              <a-space>
                <template #split>
                  <a-divider />
                </template>

                <a-popover>
                  <a-button
                    style="width: 30px; background-color: var(--color-bg-2)"
                  >
                    <a-link :href="github">
                      <img
                        style="width: 30px"
                        src="../../assets/images/GitHub.svg"
                        alt="qq"
                      />
                    </a-link>
                  </a-button>
                  <template #content>
                    <p>点我跳转</p>
                  </template>
                </a-popover>
                <a-popover>
                  <a-button
                    style="width: 30px; background-color: var(--color-bg-2)"
                  >
                    <a-link :href="gitee">
                      <img
                        style="width: 30px"
                        src="../../assets/images/gitee.svg"
                        alt="qq"
                      />
                    </a-link>
                  </a-button>
                  <template #content>
                    <p>点我跳转</p>
                  </template>
                </a-popover>
                <a-popover>
                  <a-button
                    style="width: 30px; background-color: var(--color-bg-2)"
                  >
                    <img
                      style="width: 30px"
                      src="../../assets/images/QQ.svg"
                      alt="qq"
                    />
                  </a-button>
                  <template #content>
                    <a-image width="200px" :src="qq"></a-image>
                  </template>
                </a-popover>
              </a-space>
            </a-space>
          </a-card>
        </a-card>
        <!--移动的最终偏移量距离顶部80px-->
        <a-affix :offset-top="80">
          <a-card title="目录" class="border">
            <MdCatalog
              :editor-id="blogForm.link"
              :scroll-element="scrollElement"
              :theme="theme1"
            />
          </a-card>
        </a-affix>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { MdPreview, MdCatalog } from 'md-editor-v3';
  // preview.css相比style.css少了编辑器那部分样式
  import 'md-editor-v3/lib/preview.css';
  import { reactive, ref, watch } from 'vue';
  import { useAppStore } from '@/store';
  import { getDate } from '@/utils/date';
  import Comment from '@/components/web/comment/blog/index.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { createBlogLikeApi, getBlogApi, getBlogDetailApi } from '@/api/blog';
  import { Message } from '@arco-design/web-vue';
  import { getAllCommentApi } from '@/api/comment';
  import { getCategoryApi } from '@/api/category';
  import { getSiteInfoAllApi } from '@/api/settings';
  import { getCollectApi, getUserCollectApi } from '@/api/user';
  import { isLogin } from '@/utils/auth';
  import useLoading from '@/hooks/loading';

  // 是否被收藏。
  const isCollect = ref(false);
  const scrollElement = document.documentElement;
  // 获取路由转来的参数
  const route = useRoute();
  const router = useRouter();
  const name = ref('');
  name.value = route.params.name as string;

  const github = ref();
  const gitee = ref();
  const qq = ref();
  const blogForm = reactive({
    id: 0,
    title: '',
    abstract: '',
    content: '',
    cover: '',

    read_num: 0,
    comment_num: 0,
    like_num: 0,
    collect_num: 0,

    is_publish: false,
    is_top: false,
    top_time: '',

    category: '',
    tags: [],

    author: '',
    avatar: '',
    link: '',

    created_at: '',
  });

  const collectList = async () => {
    // 未登录就不用查找。
    if (!isLogin()) return;

    const { data } = await getUserCollectApi();
    const result = data.data.list;

    if (result?.length) {
      result.forEach((item: any) => {
        if (item.id === blogForm.id) {
          isCollect.value = true;
        }
      });
    }
  };

  const { loading, setLoading } = useLoading();
  const link = ref('');
  // 获取博客详情(只会在初次访问被调用，用于阅读时+1)
  const getBlogDetail = async () => {
    const { data } = await getBlogDetailApi(name.value);
    // 如果数据不存在则定向到404
    if (data.code) {
      // 警告信息
      Message.warning(data.msg);

      // 跳转到404页面
      await router.push({ name: 'notFound' });
      return;
    }

    const response = data.data[0];

    // 写入表单
    blogForm.id = response.id;
    blogForm.title = response.title;
    blogForm.abstract = response.abstract;
    blogForm.content = response.content;
    blogForm.cover = response.cover;
    blogForm.read_num = response.read_num;
    blogForm.comment_num = response.comment_num;
    blogForm.like_num = response.like_num;
    blogForm.collect_num = response.collect_num;
    blogForm.is_publish = response.is_publish;
    blogForm.is_top = response.is_top;
    blogForm.top_time = response.top_time;
    blogForm.category = response.category;
    blogForm.tags = response.tags;
    blogForm.author = response.author;
    blogForm.avatar = response.avatar;
    blogForm.link = response.link;
    blogForm.created_at = response.created_at;

    // 获取收藏列表。
    await collectList();

    setLoading(true);

    link.value = response.link;
  };

  const appStore = useAppStore();

  // 预览器的主题颜色
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

  const blogCount = ref(0);
  const commentCount = ref(0);
  const categoryCount = ref(0);

  const getData = async () => {
    try {
      const { data } = await getSiteInfoAllApi();
      github.value = data.data.github_url;
      gitee.value = data.data.gitee_url;
      qq.value = data.data.qq_image;

      const data3 = await getBlogApi();
      const data4 = await getAllCommentApi();
      const data5 = await getCategoryApi();
      blogCount.value = data3.data.data.count; // 博客总个数
      commentCount.value = data4.data.data.count; // 评论量
      categoryCount.value = data5.data.data.count; // 分类数
    } catch (err) {
      Message.warning('获取数据出错');
    }
  };

  const like = async (id: number) => {
    blogForm.like_num += 1;

    // 打包延迟上传。
    const { data } = await createBlogLikeApi(id);
    Message.success(data.msg);
  };

  const collect = async (id: number) => {
    // 先登录
    if (!isLogin()) {
      Message.info('请登录后再收藏');
      return;
    }

    // 已经收藏和未搜藏。
    const { data } = await getCollectApi(id);
    Message.success(data.msg);

    isCollect.value = data.msg === '收藏博客成功';
    if (data.msg === '收藏博客成功') {
      blogForm.collect_num += 1;
    } else {
      blogForm.collect_num -= 1;
    }
  };

  const skipComment = () => {
    const component = document.querySelector('.comment');
    if (component) {
      component.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toTop = () => {
    const component = document.querySelector('.container');
    if (component) {
      component.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 获取全局博客数量等。
  getData();
  // 博客详情
  getBlogDetail();
</script>

<style lang="less" scoped>
  .shadow {
    position: absolute;
    width: 90%;
    top: 136px;
    box-shadow: 0px -18px 16px 9px rgba(0, 0, 0, 0.2);
  }
  .font1 {
    font-weight: 500;
    font-size: 22px;
  }
  .font2 {
    font-size: 13px;
  }
  .img {
    padding: 0;
    border-radius: 15px 15px 0 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 120px;
    -o-object-fit: cover;
    object-fit: cover;
  }

  .card-bg {
    background-color: #f3f5f405;
    margin-top: 20px;
  }
  .author {
    color: #4964f7;
    margin-bottom: 10px;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    text-shadow: 1px 1px 8px #4964f7;
  }
  .border {
    border-radius: 15px;
    border: 1px solid rgba(30, 3, 3, 0.15);
  }
  .about {
    color: var(--color-text-2);

    .header {
      text-align: center;
    }
    .info {
      //float: right;
      margin-right: 20px;
      margin-bottom: 5px;
    }

    .content {
      position: relative;
      width: 100%;

      .fixed {
        position: fixed;
        top: 260px;
        margin-left: -70px;
        z-index: 10;

        .btn1 {
          font-size: 20px;
          border: 1px solid rgba(30, 3, 3, 0.2);
          background-color: var(--color-bg-2);
        }
        .btn1:hover {
          background-color: rgba(78, 171, 171, 0.11);
        }
      }
    }
  }
  .container {
    height: auto !important;
    //background-color: var(--color-bg-2);
    background-color: #a193932b;
    background-image: linear-gradient(
        90deg,
        rgba(60, 10, 30, 0.04) 3%,
        transparent 0
      ),
      linear-gradient(1turn, rgba(60, 10, 30, 0.04) 3%, transparent 0);
    background-size: 20px 20px;
    background-position: 50%;
    background-repeat: repeat;

    .main {
      width: 1200px;
      margin: 0 auto;
      display: flex;

      .left {
        //background-color: var(--color-bg-2);
        width: 880px;

        margin: 20px 0 20px 0;

        .about {
          background-color: var(--color-bg-2);
          border: 1px solid rgba(30, 3, 3, 0.2);
          border-radius: 15px;
        }

        .comment {
          margin-top: 20px;
          border: 1px solid rgba(30, 3, 3, 0.2);
          border-radius: 15px;
        }
      }

      .right {
        position: relative;
        width: 300px;
        height: 100%;
        padding: 0 10px 0 10px;
        //background-color: var(--color-bg-2);
        margin: 20px 0 20px 10px;
        //border: 1px solid red;
      }
    }
  }
</style>
