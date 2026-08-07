<!-- packages/ui/src/config-provider/ConfigProvider.vue -->
<!--
  TmConfigProvider：薄包 ant-design-vue 的 ConfigProvider
  职责：
    1) 预留公司主题注入点（v1 用 ant 默认 token；后续 task 接入品牌色板）
    2) 把 ant design token 映射成 vxe CSS 变量（--vxe-ui-*）写入包裹 div 的 style，
       实现 ant 组件与 vxe-table 视觉同源 / 主题联动，单一真相源驱动两套库
    3) 预留 themeMode（light/dark）扩展点，便于后续接公司暗色主题
-->
<script setup lang="ts">
import { computed } from 'vue'
import { ConfigProvider as AConfigProvider, theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import type { Locale } from 'ant-design-vue/es/locale'

// ant-design-vue 主题工具：useToken 返回 { theme, token, hashId }（对象）
// 这里只取 token（GlobalToken，响应式 ComputedRef），它会在 AConfigProvider 包裹下
// 自动接收上层 theme context；测试环境若无 context，则回落到 defaultSeedToken
const { useToken } = theme
const { token } = useToken()

/** 组件 Props 定义（locale 默认 zhCN：公司中文环境，业务可传其他语言覆盖） */
const props = withDefaults(
  defineProps<{
    /**
     * 主题模式：light（默认）/ dark
     * v1 仅作为 algorithm 切换入口，预留扩展点
     * 后续可在此扩展为更丰富的品牌色板 / 自定义 token 覆盖
     */
    themeMode?: 'light' | 'dark'
    /**
     * ant-design-vue 组件语言包（默认中文 zh_CN）
     * 传入后所有被本 Provider 包裹的 ant 组件（分页器 / 日期选择器 / 空态等）按该语言渲染
     * 业务需要其他语言时传对应 locale 对象即可
     */
    locale?: Locale
  }>(),
  { locale: () => zhCN },
)

/**
 * ant token → vxe CSS 变量映射表（v2 扩展 3 → ~20 个，见 change design D6）
 *
 * 设计原则：
 *   - 单一真相源：只输入 ant token，输出 vxe 变量，避免两套主题各跑一套
 *   - 覆盖 vxe-table 完整视觉关键变量：状态色 / 文字色 / 边框 / 表头 / hover / 斑马纹 / 选中态 / 校验色
 *   - 后续可继续扩展（如 --vxe-ui-base-popup-* 弹层等）
 *
 * 注意：token.* 在挂载前（首渲染）可能为 undefined（jsdom 边界情况），
 *      使用 ?? 兜底避免生成形如 "undefinedpx" 的脏值，污染样式串
 */
const vxeVars = computed<Record<string, string>>(() => {
  const t = token.value
  return {
    // 主题色 / 状态色（vxe status 语义 ↔ ant 语义色）
    '--vxe-ui-primary-color': t.colorPrimary ?? '',
    '--vxe-ui-status-info-color': t.colorInfo ?? '',
    '--vxe-ui-status-success-color': t.colorSuccess ?? '',
    '--vxe-ui-status-warning-color': t.colorWarning ?? '',
    '--vxe-ui-status-danger-color': t.colorError ?? '',
    // 文字色 / 次级文字色
    '--vxe-ui-font-color': t.colorText ?? '',
    '--vxe-ui-font-tinge-color': t.colorTextSecondary ?? '',
    // 表格边框 / 输入边框
    '--vxe-ui-table-border-color': t.colorBorder ?? '',
    '--vxe-ui-input-border-color': t.colorBorder ?? '',
    // 表格背景（页面布局底色）
    '--vxe-ui-layout-background-color': t.colorBgLayout ?? '',
    // 表头背景 / 表头文字
    '--vxe-ui-table-header-background-color': t.colorFillAlter ?? '',
    '--vxe-ui-table-header-font-color': t.colorTextSecondary ?? '',
    // 行 hover / 选中态 / 斑马纹
    '--vxe-ui-table-row-hover-background-color': t.controlItemBgHover ?? '',
    '--vxe-ui-table-row-current-background-color': t.controlItemBgActive ?? '',
    '--vxe-ui-table-row-striped-background-color': t.colorFillContent ?? '',
    // 校验错误
    '--vxe-ui-table-validate-error-color': t.colorError ?? '',
    // 字体 / 圆角
    '--vxe-ui-font-family': t.fontFamily ?? '',
    '--vxe-ui-border-radius':
      t.borderRadius != null ? `${t.borderRadius}px` : '',
  }
})

/**
 * algorithm 选择器：dark → darkAlgorithm，否则 defaultAlgorithm
 * 直接喂给 AConfigProvider 的 theme.algorithm，实现暗色模式联动
 */
const algorithm = computed(() =>
  props.themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
)
</script>

<template>
  <!--
    包一层 AConfigProvider：注入 ant theme context（驱动 useToken）
    内部 div：承载 vxe CSS 变量，所有 vxe-table 子组件继承该变量层级
  -->
  <AConfigProvider :theme="{ algorithm }" :locale="locale">
    <div class="tm-config-provider" :style="vxeVars">
      <slot />
    </div>
  </AConfigProvider>
</template>
