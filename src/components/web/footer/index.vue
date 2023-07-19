<template>
  <div class="footer">
    <div class="index">
      <div class="demo1">
        <a-space direction="vertical" fill>
          <div>{{ copyrightInfo }}</div>
          <div>
            <a-link style="color: #909399" href="https://beian.miit.gov.cn/">{{
              beiAn
            }}</a-link>
          </div>
          <div
            >本站点由<span
              v-for="(value, index) in imgList(serverName)"
              :key="index"
              style="margin: 10px auto"
            >
              <a-space>
                <a-image :src="value" alt="图片不存在" width="80px" />
              </a-space> </span
            >提供云服务</div
          >
        </a-space>
      </div>
      <div class="demo2">
        <a-space fill>
          <a-popover>
            <a-button style="width: 30px; background-color: var(--color-bg-2)">
              <a-link :href="github">
                <img
                  style="width: 30px"
                  src="../../../assets/images/GitHub.svg"
                  alt="qq"
                />
              </a-link>
            </a-button>
            <template #content>
              <p>点我跳转</p>
            </template>
          </a-popover>
          <a-popover>
            <a-button style="width: 30px; background-color: var(--color-bg-2)">
              <a-link :href="gitee">
                <img
                  style="width: 30px"
                  src="../../../assets/images/gitee.svg"
                  alt="qq"
                />
              </a-link>
            </a-button>
            <template #content>
              <p>点我跳转</p>
            </template>
          </a-popover>
          <a-popover>
            <a-button style="width: 30px; background-color: var(--color-bg-2)">
              <img
                style="width: 30px"
                src="../../../assets/images/QQ.svg"
                alt="qq"
              />
            </a-button>
            <template #content>
              <a-image width="200px" :src="qq"></a-image>
            </template>
          </a-popover>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { getSiteInfoAllApi } from '@/api/settings';
  import { ref } from 'vue';

  const beiAn = ref();
  const serverName = ref();
  const copyrightInfo = ref();
  const github = ref();
  const gitee = ref();
  const qq = ref();
  // 处理服务商图片信息
  const imgList = (data1: string) => {
    return data1?.split('---');
  };

  const getData = async () => {
    const { data } = await getSiteInfoAllApi();
    beiAn.value = data.data.bei_an;
    serverName.value = data.data.server_name;
    copyrightInfo.value = data.data.copyright_info;
    github.value = data.data.github_url;
    gitee.value = data.data.gitee_url;
    qq.value = data.data.qq_image;
  };

  getData();
</script>

<style lang="less">
  .footer {
    width: 100%;
    background-color: var(--color-bg-2);
    border-top: 1px solid var(--color-border);
    padding-top: 20px;
  }

  .index {
    margin: 0 auto;
    width: 1300px;
  }

  .demo1 {
    box-sizing: border-box;
    display: inline-block;
    color: #909399;
    padding-left: 40px;
    width: 400px;
  }

  .demo2 {
    height: 60px;
    display: inline-block;
    float: right;
    padding-right: 70px;
  }
</style>
