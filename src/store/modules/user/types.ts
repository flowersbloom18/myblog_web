export type RoleType = 0 | 1 | 2 | 3;

export interface UserInfoState {
  token?: string;
  nick_name?: string;
  role?: RoleType; // 1 管理员  2 普通用户  3 游客  0其它
  user_id?: number;
  avatar?: string;
  exp?: number; // 过期时间
}
