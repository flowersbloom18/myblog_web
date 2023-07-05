import Service from '@/utils/service';

// 公告
export interface announcementType {
  content: string;
}

// 获取公告信息
export function getAnnouncementApi() {
  return Service.get(`/api/announcement`);
}

// 修改公告信息
export function updateAnnouncementApi(data: announcementType) {
  return Service.post(`/api/announcement`, data);
}
