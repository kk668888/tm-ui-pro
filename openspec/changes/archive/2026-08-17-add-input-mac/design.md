# add-input-mac 设计文档

## Context

见 proposal.md「Why」。现状约束：`TmInputIp` 刚刚交付（commit `3619954`），沉淀了 renderless 分段内核 `useSegmentedInput`（`packages/ui/src/composables/useSegmentedInput.ts`）——段值状态、跳段/回跳/方向键跨段、键入拦截、input 兜底、粘贴分发、受控回写、焦点方法均已实现且 IPv4 单测全绿。`TmInputMac` 作为该内核的第二个消费者，核心命题是「**复用 vs 扩展的边界**」：MAC 与 IPv4 共享全部段机制，差异只在「每段 2 位十六进制」与「blur 归一化（补零 + 大写）」。视觉外壳沿用 input-ip 的自包含方案（D2 守恒教训：antd v5 样式按组件实例 cssinjs 注入，自研组件必须自带完整 scoped 视觉，`var(--ant-*, 默认值)` 双保险 + `:focus-within`）。

## Goals / Non-Goals

**Goals:**

- 六段式 MAC 输入完整交互，段机制 100% 复用 `useSegmentedInput`，组件层零收益于「重写任何段逻辑」
- 归一化（大写 + 零填充）只在 blur 收敛，输入过程不打断、不光标漂移
- 视觉与库内 ant 封装组件零差异（size/disabled/readonly/focus/error 态全对齐）
- v-model 单字段契约（`''` 或规范 MAC 串），与 TmForm/a-form rules 无缝集成

**Non-Goals:**

- IPv6（未来独立组件）、`-`/`:` 双分隔符粘贴容错、MAC 前缀/厂商 OUI 语义校验——均见 proposal Non-Goals
- 打破 input-ip 已建立的 v-model 契约语义（`''` 即未齐/非法；IPv4 前导零原文保留行为绝不回归）

## Decisions

### D_MAC1: 复用 `useSegmentedInput`，新增可选 `normalize` 钩子，而非 fork 一份内核

`useSegmentedInput` 现签名已暴露 `acceptChar` / `sanitize` / `validate` 三个注入点，MAC 换上 `segments: 6 / maxLen: 2 / separator / acceptsHex / stripNonHex / validateHex` 即可跑通全部段机制。但「每段 2 位十六进制、blur 统一大写 + 补零」这条规则**内核现在没有落点**：

```
IPv4  段值 "1" (1位) 合法 → 四段齐即 isComplete → emit  "1.1.1.1"
MAC   段值 "A" (1位) 合法十六进制，但 MAC 规范要求 2 位 "0A"
```

若把「1 位段即合法」进 `validate` → 用户打满 `a:b:c:d:e:f` 六段就 emit `A:B:C:D:E:F`（非规范值）；若把「2 位才合法」进 `validate` → 用户打第 1 位 `a` 就会被 input 兜底收缩逻辑吞掉（`validate('a')` 为 false）。**二者不可兼得** → 必须把「**输入期接收校验**（1-2 位 hex）」与「**完成期格式校验**（2 位）」拆成两把尺。

**方案**：内核新增可选参数 `normalize?: (seg: string) => string`，语义为「**段值在 blur 收敛时统一应用的后处理**」——输入期校验用 `validate`（宽松，接收 1-2 位），`isComplete` 判断用「normalize 后再 validate」的完成期校验（严格，2 位）。MAC 传 `normalize: hex => hex.toUpperCase().padStart(2, '0')`，IPv4 不传 → 全部行为与现内核逐字节一致（向后兼容零破坏，已归档 input-ip spec 不受影响）。

### D_MAC2: 落实 blur 收敛——`onBlur` 层调用 normalize 重写段 + 重算 isComplete

spec 要求「blur 才归一，输入中不归一」。落地：组件在四个段 input 上监听 `@blur`（用 `relatedTarget` 判断焦点是否完全离开整个外壳，避免段与段之间互跳触发；段间跳转由内核 focusSegment 处理，不认为离开组件）。blur 触发时：

1. 对全部非空段执行 `normalize(seg)`（`A`→`0A`，`AB`→`AB`），回写段值
2. 重算 `isComplete`（此时六段全 2 位 hex → 触发延迟 emit 规范串，spec「blur 后 emit canonical」）

**关键取舍**：input-ip 的「blur 保留半成品原文」契约，在 MAC 上变成「blur 归一化半成品」——这是刻意的（否则无法产出规范值），且不倒退 IPv4 行为（IPv4 不传 normalize，blur 无归一逻辑，原文保留依旧）。半成品（如只填了 3 段）blur 后仍 emit `''`，仅未填齐的段保持空。

### D_MAC3: 分段对齐——maxLen=2 下「跳段」仍由内核现逻辑覆盖，「越界承载」自动不触发

MAC 每段最大 2 位十六进制（00-FF），**天然不存在 IPv4 的「越界数值」**（FF 即上限，2 位封顶），因此内核的「>maxLen 越界跳段承载」与「尾部收缩直到 validate」两条路径在 MAC 下**逻辑上永不走到**——跳段只由「段满 2 位 + 回车？」外的正常路径触发，体验更简单。但归一化钩子与内核「input 兜底收缩」有交互死角：`maxlength="2"` 的原生 input 允许段内 `A`，用户继续打 `B` → 段变 `AB` 仍合法（1-2 位）→ 内核按 `next.length === 2` 自动跳段，**此时段值可能尚未归一**（`a` 实时已转大写，但没补零）。因此在 input 兜底层（onSegmentInput）实时执行 `sanitize`（剥非 hex + 转大写，见 D_MAC4），保证段内显示「大写但不零填充」，blur 才补零。

### D_MAC4: 实时大写走 `sanitize`，零填充只走 `normalize`（分离两件事）

- `acceptChar: /^[0-9a-fA-F]$/` —— keydown 拦截层只放行 hex 字符
- `sanitize: s => s.replace(/[^0-9a-fA-F]/g, '').toUpperCase()` —— input 兜底层实时清理脏值 + 转大写（**剥字符**与**转大写**一步完成；IPv4 的 sanitize 无 toUpperCase，行为不变）
- `validate: s => /^[0-9A-F]{1,2}$/.test(s)` —— 输入期接收校验（1-2 位）
- `normalize: s => s.toUpperCase().padStart(2, '0')` —— blur 补零 + 兜底大写
- 完成期校验（isComplete）：内核在 normalize 后重跑 validate → 2 位 hex

大小写策略：**存储/emit 恒为大写**（D_MAC1 的 normalize 保证），所见即所得、提交值规范，业务侧校验/去重无需再归一。与 input-ip 的「前导零原文保留」不同——那是十进制语义（`01` 合法可被业务接受），MAC 的 `0A` 是格式必需（`A` 缺零非法），两套策略各自合理。

### D_MAC5: 分隔符 `separator` prop 进参数，粘贴解析/组装共用

内核的 `separator` 参数已同时驱动「段组装 emit」与「粘贴解析」——MAC 组件把 props.separator（默认 `':'`）直接透传，即完成「分隔符可配置」spec 的全部语义。「粘 `-` 形式到 `:` 模式」整串拒绝，是 spec 明示行为（Non-Goal 双格式容错），由内核现粘贴逻辑天然达成，无需新代码。

### D_MAC6: 视觉复用 input-ip 自包含外壳，改类名前缀

`.tm-input-ip` → `.tm-input-mac`，变量映射/`var(--ant-*, 默认值)`/`:focus-within`/size 三档/disabled/error/readonly 全套照抄。若未来第三个值类分段组件（IPv6）出现，可考虑抽公共 `.tm-segmented-shell` 样式，但**当前不抽**（遵守「两处不抽、三处再抽」的复用边界，input-ip 已独立交付，强行重构它不值当）。

### D_MAC7: 无 D6 增量——ARIA 直接沿用输入法系

input-ip 的 ARIA 组装（根 `role="group"` + `aria-label`、逐段 `aria-label="第 N 段"`、末段 `aria-describedby` 错误节点）在 MAC 上原样复用，段数从 4 变 6 由模板循环驱动，无新设计。

## Risks / Trade-offs

- [`normalize` 钩子改变 isComplete 语义，可能影响未来其他消费者理解] → 钩子为可选且文档注明「仅 blur 收敛时执行」，IPv4 不传则 isComplete 与现行为完全一致；spec 的完成期校验语言已写明
- [blur 归一会改写用户正在编辑的段值（只见 `A` 突然变 `0A`）] → 这是 spec 明示行为（blur 补零），且补零后值**变长变规范**，不会丢文本；若业务需要「所见即最终提交值」可在 blur 后读取 emit 值
- [`relatedTarget` 判断离开外壳在家用浏览器/部分焦点场景可能误判] → fallback：即使误判触发 blur 归一，段值变规范也无数据损失（补零幂等），回归测试覆盖段间跳转不触发 blur
- [nested 双实例（两个 TmInputMac 相邻）blur 归一交错] → 每实例有独立 segEls，normalize 只写本实例段，互不影响（单测覆盖）
- [复用边界：当前仍只有 input-ip 一个先例，normalize 钩子是否过度设计] → 钩子是「MAC 需求的直接投射」且为可选向后兼容，非投机抽象