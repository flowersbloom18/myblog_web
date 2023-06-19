import { loadEnv, mergeConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import baseConfig from './vite.config.base';

const env = loadEnv('development', process.cwd());
const baseUrl = env.VITE_API_BASE_URL;

export default mergeConfig(
  {
    mode: 'development',
    server: {
      port: 3000,
      proxy: {
        '/uploads': {
          target: baseUrl,
        },
        '/api': {
          target: baseUrl,
          changeOrigin: true, // 将请求头中的 Origin 设置为目标 URL
          cors: true, // 允许跨域请求。
        },
      },
    },
    plugins: [
      eslint({
        cache: false,
        include: ['src/**/*.ts', 'src/**/*.tsx', 'src/**/*.vue'],
        exclude: ['node_modules'],
      }),
    ],
  },
  baseConfig
);
