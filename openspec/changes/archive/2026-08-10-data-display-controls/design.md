## Context

@tm/ui 已完成基础控件（RadioGroup/CheckboxGroup/Switch/InputNumber）与弹层控件（DatePicker/Cascader/TreeSelect）两批，薄封装模式成熟（扩展键剥离、$attrs 合并、slots 透传、useForwardRef、withDefaults Boolean 兜底）。本变更补齐数据展示层三组件。行为契约见 `specs/components/{tag,empty,badge}/spec.md`，动机见 `proposal.md`。

## Goals / Non-Goals

**Goals:**
- 3 个组件与既有组件同构的薄封装骨架
- TmTag 的 `status` 状态→语义色映射（公司统一状态色规范）
- TmEmpty 公司默认空态文案、TmBadge 公司默认兜底

**Non-Goals:**
- 不做表格列渲染集成（TmTag 的 status 可被 TmTable 列单独使用，但本变更不涉及 TmTable 改造）
- 不做全局反馈层（Message/Modal，属方向 2）
- 不做 Tag 的增删改交互增强（ant 原生能力已够）

## Decisions

### 1. TmTag 状态映射直接用 ant 预设色名（零 CSS）

ant Tag 的 `color` 支持预设语义色：`success` / `processing` / `error` / `default` / `warning`。TmTag 的 `status` 枚举直接映射到这些预设名：

```
status: success      → color: 'success'
status: processing   → color: 'processing'
status: failed       → color: 'error'    （业务枚举叫 failed，ant 预设叫 error）
status: warning      → color: 'warning'
未知 status           → undefined → ant 默认色
```

**备选**：映射到自定义 hex / CSS 变量。否决——ant 预设色已提供语义色，且随 ConfigProvider 主题联动；业务还能用 `color` 精确覆盖。零自定义 CSS 最「薄」。

### 2. 显式 color 优先于 status 映射

`antProps.color = props.color ?? STATUS_COLOR[props.status]`。业务显式传 color 时覆盖映射；未传 color 且 status 已知时用映射色。`status` 是扩展键，从透传对象剥离（ant 不识别）。

### 3. TmEmpty / TmBadge 无扩展键，纯透传 + 默认

- `TmEmpty`：`description` 默认 `'暂无数据'`（withDefaults 兜底），业务传值覆盖；ant image/imageStyle 透传
- `TmBadge`：无公司扩展键，ant count/status/dot 全透传 + 公司默认（若有）兜底
- 两者都是最简薄封装，套 Button/Input 骨架即可

### 4. 不抽公共 SFC 模板

延续既有决策（design 记录）：三组件脚本差异小但模板不同，复制骨架比抽象共享组件更易维护。

## Risks / Trade-offs

- [status 枚举覆盖不全（业务有自定义状态）] → 未知 status 回退默认色 + 业务可显式 color 覆盖，映射表后续按需扩展
- [failed 与 ant 的 error 命名差异] → 映射表显式处理，业务感知 `failed` 而非 ant 的 `error`
- [ant 预设色随主题变化] → 这是特性（跟随 ConfigProvider），非风险；如需固定色业务可显式 color
