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
  key: string;
  role?: string | null;
  image_type?: number | null;
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
