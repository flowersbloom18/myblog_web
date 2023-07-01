import Service from '@/utils/service';
import QueryParams, { nameCoverType, Remove } from '@/types/global';

// 新增分类（请求体）
export function createCategoryApi(data: nameCoverType) {
  return Service.post('/api/category', data);
}

// 根据id删除分类 （请求体）
export function deleteCategoryApi(data: Remove) {
  return Service.delete('/api/categories', { data });
}

// 根据id修改分类名称和封面 (url参数和请求体参数）
export function updateCategoryApi(id: null | number, data: nameCoverType) {
  return Service.put(`/api/category/${id}`, data);
}

// 获取分类列表 (请求头）
export function getCategoryApi(params: QueryParams) {
  return Service.get('/api/categories', { params });
}

// 根据分类获取所有博客
export function getCategoryBlogsApi(name: string) {
  return Service.get(`/api/category/${name}`);
}
