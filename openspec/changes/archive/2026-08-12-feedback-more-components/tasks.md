## 1. 模块骨架与默认值

- [x] 1.1 创建 4 个组件模块目录（progress / skeleton / tour / float-button）及 `src`、`demos`、`__tests__` 骨架，按 design.md 区分单组件与多子组件出口
- [x] 1.2 为 TmProgress 创建 `src/status.ts`，定义业务 status → ant status/strokeColor 映射表（success→success、processing→active、failed→exception、warning→normal+strokeColor 兜底）并编写详细注释
- [x] 1.3 确认 Skeleton / FloatButton 命名空间子组件（Avatar/Image/Input/Button；Group/BackTop）在 ant 4.2.6 的可用形态与类型导出

## 2. Progress 实现

- [x] 2.1 实现 TmProgress 薄封装，`useForwardBindings` 转发业务显式值与映射后的 ant status/strokeColor，显式 `strokeColor` 优先于映射兜底，动态插槽与 `useForwardRef` 透传
- [x] 2.2 为 TmProgress 编写聚焦测试，覆盖业务 status 四态映射、ant 原生 status 透传、显式 strokeColor 优先与实例引用透传

## 3. Skeleton 实现

- [x] 3.1 实现 TmSkeleton 薄封装，`useForwardBindings` 透传原生 props，动态插槽（default / title / paragraph / avatar / extra）与 `useForwardRef` 透传
- [x] 3.2 实现 TmSkeletonAvatar / TmSkeletonImage / TmSkeletonInput / TmSkeletonButton 四个子组件，遵循薄封装骨架与命名空间导出
- [x] 3.3 为 TmSkeleton 及子组件编写聚焦测试，覆盖加载态、插槽透传、子组件注册与实例引用透传

## 4. Tour 实现

- [x] 4.1 实现 TmTour 薄封装，`useForwardBindings` 透传 open / current / steps 等原生 props，`open` 缺省不形成受控幻影 false，动态插槽与 `useForwardRef` 透传
- [x] 4.2 为 TmTour 编写聚焦测试，覆盖受控打开透传、步骤配置透传、插槽与实例引用透传

## 5. FloatButton 实现

- [x] 5.1 实现 TmFloatButton 薄封装，`useForwardBindings` 透传原生 props，图标 / 描述 / 形状 / 位置与事件透传
- [x] 5.2 实现 TmFloatButtonGroup 与 TmFloatButtonBackTop（承接 ant 移除的独立 BackTop 能力，透传 target / visibilityHeight），遵循薄封装骨架与命名空间导出
- [x] 5.3 为 TmFloatButton 及子组件编写聚焦测试，覆盖受控 visible 透传、Group 子项、BackTop 目标与实例引用透传

## 6. 注册与类型导出

- [x] 6.1 更新 `packages/ui/src/index.ts`，注册并导出 4 个主组件、design.md 列明的子组件及公开类型
- [x] 6.2 验证 resolver 的 `Tm` 前缀泛化解析覆盖全部新增组件且无需维护组件白名单
- [x] 6.3 运行 `pnpm --filter @tm/ui build`，确认 ESM/CJS 与声明文件产物可生成

## 7. 文档与最终验证

- [x] 7.1 为 4 个组件创建可运行 demos 与 `apps/docs/components/*.md` 文档，列出公司默认、status 映射表、原生透传和子组件出口
- [x] 7.2 在 TmFloatButtonBackTop 文档标注其承接原 BackTop 能力的迁移说明
- [x] 7.3 更新 `apps/docs/.vitepress/config.ts` 的「全局反馈」侧边栏，确保新增页面可导航
- [x] 7.4 运行文档构建、根目录测试和 `openspec validate 2026-08-12-feedback-more-components --strict` 完成最终门禁
