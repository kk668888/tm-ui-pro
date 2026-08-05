// packages/ui/src/composables/useForwardRef.ts
// useForwardRef：把内部组件实例的全部方法/属性代理给父组件 ref
// 父组件通过 ref 调用任意方法，都会转发到内部 ant/vxe 实例
// 无需逐一列举方法名，新增方法自动透传
import { ref, type Ref, type ComponentPublicInstance } from 'vue'

/**
 * useForwardRef 的返回结构
 *
 * @template T 内部组件实例的类型（默认 ComponentPublicInstance）
 * @property innerRef 绑定到内部组件的 ref（用于 template ref 绑定）
 * @property exposed  代理对象，供 defineExpose 暴露给父组件
 */
export interface UseForwardRefReturn<T> {
  innerRef: Ref<T | null>
  exposed: T
}

/**
 * 把内部组件实例的全部方法/属性代理给父组件 ref
 *
 * 使用方式：
 * ```ts
 * const { innerRef, exposed } = useForwardRef<InstanceType<typeof AntInput>>()
 * // template: <AntInput :ref="innerRef" />
 * defineExpose(exposed)
 * ```
 *
 * 设计要点：
 * 1. innerRef 由父组件绑定到内部组件的 template ref，挂载后会被填充实例
 * 2. exposed 是一个 Proxy，get 拦截器运行时转发到 innerRef.value[key]
 *    —— 无需枚举方法名，新增 API 自动透传
 * 3. 内部实例尚未挂载（null）时，访问任意属性返回 undefined 而非报错
 *    —— 避免父组件在挂载完成前调用时的运行时错误
 *
 * @returns {@link UseForwardRefReturn}
 */
export function useForwardRef<T extends ComponentPublicInstance = ComponentPublicInstance>(): UseForwardRefReturn<T> {
  // 内部组件实例的 ref，初始为 null；template 挂载后由 Vue 自动填充
  const innerRef = ref<T | null>(null) as Ref<T | null>

  // Proxy 拦截所有属性读取，运行时转发到最新内部实例
  // 注意：get 不抛错，inst 为 null 时返回 undefined，保证挂载前调用安全
  const exposed = new Proxy({} as T, {
    get: (_target, key: string | symbol) => {
      // 将实例断言为可索引的记录类型，便于按 key 动态访问
      const inst = innerRef.value as unknown as Record<string | symbol, unknown> | null
      return inst?.[key]
    },
  })

  return { innerRef, exposed }
}
