## 1. FormContext 与 TmForm 核心

- [x] 1.1 升级 `useFormContext.ts`：`FormContext` 接口承载 `submitting` / `readonly` / `disabled`，`provideForm` 接收 `ComputedRef<FormContext>`
- [x] 1.2 新增 `form/src/props.ts`：抽出 `TmFormExtProps` / `TmFormProps`（避免 vite:dts TS4023 私有类型无法命名）
- [x] 1.3 扩展 `Form.vue`：新增 3 个扩展键 prop，`forwardBindings` 剥离 `submitting`/`readonly`、透传 `disabled`（保留 ant 原生整表禁用）
- [x] 1.4 实现变更追踪：`onMounted` 快照 + `isDirty` / `getDirtyFields` / `resetToInitial` / `markInitial`，经 Proxy 包装合并暴露到 `useForwardRef`

## 2. 级联消费

- [x] 2.1 扩展 `FormItem.vue`：消费 FormContext，default slot props 暴露 `{ submitting, readonly, disabled }`
- [x] 2.2 适配 `Input.vue`：inject FormContext 级联 `readonly`/`disabled`，`withDefaults` 设 `undefined` 区分「未传」（修复 Boolean 默认 false 阻断 `??` 落空）
- [x] 2.3 适配 `Select.vue`：级联 `disabled`；readonly 用受控 `open:false` 锁死下拉 + `allowClear:false` 禁清空

## 3. Demo 与文档

- [x] 3.1 新增 `demos/readonly.vue`：编辑 / 只读 / 禁用三态切换
- [x] 3.2 新增 `demos/submitting.vue`：提交 loading 经 slot props 下发按钮区
- [x] 3.3 新增 `demos/dirty.vue`：变更追踪四方法 + 脏状态实时提示
- [x] 3.4 更新 `apps/docs/components/form.md`：Props / Methods / slot props / 扩展机制 + 3 个新 demo 章节

## 4. 测试与验证

- [x] 4.1 `Form.spec.ts` 新增：slot scope 下发、变更追踪、扩展键透传边界、TmInput 级联（含业务优先）
- [x] 4.2 `Select.spec.ts` 新增：disabled 级联、业务优先、无祖先容错、readonly 受控 open 锁定
- [x] 4.3 全量单测（164 通过）+ vue-tsc 零错误 + `pnpm build` 成功
