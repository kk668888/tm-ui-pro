## Purpose

定义 TmCarousel 轮播组件的公开行为，为横幅、图片集和内容分屏提供可自动播放且可受控的切换能力。

## Requirements

### Requirement: 轮播内容与切换
TmCarousel SHALL 支持多个内容页、指示点、箭头、自动播放、切换效果及受控定位方法。

#### Scenario: 自动播放内容
- **WHEN** 业务启用自动播放并提供多个内容页
- **THEN** 组件按照配置间隔切换当前内容页

### Requirement: 原生能力透传
TmCarousel SHALL 透传 Carousel 原生属性、事件、插槽和公开方法，包括切换前后事件及上一页、下一页和定位方法。

#### Scenario: 调用下一页方法
- **WHEN** 业务通过组件引用调用下一页方法
- **THEN** 轮播切换到下一个可用内容页
