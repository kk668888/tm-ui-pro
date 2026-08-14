import type { Dayjs } from 'dayjs';

/**
 * 查询表单字段值类型：ant 各筛选组件 v-model 的值的联合。
 * - input / select → string | number
 * - tree-select / cascader → string | number | (string|number)[]（ant 宽松接受数组）
 * - date-picker → Dayjs
 * - date-range → [Dayjs, Dayjs]
 * 统一收窄到显式联合，替代既往 Record<string, any>，保证字段值在编译期可追踪。
 */
export type FilterFieldValue =
  | string
  | number
  | boolean
  | Dayjs
  | [Dayjs, Dayjs]
  | FilterFieldValue[]
  | null
  | undefined;

/** 查询表单 model 的键值映射（宽松索引，字段名由 config 声明） */
export type FilterModel = Record<string, FilterFieldValue>;

export type FilterItemConfig =
  | {
      type: 'input' | 'select' | 'tree-select' | 'cascader' | 'date-picker';
      label?: string;
      name: string;
      /** 透传给 ant 组件的额外 props（placeholder / allowClear / options 等） */
      fieldProps?: Record<string, unknown>;
    }
  | {
      type: 'date-range';
      label?: string;
      name: [string, string];
      fieldProps?: Record<string, unknown>;
    };
