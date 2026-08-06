## Why

TmSelect 目前只支持两种数据来源：本地 `options` 与搜索用的 `remote`。业务方最常见的两类需求无法开箱即用：(1) 挂载时调用接口加载下拉列表（部门/角色/字典等"获取数据"场景），(2) 远程搜索没有防抖与最小输入长度门槛，每次输入都打接口、体验差且浪费带宽。需要为 TmSelect 补齐这两种能力，并让它们与现有 remote 模式共存。

## What Changes

**新增 `api` 参数（获取数据模式）**
- `api: (params) => Promise<unknown>`：请求函数，组件在挂载时调用一次获取初始列表
- 组件挂载时调用 `api({})`；固定参数（如租户 ID）由业务在闭包中捕获
- 与 `remote` 语义区分：`api` 是"获取数据"（挂载加载），`remote` 是"搜索"（输入触发）；二者互不注入搜索词

**新增响应映射编排（api 专属）**
- `fieldNames: { label, value }`（默认 `{ label: 'label', value: 'value' }`）：响应数组字段名映射
- `resultMap: (res) => TmSelectOption[]`：完全自定义响应映射，优先级最高；未提供时按常见格式智能识别（顶层数组 → `data[]` → `data.records[]` → `data.list[]`）

**新增搜索体验配置（remote 专属）**
- `debounce: number`（默认 `300`）：远程搜索防抖毫秒，合并连续输入
- `minLength: number`（默认 `1`）：最小输入长度门槛，低于则不发起请求

**共存逻辑（api + remote 同时配置）**
- `api` 填充常驻 baseOptions；用户输入（≥minLength 且防抖后）时 `remote` 的结果**临时覆盖**渲染；清空输入回退 baseOptions
- 两者写入不同槽位，互不覆盖；loading 为 apiLoading ∪ remoteLoading

**零依赖约束**
- 组件库不引入 axios；`api` 是业务传入的请求函数，业务侧 request 层负责鉴权/拦截/错误处理

## Capabilities

### New Capabilities
- `components/select`: TmSelect 的数据获取与搜索能力——`api` 挂载加载、响应映射（fieldNames/resultMap）、remote 搜索的 debounce/minLength、api 与 remote 共存

### Modified Capabilities
<!-- 无已归档 spec（openspec/specs/ 为空），无既有 requirement 变更 -->

## Impact

- `packages/ui/src/components/select/src/props.ts`：新增 `TmSelectApi` 类型与扩展 props 类型
- `packages/ui/src/components/select/src/defaults.ts`：新增 debounce/minLength/fieldNames 等默认值
- `packages/ui/src/components/select/src/Select.vue`：mergedOptions 从"二选一"改为"三态"（baseOptions / searchResult / 本地 options）
- `packages/ui/src/components/select/src/composables/useRemoteSearch.ts`：新增 debounce/minLength 与 api 模式取数适配
- `packages/ui/src/components/select/__tests__/Select.spec.ts`：新增 api 加载、响应映射、防抖、minLength、共存逻辑测试
- 依赖：零新增（不引入 axios）；`TmSelectProps` 对外类型扩展为非破坏性新增
