import Service from '@/utils/service';

// 关于
export interface aboutType {
  content: string;
}

// 获取关于信息
export function getAboutApi() {
  return Service.get(`/api/about`);
}

// 修改关于信息
export function updateAboutApi(data: aboutType) {
  return Service.post(`/api/about`, data);
}
