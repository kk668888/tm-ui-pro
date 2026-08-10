## 1. 骨架与共享装配

- [x] 1.1 为 3 个组件创建目录骨架：`components/{tag,empty,badge}/{index.ts,src/,demos/,__tests__/}`（index.ts 用 withInstall 包装，src 含 props.ts / defaults.ts / 组件 vue）
- [x] 1.2 每个组件 `defaults.ts` 定义公司默认值常量（Tag 状态映射表、Empty 默认文案、Badge 默认）

## 2. 组件实现

- [x] 2.1 TmTag：`Tag.vue`（status 扩展键剥离、`color: props.color ?? STATUS_COLOR[props.status]` 映射、ant 原生 color/closable/onClose 透传、slots 全透传、useForwardRef 方法透传）
- [x] 2.2 TmEmpty：`Empty.vue`（description 公司默认 '暂无数据' 兜底、image/imageStyle 透传、slots 全透传）
- [x] 2.3 TmBadge：`Badge.vue`（ant count/status/dot/overflowCount 透传、count 插槽透传、useForwardRef 方法透传）
- [x] 2.4 3 个组件统一遵循薄封装约定：withDefaults 对 ant 默认 true 的 Boolean 项显式兜底、公司默认经 defaults.ts 统一来源

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 3 组件 install 注册 + 组件/类型 export（含 status 扩展类型）
- [x] 3.2 resolver 泛化覆盖验证（TmTag→tag→@tm/ui，无需改代码，build 产物确认）
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 4. 测试

- [x] 4.1 每组件 `__tests__/*.spec.ts`：TmTag status 映射（已知/未知/显式 color 优先）、TmEmpty 默认文案与覆盖、TmBadge 透传、slots 透传、方法透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%，新增组件纳入 coverage 校验

## 5. 文档

- [x] 5.1 每组件 `demos/*.vue` + `apps/docs/components/{tag,empty,badge}.md`（DemoBlock + <<< 引用）
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏并入「数据展示」分组
