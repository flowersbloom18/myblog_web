export default function parseToken(token: string) {
  const payload = token.split('.')[1];
  // escape 对字符串进行编码,这样就可以在所有的计算机上读取该字符串
  return JSON.parse(
    decodeURIComponent(
      escape(window.atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    )
  );
}
