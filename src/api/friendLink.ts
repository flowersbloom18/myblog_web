import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';

export interface friendLinkFormType {
  name: string;
  description: string;
  logo: string;
  url: string;
  is_top: boolean;
}

export interface friendLinkListForm {
  id: number;
  name: string;
  description: string;
  logo: string;
  url: string;
  is_top: boolean;
  created_at: string;
}

// 新增友链
export function createFriendLinkApi(data: friendLinkFormType) {
  return Service.post('/api/friendlink', data);
}

// 根据id删除友链
export function deleteFriendlinkApi(data: Remove) {
  return Service.delete('/api/friendlinks', { data });
}

// 根据id修改友链 (url参数和请求体参数）
export function updateFriendlinkApi(
  id: null | number,
  data: friendLinkFormType
) {
  return Service.put(`/api/friendlink/${id}`, data);
}

// 获取友链列表 (请求头）
export function getFriendlinkApi(params?: QueryParams) {
  return Service.get('/api/friendlinks', { params });
}
