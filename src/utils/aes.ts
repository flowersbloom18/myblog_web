import CryptoJS from 'crypto-js';

export default {
  // 随机生成指定数量的16进制key
  generateKey(num: number) {
    const library =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < num; i++) {
      const randomPoz = Math.floor(Math.random() * library.length);
      key += library.substring(randomPoz, randomPoz + 1);
    }
    return key;
  },

  // 加密
  encrypt(word: string) {
    const keyStr = 'abcdsxyzhkj12345'; // 判断是否存在ksy，不存在就用定义好的key
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const srcs = CryptoJS.enc.Utf8.parse(word);
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  // 解密
  decrypt(word: string) {
    const keyStr = 'abcdsxyzhkj12345';
    const key = CryptoJS.enc.Utf8.parse(keyStr);
    const decrypt = CryptoJS.AES.decrypt(word, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
  },
};
