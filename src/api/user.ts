import Service from '@/utils/service';

export interface LoginData {
  user_name: string;
  password: string;
}

export interface RegisterData {
  user_name: string;
  nick_name: string;
  password: string;
}

export interface ForgetPasswordData {
  email: string;
  code: string;
  password: string;
}

export interface Email {
  email: string;
}

//
// export interface LoginRes {
//   token: string;
// }

// 用户登录
export function userLogin(data: LoginData) {
  return Service.post('/api/user_login', data);
}

// 用户注册
export function userRegister(data: RegisterData) {
  return Service.post('/api/register', data);
}

// 用户忘记密码通过邮箱找回
export function userForgetPassword(data: ForgetPasswordData) {
  // data = ""
  return Service.put('/api/user_forget_password', data);
  // const email = '2437560114@qq.com';
  // return Service.put('/api/user_forget_password', email);
}

// 退出登录
export function userLogout() {
  return Service.post('/api/logout');
}

export function getUserInfo() {
  // return Service.post<UserState>('/api/user/info');
}

export function getMenuList() {
  // return Service.post<RouteRecordNormalized[]>('/api/user/menu');
}
