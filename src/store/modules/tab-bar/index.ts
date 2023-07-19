import { defineStore } from 'pinia';
import { DEFAULT_ROUTE, DEFAULT_ROUTE_NAME } from '@/router/constants';
import { TabBarState, TagProps } from './types';

const useAppStore = defineStore('tabBar', {
  state: (): TabBarState => ({
    cacheTabList: new Set([DEFAULT_ROUTE_NAME]),
    tagList: [DEFAULT_ROUTE],
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList;
    },
    getCacheList(): string[] {
      return Array.from(this.cacheTabList);
    },
  },
});

export default useAppStore;
