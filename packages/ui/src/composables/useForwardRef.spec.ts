// packages/ui/src/composables/useForwardRef.spec.ts
// useForwardRef 的单测：验证 Proxy 透传内部实例方法/属性，且空实例访问不报错
import { describe, it, expect } from 'vitest'
import { useForwardRef } from './useForwardRef'
import { ref } from 'vue'

describe('useForwardRef', () => {
  it('代理内部实例的方法/属性到 exposed', () => {
    const { innerRef, exposed } = useForwardRef<any>()
    // 模拟内部组件挂载后填充实例
    innerRef.value = { focus: () => 'focused', value: 42 }
    expect(exposed.focus()).toBe('focused')
    expect(exposed.value).toBe(42)
  })

  it('内部实例为空时访问不报错（返回 undefined）', () => {
    const { exposed } = useForwardRef<any>()
    expect(exposed.anyMethod).toBeUndefined()
  })

  it('has 拦截器：内部实例存在的 key 返回 true（Vue 3.5+ exposeProxy 兼容）', () => {
    // 回归背景：Vue 3.5+ 的 exposeProxy 在 get 时先校验 `key in target`，
    // 若 useForwardRef 只实现 get、不实现 has，父组件 ref 拿不到 focus/blur 等方法
    const { innerRef, exposed } = useForwardRef<any>()
    // 挂载前：内部实例为 null，has 应返回 false
    expect('focus' in exposed).toBe(false)
    // 挂载后：方法存在返回 true，不存在返回 false
    innerRef.value = { focus: () => 'focused' }
    expect('focus' in exposed).toBe(true)
    expect('nonExistent' in exposed).toBe(false)
  })

  it('has 拦截器：排除 Vue 内部/实例私有 key（锁定排除规则，防止 forward 链路被污染）', () => {
    // 回归背景：has trap 的排除逻辑（`__v_*` / `$xxx` / `_xxx` / Symbol 返回 false）
    // 是 useForwardRef 调试过程中定位出的脆弱部分，仅有正面断言不足以锁住行为。
    // 这里针对 4 类排除分支补负面断言，确保即使内部实例上真实存在这些 key，
    // has 也仍然返回 false（防止未来误改导致 wrapper.vm.$emit 等错指到内部实例）。
    const sym = Symbol('test')
    const { innerRef, exposed } = useForwardRef<any>()
    // 挂载前：inst 为 null，in 操作不应抛错，且全部返回 false
    expect('__v_isRef' in exposed).toBe(false)
    expect('$emit' in exposed).toBe(false)
    expect('_internal' in exposed).toBe(false)
    expect(sym in exposed).toBe(false)

    // 挂载后：即使实例上确实存在这些被排除的 key，has 仍返回 false
    innerRef.value = {
      __v_isRef: true,
      $emit: () => {},
      _internal: 'private',
      [sym]: 'symbol-val',
      focus: () => 'focused',
    }
    // 1. `__v_*`：Vue 响应式 marker，若暴露会让 proxyRefs/markRaw 误判 exposed 为 ref/reactive
    expect('__v_isRef' in exposed).toBe(false)
    // 2. `$xxx`：Vue 实例公共属性，应由 exposeProxy 走 publicPropertiesMap 兜底
    //    （否则 wrapper.vm.$emit 会错误指向内部 AInput，vue-test-utils 读不到 TmInput 事件）
    expect('$emit' in exposed).toBe(false)
    // 3. `_xxx`：Vue 实例内部属性（如 _setup/_props），不应转发
    expect('_internal' in exposed).toBe(false)
    // 4. Symbol key：Vue 内部用 Symbol 携带元信息，统一不转发
    expect(sym in exposed).toBe(false)
    // 普通公共方法仍正常透传（确保排除规则未误伤正常 API）
    expect('focus' in exposed).toBe(true)
  })
})
