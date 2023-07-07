<template>
  <a-card>
    <h2 style="margin-left: 20px">标签下的博客数占比</h2>

    <div id="mainTag" style="margin: 0 auto; width: 90%; height: 400px"></div>
  </a-card>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as echarts from 'echarts/core';

  import {
    TitleComponent,
    TitleComponentOption,
    TooltipComponent,
    TooltipComponentOption,
    LegendComponent,
    LegendComponentOption,
  } from 'echarts/components';
  import { PieChart, PieSeriesOption } from 'echarts/charts';
  import { LabelLayout } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  import { getTagApi } from '@/api/tag';
  import theme from 'echarts/types/src/theme/dark';
  import { useAppStore } from '@/store';

  let renderData3 = reactive<string[]>([]);
  let renderData4 = reactive<{ name: string; value: string }[]>([]);
  const loading2 = ref(true);

  const getData = async () => {
    try {
      // 获取数量
      const data = await getTagApi();

      // 查询数据
      const data2 = await getTagApi({
        page: 1,
        limit: data.data.data.count,
      });
      // 获取需要的数据
      const result = data2.data.data.list;
      renderData3 = result.map((item: { tag: any; blog_num: number }) => ({
        name: item.tag.name,
        value: item.blog_num,
      }));
      renderData4 = result.map((item: { tag: any; blog_num: number }) => ({
        name: item.tag.name,
      }));

      // 加载完毕
      loading2.value = false;
    } catch (err) {
      Message.warning('1');
      Message.warning(err as string);
    }
  };

  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout,
  ]);

  type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
    | PieSeriesOption
  >;

  // 获取系统主题
  const appStore = useAppStore();
  // echarts的主题颜色
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
      // 激活加载
      loading2.value = !loading2.value;
      theme1.value = 'dark';
    } else {
      // 激活加载
      loading2.value = !loading2.value;
      theme1.value = 'light';
    }
  });

  // 监控，才可成功
  watch(loading2, () => {
    const myChart = echarts.init(
      document.getElementById('mainTag') as HTMLElement,
      theme1.value
    );
    myChart.setOption({
      title: {
        text: '',
        subtext: '',
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 10,
        top: 20,
        bottom: 20,
        data: renderData4,
      },
      series: [
        {
          name: '标签名称',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: renderData3,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    } as EChartsOption);
  });
  getData();
</script>

<style scoped lang="less"></style>
