<template>
  <a-card>
    <h2 style="margin-left: 20px">分类下的博客数占比</h2>
    <div
      id="mainCategory"
      style="margin: 0 auto; width: 90%; height: 400px"
    ></div>
  </a-card>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { getCategoryApi } from '@/api/category';
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
  import { useAppStore } from '@/store';

  let renderData1 = reactive<string[]>([]);
  let renderData2 = reactive<{ name: string; value: string }[]>([]);
  const loading = ref(true);

  const getData = async () => {
    try {
      // 获取数量
      const data = await getCategoryApi();

      // 查询数据
      const data2 = await getCategoryApi({
        page: 1,
        limit: data.data.data.count,
      });
      // 获取需要的数据
      const result = data2.data.data.list;
      renderData1 = result.map((item: { category: any; blog_num: number }) => ({
        name: item.category.name,
      }));
      renderData2 = result.map((item: { category: any; blog_num: number }) => ({
        name: item.category.name,
        value: item.blog_num,
      }));

      // 加载完毕
      loading.value = false;
    } catch (err) {
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
      loading.value = !loading.value;
      theme1.value = 'dark';
    } else {
      // 激活加载
      loading.value = !loading.value;
      theme1.value = 'light';
    }
  });

  // 挂载，监控，才可成功
  watch(loading, () => {
    const myChart = echarts.init(
      document.getElementById('mainCategory') as HTMLElement,
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
        data: renderData1,
      },
      series: [
        {
          name: '分类名称',
          type: 'pie',
          radius: '55%',
          center: ['40%', '50%'],
          data: renderData2,
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
