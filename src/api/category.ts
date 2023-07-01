import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';
import { AxiosRequestConfig } from 'axios';

export interface categoryType {
  name: string;
  cover: string;
}

export interface idName {
  id: number;
  name: string;
}

// 新增分类
export function uploadAttachment(data: categoryType) {
  return Service.post('/api/category', data); // 请求体
}

// 获取附件列表 (请求头）
export function getAttachment(params: QueryParams) {
  return Service.get('/api/attachment', { params });
}

// 根据id删除附件 （请求体）
export function deleteAttachment(data: Remove) {
  return Service.delete('/api/attachment', { data });
}

// 根据id修改附件名称
export function updateAttachment(data: idName) {
  return Service.put('/api/attachment', data);
}
