## 1. 骨架与共享装配

- [x] 1.1 创建 8 个组件目录骨架：`components/{slider,rate,tree,auto-complete,mentions,transfer,checkbox,radio}/{index.ts,src/,demos/,__tests__/}`（多子组件模块 tree×3、mentions×2 按 form 形态；单组件模块 slider/rate/auto-complete/transfer/checkbox/radio 用 `export default TmXxx`）
- [x] 1.2 `transfer/src/defaults.ts` 定义公司默认：`titles: ['源列表', '目标列表']`

## 2. 组件实现

- [x] 2.1 TmSlider：`Slider.vue`（min/max/step/range/marks 透传、tipFormatter 透传）
- [x] 2.2 TmRate：`Rate.vue`（count/allowHalf/allowClear/character/tooltips 透传）
- [x] 2.3 TmTree：`Tree.vue` + `DirectoryTree.vue`（treeData/checkable/checkedKeys 透传；ant 遗留 TreeNode 子组件 API 经 wrapper 会递归，故移除）
- [x] 2.4 TmAutoComplete：`AutoComplete.vue`（options 数据源对齐 TmSelect、value/allowClear/filterOption 透传）
- [x] 2.5 TmMentions：`Mentions.vue` + `MentionsOption.vue`（prefix/options 透传）
- [x] 2.6 TmTransfer：`Transfer.vue`（titles 公司默认兜底、dataSource/targetKeys 透传）
- [x] 2.7 TmCheckbox：`Checkbox.vue`（v-model:checked、value/indeterminate/disabled 透传）
- [x] 2.8 TmRadio：`Radio.vue`（checked/value/disabled 透传）
- [x] 2.9 8 组件统一遵循薄封装约定：useForwardBindings(props, companyDefaults) 透传、slots 全透传、useForwardRef 方法透传、缺省 Boolean 幻影值跳过

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 install 注册 + 组件/类型 export（含 2 个多子组件：TmTree/TmDirectoryTree、TmMentions/TmMentionsOption）
- [x] 3.2 resolver 泛化覆盖验证（无需改代码，build 产物确认）
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 4. 测试

- [x] 4.1 每组件 `__tests__/*.spec.ts`：Slider range/step、Rate allowHalf、Tree 渲染与勾选、AutoComplete options、Mentions prefix、Transfer 默认标题与覆盖、Checkbox checked 受控、Radio checked 受控、slots 透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%

## 5. 文档

- [x] 5.1 每组件 `demos/*.vue` + `apps/docs/components/{slider,rate,tree,auto-complete,mentions,transfer,checkbox,radio}.md`
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏「表单」分组扩充
