# @tm/ui 组件库大方向优化评审

> 日期：2026-08-12  
> 文档类型：架构评审与优化方向建议  
> 当前状态：讨论稿，尚未转化为 OpenSpec 实施变更

## 1. 当前判断

@tm/ui 已经完成从少量核心组件向较完整组件库的扩展。当前仓库约有 50 个组件目录、57 个组件测试文件、51 个组件文档页，组件数量已经不再是最主要的短板。

下一阶段不应只以“继续封装更多 ant-design-vue 组件”为目标，而应推动组件库从“组件集合”升级为“可持续维护的内部设计系统平台”。重点需要转向：

- 设计令牌与视觉一致性
- 薄封装边界和组件分层
- 构建出口与按需加载
- 自动化质量门禁
- API 生命周期和兼容性治理
- 文档、元数据和开发者体验
- 从原子组件向业务模式组件演进

## 2. 设计令牌体系

这是当前优先级最高的架构优化。

现有 `TmConfigProvider` 已实现：

- ant-design-vue Token 到 vxe CSS 变量的映射
- Light/Dark Algorithm 切换
- Locale 注入

但当前仍主要依赖 ant Token，尚未形成属于公司的稳定设计令牌契约。随着组件增多，如果默认颜色、间距、圆角和组件视觉继续散落在各组件的 `defaults.ts` 与局部 CSS 中，后续统一升级的成本会快速上升。

建议建立三级 Token 模型：

```text
品牌层
  colorBrand / colorSuccess / colorDanger

语义层
  pageBg / panelBg / borderMuted / textSecondary

组件层
  tableHeaderBg / cardPadding / formLabelWidth
```

建议提供：

- `TmThemeConfig` 公开类型
- 品牌、语义、组件三级 Token
- CSS Variables 输出
- Light/Dark 两套稳定基线
- Token 变更兼容规则
- Token 文档和实时调试页面

## 3. 薄封装边界与组件分层

当前“ant 组件覆盖率”路线能够统一入口，但也可能产生大量只改名字、不提供额外价值的代理组件。

建议将组件分为三层：

```text
基础适配层
  TmButton / TmCard / TmTooltip
  负责主题、默认值、兼容修复和统一 API

业务模式层
  TmSearchForm / TmDetailPanel / TmFilterBar / TmEditableTable
  负责解决多个项目重复出现的业务交互模式

领域组件层
  UserSelector / DepartmentTree / PermissionPicker
  由具体业务域维护，不进入基础组件库
```

每新增一个基础 Wrapper，至少应回答：

1. 是否提供公司默认值或统一视觉规范？
2. 是否解决上游兼容、类型或交互问题？
3. 是否统一了多个业务项目中真实重复的用法？

如果三个答案都是否，业务直接使用 ant-design-vue 通常更合理。

建议完成当前数据展示批次后，暂停一次纯数量扩张，优先沉淀业务模式组件。

## 4. 包出口与按需加载

当前包主要提供：

- 主入口 `@tm/ui`
- 表格子入口 `@tm/ui/table`

随着组件持续增加，主入口声明文件、构建时间和依赖图会继续膨胀。建议逐步支持组件级子入口：

```ts
import { TmCard } from '@tm/ui'
import { TmCard } from '@tm/ui/card'
import '@tm/ui/card/style.css'
```

Resolver 应基于真实组件元数据解析子入口，而不是让除 Table 外的全部组件都指向主入口。

建议补充以下构建治理能力：

- 包体积预算和构建产物体积报告
- 每个子入口的 `exports` 自动校验
- Tree-shaking 消费端验证
- `npm pack --dry-run` 发布内容检查
- 独立消费项目的 TypeScript 类型验证
- ESM、CJS 和 SSR 三种消费方式验证

## 5. 自动化质量门禁

当前 Vitest 已配置 Coverage Reporter，但没有设置强制 `thresholds`。因此 README 中声明的 80% 覆盖率尚未成为真正的失败门禁。

仓库当前也没有 `.github/workflows`，说明持续集成尚未将本地校验固化为合并前约束。

建议建立统一命令：

```text
pnpm check
  ├─ lint
  ├─ typecheck
  ├─ unit tests + coverage thresholds
  ├─ library build
  ├─ docs build
  ├─ consumer fixture build
  ├─ OpenSpec validate
  └─ package exports validation
```

浏览器级质量还应覆盖：

- Playwright 文档示例冒烟测试
- Light/Dark 截图回归
- 键盘操作与焦点顺序
- axe 可访问性检查
- Console Warning 拦截
- SSR 构建和 Hydration 验证

仅依赖 jsdom 单元测试，无法可靠发现浮层定位、焦点、动画、真实布局和主题样式问题。

## 6. API 生命周期与兼容性治理

当前已经遇到以下典型兼容问题：

- Comment 等上游废弃组件
- Vue Boolean Prop 幻影 `false`
- 声明文件中物理依赖路径污染
- ant-design-vue 与 vxe-table 两套组件体系协同

这意味着组件库需要建立正式的 API 生命周期制度：

- Node、Vue、TypeScript、ant-design-vue、vxe-table 支持矩阵
- Deprecated 标记和移除周期
- Major、Minor、Patch 判定标准
- Props 默认值变更规则
- 上游依赖升级回归清单
- 公共 API 快照测试
- 废弃组件迁移指南

当前 `packages/ui/package.json` 的 Repository 和 Registry 仍为占位配置，正式发布前需要替换为真实内部地址，并明确 Peer Dependency 的兼容区间策略。

## 7. 文档和开发者体验

当前根 README 的组件清单仍主要描述早期 Button、Input、Select、Form、Table 等组件，与仓库实际组件数量不一致。说明文档、出口、Resolver 和实现正在形成多个事实来源。

建议建立统一组件元数据：

```ts
{
  name: 'TmCard',
  category: 'data-display',
  status: 'stable',
  since: '0.2.0',
  deprecated: false,
  docs: '/components/card'
}
```

由该元数据自动生成或校验：

- 组件总出口
- Resolver 映射
- VitePress 侧边栏
- README 组件清单
- API 状态页面
- 发布变更摘要

文档站当前消费构建后的 `es` 产物，修改源码后需要重新构建组件库才能看到效果。建议：

- 开发环境 Alias 到 `packages/ui/src`
- 发布验证环境继续消费真实构建产物
- 增加组件 Playground
- 支持 Props、Events、Slots、Methods 自动生成
- 为每个示例提供可运行源码和最小依赖说明

## 8. 从原子组件转向业务模式组件

基础组件覆盖达到一定程度后，内部组件库的核心价值不再是减少 `ant-design-vue` 的 Import，而是减少多个业务项目对相同交互模式的重复实现。

建议优先从真实项目收集高重复模式，例如：

- 查询条件展开、收起、重置和查询
- 列表页工具栏、密度、列设置和批量操作
- 详情页字段分组与状态展示
- 新增、编辑抽屉的提交状态与离开确认
- 权限控制按钮和空状态
- 文件上传、预览和失败重试
- 表格查询条件、分页和 URL 状态同步

这些模式的复用价值通常高于继续增加只做属性透传的基础 Wrapper。

## 9. 建议优先级

### P0：工程底座

1. 建立 CI 和统一 `pnpm check`
2. 真正启用覆盖率阈值
3. 修复 Registry 与 Repository 发布配置
4. 增加消费端、SSR 和文档构建验证

### P1：设计系统化

1. 建立公司 Token 契约
2. 明确薄封装准入标准
3. 建立 API 生命周期和兼容矩阵
4. 建立组件元数据单一数据源

### P2：产品能力

1. 从原子封装转向 SearchForm、DetailPanel 等业务模式组件
2. 完善组件子入口与包体积治理
3. 增加浏览器、视觉和可访问性测试

## 10. 总结

当前 @tm/ui 已经过了“组件数量不足”的主要阶段。下一阶段的关键问题是：

> 如何保证组件越来越多以后，仍然具备一致的视觉、稳定的 API、可信的发布质量、可控的升级成本和足够高的业务复用价值。

因此，短期应优先补齐工程门禁与发布治理，中期建立公司设计令牌和组件元数据，随后把新增能力的重点转向高复用业务模式组件。
