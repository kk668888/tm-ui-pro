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

// ant-design-vue 主题工具：useToken 返回 { theme, token, hashId }（对象）
// 这里只取 token（GlobalToken，响应式 ComputedRef），它会在 AConfigProvider 包裹下
// 自动接收上层 theme context；测试环境若无 context，则回落到 defaultSeedToken
const { useToken } = theme
const { token } = useToken()

/** 组件 Props 定义 */
const props = defineProps<{
  /**
   * 主题模式：light（默认）/ dark
   * v1 仅作为 algorithm 切换入口，预留扩展点
   * 后续可在此扩展为更丰富的品牌色板 / 自定义 token 覆盖
   */
  themeMode?: 'light' | 'dark'
}>()

/**
 * ant token → vxe CSS 变量映射表
 *
 * 设计原则：
 *   - 单一真相源：只输入 ant token，输出 vxe 变量，避免两套主题各跑一套
 *   - 仅做最小映射（primary / font / radius），覆盖 vxe 视觉的关键变量
 *   - 后续 task 可在此扩展更多映射（如 colorError / 控件高度等）
 *
 * 注意：token.* 在挂载前（首渲染）可能为 undefined（jsdom 边界情况），
 *      使用 ?? 兜底避免生成形如 "undefinedpx" 的脏值，污染样式串
 */
const vxeVars = computed<Record<string, string>>(() => ({
  '--vxe-ui-primary-color': token.value.colorPrimary ?? '',
  '--vxe-ui-font-family': token.value.fontFamily ?? '',
  // borderRadius 在 ant token 中为数字（默认 6），需拼单位
  '--vxe-ui-border-radius':
    token.value.borderRadius != null ? `${token.value.borderRadius}px` : '',
}))

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
  <AConfigProvider :theme="{ algorithm }">
    <div class="tm-config-provider" :style="vxeVars">
      <slot />
    </div>
  </AConfigProvider>
</template>
