<template>
  <a-card :bordered="false" :style="{ width: '100%', marginBottom: '20px' }">
    <a-row>
      <a-col :span="2" style="line-height: 28px">
        <span style="font-size: 16px"> 编辑博客 </span>
      </a-col>
      <a-col :span="6" offset="16">
        <a-space>
          <a-button @click="attachmentOpen">选择附件</a-button>
          <a-button @click="back">返回</a-button>
          <a-button @click="onPublish">
            <svg
              t="1688303853008"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="6353"
              width="26px"
              height="100%"
            >
              <path
                d="M211.649242 813.217191a425.984 425.984 0 1 0 602.421836-602.442865 425.984 425.984 0 1 0-602.421836 602.442865Z"
                fill="#00A0E9"
                p-id="6354"
              ></path>
              <path
                d="M266.3936 427.7248l422.5024-103.5776c20.4288-5.0176 37.5296 15.9744 28.4672 34.9696l-188.2112 395.1616c-9.728 20.3776-39.3728 18.432-46.2848-3.072l-48.0256-149.4016a25.06752 25.06752 0 0 1 5.2224-24.3712L522.1888 486.4c5.0176-5.5808-1.6896-13.9264-8.192-10.0864l-108.9024 63.5392a24.9856 24.9856 0 0 1-24.6272 0.3072L260.2496 473.8048c-19.8656-10.9568-15.9232-40.6528 6.144-46.08z"
                fill="#FFFFFF"
                p-id="6355"
              ></path>
            </svg>
            &nbsp;&nbsp;发布</a-button
          >
        </a-space>
      </a-col>
    </a-row>
  </a-card>

  <MdEditor
    v-model="blogForm.content"
    style="height: 70vmin"
    :theme="theme1"
    preview-theme="default"
    code-theme="atom"
    show-code-row-number="true"
    :toolbars="toolBars"
    @on-upload-img="onUploadImg"
  />

  <a-modal
    v-model:visible="visible"
    title="博客"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <a-form ref="formRef" :model="blogForm">
      <a-form-item
        field="title"
        label="标题"
        :rules="[
          {
            required: true,
            message: '请输入标题',
          },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input v-model="blogForm.title" placeholder="请输入标题" />
      </a-form-item>

      <a-form-item field="abstract" label="摘要">
        <a-textarea
          v-model="blogForm.abstract"
          show-word-limit
          :max-length="150"
          placeholder="请输入摘要"
          allow-clear
          auto-size
        >
          <template #suffix>
            <a-tooltip
              content="摘要，系统会根据博客自动生成，相对来说，自己写会更加美观"
              position="top"
            >
              <icon-info-circle />
            </a-tooltip>
          </template>
        </a-textarea>
      </a-form-item>

      <a-form-item field="cover" label="封面">
        <a-input v-model="blogForm.cover" placeholder="请输入封面" />
      </a-form-item>
      <span style="margin: -10px auto 10px">
        <a-image
          :src="blogForm.cover"
          width="200px"
          height="100px"
          alt="No Picture"
        />
      </span>

      <a-form-item field="category" label="分类">
        <a-auto-complete
          v-model="categoryName"
          :data="categoryData"
          placeholder="根据提示选择分类"
        >
          <template #suffix>
            <a-tooltip
              content="分类会根据输入内容预加载，根据提示选择即可，请注意分类要提前创建哟"
              position="top"
            >
              <icon-info-circle />
            </a-tooltip>
          </template>
        </a-auto-complete>
      </a-form-item>
      <a-form-item
        field="tags"
        label="标签"
        :rules="[
          {
            required: true,
            message: '请输入标签',
          },
        ]"
        :validate-trigger="['change', 'blur']"
      >
        <a-input-tag v-model="blogForm.tags" placeholder="请输入标签">
          <template #suffix>
            <a-tooltip content="点击回车即可创建" position="top">
              <icon-info-circle />
            </a-tooltip>
          </template>
        </a-input-tag>
      </a-form-item>
      <a-form-item field="is_publish" label="是否发布">
        <a-switch v-model="blogForm.is_publish" />
      </a-form-item>
      <a-form-item field="is_top" label="是否置顶">
        <a-switch v-model="blogForm.is_top" />
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

<script setup lang="ts">
  import { MdEditor, ToolbarNames } from 'md-editor-v3';
  import 'md-editor-v3/lib/style.css';
  import { getBlogContentApi, updateBlogApi } from '@/api/blog';
  import { reactive, ref, watch } from 'vue';
  import { useAppStore } from '@/store';
  import { getAttachment, uploadAttachment } from '@/api/attachment';
  import { getCategoryApi } from '@/api/category';
  import { Message } from '@arco-design/web-vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { useRoute, useRouter } from 'vue-router';
  import Attachment from '@/views/admin/attachment/index.vue';

  // 打开附件
  const isOpen = ref(false);
  const handleOK3 = () => {
    // 关闭
    isOpen.value = false;
  };
  const attachmentOpen = () => {
    isOpen.value = true;
  };

  // 获取路由转来的参数
  const route = useRoute();
  const router = useRouter();
  const id = ref('');
  id.value = route.params.id as string;

  const defaultCover = ref('');
  defaultCover.value = '/src/assets/images/blog-default-cover.jpg';
  const visible = ref(false);
  const blogForm = reactive({
    title: '',
    content: '',
    abstract: '', // 自己添加摘要，或系统添加（相对不美观）
    cover: '',
    is_publish: false,
    is_top: false,
    category_id: 0,
    tags: [],
  });
  // 表单最后的校验
  const formRef = ref<FormInstance>();

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
    'code',
    'link',
    'image',
    'table',
    '-',
    '=',
    'pageFullscreen',
    'preview',
    'catalog',
  ] as ToolbarNames[];

  // 获取博客详情
  const getBlogDetail = async () => {
    const { data } = await getBlogContentApi(id.value);
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
    blogForm.content = response.content;
    blogForm.title = response.title;
    blogForm.abstract = response.abstract;
    blogForm.cover = response.cover;
    blogForm.is_publish = response.is_publish;
    blogForm.is_top = response.is_top;
    blogForm.tags = response.tags;

    // eslint-disable-next-line no-use-before-define
    categoryName.value = response.category;
  };

  const attachmentURL = ref('');
  const getAttachmentUrl = async (targetString: string) => {
    // 1、附件xxxx已存在
    // 2、附件xxxx上传成功
    // 3、失败
    const a = targetString.split('附件')[1];
    const b = ref('');
    if (targetString.includes('已存在')) {
      // eslint-disable-next-line prefer-destructuring
      b.value = a.split('已存在')[0];
    } else if (targetString.includes('上传成功')) {
      // eslint-disable-next-line prefer-destructuring
      b.value = a.split('上传成功')[0];
    }

    const response = await getAttachment({ page: 1, limit: 1, key: b.value });
    // 如果没有包含http则是本地，需要加上/
    const { url } = response.data.data.list[0];
    if (!url.includes('http')) {
      attachmentURL.value = `/${url}`;
    } else {
      attachmentURL.value = url;
    }
  };

  // 支持图片上传，跟附件同样的功能，还多了裁剪上传。
  const onUploadImg = async (files: any[], callback: (arg0: any[]) => void) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('attachments', file);
          uploadAttachment(form)
            .then((res2) => rev(res2))
            .catch((error) => rej(error));
        });
      })
    );

    // 获取url数据并返回
    callback(
      await Promise.all(
        res.map(async (item: any): Promise<string> => {
          await getAttachmentUrl(item.data.data[0].msg);
          return attachmentURL.value;
        })
      )
    );
  };

  // 分类选择的数据
  const categoryName = ref('');
  const categoryData: string[] = reactive([]);
  // 根据分类名称获取id的数据
  const categoryData2 = reactive<Array<{ name: string; id: number }>>([]);

  // 获取分类ID,如果不存在要警报的【这里分类不允许新增】。
  const findIdByName = (name: string): boolean => {
    const category = categoryData2.find((item) => item.name === name) as {
      name: string;
      id: number;
    };
    // 如果存在则可以
    if (category) {
      blogForm.category_id = category.id;
      return true;
    }
    // 报错处理
    Message.warning('该分类不存在，请先创建然后选择');
    return false;
  };
  // 发布【修改各种数据】
  const onPublish = async () => {
    visible.value = true;
    // 默认封面
    if (!blogForm.cover) {
      blogForm.cover = defaultCover.value;
    }

    // 当不存在数据才会获取
    if (!categoryData.length) {
      // 目的是获取所有的分类，先查询分类数量，再全部查询所有。
      const { data } = await getCategoryApi();
      const { count } = data.data;

      const { data: data2 } = await getCategoryApi({ page: 1, limit: count });

      const { list } = data2.data;
      for (let i = 0; i < list.length; i += 1) {
        // 渲染数据
        categoryData.push(list[i].category.name);
        // id和name
        categoryData2.push({
          name: list[i].category.name,
          id: list[i].category.id,
        });
      }
    }
  };

  // 返回上一页
  const back = () => {
    router.back();
  };

  // 更新数据
  const handleOk = async () => {
    // 1、使用set集合去除标签重复的选项
    blogForm.tags = [...new Set(blogForm.tags)];

    // 2、获取到最终的分类ID，并判断是否合理
    if (!findIdByName(categoryName.value)) {
      visible.value = true;
    }

    // 3、验证表单
    const state = await formRef.value?.validate();
    // 如果存在响应结果，则说明数据错误
    if (state) {
      visible.value = true; // 目前无法解决，一出现错误，表格自动关闭，所以干脆直接开启。
      Message.warning('请输入完整信息！');
    } else {
      // 4、发送数据
      if (!blogForm.cover) {
        blogForm.cover = defaultCover.value;
      }

      // 开始提交
      const res = await updateBlogApi(id.value, blogForm);
      // 判断是否成功
      if (res.data.code) {
        // 如果不为0则失败
        // Message.error('信息修改失败');
        Message.error(res.data.msg);
        visible.value = false;
      } else {
        Message.success(res.data.msg);
        // 返回博客列表页面
        await router.push({ name: 'blog_list' });
        // 更新就返回了，不在此页面久留
        // await getBlogDetail();
      }
    }
  };
  const handleCancel = () => {
    visible.value = false;
  };

  getBlogDetail();
</script>

<style scoped lang="less">
  // 夜间模式的颜色配置
  .md-editor-dark {
    --md-bk-color: #333 !important;
  }
</style>
