<template>
  <a-card>
    <h2 style="margin-left: 20px">博客浏览量排名</h2>

    <div id="mainBlog" style="margin: 0 auto; width: 90%; height: 400px"></div>
  </a-card>
</template>

<script setup lang="ts">
  import { reactive, ref, watch } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import * as echarts from 'echarts/core';
  import { GridComponent, GridComponentOption } from 'echarts/components';
  import { LineChart, LineSeriesOption } from 'echarts/charts';
  import { UniversalTransition } from 'echarts/features';
  import { CanvasRenderer } from 'echarts/renderers';
  import { useAppStore } from '@/store';
  import { getBlogApi } from '@/api/blog';
  import { getDate } from '@/utils/date';

  let renderData1 = reactive<string[]>([]);
  let renderData4 = reactive<{ name: string; value: string; time: string }[]>(
    []
  );
  const loading2 = ref(true);

  const getData = async () => {
    try {
      // 获取数量
      const data = await getBlogApi({
        page: 1,
        limit: 10,
        sort: 'read_num desc', // 按照浏览量降序查询
      });

      // 获取需要的数据
      const result = data.data.data.list;
      renderData1 = result.map((item: any) => ({
        value: getDate(item.created_at),
      }));

      renderData4 = result.map((item: any) => ({
        name: item.title,
        value: item.read_num,
        time: getDate(item.created_at),
      }));

      // 加载完毕
      loading2.value = false;
    } catch (err) {
      Message.warning('1');
      Message.warning(err as string);
    }
  };

  echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition]);

  type EChartsOption = echarts.ComposeOption<
    GridComponentOption | LineSeriesOption
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
      document.getElementById('mainBlog') as HTMLElement,
      theme1.value
    );

    myChart.setOption({
      xAxis: {
        type: 'category',
        data: renderData1,
      },

      tooltip: {
        trigger: 'axis',
        formatter: '博客标题：{b} <br/> 访问量: {c} ',
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: renderData4,
          type: 'line',
          smooth: true,
          label: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 20,
            },
          },
        },
      ],
    } as EChartsOption);
  });
  // });
  getData();
</script>

<style scoped lang="less"></style>
