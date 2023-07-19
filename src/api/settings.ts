import Service from '@/utils/service';

export interface SiteInfoFormType {
  create_at: string;
  bei_an: string;
  title: string;
  logo_light: string;
  logo_dark: string;
  favicon: string;
  copyright_protocol: string;
  copyright_info: string;
  server_name: string;
  qq_image: string;
  gitee_url: string;
  github_url: string;
}
export interface EmailFormType {
  host: string;
  port: number;
  send_email: string;
  password: string;
  send_name: string;
  logo_email: string;
}
export interface QiNiuFormType {
  enable: boolean;
  access_key: string;
  secret_key: string;
  bucket: string;
  cdn: string;
  zone: string;
  prefix: string;
  size: number;
}
export interface JwtFormType {
  secret: string;
  expires: number;
  issuer: string;
}
export interface UploadFormType {
  size: number;
}
export interface TianApiFormType {
  Key: string;
  DouYinHot: string;
  NetWorkHot: string;
  WeiBoHot: string;
  BulletIn: string;
  ZaoAn: string;
  WanAn: string;
  LiShi: string;
}
export interface JuheFormType {
  Key: string;
}
// site email qiniu jwt upload tianapi juhe

// 获取-站点信息配置【不需要权限的，全局可调用】
export function getSiteInfoAllApi() {
  return Service.get('/api/settings/site1');
}

// 【以下都需要权限】

// 更新-站点信息配置
export function updateSiteInfoApi(data: SiteInfoFormType) {
  return Service.put(`/api/settings/site`, data);
}

// 获取和更新邮箱信息配置
export function getEmailInfoApi() {
  return Service.get('/api/settings/email');
}
export function updateEmailInfoApi(data: EmailFormType) {
  return Service.put(`/api/settings/email`, data);
}

// 获取和更新七牛云信息配置
export function getQiNiuYunInfoApi() {
  return Service.get('/api/settings/qiniu');
}
export function updateQiNiuYunInfoApi(data: QiNiuFormType) {
  return Service.put(`/api/settings/qiniu`, data);
}

// 获取和更新JWT信息配置
export function getJWTInfoApi() {
  return Service.get('/api/settings/jwt');
}
export function updateJWTInfoApi(data: JwtFormType) {
  return Service.put(`/api/settings/jwt`, data);
}

// 获取和更新上传信息配置
export function getUploadInfoApi() {
  return Service.get('/api/settings/upload');
}
export function updateUploadInfoApi(data: UploadFormType) {
  return Service.put(`/api/settings/upload`, data);
}

// 获取和更新Tian Api信息配置
export function getTianApiInfoApi() {
  return Service.get('/api/settings/tianapi');
}
export function updateTianApiInfoApi(data: TianApiFormType) {
  return Service.put(`/api/settings/tianapi`, data);
}

// 获取和更新Juhe Api信息配置
export function getJuheInfoApi() {
  return Service.get('/api/settings/juhe');
}
export function updateJuheInfoApi(data: JuheFormType) {
  return Service.put(`/api/settings/juhe`, data);
}
