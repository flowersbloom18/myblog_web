import Service from '@/utils/service';
import QueryParams, { Remove } from '@/types/global';

// 获取日志的表单
export interface LogForm {
  id: number;
  user_name: string;
  nick_name: string;
  email: string;
  ip: string;
  address: string;
  device: string;
  level: string;
  content: string;
  created_at: string;
}

// 根据id删除日志
export function deleteLogApi(data: Remove) {
  return Service.delete('/api/log', { data });
}

// 获取日志列表 (请求头）
export function getLogApi(params?: QueryParams) {
  return Service.get('/api/log', { params });
}
