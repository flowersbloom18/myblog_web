import { defineStore } from 'pinia';
import { userLogin, userLogout, LoginData, getUserInfo } from '@/api/user';
import { setToken, clearToken } from '@/utils/auth';
import { removeRouteListener } from '@/utils/route-listener';
import aes from '@/utils/aes';
import { Message } from '@arco-design/web-vue';
import { UserLoginInfoState } from './types';
// import useAppStore from '../app';

const useUserStore = defineStore('user', {
  state: (): UserLoginInfoState => ({
    token: '',
    nick_name: '',
    role: 0, // 1 管理员  2 普通用户  3 游客 0 其它（无权限）
    user_id: 0,
    avatar: '',
    exp: 1687051125.841,
  }),

  getters: {
    userInfo(state: UserLoginInfoState): UserLoginInfoState {
      return { ...state };
    },
  },

  actions: {
    // 修改userInfo
    setUserInfo(info: UserLoginInfoState) {
      this.$patch(info); // 修改数据
      // 持久化--安全性较低。
      // localStorage.setItem('userInfo', JSON.stringify(info));

      // 加密存储
      const encrypts = aes.encrypt(JSON.stringify(info));
      localStorage.setItem('userInfo', encrypts);
    },
    loadUserInfo() {
      const info = localStorage.getItem('userInfo');
      if (info === null) {
        return;
      }
      // 先json解析
      let userInfo;
      try {
        // 解密
        userInfo = JSON.parse(aes.decrypt(info));
      } catch (e) {
        localStorage.removeItem('userInfo');
        return;
      }
      const { exp } = userInfo;
      if (exp === undefined) {
        localStorage.removeItem('userInfo');
        return;
      }
      const nowTime = new Date().getTime();
      if (exp * 1000 - nowTime < 0) {
        // 过期了
        Message.warning('当前登录已失效,请重新登录');
        localStorage.removeItem('userInfo');
        return;
      }
      this.setUserInfo(userInfo);
    },
    switchRoles() {
      // return new Promise((resolve) => {
      //   this.role = this.role === 'user' ? 'admin' : 'user';
      //   resolve(this.role);
      // });
      // return new Promise((resolve) => {
      //   this.role = this.role === 2 ? 1 : 2;
      //   resolve(this.role);
      // });
    },
    // Set user's information
    setInfo(partial: Partial<UserLoginInfoState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      // const res = await getUserInfo();
      //
      // this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const res = await userLogin(loginForm);
        setToken(res.data.token);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      // const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      // appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
