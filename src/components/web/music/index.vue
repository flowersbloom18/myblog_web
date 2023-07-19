<template>
  <div id="aplayer" style="color: #636b63; text-align: left"></div>
</template>

<script lang="ts" setup>
  // @ts-ignore
  import APlayer from 'aplayer';
  import 'aplayer/dist/APlayer.min.css';
  import { ref, onMounted, reactive, watch } from 'vue';
  import { getMusicApi, MusicForm, MusicForm2 } from '@/api/music';
  import useLoading from '@/hooks/loading';

  const { loading, setLoading } = useLoading();
  const playerRef = ref(null);
  let renderData = reactive<MusicForm[]>([]);
  const musicList = reactive<MusicForm2[]>([]);

  const getData = async () => {
    const data = await getMusicApi();
    const data2 = await getMusicApi({ page: 1, limit: data.data.data.count });
    renderData = data2.data.data.list;

    renderData.map((item) => {
      if (!item.status) {
        return;
      }
      const newItem = {
        name: item.name,
        artist: item.author,
        url: item.url,
        cover: item.cover,
      };
      musicList.push(newItem);
      // eslint-disable-next-line consistent-return
      return newItem;
    });
    setLoading(true);
  };
  getData();

  onMounted(() => {
    watch(loading, () => {
      playerRef.value = new APlayer({
        container: document.getElementById('aplayer'),
        theme: '#b6c7c7',
        listFolded: true, // 自动折叠列表
        // fixed: true, // 吸底
        audio: musicList.map((item) => ({
          name: item.name,
          artist: item.artist,
          url: item.url,
          cover: item.cover,
        })),
      });
    });
  });
</script>
