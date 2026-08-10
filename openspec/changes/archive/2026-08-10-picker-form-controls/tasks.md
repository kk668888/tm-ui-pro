## 1. 基础设施

- [x] 1.1 新增 `packages/ui/src/composables/useReadonlyLock.ts`：接收 props + formContext + `{ searchable }`，输出 `{ isReadonly, antProps }`（disabled `??` 级联、readonly→open:false/allowClear:false/showSearch:false）
- [x] 1.2 为 useReadonlyLock 编写单测：readonly 锁闭、disabled 级联、searchable 分支、无 context 容错
- [x] 1.3 回填 `Select.vue`：删除内联只读块改用 useReadonlyLock，`Select.spec.ts` 全绿、行为零回归
- [x] 1.4 `packages/ui/package.json` 显式声明 `dayjs` 依赖（版本对齐 ant 所用），供 TmDatePicker 直接 import

## 2. 组件实现

- [x] 2.1 TmDatePicker：`props.ts`（TmDatePickerProps = DatePickerProps & { modelValue?: Dayjs | string; valueFormat?: string }）+ `DatePicker.vue`（Dayjs 直通默认、valueFormat 时 string↔Dayjs 双向桥接、useReadonlyLock、disabled 级联、能力/插槽透传）
- [x] 2.2 TmRangePicker：区间 `modelValue: [Dayjs,Dayjs] | [string,string]`，valueFormat 对起止日期成对转换、任一端为空容错返回空对
- [x] 2.3 TmCascader：`Cascader.vue`（modelValue↔value 桥接、options/fieldNames 透传、useReadonlyLock、disabled 级联）
- [x] 2.4 TmTreeSelect：`TreeSelect.vue`（modelValue↔value 桥接、treeData/fieldNames 透传、useReadonlyLock、disabled 级联）
- [x] 2.5 4 个控件统一遵循 Boolean prop 默认值陷阱规避：withDefaults 显式兜底 + disabled/readonly 置 undefined

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 4 控件 install 注册 + 组件/类型 export（含 valueFormat 扩展类型）
- [x] 3.2 `packages/ui/src/resolver.ts` 追加 4 控件按需导入映射
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 4. 测试

- [x] 4.1 每控件 `__tests__/*.spec.ts`：v-model 桥接、valueFormat 有/无双模式、readonly 锁弹层不可开、disabled 级联（含 TmForm 包裹）、方法透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%

## 5. 文档

- [x] 5.1 每控件 `demos/*.vue` + `apps/docs/components/{date-picker,cascader,tree-select}.md`（DemoBlock + <<< 引用）
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏并入「表单 / 数据展示」分组
