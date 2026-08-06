## Context

TmSelect 是 ant-design-vue Select 的薄封装，现有数据来源：本地 `options` 与搜索用 `remote`（`useRemoteSearch`，已有 token 竞态防护 + loading，但无防抖/minLength）。组件库零依赖（peerDependencies 仅 vue/antd/vxe，无 axios）。见 proposal.md - Why。

本次为 TmSelect 补齐两种独立能力：`api`（挂载加载初始列表 + 响应映射）与搜索体验（remote 防抖/minLength），并支持二者共存。

## Goals / Non-Goals

**Goals:**
- `api` 挂载加载：挂载时调用请求函数一次，响应映射为 `{label, value}[]`
- 响应映射：`resultMap` > `fieldNames` > 智能识别，覆盖常见后端格式
- `remote` 搜索：minLength 门槛 + debounce 防抖，保留现有 token 竞态防护
- `api` + `remote` 共存：api 常驻 baseOptions，搜索时 remote 结果临时覆盖，清空回退
- 保持零依赖：不引入 axios

**Non-Goals:**
- `api` 联动刷新（`deps` 依赖刷新）：本期不实现，api 仅在挂载时加载一次
- `searchKey` 搜索参数注入：api 挂载无搜索词、固定参数由业务闭包捕获，排除该死参数
- 多选/远程 valueLabel 反查回显
- 结果缓存、级联刷新

## Decisions

### D1: 拆分为两个 composable，职责分离

`useRemoteSearch`（现有，扩展搜索体验）+ 新增 `useApiLoader`（api 挂载加载）。

- `useRemoteSearch`：新增 `debounce` / `minLength` 参数，保持 token 竞态防护；返回现有 `options` / `loading` / `search`，并新增 `currentQuery`（响应式搜索词）
- `useApiLoader`：挂载时调用 `api({})`，维护 `options` / `loading`

**Rationale**：api 与 remote 语义独立（获取数据 vs 搜索），拆分保持单一职责、便于独立测试。合并逻辑收敛到 Select.vue 的 `mergedOptions`。**Alternative considered**：单一 composable 管全部数据源——耦合两种生命周期，测试复杂。

### D2: 响应映射独立为纯函数工具

新增 `mapApiResponse(res, { fieldNames, resultMap })` 纯函数，返回 `TmSelectOption[]`。

优先级与智能识别顺序：
```
1. resultMap 存在 → resultMap(res)
2. Array.isArray(res) → res
3. res.data 是数组 → res.data
4. res.data.records / res.data.list 是数组 → 对应数组
5. res.records / res.list 是数组 → 对应数组
6. 均不匹配 → []
```
再按 `fieldNames`（默认 `{label:'label', value:'value'}`）取 `label`/`value`。

**Rationale**：纯函数易单测（智能识别各分支独立测试）。**Alternative**：映射逻辑内联进 useApiLoader——测试需走组件挂载，成本高。

### D3: 防抖 + minLength + token 竞态的组合实现

`useRemoteSearch` 的 `search(query)` 处理链：
```
1. currentQuery.value = query（即时更新，驱动渲染层 searchActive 判断）
2. query.length < minLength → options.value = []；return（不设防抖、不发请求）
3. clearTimeout(prevTimer)
4. timer = setTimeout(async () => {
     const token = ++lastToken          // 防抖窗口后仍走 token 竞态防护
     loading.value = true
     try { const r = await remote(query); if (token === lastToken) options.value = r }
     finally { if (token === lastToken) loading.value = false }
   }, debounce)
```
**Rationale**：防抖在前合并连续输入、token 在后防乱序，两者不冲突。**Trade-off**：防抖窗口内 `searchActive` 已为 true、渲染旧 `options`（上次搜索结果），约 300ms 后刷新——可接受，与多数 select 组件一致。

### D4: mergedOptions 三态收敛

```
searchActive = props.remote && currentQuery.length >= minLength
baseOptions  = api 模式 ? useApiLoader.options : props.options（本地）
searchResult = useRemoteSearch.options
mergedOptions = searchActive ? searchResult : baseOptions
loading      = apiLoading || remoteLoading
```
**Rationale**：api 与 remote 写入不同槽位，互不覆盖；渲染层按"是否处于激活搜索"切换。**注意**：现有 `props.remote` 二选一逻辑升级为三态，是 Select.vue 的核心重构点。

### D5: 默认值集合扩展

`defaults.ts` 新增 `debounce: 300`、`minLength: 1`（remote 搜索默认值），`fieldNames` 默认 `{label:'label', value:'value'}`。`api`/`remote`/`resultMap` 为函数类型默认 `undefined`。

### D6: 类型定义

`props.ts` 新增：
```ts
type TmSelectApi = (params: Record<string, unknown>) => Promise<unknown>
// TmSelectExtProps 新增：
api?: TmSelectApi
fieldNames?: { label: string; value: string }
resultMap?: (res: unknown) => TmSelectOption[]
debounce?: number
minLength?: number
```
`remote` 保持 `(query: string) => Promise<TmSelectOption[]>` 不变（业务自己映射），`api` 返回原始响应由组件映射。

## Risks / Trade-offs

- **[api 与 remote 同时配置时的选项来源歧义]** → 文档明确定义：api 提供 baseOptions、remote 搜索覆盖；渲染层由 `searchActive` 单一判定，无并发写入同一槽位
- **[智能识别误判响应结构]** → 提供 `resultMap` 完全自定义兜底；智能识别仅匹配"数组直接位于常见 key"的形态，避免深度递归
- **[防抖期间显示旧搜索结果]** → 与主流 select 行为一致，token 防护保证最终一致；若产品侧不接受可后续加"防抖开始即清空"选项（不改 spec，改实现）
- **[api 请求失败静默]** → 遵循现有 remote 语义（finally 复位 loading、不抛未捕获错误），业务可自行在闭包 try/catch
- **[无联动刷新]** → 本期 Non-Goal；后续若需要 `deps` 参数，api 的 useApiLoader 预留 `reload()` 出口即可扩展，不改 spec

## Open Questions

- 无阻塞性开放问题。`api` 联动刷新（deps）、远程 valueLabel 反查均可在后续变更中按需加入，不影响本设计的 spec 与任务拆分。
