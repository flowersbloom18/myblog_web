import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';

// 新增或修改的博客表单数据
export interface blogFormType {
  title: string;
  content: string;
  cover: string;
  is_publish: boolean;
  is_top: boolean;
  category_id: number;
  tags: number[];
}

// 博客列表数据
export interface blogList {
  id: number;
  title: string;
  abstract: string;
  content: string; // 暂且不需要
  cover: string;

  read_num: number;
  comment_num: number;
  like_num: number;
  collect_num: number;

  is_publish: boolean;
  is_top: boolean;
  top_time: string; // 暂且不需要

  category: string;
  tags: string[];

  author: string;
  link: string;

  created_at: string;
}

// 新增博客（请求体）
export function createBlogApi(data: blogFormType) {
  return Service.post('/api/blog', data);
}

// 根据id删除博客 （请求体）
export function deleteBlogApi(data: Remove) {
  return Service.delete('/api/blogs', { data });
}

// 根据id修改博客名称和封面 (url参数和请求体参数）
export function updateBlogApi(id: string | null, data: blogFormType) {
  return Service.put(`/api/blog/${id}`, data);
}

// 获取博客列表 (请求头）
export function getBlogApi(params: QueryParams) {
  return Service.get('/api/blogs', { params });
}

// 获取博客详情 (请求头）根据博客link--前台
export function getBlogDetailApi(link: string | null) {
  return Service.get(`/api/blog/detail/${link}`);
}

// 获取博客详情 (请求头）根据博客id--后台
export function getBlogContentApi(id: string | null) {
  return Service.get(`/api/blog/edit/${id}`);
}

// 博客点赞(请求头）根据博客id
export function createBlogLikeApi(id: number) {
  return Service.get(`/api/blog/like/${id}`);
}
