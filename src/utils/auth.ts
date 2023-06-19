import aes from '@/utils/aes';
import { Message } from '@arco-design/web-vue';

const TOKEN_KEY = 'token';

// 过期检测
// 判断登录状态【真假】
const isLogin = () => {
  let userInfo;
  const info = localStorage.getItem('userInfo');
  if (info === null) {
    return false;
  }
  try {
    // 解密
    userInfo = JSON.parse(aes.decrypt(info));
  } catch (e) {
    Message.warning('当前登录已失效-err');
    localStorage.removeItem('userInfo');
    return false;
  }
  const { exp } = userInfo;
  if (exp === undefined) {
    Message.warning('当前登录已失效-exp');
    localStorage.removeItem('userInfo');
    return false;
  }
  const nowTime = new Date().getTime();
  if (exp * 1000 - nowTime < 0) {
    // 过期了
    // Message.warning('当前登录已失效');
    Message.warning('当前登录已失效,请重新登录');
    localStorage.removeItem('userInfo');
    return false;
  }
  return true;
};

const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export { isLogin, getToken, setToken, clearToken };
