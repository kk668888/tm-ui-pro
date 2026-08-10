## 1. DemoBlock 代码折叠

- [x] 1.1 `DemoBlock.vue` 增加 `code` prop + 折叠/展开状态（默认收起）
- [x] 1.2 增加「显示代码/收起」切换 + 一键复制源码按钮（clipboard + 反馈）
- [x] 1.3 各组件 md 用 `?raw` import demo 源码传入 `DemoBlock :code`

## 2. API 表格 TmTable 渲染

- [x] 2.1 新建 docs 层 `TmPropsTable.vue`（内部 TmTable，列：属性/说明/类型/默认值）
- [x] 2.2 迁移 button / input / select / form / table 五页 API Props 表格为数据驱动

## 3. ConfigProvider 文档页

- [x] 3.1 新增 `packages/ui/src/config-provider/demos/basic.vue`（主题桥接 + locale 演示）
- [x] 3.2 新增 `apps/docs/components/config-provider.md`（说明 + demo + API）
- [x] 3.3 `config.ts` 侧边栏加入 ConfigProvider 项

## 4. 验证

- [x] 4.1 `pnpm --filter @tm/docs build` 通过（SSR + 搜索索引无回归，API 表格渲染 vxe-grid）
