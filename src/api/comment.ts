import Service from '@/utils/service';
import { Remove } from '@/types/global';

// 评论表单
export interface CommentFormType {
  content: string;
  page_type: number;
  page: string;
  father_id: number;
  panel_id: number;
}

// 评论列表数据
export interface CommentListType {
  id: number;
  created_at: string;
  content: string;
  page_type: string;
  page: string;
  is_admin: string;
  father_id: number;
  panel_id: number;

  user_id: number;
  ip_address: string;
  nick_name: string;
  avatar: string;

  father_nick_name: string;
}

// 新增评论
export function createCommentApi(data: CommentFormType) {
  return Service.post('/api/comment', data);
}

// 获取所有评论
export function getAllCommentApi() {
  return Service.get('/api/comments');
}

// 获取【某一个】博客下的所有评论
export function getBlogCommentApi(params: { key: string }) {
  return Service.get('/api/comments_blog', { params });
}

// 获取友链下的所有评论
export function getFiendLinkCommentApi() {
  return Service.get('/api/comments_friendlink');
}

// 获取关于下的所有评论
export function getAboutCommentApi() {
  return Service.get('/api/comments_about');
}

// 获取当前登录用户的所有评论
export function getCurrentUserCommentApi() {
  return Service.get('/api/comments_user');
}

// 获取当前评论开关的状态
export function getCommentStatusApi() {
  return Service.get('/api/comment_open');
}

// 修改当前评论开关的状态
export function updateCommentApi(data: { is_open: boolean }) {
  return Service.put('/api/comment_open', data);
}

// 根据id删除评论
export function deleteCommentApi(data: Remove) {
  return Service.delete('/api/comments', { data });
}
