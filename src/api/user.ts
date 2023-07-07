import Service from '@/utils/service';
import qs from 'query-string';
import QueryParams, { Remove } from '@/types/global';

export interface LoginData {
  user_name: string;
  password: string;
}

export interface RegisterData {
  user_name: string;
  nick_name: string;
  password: string;
}

export interface AddUserData {
  user_name: string;
  nick_name: string;
  password: string;
  role: number | null;
}

export interface ForgetPasswordData {
  email: string;
  code: string;
  password: string;
}

export interface Email {
  email: string;
}

export interface EmailData {
  email: string;
  code: string;
}

export interface UserPolicyRecord {
  id: number;
  user_name: string;
  nick_name: string;
  email: string;
  avatar: string;
  role: string | null; // 模糊查询
  register_origin: string;
  ip: string;
  address: string;
  device: string;
  created_at: string;
}

export interface removeCollect {
  blogID: number;
}

// 用户登录
export function userLogin(data: LoginData) {
  return Service.post('/api/user_login', data);
}

// 用户注册
export function userRegister(data: RegisterData) {
  return Service.post('/api/register', data);
}

// 管理员创建用户
export function adminCreateUserApi(data: AddUserData) {
  return Service.post('/api/create_user', data);
}

// 用户忘记密码通过邮箱找回
export function userForgetPassword(data: ForgetPasswordData) {
  return Service.put('/api/user_forget_password', data);
}

// 用户绑定邮箱，通过邮箱，登录或重置密码。
export function userBindEmailApi(data: EmailData) {
  return Service.put('/api/user_bind_email', data);
}

// 退出登录
export function userLogout() {
  return Service.post('/api/logout');
}

// 获取用户列表
export function getUserList(params?: QueryParams) {
  return Service.get('/api/users', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 获取用户个人信息
export function getUserInfo() {
  return Service.get('/api/user_info');
}

// 获取用户收藏列表
export function getUserCollectApi() {
  return Service.get('/api/collect');
}

// 用户收藏和取消
export function getCollectApi(params: number) {
  return Service.post(`/api/collect/${params}`);
}

export interface UpdateRoleData {
  user_id: number | null;
  nick_name: string;
  role: number | null;
}

// 更新用户昵称或权限
export function userUpdateRoleApi(data: UpdateRoleData) {
  return Service.put('/api/update_role', data);
}

// 根据ID删除用户
export function removeUserApi(data: Remove) {
  return Service.delete('/api/users', { data });
}

export interface UpdateNickNameData {
  nick_name: string;
  avatar: string;
}

// 更新用户昵称或头像
export function userUpdateNickNameApi(data: UpdateNickNameData) {
  return Service.put('/api/update_nick_name', data);
}

export interface UpdatePwdData {
  old_pwd: string;
  pwd: string;
}

// 更新用户昵称或头像
export function userUpdatePwdApi(data: UpdatePwdData) {
  return Service.put('/api/update_password', data);
}
