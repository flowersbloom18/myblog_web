import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';

// 提交的数据类型
export interface musicFormType {
  name: string;
  author: string;
  cover: string;
  url: string;
  status: boolean;
  sort: number;
}

// 获取的表单
export interface MusicForm {
  id: number;
  name: string;
  author: string;
  cover: string;
  url: string;
  status: boolean;
  sort: number;
  created_at: string;

  artist?: string;
}

export interface MusicForm2 {
  name: string;
  artist: string;

  cover: string;
  url: string;
}

// 新增音乐
export function createMusicApi(data: musicFormType) {
  return Service.post('/api/music', data);
}

// 根据id删除音乐
export function deleteMusicApi(data: Remove) {
  return Service.delete('/api/music', { data });
}

// 根据id修改音乐 (url参数和请求体参数）
export function updateMusicApi(id: null | number, data: musicFormType) {
  return Service.put(`/api/music/${id}`, data);
}

// 获取音乐列表 (请求头）
export function getMusicApi(params?: QueryParams) {
  return Service.get('/api/music', { params });
}
