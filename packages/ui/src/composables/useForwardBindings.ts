// packages/ui/src/composables/useForwardBindings.ts
// useForwardBindings：构建透传给内部 ant/vxe 组件的 bindings 对象
//
// 解决的问题：「类型化 defineProps<TmProps>()」会把业务未传的可选 Boolean prop 归一化为 false
// （Vue 对缺省可选 Boolean 的 casting），而薄封装组件又用 `{...$attrs, ...props}` 全量透传，
// 导致这些「幻影 false」覆盖 ant 内部默认值（如 Popover.open / Popconfirm.open /
// Upload.openFileDialogOnClick），触发区点击/弹出无反应。
//
// 因此这里只转发三类值，其余交给内部组件默认兜底：
//   1. $attrs：非 props 的透传属性与监听器（Vue 已自动归类）
//   2. 业务显式传入的 props（父组件 vnode.props 里真实存在的 key）
//   3. 公司默认值（withDefaults 的 key，必须显式转发，避免被当作幻影值跳过）
import {
  computed,
  getCurrentInstance,
  isRef,
  useAttrs,
  type ComputedRef,
  type Ref,
} from 'vue'

// rawProps 里的 key 可能是 kebab-case（file-list）或 camelCase（fileList），双向归一化辅助
const toCamel = (s: string): string => s.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
const toKebab = (s: string): string => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)

/**
 * 构建透传 bindings 对象（供模板 `<内部组件 v-bind="forwardBindings">` 使用）
 *
 * @param source 待透传的 props 对象：直接传 withDefaults 的 `props`（reactive），
 *               或传含中间变换的 computed（如 Popconfirm 的 antProps，剥离扩展键后）
 * @param companyDefaults withDefaults 里显式兜底（或中间变换合成）的 key 列表，这些始终转发
 * @param excludedKeys 需要排除的 key 列表：wrapper 在模板里显式绑定的监听器
 *                     （如 `@update:file-list`）若又被 $attrs 透传，会被 Vue 合并成数组
 *                     监听器，内部组件调用 `.call()` 时崩溃。必须从透传对象剔除，
 *                     让模板绑定成为唯一通道（与 TmInput 剥离 onUpdate:value 同思路）
 * @returns 计算属性；应替代手工 `{...$attrs, ...props}`，消除幻影 false 透传
 */
export function useForwardBindings(
  source: ComputedRef<Record<string, unknown>> | Record<string, unknown>,
  companyDefaults: string[] = [],
  excludedKeys: string[] = [],
): ComputedRef<Record<string, unknown>> {
  // 必须在 setup 期间调用：getCurrentInstance 拿父组件 vnode 的原始 props
  const instance = getCurrentInstance()
  const $attrs = useAttrs()

  return computed(() => {
    // 支持 reactive props 直接传，或 computed（中间变换）传 ref，统一取当前值
    const vals = isRef(source)
      ? (source as Ref<Record<string, unknown>>).value
      : (source as Record<string, unknown>)
    // 父组件显式传入的原始 props（Vue 未做 Boolean 归一化的原始对象）
    const raw = (instance?.vnode.props ?? {}) as Record<string, unknown>
    const forward: Record<string, unknown> = { ...$attrs }

    for (const key in vals) {
      const isCompany = companyDefaults.includes(key)
      // 业务显式传入：rawProps 里存在该 key（含 kebab/camel 两种形态）
      const isExplicit = key in raw || toCamel(key) in raw || toKebab(key) in raw
      if (isCompany || isExplicit) {
        forward[key] = vals[key]
      }
      // 其余（缺省被归一化为 false/undefined 的 prop）跳过，交给内部组件默认兜底
    }

    // 剔除 wrapper 在模板中显式绑定的监听器，避免与 $attrs 透传合并成数组监听器
    for (const k of excludedKeys) {
      delete forward[k]
    }

    return forward
  })
}
