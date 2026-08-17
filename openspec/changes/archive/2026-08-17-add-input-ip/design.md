# add-input-ip 设计文档

## Context

见 proposal.md「Why」。现状约束：库内 64 个组件全部是 ant-design-vue 薄封装，TmInput（`packages/ui/src/components/input/src/Input.vue`）确立了「v-model 桥接 + 属性剥离透传 + useForwardRef 方法透传 + FormContext 级联」的封装范式；但 TmInputIp 的交互（分段、跳段、键入拦截）在 antd 中没有对应物，无法沿用「包一层 AInput」的路线。antd 的 `Mentions` / `Cascader` 证明「ant 风格自研控件」是官方认可的组件形态：用 `ant-input` 类名与 design token 构建外壳，而非嵌入 antd 组件实例。

## Goals / Non-Goals

**Goals:**

- 四段式 IPv4 输入的完整交互：跳段、退格回跳、方向键跨段、粘贴分发、键入拦截
- 视觉与库内 ant 封装组件零差异（size/disabled/readonly/focus/error 态全对齐）
- 分段输入内核沉淀为可复用 composable，供后续 IPv6 / port-range / CIDR 使用
- v-model 单字段契约（`''` 或完整 IP 字符串），与 TmForm/a-form rules 无缝集成

**Non-Goals:**

- IPv6、CIDR 掩码输入（未来独立组件复用 composable）
- 「>255 提前断段」以外的启发式断段（如按剩余长度猜测分段）——重新引入歧义，明确排除
- 必填校验、IP 段黑名单（私有/保留地址判断）等业务级校验——归表单 rules 层
- 内置 allowEmpty prop——空值即 `''`，是否必填由表单 rule 决定，无需组件开关

## Decisions

### D1: 四段原生 input，而非单框 + 拦截格式化

单框方案（onInput 拦截 + 重排文本 + 光标还原）的死穴是中间编辑：用户挪光标到串中间后，任何「智能断段」重排都会导致文本跳动与光标漂移，追加式打字只是理想路径。四段式把每段限制在 ≤3 字符，光标管理问题在数学上不存在；「只打数字不加点」的体验由「段满 3 位自动跳段」承接，与单框方案等价。AWS / 阿里云 / Windows / macOS 网络设置均为四段式，用户零学习成本。
替代方案已否决：4×TmInputNumber 组装（InputNumber 的 precision/parser/步进配置对 3 位数字段全是噪音，borderless 化再拼框比原生 input 更 hack）。

### D2: 视觉外壳完全自包含（教训修正：antd v5 样式按组件实例 cssinjs 注入）

初版假设「`<div class="ant-input tm-input-ip">` 外壳挂 ant-input 类名，样式由 antd 既有 CSS 类/变量驱动」。**该假设在实现后被 UI 验收推翻（2026-08-17）**：antd v5 的组件样式是通过 cssinjs 在**组件实例首次渲染时**动态注入的（需渲染真实 `<AntInput>` 才会生成 `.ant-input` 的边框/圆角/背景）；`ant-design-vue/dist` 只提供 `reset.css`，无全量静态 `antd.css`。TmInputIp 内部是 4 个原生 `<input>`、无任何 ant 组件实例，挂 `.ant-input` 类名**拿不到任何样式** → 组件无边框、透明背景。

**修正方案**：视觉完全自包含——外壳用自备 `.tm-input-ip` 类 + 状态类（`-sm/-lg/-disabled/-error`），在 scoped 样式内完整实现对齐 ant v5 Input 的视觉：边框（`--ant-color-border` 回退 `#d9d9d9`）、圆角（`--ant-border-radius` 回退 `6px`）、hover（`colorPrimaryHover`）、focus 环（`:focus-within` + `--ant-color-primary-outline-bg` 回退 `rgba(5,145,255,.1)`）、error 红框、disabled 置灰、size 三档高度（24/32/40）。颜色统一 `var(--ant-*, 默认值)` 双保险：消费方开启 `ConfigProvider theme.cssVar` 时跟随主题，未开启时回退 ant 默认色值，**任何场景都完整可用**，不依赖页面是否恰好渲染过其他 ant 组件。

**D2 修正的守恒教训**：自研组件（不内嵌 ant 组件实例）的外观不能寄生在「antd 类名恰好被注入」上，必须自带对齐 ant 主题的完整视觉。

### D3: 分段内核抽 `useSegmentedInput` composable

签名方向（实现时定稿）：

```
useSegmentedInput({
  segments: 4,                      // 段数：IPv4=4，未来 IPv6=8
  maxLen: 3,                        // 每段最大字符数
  separator: '.',                   // 分隔符（组装与粘贴解析用）
  validate: (s: string) => boolean, // 段级合法性（IPv4: 0-255）
  modelValue,                       // 受控外部值
})
→ { segValues, onSegmentInput, onSegmentKeydown, onPaste, focusSegment, focus(), blur(), displayValue, isComplete }
```

组件层（InputIp.vue）只负责：外壳渲染、FormContext 级联、emit 组装、样式绑定。所有「段状态机」逻辑（跳段/退格回跳/方向键/粘贴分发/越界跳段）收敛在 composable，单测可脱离 DOM 组件直接打。未来 `TmInputIpv6` 换 `segments: 8 / maxLen: 4 / validate: hex` 即可复用。
替代方案否决：逻辑内联在 InputIp.vue——能跑，但第二个分段组件出现时必然返工抽离，且逻辑混在渲染层可测性差。

### D4: 键入拦截双层防线——keydown 先拦截，input 事件兜底

keydown 层拦截非数字与越界键入（体验：字符根本不出现）；input 事件层兜底处理 keydown 拦不住的路径：中文输入法组合键、浏览器自动填充、拖放文本。兜底层做同样规则的重排（拒绝即回写旧值）。粘贴不在这两层处理，走 paste 事件 preventDefault + 解析分发（spec「粘贴解析分发」要求非法整串拒绝）。

### D5: 受控契约——段值半受控，modelValue 单向收敛

内部段值是组件局部状态（用户键入直接改段，体验不抖动）；每次段变化后计算 `isComplete && allValid ? 组装串 : ''` 并 emit。外部 modelValue 变化时**仅在非「本组件刚 emit 的值」时**回写段（本地记录 lastEmitted 防回环），避免受控回写打断用户连续输入。程序设非法值（`999.1.1.1`）不做 clamp：按原文落段、越界段标 error（spec 已约束该行为），合法性以 error 态呈现而非静默改写。
前导零同理：`01` 是合法段值（≤255），显示与 emit 均按原文，不做归一——所见即所得，显示值与提交值永远一致。

### D6: ARIA 语义组装

单一逻辑字段拆四个物理 input，需补齐可访问性：组件根设 `role="group"` + `aria-label`（业务 label 透传）；每段 `aria-label="第 N 段"`；末段 `aria-describedby` 指向校验错误描述节点。这是四段式相对单框的主要代价，可控且一次性。

## Risks / Trade-offs

- [antd 类名契约被大版本重命名（如 antd v5→v6 token 体系变更）] → 视觉外壳集中在少数几个 class 上（D2 的 `.tm-input-ip` 补充层），真发生时改动面收敛在样式文件；升级前跑 demo 视觉回归即可暴露
- [多 input 在表单中宽度表现与单框控件不一致] → 外壳宽度默认 100% 跟随 form item 控件区，段宽 flex 均分（末段不吃剩余空间问题在 demo 三档 size 下验证）
- [emit `''` 契约与「半成品保留显示」并存，业务侧可能误以为有值] → demo 与 README 明确说明；TmForm 场景下 a-form rules 校验的是 modelValue（`''` 触发 required），半成品不参与提交，契约自洽
- [useSegmentedInput 过度设计风险（当前只有 IPv4 一个消费者）] → 抽取界限收敛在「与 IPv4 无关的段机制」（跳段/回跳/粘贴分发/组装），validate/segments 由参数注入——抽取的是机制不是业务，不算投机泛化
- [IME/自动填充路径的拦截遗漏] → D4 双层防线 + 针对性测试（compositionstart/end、drag-drop 用例）；漏网后果有界（兜底层回写旧值，最坏体验是输入被丢弃，不会产生脏值）

## Migration Plan

纯新增组件，无迁移。合入后随下个 minor 版本发布；demo 路由 `routeNames.ts` 追加演示页。回滚 = 移除导出与目录，零残留。
