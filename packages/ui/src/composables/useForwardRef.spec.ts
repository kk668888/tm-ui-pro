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
})
