// apps/docs/.vitepress/config.ts
// VitePress 站点配置：标题、导航、侧边栏与 Vite SSR 选项
//
// 设计要点（Task 15 / Bug 2 + Bug 6）：
// - 文档站定位为「应用层」，承载所有应用级依赖；通过 workspace:* 引用 @kibus/tm-ui-plus，
//   确保核心库零应用依赖。
// - 移除 Task 3 的 ignoreDeadLinks:true（当时 /components/* 链接暂无内容）。
//   Task 15 创建 5 个组件页后，所有 nav/sidebar 链接都有真实目标，可恢复死链校验，
//   防止后续误改链接导致死链被静默忽略。
// - vite.ssr.noExternal：让 VitePress SSR 阶段把 ant-design-vue / vxe / @kibus/tm-ui-plus 等
//   ESM 包打进 SSR bundle（而非视为 external 走 node 原生 resolve），避免
//   `Cannot find module` / `named export not found` 类 SSR 报错（Bug 6）。
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@kibus/tm-ui-plus 组件库',
  description: '公司内部基于 ant-design-vue + vxe-table 二次封装的组件库',
  // Bug 2：移除 ignoreDeadLinks（Task 3 deferred 收口）。
  // 各组件页 + nav/sidebar 链接均有真实目标，死链校验恢复启用。
  vite: {
    ssr: {
      // Bug 6：SSR bundle 必须包含以下 ESM 包，否则 VitePress build 阶段
      // `renderToString(<TmTable>)` 会因 vxe / @kibus/tm-ui-plus 命名 export 无法解析而报错。
      noExternal: [
        '@kibus/tm-ui-plus',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'vxe-table',
        'vxe-pc-ui',
        '@vxe-ui/core',
      ],
    },
  },
  themeConfig: {
    // 本地全文搜索：VitePress 内置 local search，构建期索引全站，客户端零请求检索
    search: {
      provider: 'local',
    },
    nav: [{ text: '组件', link: '/components/button' }],
    sidebar: {
      // /components/ 前缀的页面统一展示组件侧边栏
      '/components/': [
        {
          text: '基础组件',
          items: [
            { text: 'Button 按钮', link: '/components/button' },
            { text: 'Input 输入框', link: '/components/input' },
            { text: 'InputNumber 数字输入框', link: '/components/input-number' },
            { text: 'Select 选择器', link: '/components/select' },
            { text: 'RadioGroup 单选组', link: '/components/radio-group' },
            { text: 'CheckboxGroup 复选组', link: '/components/checkbox-group' },
            { text: 'Switch 开关', link: '/components/switch' },
          ],
        },
        {
          text: '通用与布局',
          items: [
            { text: 'Typography 排版', link: '/components/typography' },
            { text: 'Space 间距', link: '/components/space' },
            { text: 'Flex 弹性布局', link: '/components/flex' },
            { text: 'Grid 栅格', link: '/components/grid' },
            { text: 'Divider 分割线', link: '/components/divider' },
            { text: 'Layout 布局', link: '/components/layout' },
          ],
        },
        {
          text: '导航',
          items: [
            { text: 'Menu 导航菜单', link: '/components/menu' },
            { text: 'Tabs 标签页', link: '/components/tabs' },
            { text: 'Breadcrumb 面包屑', link: '/components/breadcrumb' },
            { text: 'Dropdown 下拉菜单', link: '/components/dropdown' },
            { text: 'Steps 步骤条', link: '/components/steps' },
            { text: 'Pagination 分页', link: '/components/pagination' },
            { text: 'PageHeader 页头', link: '/components/page-header' },
            { text: 'Anchor 锚点', link: '/components/anchor' },
            { text: 'Affix 固钉', link: '/components/affix' },
          ],
        },
        {
          text: '表单',
          items: [
            { text: 'Form 表单', link: '/components/form' },
            { text: 'DatePicker 日期选择', link: '/components/date-picker' },
            { text: 'TimePicker 时间选择', link: '/components/time-picker' },
            { text: 'Cascader 级联选择', link: '/components/cascader' },
            { text: 'TreeSelect 树选择', link: '/components/tree-select' },
            { text: 'Tree 树形控件', link: '/components/tree' },
            { text: 'AutoComplete 自动完成', link: '/components/auto-complete' },
            { text: 'Mentions 提及', link: '/components/mentions' },
            { text: 'Transfer 穿梭框', link: '/components/transfer' },
            { text: 'Slider 滑块', link: '/components/slider' },
            { text: 'Rate 评分', link: '/components/rate' },
            { text: 'Checkbox 复选框', link: '/components/checkbox' },
            { text: 'Radio 单选框', link: '/components/radio' },
            { text: 'Upload 文件上传', link: '/components/upload' },
          ],
        },
        {
          text: '数据展示',
          items: [
            { text: 'Table 表格', link: '/components/table' },
            { text: 'Tag 标签', link: '/components/tag' },
            { text: 'Badge 徽标', link: '/components/badge' },
            { text: 'Empty 空状态', link: '/components/empty' },
            { text: 'Card 卡片', link: '/components/card' },
            { text: 'Collapse 折叠面板', link: '/components/collapse' },
            { text: 'Descriptions 描述列表', link: '/components/descriptions' },
            { text: 'Timeline 时间轴', link: '/components/timeline' },
            { text: 'Avatar 头像', link: '/components/avatar' },
            { text: 'Image 图片', link: '/components/image' },
            { text: 'List 列表', link: '/components/list' },
            { text: 'Segmented 分段控制器', link: '/components/segmented' },
            { text: 'Statistic 统计数值', link: '/components/statistic' },
            { text: 'Calendar 日历', link: '/components/calendar' },
            { text: 'Carousel 轮播', link: '/components/carousel' },
            { text: 'QRCode 二维码', link: '/components/qrcode' },
            { text: 'Tooltip 文字提示', link: '/components/tooltip' },
            { text: 'Comment 评论', link: '/components/comment' },
            { text: 'Watermark 水印', link: '/components/watermark' },
          ],
        },
        {
          text: '全局反馈',
          items: [
            { text: 'Alert 警告提示', link: '/components/alert' },
            { text: 'Popconfirm 气泡确认框', link: '/components/popconfirm' },
            { text: 'Popover 气泡卡片', link: '/components/popover' },
            { text: 'Result 结果页', link: '/components/result' },
            { text: 'Spin 加载中', link: '/components/spin' },
            { text: 'App 全局反馈桥接', link: '/components/app' },
            { text: 'Message 全局消息', link: '/components/message' },
            { text: 'Notification 通知提醒', link: '/components/notification' },
            { text: 'Modal 对话框', link: '/components/modal' },
            { text: 'Drawer 抽屉', link: '/components/drawer' },
            { text: 'Progress 进度条', link: '/components/progress' },
            { text: 'Skeleton 骨架屏', link: '/components/skeleton' },
            { text: 'Tour 引导', link: '/components/tour' },
            { text: 'FloatButton 浮动按钮', link: '/components/float-button' },
          ],
        },
        {
          text: '全局配置',
          items: [{ text: 'ConfigProvider', link: '/components/config-provider' }],
        },
      ],
    },
  },
})
