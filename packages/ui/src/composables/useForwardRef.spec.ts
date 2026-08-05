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
})
