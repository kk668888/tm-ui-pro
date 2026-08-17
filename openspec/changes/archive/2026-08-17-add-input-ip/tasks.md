# add-input-ip 任务清单

## 1. 分段输入内核 composable

- [x] 1.1 实现 `packages/ui/src/composables/useSegmentedInput.ts`：段状态数组（segValues）、段级 input/keydown 处理器、组装 displayValue 与 isComplete 计算
- [x] 1.2 实现跳段机制：段满 maxLen 自动跳下一段、键入分隔符跳段、越界数字（validate 不过）触发跳段并承载新数字
- [x] 1.3 实现退格回跳（段首删除→上一段末尾删一位）与 ←/→ 跨段焦点移动
- [x] 1.4 实现粘贴解析分发：带分隔符原文与纯数字两种输入按段分发，非法整串拒绝不改值
- [x] 1.5 实现 keydown 拦截 + input 事件兜底双层防线（含 IME compositionstart/end 路径）
- [x] 1.6 实现 focus()/focusSegment(n) 与受控回写（lastEmitted 防回环，程序设值含非法段按原文落段）
- [x] 1.7 为 useSegmentedInput 编写单测（脱离组件直打逻辑）：跳段/回跳/方向键/粘贴/拦截/兜底/受控回环全覆盖

## 2. TmInputIp 组件

- [x] 2.1 创建 `packages/ui/src/components/input-ip/` 骨架：index.ts（withInstall）、src/props.ts（TmInputIpProps：modelValue + size/disabled/readonly 等）、src/defaults.ts（公司默认值）
- [x] 2.2 实现 src/InputIp.vue：外壳（ant-input 类名 + tm-input-ip 作用域样式）、四段 input 渲染、点分隔符、接入 useSegmentedInput
- [x] 2.3 实现 v-model 契约：段齐且全合法 emit 组装串（前导零按原文），否则 emit ''
- [x] 2.4 实现 FormContext 级联（业务显式传优先，未传级联 TmForm readonly/disabled）与 readonly 只读展示 / disabled 置灰
- [x] 2.5 实现初始非法值展示：越界段标 error 视觉态，不 clamp；blur 保留半成品不清空
- [x] 2.6 实现 ARIA 组装（role=group + aria-label，每段 aria-label，末段 aria-describedby）与 ref 暴露 focus()/blur()（focus 定位首个空段）
- [x] 2.7 编写 demos/basic.vue（基础双向绑定、size 三档、disabled/readonly、TmForm 级联、初始非法值示例）

- [x] 2.8 修复视觉缺边框：外壳自带对齐 ant 主题的完整视觉（ant-input 类名在 cssinjs 下无样式注入），scoped 样式实现边框/圆角/hover/focus(:focus-within)/disabled/error/size 三档，颜色用 var(--ant-*, 默认值) 双保险；同步更新 InputIp.spec 类名断言（2026-08-17 UI 验收反馈）
- [x] 2.9 修复开头多出一点：v-for 首轮误渲染分隔符，模板加 v-if="i > 1" 使 3 个分隔符只夹在段间；补回归测试（分隔符恰 3 个、首子节点为段 input）：外壳自带对齐 ant 主题的完整视觉（ant-input 类名在 cssinjs 下无样式注入），scoped 样式实现边框/圆角/hover/focus(:focus-within)/disabled/error/size 三档，颜色用 var(--ant-*, 默认值) 双保险；同步更新 InputIp.spec 类名断言（2026-08-17 UI 验收反馈）

## 3. 组件测试

- [x] 3.1 编写 `__tests__/InputIp.spec.ts`：v-model 契约场景（齐全 emit IP / 未齐 emit '' / 前导零原文）
- [x] 3.2 测试键入交互场景：满 3 位跳段、点号跳段、越界数字跳段、非数字拦截、段长上限
- [x] 3.3 测试退格回跳、方向键跨段、粘贴两种格式分发与非法粘贴拒绝
- [x] 3.4 测试 blur 半成品保留、初始非法段 error 展示、FormContext 级联与显式覆盖

## 4. 注册与文档

- [x] 4.1 组件库主出口追加 TmInputIp 导出与类型再导出（TmInputIpProps）
- [x] 4.2 demo 应用注册演示页：routeNames.ts 加路由、页面接入 demos 示例
- [x] 4.3 更新 packages/ui/README.md 组件清单：TmInputIp 条目（v-model ''/完整串契约、四段交互、首个自研组件的说明）
- [x] 4.5 文档站补页：apps/docs/components/input-ip.md（组件说明 + DemoBlock 引用 demos/basic.vue + TmPropsTable API 表）与 .vitepress/config.ts sidebar 基础组件组登记
- [x] 4.4 全量验证：type-check（vue-tsc）、组件库测试套件、demo 构建通过
