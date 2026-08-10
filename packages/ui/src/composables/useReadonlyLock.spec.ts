// packages/ui/src/composables/useReadonlyLock.spec.ts
// useReadonlyLock 单测：readonly 锁闭、disabled 级联、searchable 分支、无 context 容错
import { describe, it, expect } from 'vitest'
import { computed, type ComputedRef } from 'vue'
import { useReadonlyLock } from './useReadonlyLock'
import type { FormContext } from '../components/form/src/composables/useFormContext'

function formContext(readonly?: boolean, disabled?: boolean): ComputedRef<FormContext> {
  return computed(() => ({ readonly, disabled }))
}

const baseProps = { readonly: undefined, disabled: undefined, open: undefined, allowClear: true }

describe('useReadonlyLock', () => {
  it('readonly（context）时锁闭：open:false / allowClear:false / showSearch:false（searchable）', () => {
    const { antProps } = useReadonlyLock(
      { ...baseProps, showSearch: true },
      formContext(true),
      { searchable: true },
    )
    expect(antProps.value).toMatchObject({
      open: false,
      allowClear: false,
      showSearch: false,
      disabled: undefined,
      readonly: true,
    })
  })

  it('业务显式 readonly=true 优先于 context readonly=false', () => {
    const { isReadonly, antProps } = useReadonlyLock(
      { ...baseProps, readonly: true, showSearch: true },
      formContext(false),
      { searchable: true },
    )
    expect(isReadonly.value).toBe(true)
    expect(antProps.value.open).toBe(false)
  })

  it('非只读时按业务透传：open 未传置 undefined 走 ant 内部管理', () => {
    const { antProps } = useReadonlyLock(
      { ...baseProps, showSearch: true },
      undefined,
      { searchable: true },
    )
    expect(antProps.value.open).toBeUndefined()
    expect(antProps.value.allowClear).toBe(true)
    expect(antProps.value.showSearch).toBe(true)
  })

  it('业务显式传 open=true 非只读时下发受控打开', () => {
    const { antProps } = useReadonlyLock(
      { ...baseProps, open: true, showSearch: true },
      undefined,
      { searchable: true },
    )
    expect(antProps.value.open).toBe(true)
  })

  it('业务显式 open=false 保留为受控关闭（修复 review：open 直透而非 || undefined）', () => {
    const { antProps } = useReadonlyLock(
      { ...baseProps, open: false, showSearch: true },
      undefined,
      { searchable: true },
    )
    expect(antProps.value.open).toBe(false)
  })

  it('showSearch 对象透传：非只读时对象原样保留（TreeSelect 场景）', () => {
    const obj = { treeNodeFilterProp: 'title' as const }
    const { antProps } = useReadonlyLock(
      { ...baseProps, showSearch: obj },
      undefined,
      { searchable: true },
    )
    expect(antProps.value.showSearch).toEqual(obj)
  })

  it('searchable:false 时不产生 showSearch 字段（DatePicker/Cascader 无搜索框）', () => {
    const { antProps } = useReadonlyLock({ ...baseProps }, formContext(true))
    expect('showSearch' in antProps.value).toBe(false)
  })

  it('disabled 级联：业务显式传优先于 context', () => {
    const ctxDisabled = useReadonlyLock({ ...baseProps, disabled: undefined }, formContext(false, true))
    expect(ctxDisabled.antProps.value.disabled).toBe(true)

    const explicit = useReadonlyLock({ ...baseProps, disabled: false }, formContext(false, true))
    expect(explicit.antProps.value.disabled).toBe(false)
  })

  it('无 context 容错：formContext 为 undefined 时不报错，disabled 走业务/undefined', () => {
    const { antProps } = useReadonlyLock({ ...baseProps, disabled: undefined }, undefined)
    expect(antProps.value.disabled).toBeUndefined()
    expect(antProps.value.open).toBeUndefined()
  })

  it('isReadonly 输出：readonly 为真时 true，否则 false', () => {
    expect(useReadonlyLock(baseProps, formContext(true)).isReadonly.value).toBe(true)
    expect(useReadonlyLock(baseProps, undefined).isReadonly.value).toBe(false)
  })
})
