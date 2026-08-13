## 1. 模块骨架与默认值

- [x] 1.1 创建 15 个组件模块目录及 `src`、`demos`、`__tests__` 骨架，按设计区分单组件与多子组件出口
- [x] 1.2 为 TmCard 创建 `defaults.ts`，定义 `bordered: true` 与 `size: 'default'` 公司默认并编写详细注释
- [x] 1.3 为 TmTooltip 创建 `defaults.ts`，定义位置、溢出调整和箭头公司默认并编写详细注释

## 2. 基础数据容器实现

- [x] 2.1 实现 TmCard 薄封装、类型出口、动态插槽与实例透传，并保证业务值覆盖公司默认
- [x] 2.2 实现 TmCollapse 与 TmCollapsePanel，覆盖活动面板、手风琴模式、事件和插槽透传
- [x] 2.3 实现 TmDescriptions 与 TmDescriptionsItem，覆盖列数、布局、条目样式和插槽透传
- [x] 2.4 实现 TmTimeline，覆盖模式、待处理状态和默认插槽透传且不扩大提案公开 API
- [x] 2.5 实现 TmList、TmListItem 与 TmListItemMeta，覆盖数据源、分页、加载状态和条目插槽透传

## 3. 媒体与标识实现

- [x] 3.1 实现 TmAvatar 与 TmAvatarGroup，覆盖图片回退、尺寸、形状和溢出汇总透传
- [x] 3.2 实现 TmImage 与 TmImagePreviewGroup，覆盖预览受控状态、占位、失败回退和插槽透传
- [x] 3.3 实现 TmCarousel，覆盖自动播放、切换事件及 `next`、`prev`、`goTo` 公开方法透传
- [x] 3.4 实现 TmQRCode，覆盖二维码状态、样式、图标和刷新事件透传

## 4. 指标与交互展示实现

- [x] 4.1 实现 TmSegmented，覆盖受控值、选项、禁用状态和变化事件透传
- [x] 4.2 实现 TmStatistic 与 TmCountdown，覆盖数值格式化、前后缀和完成事件透传
- [x] 4.3 实现 TmCalendar，覆盖受控日期、面板切换、范围和单元格插槽透传
- [x] 4.4 实现 TmTooltip，使用公司默认并确保缺省 `open`/`visible` 不形成受控幻影 false
- [x] 4.5 实现兼容型 TmComment，保持上游 props/slots 且不增加新的评论数据模型
- [x] 4.6 实现 TmWatermark，覆盖文本、图片、字体、间距、偏移和默认内容插槽透传

## 5. 注册与类型导出

- [x] 5.1 更新 `packages/ui/src/index.ts`，注册并导出 15 个主组件、设计列明的子组件及公开类型
- [x] 5.2 验证 resolver 的 `Tm` 前缀泛化解析覆盖所有新增组件且无需维护组件白名单
- [x] 5.3 运行 `pnpm --filter @tm/ui build`，确认 ESM/CJS 与声明文件产物可生成

## 6. 自动化测试

- [x] 6.1 为 Card、Collapse、Descriptions、Timeline、List 编写聚焦测试，覆盖默认值、状态、事件与插槽透传
- [x] 6.2 为 Avatar、Image、Carousel、QRCode 编写聚焦测试，覆盖失败回退、受控预览、公开方法与刷新事件
- [x] 6.3 为 Segmented、Statistic、Calendar、Tooltip、Comment、Watermark 编写聚焦测试，覆盖受控状态、Boolean 陷阱和兼容契约
- [x] 6.4 运行 `pnpm --filter @tm/ui test` 与根目录 `pnpm test`，修复新增回归并保持项目覆盖率门禁

## 7. 文档与最终验证

- [x] 7.1 为 15 个组件创建可运行 demos 与 `apps/docs/components/*.md` 文档，列出公司默认、原生透传和子组件出口
- [x] 7.2 在 TmComment 文档标注上游废弃状态，并给出基于 Avatar、Flex、Space、Typography 的推荐替代方式
- [x] 7.3 更新 `apps/docs/.vitepress/config.ts` 的“数据展示”侧边栏，确保新增页面可导航
- [x] 7.4 运行文档构建、根目录构建和 `openspec validate 2026-08-12-data-display-components --strict` 完成最终门禁
