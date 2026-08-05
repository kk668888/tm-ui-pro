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
 * 4. has 拦截器：Vue 3.5+ 的 exposeProxy 在 get 时会先校验 `key in target`，
 *    若仅实现 get，则 exposeProxy 永远走 fallback 分支，导致父组件 ref 拿不到方法。
 *    通过 has 拦截器声明「内部实例存在的 key 都视为已暴露」，才能让 defineExpose(exposed) 真正生效
 *
 * @returns {@link UseForwardRefReturn}
 */
export function useForwardRef<T extends ComponentPublicInstance = ComponentPublicInstance>(): UseForwardRefReturn<T> {
  // 内部组件实例的 ref，初始为 null；template 挂载后由 Vue 自动填充
  const innerRef = ref<T | null>(null) as Ref<T | null>

  // Proxy 拦截所有属性读取与 `key in target` 判断，运行时转发到最新内部实例
  // 注意：get 不抛错，inst 为 null 时返回 undefined，保证挂载前调用安全
  const exposed = new Proxy({} as T, {
    get: (_target, key: string | symbol) => {
      // 将实例断言为可索引的记录类型，便于按 key 动态访问
      const inst = innerRef.value as unknown as Record<string | symbol, unknown> | null
      return inst?.[key]
    },
    // 关键：has 拦截器让 Vue 的 exposeProxy 识别「内部实例有的方法都对外可见」
    // 否则 Vue 3.5+ 的 `key in target` 校验会落空，导致 defineExpose(exposed) 失效
    //
    // 但必须排除以下三类 key，否则会引发严重的副作用：
    // 1. `__v_*`（如 __v_isRef/__v_isReactive/__v_raw）：Vue 的响应式 marker，
    //    若返回 true，proxyRefs/markRaw 会把 exposed Proxy 误判为 ref/reactive，
    //    进而导致 exposeProxy 包装链路异常。
    // 2. `$xxx`（如 $emit/$parent/$el/$...）：Vue 实例的公共属性，
    //    应由 exposeProxy 走 publicPropertiesMap 兜底，返回 TmInput 自己的属性，
    //    而不是转发到内部 AInput。否则 wrapper.vm.$ 会错误指向 AInput 实例，
    //    导致 vue-test-utils 的 wrapper.emitted() 等读不到 TmInput 自身的事件。
    // 3. `_xxx`：Vue 实例的内部属性（如 _setup/_props），同样不应转发。
    // 4. Symbol key：Vue 内部用 Symbol 携带元信息，统一不转发。
    has: (_target, key: string | symbol) => {
      if (typeof key === 'symbol') return false
      if (typeof key === 'string') {
        if (key.startsWith('__v_')) return false
        if (key.startsWith('$') || key.startsWith('_')) return false
      }
      const inst = innerRef.value as unknown as Record<string | symbol, unknown> | null
      // 挂载前 inst 为 null，has 返回 false（Vue 自动走 publicPropertiesMap 兜底）
      // 挂载后 inst[key] !== undefined 表示该方法/属性确实存在于内部实例
      return inst !== null && inst[key] !== undefined
    },
  })

  return { innerRef, exposed }
}
