## 1. 迁移准备

- [x] 1.1 清点 23 个遗留组件（alert/badge/button/cascader/checkbox-group/date-picker/range-picker/drawer/empty/form/form-item/input/input-number/modal/radio-group/result/select/spin/switch/table/tag/time-picker/tree-select），逐一核对 `withDefaults` 兜底键与中间变换合成键，产出 `companyDefaults` 清单
- [x] 1.2 逐一 grep 各组件模板 `@` 显式绑定，产出 `excludedKeys` 清单（模板绑定监听器须从透传剔除，避免数组监听器崩溃）

## 2. 批次 A：简单透传组件迁移（16 个）

- [x] 2.1 alert / badge / tag：迁移为 `useForwardBindings(props/antProps, companyDefaults)`，保留 withDefaults 兜底，删除 `{...$attrs, ...props}` 全量透传
- [x] 2.2 cascader / date-picker / range-picker / time-picker / tree-select：迁移（picker 系注意受控 open/value 剥离、useReadonlyLock 合成键列入 companyDefaults）
- [x] 2.3 drawer / modal：迁移（保持 visible/open/modelValue 剥离逻辑，closable/mask/maskClosable/keyboard 兜底键列入 companyDefaults）
- [x] 2.4 empty / result / spin / switch / input / input-number：迁移（公司默认与 FormContext 级联合成键列入 companyDefaults）
- [x] 2.5 回归断言：受影响组件补「未传可选 Boolean 不收到幻影 false / 公司默认兜底转发」断言（spin/empty 默认断言、tag 新增 bordered 断言、modal/drawer/switch 既有剥离断言）

## 3. 批次 B：中间变换组件迁移（7 个）

- [x] 3.1 button：迁移为 `useForwardBindings(antProps, ['type'])`（computed 源，onClick 由 antProps 剥离避免双触发）
- [x] 3.2 select / table / form / form-item：迁移为 computed 源（保留现有中间变换，合成键 columns/data/loading/options/filterOption 与公司默认列入 companyDefaults）
- [x] 3.3 checkbox-group / radio-group：迁移为 `useForwardBindings(antProps, ['disabled'])`
- [x] 3.4 回归断言：select 既有 bordered/open/剥离/disabled 级联断言，table 公司默认 border/stripe/showOverflow 断言

## 4. 验证

- [x] 4.1 运行 23 个组件 + composable 全量测试通过（无新增失败）
- [x] 4.2 运行组件库全量测试（536 通过）+ build 类型检查，无新增错误，确认零行为回归
