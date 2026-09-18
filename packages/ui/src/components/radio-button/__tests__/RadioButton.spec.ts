// packages/ui/src/components/radio-button/__tests__/RadioButton.spec.ts
// TmRadioButton 单测：值单元语义 + FormContext 级联
//
// 已知限制（spec/design 如实记录，dbg 实验链锁定）：
// TmRadioGroup 的 children（模板子组件）模式经 slot 转发后 ant 的 provide/inject 识别断链
// （Vue slot 内容 parent = 转发 wrapper，RadioGroup 的 Symbol inject 找不到）——
// 极简纯转发 wrapper 同样复现，属 Vue slot 语义固有限制。因此：
// - TmRadioButton 的组合测试用【原生 ARadioGroup】承载（该场景完全可用）
// - TmRadioGroup 组合场景业务走 options prop（既有能力）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { RadioGroup as ARadioGroup } from 'ant-design-vue'
import TmRadioButton from '../src/RadioButton.vue'
import { TmForm } from '../../form'

describe('TmRadioButton', () => {
  it('作为 RadioGroup 值单元：点击更新组值并呈选中态（原生 Group + TmButton）', async () => {
    const wrapper = mount({
      components: { ARadioGroup, TmRadioButton },
      data: () => ({ v: 'a' }),
      template: `
        <ARadioGroup v-model:value="v">
          <TmRadioButton value="a">A</TmRadioButton>
          <TmRadioButton value="b">B</TmRadioButton>
        </ARadioGroup>
      `,
    })
    // 初始 a 选中（受控：v-model 驱动 checked 类而非 DOM checked 属性）
    expect(wrapper.find('.ant-radio-button-wrapper-checked').exists()).toBe(true)
    expect(wrapper.find('.ant-radio-button-wrapper-checked').text()).toBe('A')
    // 点击 b → 组值更新且选中态迁移
    await wrapper.findAll('input')[1].setValue()
    expect((wrapper.vm as unknown as { v: string }).v).toBe('b')
    expect(wrapper.find('.ant-radio-button-wrapper-checked').text()).toBe('B')
  })

  it('FormContext 级联：TmForm disabled 级联禁用，业务显式 false 可覆盖', () => {
    const wrapper = mount({
      components: { TmForm, TmRadioButton },
      template: `
        <TmForm :disabled="true">
          <TmRadioButton value="a">级联</TmRadioButton>
          <TmRadioButton value="b" :disabled="false">覆盖</TmRadioButton>
        </TmForm>
      `,
    })
    const inner = wrapper.findAllComponents({ name: 'ARadioButton' })
    expect(inner[0].props('disabled')).toBe(true)
    expect(inner[1].props('disabled')).toBe(false)
  })
})
