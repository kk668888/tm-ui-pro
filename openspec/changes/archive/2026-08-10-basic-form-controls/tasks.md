## 1. 骨架与共享装配

- [x] 1.1 为 4 个组件创建目录骨架：`components/{radio-group,checkbox-group,switch,input-number}/{index.ts,src/,demos/,__tests__/}`（index.ts 用 withInstall 包装，src 含 props.ts / defaults.ts / 组件 vue）
- [x] 1.2 每个组件 `defaults.ts` 定义公司默认值常量（size / bordered / allowClear 等，沿用 Input/Select 惯例）

## 2. 组件实现

- [x] 2.1 TmRadioGroup：`props.ts`（TmRadioGroupProps = RadioGroupProps & { modelValue? }）+ `RadioGroup.vue`（modelValue↔value 桥接、options/插槽透传、disabled `??` 级联、readonly→disabled、useForwardRef 方法透传）
- [x] 2.2 TmCheckboxGroup：同构于 RadioGroup，值类型为数组，支持复选增删与 options 透传
- [x] 2.3 TmSwitch：`Switch.vue`（modelValue↔checked 桥接、checkedValue/unCheckedValue 透传、disabled `??` 级联、readonly→disabled）
- [x] 2.4 TmInputNumber：`InputNumber.vue`（modelValue↔value 桥接、min/max/precision/formatter/parser 透传、readonly 原生透传、disabled 级联）
- [x] 2.5 4 个组件统一遵循 Boolean prop 默认值陷阱规避：withDefaults 对 ant 默认 true 项显式兜底、对 disabled/readonly 显式置 undefined 保证 `??` 级联落空

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 4 组件 install 注册 + 组件/类型 export（含 props 类型）
- [x] 3.2 `packages/ui/src/resolver.ts` 追加 4 组件按需导入映射（TmRadioGroup/TmCheckboxGroup/TmSwitch/TmInputNumber）
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，es/lib 双格式产物与 .d.ts 类型声明正确

## 4. 测试

- [x] 4.1 每组件 `__tests__/*.spec.ts`：v-model 双向桥接、options 渲染、disabled/readonly 级联（含 TmForm 包裹场景）、方法透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%，新增组件纳入现有 coverage 校验

## 5. 文档

- [x] 5.1 每组件 `demos/*.vue` + `apps/docs/components/{radio-group,checkbox-group,switch,input-number}.md`（DemoBlock 内嵌、<<< 引用 demo）
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏并入「基础组件 / 表单」分组
