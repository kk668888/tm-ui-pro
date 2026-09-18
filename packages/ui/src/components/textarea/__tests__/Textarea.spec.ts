// packages/ui/src/components/textarea/__tests__/Textarea.spec.ts
// TmTextarea 单测：v-model 契约、公司默认值、FormContext 级联、autosize 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTextarea from '../src/Textarea.vue'
import { TmForm } from '../../form'

describe('TmTextarea', () => {
  it('v-model：完整闭环——输入回写、清空 emit 空串', async () => {
    // 受控组件必须用完整 v-model 闭环（props 不回写时 ant 内部 stateValue 会与外部错位）
    const wrapper = mount({
      components: { TmTextarea },
      data: () => ({ v: 'abc' }),
      template: `<TmTextarea v-model="v" />`,
    })
    const vm = wrapper.vm as unknown as { v: string }
    await wrapper.find('textarea').setValue('hello')
    expect(vm.v).toBe('hello')
    await wrapper.find('textarea').setValue('')
    expect(vm.v).toBe('')
  })

  it('v-model：父组件更新 modelValue 同步到内部 textarea（真双向）', async () => {
    const wrapper = mount(TmTextarea, { props: { modelValue: '' } })
    await wrapper.setProps({ modelValue: 'world' })
    expect(wrapper.find('textarea').element.value).toBe('world')
  })

  it('公司默认 allowClear=true / bordered=true 下发（幻影 false 回归锁）', () => {
    const wrapper = mount(TmTextarea)
    const inner = wrapper.findComponent({ name: 'ATextarea' })
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('bordered')).toBe(true)
  })

  it('autosize 透传生效（多行自动增高能力）', () => {
    const wrapper = mount(TmTextarea, { props: { autosize: { minRows: 2, maxRows: 6 } } })
    const inner = wrapper.findComponent({ name: 'ATextarea' })
    expect(inner.props('autosize')).toEqual({ minRows: 2, maxRows: 6 })
  })

  it('业务覆盖公司默认值：allowClear=false', () => {
    const wrapper = mount(TmTextarea, { props: { allowClear: false } })
    expect(wrapper.findComponent({ name: 'ATextarea' }).props('allowClear')).toBe(false)
  })

  it('FormContext 级联：TmForm disabled 级联禁用，业务显式 false 可覆盖', () => {
    const wrapper = mount({
      components: { TmForm, TmTextarea },
      template: `
        <TmForm :disabled="true">
          <TmTextarea data-cascade="form" />
          <TmTextarea :disabled="false" data-cascade="override" />
        </TmForm>
      `,
    })
    const inners = wrapper.findAllComponents({ name: 'ATextarea' })
    expect(inners[0].props('disabled')).toBe(true)
    expect(inners[1].props('disabled')).toBe(false)
  })
})
