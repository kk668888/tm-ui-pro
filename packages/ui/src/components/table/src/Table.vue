<!-- packages/ui/src/components/table/src/Table.vue -->
<!--
  TmTable 范本组件：薄封装 vxe-grid + ant 分页/搜索（v2 table-ant-pagination-search）
  核心机制：
  1. 单一 forwardBindings computed：合并 $attrs + 已剥离扩展键的 vxe 原生 props
     - 分页器改用 ant-design-vue <a-pagination>，pagerConfig 不再下发 vxe（vxe 不渲染分页器）
     - data = usePagination.data（远程=拉取结果；静态=当前页本地切片）
     - total 写入 a-pagination.total（ant Pagination 标准）
  2. 扩展属性剥离：request / search / density / pagerConfig / pagination 不下发 vxe
     - request 仅在内部驱动 onMounted + a-pagination change
     - search 驱动表格上方 ant 搜索表单；density 合并进 row-config
     - pagination=false 时隐藏 ant 分页器且静态数据不切片（全量渲染）
  3. 方法透传：useForwardRef + defineExpose(exposed)
  4. ant Pagination change 事件驱动远程拉数（v2 替代 vxe page-change）
  5. race condition 防护：usePagination 内部 token 守卫
  6. 布局：外层 flex column，grid 占剩余高度，a-pagination 固定底部
-->
<script setup lang="ts">
import { computed, onMounted, useSlots, watch } from 'vue'
import {
  Pagination as APagination,
  Form as AForm,
  FormItem as AFormItem,
  Row as ARow,
  Col as ACol,
  Input as AInput,
  Select as ASelect,
  DatePicker as ADatePicker,
  Button as AButton,
  Space as ASpace,
} from 'ant-design-vue'
import { VxeGrid, type VxeGridInstance } from 'vxe-table'
import type { TmTableProps } from './props'
import { tmTableDefaults } from './defaults'
import { useColumns } from './composables/useColumns'
import { usePagination } from './composables/usePagination'
import { useSearch } from './composables/useSearch'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 forwardBindings 合并
defineOptions({ name: 'TmTable', inheritAttrs: false })

/**
 * 组件 props：TmTableProps = VxeGridProps（vxe 原生）+ { request? / search? / density? }（公司扩展）
 *
 * withDefaults 兜底公司默认；业务显式传入同名 prop 时自动覆盖：
 * - border / stripe / showOverflow：视觉规范默认值
 * - pagerConfig：对象类型，必须用工厂函数返回（避免多实例共享引用）
 *   注意：pagerConfig 不再透传 vxe-grid，其 pageSize/pageSizes 改为驱动 ant Pagination
 */
const props = withDefaults(defineProps<TmTableProps>(), {
  border: tmTableDefaults.border,
  showHeader: tmTableDefaults.showHeader,
  stripe: tmTableDefaults.stripe,
  showOverflow: tmTableDefaults.showOverflow,
  fit: tmTableDefaults.fit,
  pagination: tmTableDefaults.pagination,
  pagerConfig: () => ({
    pageSize: tmTableDefaults.pagerConfig.pageSize,
    pageSizes: [...tmTableDefaults.pagerConfig.pageSizes],
  }),
})

// slot keys 显式抽出并断言为 string[]：让 vue-tsc/vite:dts 双路径对 v-for + 动态 #[name]
// 不再触发 TS7022 circular inference（T14 收口 2）
const slotNames = Object.keys(useSlots()) as string[]

/**
 * 方法透传：父组件通过 ref 可调用 commit / revertData / clearData / getCheckboxRecords 等 vxe 实例方法
 */
const { innerRef, exposed } = useForwardRef<VxeGridInstance>()
defineExpose(exposed)

/**
 * 分页 + 数据驱动：ant Pagination change 驱动
 * - 远程模式：fetchData 拉数，竞态 token 守卫
 * - 静态模式：data 为当前页切片，total = 数据长度
 */
const pagination = usePagination({
  getRequest: () => props.request,
  getStaticData: () => props.data,
  getEnabled: () => props.pagination,
})

/** 搜索控制器：search 扩展键声明式 ant 表单（未配置时 no-op） */
const search = useSearch(props.search, {
  fetchData: pagination.fetchData,
  resetToFirst: pagination.resetToFirst,
})

/** 列归一化：补公司默认 align=left / showOverflow=true */
const columns = useColumns(() => props.columns)

/**
 * 业务显式传 pagerConfig.pageSize 时，同步为 ant Pagination 初始页大小（响应式跟随变化）
 */
watch(
  () => props.pagerConfig?.pageSize,
  (size) => {
    if (size) pagination.page.pageSize = size
  },
  { immediate: true },
)

/** ant Pagination 页大小选项：vxe pageSizes 数字数组 → ant 字符串数组 */
const pageSizeOptions = computed(() =>
  (props.pagerConfig?.pageSizes ?? tmTableDefaults.pagerConfig.pageSizes).map(String),
)

/**
 * density → row-config.height 合并（业务显式 row-config.height 优先）
 * 未配置 density 且业务未传 row-config 时返回 undefined（不注入，保持薄封装）
 */
const rowConfig = computed(() => {
  const base = props.rowConfig ?? {}
  if (base.height != null) return base
  if (!props.density) return Object.keys(base).length ? base : undefined
  return { ...base, height: tmTableDefaults.densityHeight[props.density] }
})

/**
 * grid 高度策略：
 * 业务显式传 height（如固定高度 / "100%" 撑满父容器）时使用；
 * 未传时表格自然高度（按行数渲染），宽度始终撑满父容器。
 */
const gridHeight = computed(() => props.height)

/**
 * 扩展属性剥离 + 合成：剥离 request/search/density/pagerConfig/pagination/data/loading/height
 * - data = pagination.data（远程拉取结果 / 静态当前页切片）
 * - loading = 业务 loading ∪ 远程 loading
 * - rowConfig / height 按策略注入（null 时不含键）
 */
const antProps = computed(() => {
  const { request: _r, search: _s, density: _d, pagerConfig: _pc, pagination: _pagination, data: _data, loading: _loading, height: _height, rowConfig: _rc, ...rest } = props
  return {
    ...rest,
    columns: columns.value,
    data: pagination.data.value,
    loading: Boolean(props.loading) || pagination.loading.value,
    ...(rowConfig.value != null ? { rowConfig: rowConfig.value } : {}),
    ...(gridHeight.value != null ? { height: gridHeight.value } : {}),
  }
})

/** 透传对象：$attrs + 业务显式 props + 公司默认与合成键（border/stripe/showOverflow 等 + columns/data/loading/rowConfig/height，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, [
  'border', 'showHeader', 'stripe', 'showOverflow', 'fit',
  'columns', 'data', 'loading', 'rowConfig', 'height',
])

/** 远程模式：挂载时自动拉首页 */
onMounted(() => {
  if (props.request) void pagination.fetchData()
})
</script>

<template>
  <div class="tm-table">
    <!-- search 搜索区（可选）：ant 声明式表单，查询/重置接 useSearch -->
    <div v-if="props.search" class="tm-table__search">
      <a-form :model="search.model" @finish="search.handleSearch">
        <a-row :gutter="16">
          <a-col v-for="field in search.fields" :key="field.field" :span="field.span ?? 8">
            <a-form-item :label="field.label" :name="field.field">
              <a-input v-if="(field.type ?? 'input') === 'input'" v-model:value="search.model[field.field]"
                :placeholder="field.placeholder" allow-clear />
              <a-select v-else-if="field.type === 'select'" v-model:value="search.model[field.field]"
                :options="field.options" :placeholder="field.placeholder" allow-clear style="width: 100%" />
              <a-date-picker v-else-if="field.type === 'date'" v-model:value="search.model[field.field]"
                :placeholder="field.placeholder" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col>
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit">
                  {{ tmTableDefaults.searchButtonText }}
                </a-button>
                <a-button @click="search.resetQuery">
                  {{ tmTableDefaults.resetButtonText }}
                </a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格主体：vxe-grid，宽度撑满父容器，高度按业务 height 或内容自然渲染 -->
    <div class="tm-table__grid">
      <VxeGrid ref="innerRef" v-bind="forwardBindings">
        <!-- 动态透传全部插槽：empty / toolbar / top / bottom / form / ... -->
        <template v-for="name in slotNames" :key="name" #[name]="slotData">
          <slot :name="name" v-bind="slotData ?? {}" />
        </template>
      </VxeGrid>
    </div>

    <!-- ant 分页器：固定底部，change 事件驱动远程拉数 / 静态切页；pagination=false 时整体隐藏 -->
    <div v-if="props.pagination" class="tm-table__pager">
      <a-pagination :current="pagination.page.currentPage" :page-size="pagination.page.pageSize"
        :total="pagination.total.value" :page-size-options="pageSizeOptions"
        :show-total="(total: number) => `共 ${total} 条`" show-size-changer @change="pagination.onChange" />
    </div>
  </div>
</template>
