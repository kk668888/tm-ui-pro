# ConfigProvider 全局配置

薄包 ant-design-vue 的 `ConfigProvider`，承担三件事：**主题桥接**（把 ant token 映射为 vxe CSS 变量，让 ant 组件与 vxe-table 视觉同源）、**暗色模式**（`themeMode` 切换）、**国际化**（默认 zh_CN locale）。

## 何时使用

- 应用根组件，希望 ant 组件与 vxe 表格视觉一致（主色 / 边框 / hover / 斑马纹同源）。
- 需要一键切换明暗主题，且 vxe 表格同步联动。
- 希望 ant 组件（分页器 / 日期选择器 / 空态）默认显示中文。

## 基础用法

`TmConfigProvider` 包裹业务树：ant token 作为**单一真相源**，自动映射为 `--vxe-ui-*` CSS 变量注入包裹 div，被包裹的 vxe-table 继承该变量层级；点「切换暗色」可观察 ant 与 vxe 同步变暗。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import ConfigProviderDemo from '../../../packages/ui/src/config-provider/demos/basic.vue'
import ConfigProviderDemoCode from '../../../packages/ui/src/config-provider/demos/basic.vue?raw'

// TmPropsTable 数据：TmConfigProvider Props 表格（数据驱动渲染）
const cpProps = [
  {
    prop: 'themeMode',
    desc: '主题模式：`light`（默认）/ `dark`。切换 ant algorithm（default / dark），vxe CSS 变量随 token 联动',
    type: "'light' | 'dark'",
    default: "'light'",
  },
  {
    prop: 'locale',
    desc: 'ant-design-vue 语言包（默认中文 zh_CN）。传入其他 locale 对象后，被包裹的 ant 组件按该语言渲染',
    type: 'Locale',
    default: 'zh_CN',
  },
]
</script>

<DemoBlock :code="ConfigProviderDemoCode">
  <ConfigProviderDemo />
</DemoBlock>

## API

### TmConfigProvider Props

<TmPropsTable :data="cpProps" />

### Slots

- `default` — 业务树内容，包在 ant ConfigProvider 上下文内。

### TmConfigProvider Types

```ts
import type { Locale } from 'ant-design-vue/es/locale'
```

## 扩展机制

- **主题桥接**：`useToken()` 从 ant theme context 取 token（`colorPrimary` / `colorBorder` / `colorFillAlter` / `controlItemBgHover` 等），computed 映射为 vxe CSS 变量（`--vxe-ui-primary-color` / `--vxe-ui-table-border-color` / `--vxe-ui-table-header-background-color` / `--vxe-ui-table-row-hover-background-color` 等）写入包裹 div。业务零配置，ant 换主题 vxe 自动跟随。
- **暗色模式**：`themeMode: 'dark'` → ant `darkAlgorithm`，所有 token 变暗，vxe 变量同步联动。
- **locale**：ant 4.x 的 `app.use(Antd, { locale })` 不接受参数，locale 必须经 `ConfigProvider` 上下文下发。默认 `zh_CN`，业务可传 `en_US` 等覆盖。
- **约定**：`TmConfigProvider` 应在应用根包裹一次；业务未使用它时，vxe 表格走默认主题（与 ant 视觉不联动）。
