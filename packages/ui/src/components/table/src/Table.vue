<!-- packages/ui/src/components/table/src/Table.vue -->
<!--
  TmTable 范本组件：薄封装 vxe-grid + request 远程扩展
  核心机制（沿用 TmSelect/TmInput 已确立的封装模式）：
  1. 单一 forwardBindings computed（plan-bug #1 修正）：合并 $attrs + 已剥离扩展键的 vxe 原生 props
     - 远程模式：data/total/pagerConfig 由 usePagination 维护并下发
     - 静态模式：透传业务 data prop
  2. 扩展属性剥离：request 不下发 vxe（vxe 不识别），仅在内部驱动 onMounted + page-change
  3. 方法透传：useForwardRef + defineExpose(exposed)（plan-bug #2 方案 A，与 TmSelect 一致）
     - 不 spread Proxy（vxe 方法 commit/revertData/clearData/getCheckboxRecords 全部保真转发）
     - fetchData 不暴露 vm：mount 拉首页 + page-change 自动 refetch 已覆盖核心场景
  4. request 远程扩展（Bug 3/4 修复）：
     - Bug 3：远程 data + total 必须透传 VxeGrid（plan 漏写 → 表格空）
     - Bug 4：page-change 事件必须绑定 onPageChange（plan 漏写 → 翻页失效）
  5. race condition 防护：usePagination 内部 token 守卫，快速翻页下乱序响应被丢弃
-->
<script setup lang="ts">
// 所有 import 必须在 <script setup> 顶部（plan-bug #5 修正：plan 把 onMounted 写在 script 中途）
import { computed, onMounted, useAttrs } from 'vue'
import { VxeGrid, type VxeGridInstance } from 'vxe-table'
import type { TmTableProps } from './props'
import { tmTableDefaults } from './defaults'
import { useColumns } from './composables/useColumns'
import { usePagination } from './composables/usePagination'
import { useForwardRef } from '../../../composables/useForwardRef'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 forwardBindings 合并
defineOptions({ name: 'TmTable', inheritAttrs: false })

/**
 * 组件 props：TmTableProps = VxeGridProps（vxe 原生）+ { request? }（公司扩展）
 *
 * withDefaults 兜底公司默认；业务显式传入同名 prop 时自动覆盖：
 * - border / stripe / showOverflow：视觉规范默认值
 * - pagerConfig：对象类型，必须用工厂函数返回（避免多实例共享引用）
 * - request：undefined 表示「未配置远程模式」
 */
const props = withDefaults(defineProps<TmTableProps>(), {
  border: tmTableDefaults.border,
  stripe: tmTableDefaults.stripe,
  showOverflow: tmTableDefaults.showOverflow,
  // pagerConfig 工厂：每实例独立对象，且显式 spread pageSizes 让 readonly tuple（来自
  // tmTableDefaults 的 as const）还原为 vxe PagerConfig 要求的可变数组类型（vue-tsc 修复）。
  pagerConfig: () => ({
    pageSize: tmTableDefaults.pagerConfig.pageSize,
    pageSizes: [...tmTableDefaults.pagerConfig.pageSizes],
  }),
})

// inheritAttrs:false 下需手动取 $attrs；useAttrs 显式拿到外部透传对象
const $attrs = useAttrs()

/**
 * 方法透传：父组件通过 ref 可调用 commit / revertData / clearData / getCheckboxRecords 等 vxe 实例方法
 *
 * 方案 A（与 TmSelect 一致）：defineExpose(exposed) 直传 Proxy，不 spread
 * —— spread 会因 useForwardRef 的 Proxy 未实现 ownKeys/getOwnPropertyDescriptor 而丢失全部方法。
 */
const { innerRef, exposed } = useForwardRef<VxeGridInstance>()
defineExpose(exposed)

/** 远程数据 + 分页驱动（含 race condition token 守卫） */
const {
  page,
  data: remoteData,
  total: remoteTotal,
  loading: remoteLoading,
  fetchData,
  onPageChange,
} = usePagination(() => props.request)

/** 列归一化：补公司默认 align=left / showOverflow=true */
const columns = useColumns(() => props.columns)

/**
 * 单一合并透传对象（plan-bug #1 修正：原 plan 双 v-bind 不合法）
 *
 * 远程模式（request 配置）：
 * - 剥离 data/pagerConfig/loading 由 composable 重新写入（Bug 3 修复：plan 漏写导致空表）
 * - data = remoteData.value（composable 拉取的最新数据）
 * - total 写入 pagerConfig.total（vxe pager 标准）
 * - currentPage/pageSize 双向同步给 vxe pager（避免 vxe 内部状态与 composable 分裂）
 * - loading 合并：业务 loading ∪ 远程 loading
 * - 绑定 onPageChange 到 vxe page-change 事件（Bug 4 修复：plan 漏写导致翻页失效）
 *
 * 静态模式（无 request）：仅剥离 request，业务 data/pagerConfig 原样透传
 */
const forwardBindings = computed(() => {
  if (props.request) {
    // 远程模式：剥离由 composable 接管的字段
    const {
      request: _r,
      data: _d,
      pagerConfig: _pc,
      loading: _l,
      ...rest
    } = props
    return {
      ...$attrs,
      ...rest,
      columns: columns.value,
      data: remoteData.value,
      loading: Boolean(props.loading) || remoteLoading.value,
      pagerConfig: {
        ...(props.pagerConfig ?? {}),
        total: remoteTotal.value,
        currentPage: page.currentPage,
        pageSize: page.pageSize,
      },
      // Bug 4 修复：plan 漏写 page-change 事件绑定 → 翻页不触发拉数
      onPageChange,
    }
  }
  // 静态模式：仅剥离扩展键 request
  const { request: _r, ...rest } = props
  return {
    ...$attrs,
    ...rest,
    columns: columns.value,
  }
})

/** 远程模式：挂载时自动拉首页（与 plan 方案 A 一致，fetchData 不暴露 vm） */
onMounted(() => {
  if (props.request) void fetchData()
})
</script>

<template>
  <div class="tm-table">
    <!-- v-bind="forwardBindings" 单点承载 $attrs + 已剥离扩展键的 vxe 原生 props -->
    <VxeGrid ref="innerRef" v-bind="forwardBindings">
      <!--
        动态透传全部插槽：empty / toolbar / top / bottom / form / ...
        用 Object.keys($slots) 迭代字符串键（避免 vue-tsc TS7022 circular inference）
      -->
      <template v-for="name in Object.keys($slots)" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </VxeGrid>
  </div>
</template>

<style src="../style/vxe-align.css"></style>
