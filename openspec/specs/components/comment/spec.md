## Purpose

定义 TmComment 评论展示组件的兼容行为，为现有评论界面提供头像、作者、时间、操作和嵌套回复的统一结构。

## Requirements

### Requirement: 评论结构
TmComment SHALL 支持头像、作者、时间、正文、操作区和嵌套评论内容，并保持上游 Comment 的公开用法。

#### Scenario: 渲染完整评论
- **WHEN** 业务提供作者、头像、时间、正文和操作内容
- **THEN** 组件在对应语义区域显示全部内容

### Requirement: 兼容性说明
TmComment SHALL 透传 Comment 原生属性与插槽，并在文档中明确其上游废弃状态和推荐的替代组合方式。

#### Scenario: 查看废弃提示
- **WHEN** 开发者查阅 TmComment 文档
- **THEN** 文档明确标注兼容保留范围及推荐替代方案
