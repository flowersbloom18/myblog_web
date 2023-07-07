import Service from '@/utils/service';

// 1 - 抖音热搜;
export interface douYinHotType {
  word: string; // 内容
  hotindex: number; // 热度
}
// 2 - 全网热搜
export interface allWebHotType {
  title: string; // 标题
  hotnum: number; // 热度
  digest: string; // 内容
}
// 3 - 微博热搜
export interface weiBoHotType {
  hotword: string; // 热度词
  hotwordnum: string; // 热度
  hottag: string; // 热度标签
}
// 4 - 每日简报
export interface everyDayInfoType {
  title: string; // 标题
  digest: string; // 内容
  mtime: string; // 日期
}
// 5 - 早安
export interface zaoAnInfoType {
  data: string; // 内容
}
// 6 - 晚安
export interface wanAnInfoType {
  data: string; // 内容
}
// 7 - 历史的今天
export interface historyDayInfoType {
  title: string; // 详情
  lsdate: string; // 日期
}

export function getDouYinHotApi() {
  return Service.get(`/api/info/1`);
}
export function getAllWebHotApi() {
  return Service.get(`/api/info/2`);
}
export function getWeiBoHotApi() {
  return Service.get(`/api/info/3`);
}
export function getEveryDayInfoApi() {
  return Service.get(`/api/info/4`);
}
export function getZaoAnInfoApi() {
  return Service.get(`/api/info/5`);
}
export function getWanAnInfoApi() {
  return Service.get(`/api/info/6`);
}
export function getHistoryDayInfoApi() {
  return Service.get(`/api/info/7`);
}
