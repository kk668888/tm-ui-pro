## 1. 类型与默认值

- [x] 1.1 `props.ts`：新增 `TmSelectApi` 类型与扩展 props 字段（`api` / `fieldNames` / `resultMap` / `debounce` / `minLength`），`remote` 类型不变
- [x] 1.2 `defaults.ts`：新增 `debounce: 300`、`minLength: 1` 及 `fieldNames` 默认值，扩展 `Pick<SelectProps, ...>` 类型

## 2. 响应映射纯函数

- [x] 2.1 新增 `mapApiResponse` 纯函数：`resultMap` > `fieldNames` > 智能识别（顶层数组 → data[] → data.records[] → data.list[] → records[]/list[] → []），按 fieldNames 映射 label/value
- [x] 2.2 为 `mapApiResponse` 补单测：智能识别各分支、fieldNames 自定义、resultMap 优先、无法识别返回空数组

## 3. useRemoteSearch 搜索体验扩展

- [x] 3.1 `useRemoteSearch` 增加 `debounce` / `minLength` 参数：minLength 门槛、防抖合并连续输入、保留 token 竞态防护
- [x] 3.2 `useRemoteSearch` 返回新增 `currentQuery` 响应式搜索词（即时更新，驱动 searchActive 判定）

## 4. useApiLoader 新增

- [x] 4.1 新增 `useApiLoader` composable：挂载时调用 `api({})`，维护 `options` / `loading`，失败时复位 loading 不抛未捕获错误
- [x] 4.2 为 `useApiLoader` 补单测：挂载加载、失败复位、未配置 api 不调用

## 5. Select.vue 三态收敛

- [x] 5.1 `Select.vue` 接入 `useApiLoader` 与扩展后的 `useRemoteSearch`，新增 `searchActive` / `baseOptions` 计算
- [x] 5.2 `mergedOptions` 从二选一改为三态（`searchActive ? searchResult : baseOptions`），loading 合并为 `apiLoading || remoteLoading`
- [x] 5.3 `defaults.ts` 新默认值接入 withDefaults；确认 `api`/`remote`/`resultMap` 等函数 prop 默认 undefined

## 6. 集成测试

- [x] 6.1 Select 单测补齐：api 挂载加载并映射、minLength 门槛、防抖合并、api+remote 共存（初始列表→搜索覆盖→清空回退）、loading 合并
- [x] 6.2 运行全量测试（packages/ui）确认 100% 通过、无回归

## 7. 文档

- [x] 7.1 更新 `apps/docs/components/select.md`：新增 api 挂载加载、fieldNames/resultMap 映射、debounce/minLength 参数说明与示例
