## 1. 基础设施

- [x] 1.1 新增 `packages/ui/src/utils/feedbackHolder.ts`：模块级单例持有 `useAppProps`（getHolder/setHolder，不可变引用更新）
- [x] 1.2 新增 `components/app/`：`App.vue`（内部 ant `<App>` + setup `useApp()` → setHolder + $attrs 透传）、index.ts（withInstall TmApp）

## 2. 命令式 API

- [x] 2.1 新增 `components/message/`：`TmMessage`（success/info/warning/error/loading，`getHolder()?.message ?? antMessage` 降级，返回销毁句柄 + duration）
- [x] 2.2 新增 `components/notification/`：`TmNotification`（success/info/warning/error，holder 优先 + ant 全局降级）
- [x] 2.3 新增 `components/modal/confirm.ts`：`TmModal` 命令式静态方法（confirm/info/success/error/warning，`getHolder()?.modal ?? antModal` 降级）

## 3. 组件式薄封装

- [x] 3.1 `components/modal/`：`Modal.vue`（`modelValue ↔ open` 桥接 + 扩展键剥离 + ant 原生透传 + 插槽）+ `index.ts`（Object.assign 合并命令式静态方法）
- [x] 3.2 新增 `components/drawer/`：`Drawer.vue`（`modelValue ↔ open` 桥接 + ant 透传 + useForwardRef）+ index.ts

## 4. 注册与导出

- [x] 4.1 `packages/ui/src/index.ts` 追加：TmApp/TmModal/TmDrawer install 注册 + named export（TmMessage/TmNotification/TmModal 静态方法/TmApp）+ 类型 export
- [x] 4.2 resolver 泛化覆盖验证（TmApp/TmModal/TmDrawer → @tm/ui；函数式 API 非组件不走 resolver）
- [x] 4.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 5. 测试

- [x] 5.1 `feedbackHolder` 单测：set/get/覆盖/复位
- [x] 5.2 命令式 API 单测：holder 优先分支 + 降级分支（mock getHolder / 无 holder 时 ant 全局）、返回销毁句柄
- [x] 5.3 组件式单测：Modal/Drawer 的 v-model 桥接（child→parent / parent→child）、扩展键剥离、插槽透传
- [x] 5.4 `pnpm test` 全绿且覆盖率 ≥80%

## 6. 文档

- [x] 6.1 每模块 `demos/*`（命令式用代码块演示）+ `apps/docs/components/{app,message,notification,modal,drawer}.md`
- [x] 6.2 `apps/docs/.vitepress/config.ts` 侧边栏并入「全局反馈」分组
