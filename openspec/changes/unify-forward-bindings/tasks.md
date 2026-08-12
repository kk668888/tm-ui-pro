## 1. 共享 composable

- [ ] 1.1 新增 `packages/ui/src/composables/useForwardBindings.ts`：只转发 `$attrs` + 业务显式传入 props + 公司默认值，跳过幻影 false；`isRef` 区分 reactive props 与 ComputedRef 源；kebab/camel 归一化匹配父组件 vnode.props
- [ ] 1.2 新增 `useForwardBindings.spec.ts`：覆盖幻影 false 跳过、显式 props 转发（含显式 false）、公司默认转发、显式覆盖公司默认、computed 源适配（含合成键转发）

## 2. 组件接入与回归测试

- [ ] 2.1 TmUpload 接入 `useForwardBindings(props, ['showUploadList'])`，删除 `openFileDialogOnClick: undefined` 手工补丁
- [ ] 2.2 TmPopover 接入 `useForwardBindings(props, ['autoAdjustOverflow'])`，删除 `open: undefined` / `visible: undefined` 手工补丁
- [ ] 2.3 TmPopconfirm 接入 `useForwardBindings(antProps, [...companyDefaults])`，删除 `open: undefined` 手工补丁
- [ ] 2.4 `Upload.spec.ts` 新增点击回归测试：点击触发区 / 点击内部按钮触发 file input 打开文件框，且业务未传时内部不收到幻影 false

## 3. 验证

- [ ] 3.1 运行 Upload / Popover / Popconfirm / composable 全量测试通过
- [ ] 3.2 运行组件库全量测试 + `vue-tsc` 类型检查，无新增错误
