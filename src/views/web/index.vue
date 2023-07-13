<template>
  <div class="base_view index_view">
    <NavBar />
    <!--    <GVBBanner></GVBBanner>-->
    <!--    <div class="gvb_base_container">-->
    <!--      <div class="gvb_inner_container gvb_index_main">-->
    <!--        <div class="left">-->
    <!--          <GVBNews></GVBNews>-->
    <!--          <GVBArticleCalendarCard style="margin-top: 20px"></GVBArticleCalendarCard>-->
    <!--          <GVBArticleList style="margin-top: 20px"></GVBArticleList>-->
    <!--        </div>-->
    <!--        <div class="right">-->
    <!--          <GVBAdvertCard></GVBAdvertCard>-->
    <!--          <GVBMyCard style="margin-top: 20px"></GVBMyCard>-->
    <!--          <GVBTagsCard style="margin-top: 20px"></GVBTagsCard>-->
    <!--          <GVBSiteCard style="margin-top: 20px"></GVBSiteCard>-->
    <!--          <GVBFadeBackCard style="margin-top: 20px"></GVBFadeBackCard>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <!--    <GVBFooter></GVBFooter>-->
  </div>
</template>

<script setup lang="ts">
  import NavBar from '@/components/web/navbar/index.vue';
  // import GVBNav from "@/components/gvb_nav.vue"
  // import GVBBanner from "@/components/gvb_banner.vue"
  // import GVBCCard from "@/components/gvb_card.vue"
  // import GVBNews from "@/components/index/gvb_news.vue"
  // import GVBArticleCalendarCard from "@/components/index/gvb_article_calendar.vue"
  // import GVBTagsCard from "@/components/index/gvb_tag_card.vue"
  // import GVBSiteCard from "@/components/index/gvb_site_card.vue"
  // import GVBFadeBackCard from "@/components/index/gvb_fade_back_card.vue"
  // import GVBAdvertCard from "@/components/index/gvb_advertis_card.vue"
  // import GVBMyCard from "@/components/index/gvb_my_card.vue"
  // import GVBFooter from "@/components/gvb_footer.vue"
  // import GVBArticleList from "@/components/index/gvb_article_list.vue"
</script>

<style lang="less">
  .index_view {
    .gvb_inner_container {
      display: flex;
      justify-content: space-between;
    }

    .gvb_index_main {
      .left {
        width: calc(100% - 416px);
      }

      .right {
        width: 396px;
      }
    }
  }
</style>
