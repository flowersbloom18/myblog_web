import Service from '@/utils/service';
import QueryParams, { nameCoverType, Remove } from '@/types/global';

// 新增标签（请求体）
export function createTagApi(data: nameCoverType) {
  return Service.post('/api/tag', data);
}

// 根据id删除标签 （请求体）
export function deleteTagApi(data: Remove) {
  return Service.delete('/api/tags', { data });
}

// 根据id修改标签名称和封面 (url参数和请求体参数）
export function updateTagApi(id: null | number, data: nameCoverType) {
  return Service.put(`/api/tag/${id}`, data);
}

// 获取标签列表 (请求头）
export function getTagApi(params?: QueryParams) {
  return Service.get('/api/tags', { params });
}

// 根据标签获取所有博客
export function getTagBlogsApi(name: string) {
  return Service.get(`/api/tag/${name}`);
}
