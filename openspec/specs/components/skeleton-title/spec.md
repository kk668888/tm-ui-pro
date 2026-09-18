## Purpose

定义 TmSkeletonTitle 骨架屏标题条的公开行为：ant Skeleton.Title 的库内薄封装，供自定义骨架组合使用。

## Requirements

### Requirement: 标题条契约

TmSkeletonTitle SHALL 渲染为骨架占位标题条：`width` 控制条宽（数值或百分比），宽度随父容器自适应，呈骨架动画样式。

#### Scenario: 指定宽度
- **WHEN** 业务传 `width: '50%'`
- **THEN** 标题条占父容器一半宽度并呈骨架动画

### Requirement: 原生属性透传

TmSkeletonTitle SHALL 透传 `className` / `style` / `prefixCls` 等原生属性，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于标题条节点
