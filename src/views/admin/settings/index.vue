<template>
  <div class="container">
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="站点信息">
            <SiteInfo />
          </a-tab-pane>
          <a-tab-pane key="2" title="邮箱信息">
            <EmailInfo />
          </a-tab-pane>
          <a-tab-pane key="3" title="七牛云信息">
            <QiniuyunInfo />
          </a-tab-pane>
          <a-tab-pane key="4" title="JWT信息">
            <JwtInfo />
          </a-tab-pane>
          <a-tab-pane key="5" title="上传信息">
            <UploadInfo />
          </a-tab-pane>
          <a-tab-pane key="6" title="TianAPI">
            <TianapiInfo />
          </a-tab-pane>
          <a-tab-pane key="7" title="JuheAPI">
            <JuheInfo />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import SiteInfo from '@/views/admin/settings/components/site-info.vue';
  import EmailInfo from '@/views/admin/settings/components/email-info.vue';
  import QiniuyunInfo from '@/views/admin/settings/components/qiniuyun-info.vue';
  import JwtInfo from '@/views/admin/settings/components/jwt-info.vue';
  import UploadInfo from '@/views/admin/settings/components/upload-info.vue';
  import TianapiInfo from '@/views/admin/settings/components/tianapi-info.vue';
  import JuheInfo from '@/views/admin/settings/components/juhe-info.vue';
</script>

<style scoped lang="less">
  .container {
    padding: 0 20px 20px 20px;
  }

  .wrapper {
    padding: 20px 0 0 20px;
    min-height: 580px;
    background-color: var(--color-bg-2);
    border-radius: 4px;
  }

  :deep(.section-title) {
    margin-top: 0;
    margin-bottom: 16px;
    font-size: 14px;
  }
</style>
