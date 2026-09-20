# ScreenFrame — 大屏框架

从 `release/index.html` 的设计稿（天懋主动安全监测与审计系统）里**只提炼框架与主题**，
不含任何业务内容。业务字段、文案、菜单项全部通过插槽注入。

## 交付了什么

| 提炼项           | 说明                                                     |
| :--------------- | :------------------------------------------------------- |
| **四段式布局**   | 顶栏 / 副栏 / 侧栏 / 工作区，尺寸与原稿一致              |
| **收敛后的色板** | 原稿散落的 10+ 个近似青归并为 `--screen-*` 一套变量      |
| **结构固化**     | 原稿用 JS 在运行时重写 DOM，这里全部改为静态模板         |
| **等比缩放**     | 原稿是非等比 `scale(sx, sy)`（会拉伸变形），这里改为等比 |

## 文件

```
screen-frame/
├── ScreenFrame.vue          框架壳：四段式组装 + 缩放 + 插槽
├── ScreenTopbar.vue         顶栏（品牌 / 导航 / 动作三段）
├── ScreenSubbar.vue         副栏（返回 / 标签 / 右侧信息）
├── ScreenSidebar.vue        侧栏容器
├── ScreenPanel.vue          工作区分区（扁平样式，标题带发光竖条）
├── ScreenNavItem.vue        顶栏导航项（激活态：发光 + 两侧菱形）
├── ScreenSideItem.vue       侧栏项（激活态：箭头形切角）
├── ScreenChip.vue           斜切标签
├── useScreenScale.ts        等比缩放 composable
└── screen-frame.tokens.css  收敛后的主题 token
```

## 用法

```vue
<script setup lang="ts">
import ScreenFrame from '@/shared/components/screen-frame/ScreenFrame.vue';
import ScreenNavItem from '@/shared/components/screen-frame/ScreenNavItem.vue';
import ScreenSideItem from '@/shared/components/screen-frame/ScreenSideItem.vue';
import ScreenPanel from '@/shared/components/screen-frame/ScreenPanel.vue';

const navs = ['模块一', '模块二', '模块三'];
const sides = ['分组一', '分组二', '分组三'];
</script>

<template>
  <ScreenFrame>
    <template #brand>系统名称</template>

    <template #nav>
      <ScreenNavItem v-for="(n, i) in navs" :key="n" :active="i === 0">{{ n }}</ScreenNavItem>
    </template>

    <template #sidebar>
      <ScreenSideItem v-for="(s, i) in sides" :key="s" :active="i === 2">{{ s }}</ScreenSideItem>
    </template>

    <!-- 默认插槽 = 工作区内容 -->
    <ScreenPanel title="面板一">
      <p>这里放业务内容（建议用 @trustmo/tm-ui 的表单/表格组件填充）</p>
    </ScreenPanel>

    <ScreenPanel title="面板二">
      <p>相邻面板之间会自动出现分隔线</p>
    </ScreenPanel>
  </ScreenFrame>
</template>
```

## 插槽

| 插槽            | 位置                 | 常放什么              |
| :-------------- | :------------------- | :-------------------- |
| `#brand`        | 顶栏左（固定 430px） | 系统名                |
| `#nav`          | 顶栏中（占满剩余）   | 若干 `ScreenNavItem`  |
| `#actions`      | 顶栏右               | 图标、头像            |
| `#back`         | 副栏左               | 返回箭头              |
| `#chips`        | 副栏中               | 若干 `ScreenChip`     |
| `#subbar-extra` | 副栏右               | 系统时间、状态        |
| `#sidebar`      | 侧栏                 | 若干 `ScreenSideItem` |
| 默认插槽        | 工作区（可滚动）     | 若干 `ScreenPanel`    |

## Props

| 组件             | Prop                    | 默认    | 说明                                          |
| :--------------- | :---------------------- | :------ | :-------------------------------------------- |
| `ScreenFrame`    | `width`                 | `2048`  | 设计稿宽（px）                                |
| `ScreenFrame`    | `height`                | `1088`  | 设计稿高（px）                                |
| `ScreenFrame`    | `fit`                   | `true`  | `true` 按窗口等比缩放；`false` 撑满容器自适应 |
| `ScreenPanel`    | `title`                 | `''`    | 不传则整个标题栏不渲染                        |
| `ScreenNavItem`  | `active`                | `false` | 是否激活                                      |
| `ScreenSideItem` | `active` / `expandable` | `false` | 是否选中 / 是否显示展开箭头                   |
| `ScreenChip`     | `active`                | `false` | 是否选中                                      |

## 主题 token

全部定义在 `.screen-frame` 上（**作用域变量**，不污染外部）：

| 变量                      | 值        | 用途                     |
| :------------------------ | :-------- | :----------------------- |
| `--screen-primary`        | `#00acd8` | 主色：边框、图标、激活态 |
| `--screen-primary-strong` | `#00b9e7` | 强调：发光、焦点         |
| `--screen-primary-bright` | `#66d7f0` | 高亮：只读值、数字       |
| `--screen-bg-deep`        | `#031f28` | 最底层画布               |
| `--screen-bg-sider`       | `#03232c` | 侧栏                     |
| `--screen-bg-panel`       | `#07313d` | 工作区                   |
| `--screen-bg-card`        | `#082f3a` | 卡片 / 控件              |
| `--screen-border`         | `#174756` | 分割线                   |
| `--screen-border-strong`  | `#28515d` | 控件边框                 |
| `--screen-text`           | `#789aa5` | 正文                     |
| `--screen-text-muted`     | `#668a96` | 次要文字                 |
| `--screen-text-strong`    | `#d0e2e6` | 标题                     |
| `--screen-success`        | `#54bd17` | 开关「开」               |
| `--screen-danger`         | `#e26c62` | 必填星号                 |
| `--screen-accent`         | `#c9d817` | 导航激活菱形             |

尺寸（顶栏 62 / 副栏 50 / 侧栏 186 / 面板头 42 / 字段行 50 / 控件 36 / 标签列 160）
同样以 `--screen-*` 变量给出，改布局只改 `screen-frame.tokens.css`。

## 与 demo 主题体系的关系

demo 主站的 `--color-primary` / `--bg-container` 是 **ant 语义色**，由 ThemeProvider 注入、
随明暗切换；本框架的 `--screen-*` 是**布局壳专用**的固定深青。两者分工不同：

| 变量         | 管什么                                  | 来源                                | 随主题切换 |
| :----------- | :-------------------------------------- | :---------------------------------- | :--------- |
| `--screen-*` | 外壳（顶栏 / 副栏 / 侧栏 / 工作区底色） | 本组件目录，固定值                  | 否         |
| 主站 token   | 内容区（ant / tm-ui 组件）              | `theme.tokens.json` → ThemeProvider | 是         |

为了让外壳与内容区视觉统一，demo 新增了 **`screen`（大屏深青）主题预设**并设为默认，
同时默认切到暗色模式 —— 深青底 + 浅青文字是一整套，只换主色会得到「深青底 + 深色文字」
这种不可读的组合。用户仍可用主题切换器改回其他配色。

为什么不把 `--screen-*` 塞进 `theme.tokens.json`：那是全局语义层，塞进去会污染所有页面，
还会触发 `tokens:check` 契约校验。因此收敛为**作用域变量**，只在 `.screen-frame` 子树内生效。

## 与原稿的取舍记录

| 项         | 原稿                                         | 这里                | 原因                               |
| :--------- | :------------------------------------------- | :------------------ | :--------------------------------- |
| 缩放       | `scale(innerWidth/2048, innerHeight/1088)`   | 等比取较小值        | 原稿在比例不一致时元素被拉伸变形   |
| 缩放后定位 | 左上角对齐                                   | 居中                | 等比缩放后四周会留白，居中更稳     |
| 结构       | JS 在运行时改 order、搬元素、`remove()` 卡片 | 静态模板 + 插槽     | 运行时改造无法维护                 |
| 色值       | 10+ 个近似青散落各处                         | 归并为 `--screen-*` | 改色只需改一处                     |
| 卡片       | 前几轮：卡片 + 边框 + 阴影                   | 扁平分区 + 发光竖条 | 采用原稿 14 轮迭代后的**最终**形态 |
| 面板命名   | `card`                                       | `panel`             | 避免与 tm-ui 的 `TmCard` 语义混淆  |

## 与 tm-ui 的关系

框架只提供**容器与装饰**，不含表单/表格控件。工作区内容请用 `@trustmo/tm-ui` 组件填充
（`TmInput` / `TmSelect` / `TmSwitch` / `TmForm` + `TmFormItem` 等），不要手写原生控件。
