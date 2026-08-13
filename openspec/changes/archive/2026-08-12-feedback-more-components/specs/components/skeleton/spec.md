## Purpose

定义 TmSkeleton 骨架屏及子组件的公开行为，为内容加载占位提供统一的骨架展示能力。

## ADDED Requirements

### Requirement: 骨架组合
TmSkeleton SHALL 导出 TmSkeleton 与 TmSkeletonAvatar、TmSkeletonImage、TmSkeletonInput、TmSkeletonButton，并支持标题、段落、头像和自定义占位内容。

#### Scenario: 渲染加载骨架
- **WHEN** 业务启用加载态并提供标题或段落配置
- **THEN** 组件显示对应骨架占位

### Requirement: 原生属性透传
TmSkeleton SHALL 透传 Skeleton 原生属性、事件和插槽，业务显式配置 SHALL 覆盖公司默认值。

#### Scenario: 自定义骨架内容
- **WHEN** 业务提供默认插槽内容
- **THEN** 骨架容器展示业务占位内容
