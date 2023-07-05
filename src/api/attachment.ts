import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';
import { AxiosRequestConfig } from 'axios';

export interface idName {
  id: number;
  name: string;
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

// 上传附件
export function uploadAttachment(
  formData: any,
  config?: AxiosRequestConfig<any> | undefined
) {
  return Service.post('/api/attachment', formData, config);
}
