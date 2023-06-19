import axios from 'axios';
import aes from '@/utils/aes';

const Service = axios.create({
  timeout: 7000,
  headers: {
    'Content-Type': 'application/json',
  },
});

Service.interceptors.request.use((request) => {
  const info = localStorage.getItem('userInfo');
  if (info === null) {
    return request;
  }
  // 一般用于用户的token
  let userInfo;
  try {
    // 解密
    userInfo = JSON.parse(aes.decrypt(info));
  } catch (e) {
    localStorage.removeItem('userInfo');
  }
  // @ts-ignore
  request.headers.token = userInfo.token;
  return request;
});

export default Service;
