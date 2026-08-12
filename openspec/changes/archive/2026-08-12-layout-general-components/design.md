## Context

@tm/ui 已完成基础控件、弹层控件、数据展示、全局反馈多批，薄封装模式成熟：扩展键剥离、`$attrs` 合并（现统一用 `useForwardBindings` 消除幻影 false）、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底。本变更补齐通用与布局层 6 组件。行为契约见 `specs/components/{space,divider,typography,flex,grid,layout}/spec.md`，动机见 `proposal.md`。

ant-design-vue 4.2.6 已确认的导出形态：
- `Space`、`Divider`、`Flex`：顶层命名导出
- `Row`、`Col`：顶层命名导出（`es/grid` 桶另有 `useBreakpoint`）
- `Layout` + `LayoutSider` / `LayoutHeader` / `LayoutFooter` / `LayoutContent`：顶层命名导出
- `Typography` + `TypographyTitle` / `TypographyParagraph` / `TypographyText` / `TypographyLink`：顶层命名导出

## Goals / Non-Goals

**Goals:**
- 6 个组件与既有组件同构的薄封装骨架
- 多子组件模块（grid/layout/typography）按 form 模块形态组织，子组件独立注册
- 公司默认值策略统一收敛到 `defaults.ts`，一处改动全库生效

**Non-Goals:**
- 不做 Flex / Space 的响应式间距断点逻辑（ant 原生能力已够）
- 不做 Typography 的编辑态深度定制（ant editable 透传即可）
- 不做 Layout 的主题联动扩展（依赖 ConfigProvider，属 ant 原生）

## Decisions

### 1. 多子组件模块按 form 形态组织

grid / layout / typography 是多子组件模块，沿用 `components/form` 的既有形态：`index.ts` 分别 `withInstall` 每个子组件并命名导出，`export default { TmRow, TmCol }` 提供对象形态便于整体引用。单组件模块（space/divider/flex）保持 `export default TmXxx`。

**备选**：子组件挂在父组件静态属性（`TmGrid.Row`）。否决——Vue SFC 静态属性挂载需 `defineOptions` 透传且类型推导复杂，命名导出更符合既有 form 模块约定，resolver 也能独立解析 `<TmCol>`。

### 2. 公司默认值收敛到 defaults.ts，用 useForwardBindings 显式转发

真正有意义的公司默认是 `Flex` 的 `gap`（ant Flex 默认无间距，公司规范引入 `middle`）；`Space` 的 `size` 与 `Divider` 的 `type` / `orientation` 与 ant 默认一致，但显式锁定为规范锚点（未来改默认只动 `defaults.ts`）。

统一用 `useForwardBindings(props, companyDefaults)`：`companyDefaults` 传默认键列表，保证 withDefaults 兜底值始终转发；未显式传入的 Boolean 幻影值跳过，交给 ant 内部默认。grid / layout 无公司默认，`companyDefaults` 传 `[]`。

### 3. 子组件命名映射（对齐 ant 导出名）

```
ant 导出                       Tm 包装                职责
──────────────────────────────────────────────────────────
Space                        TmSpace               单组件
Divider                      TmDivider             单组件
Flex                         TmFlex                单组件
Row / Col                    TmRow / TmCol         同一模块 components/grid
Layout / LayoutSider /       TmLayout / TmSider /   同一模块 components/layout
  LayoutHeader /                TmHeader /
  LayoutFooter /                 TmFooter /
  LayoutContent                  TmContent
Typography +                  TmTypographyTitle /   同一模块 components/typography
  TypographyTitle /               TmTypographyParagraph /
  TypographyParagraph /           TmTypographyText /
  TypographyText /                TmTypographyLink
  TypographyLink
```

子组件导入直接用 ant 顶层命名导出（如 `import { LayoutSider as ASider } from 'ant-design-vue'`），不依赖 `Layout.Sider` 静态属性形态。

### 4. 不抽公共 SFC 模板

延续既有决策：各组件脚本差异小但模板不同（布局类无 slots 转发差异），复制骨架比抽象共享组件更易维护。

## Risks / Trade-offs

- [layout 五子组件 + grid 双子组件使 index.ts 注册行数膨胀] → 多子组件模块与 form 同构，install 逐个 `app.use`，与既有约定一致，无新增复杂度
- [Typography 四子组件 props 类型各自不同] → 各自 `props.ts` 声明独立 TmProps 类型，不强行合并
- [useForwardBindings 依赖 getCurrentInstance，必须在 setup 同步调用] → 延续 popover/popconfirm 已锁定用法，新组件照搬
