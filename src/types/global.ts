export interface AnyObject {
  [key: string]: unknown;
}

// Vue 3 的类型声明文件
declare module 'vue' {
  export function ref<T>(value: T): { value: T };

  export function reactive<T extends object>(raw: T): T;
}

// 分页查询参数
export default interface QueryParams {
  page: number;
  limit: number;
  key?: string; // 模糊查询关键字
  role?: string | null;
  image_type?: number | null; // 照片类型
  sort?: string | null; // 排序方式
}

// 批量删除
export interface Remove {
  id_list: number[];
}

// 分类、标签的名称和封面(create、update)
export interface nameCoverType {
  name: string;
  cover: string;
}

// 表单渲染(分类、标签）
export interface FormRecord {
  id: number;
  name: string;
  cover: string;
  created_at: string;
  blog_num: number;
}

// 标签的随机颜色
export const Colors = [
  'orangered',
  'blue',
  'purple',
  'arcoblue',
  'green',
  'orange',
  'gold',
  'lime',
  'cyan',
  'pinkpurple',
  'magenta',
  'gray',
];

// 产生随机的颜色
export const RandomColor = () => {
  const randomIndex = Math.floor(Math.random() * Colors.length);
  return Colors[randomIndex];
};
