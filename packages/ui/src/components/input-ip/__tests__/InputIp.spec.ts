// packages/ui/src/components/input-ip/__tests__/InputIp.spec.ts
// TmInputIp 组件测试：挂载真实组件验证 spec 各场景
// 覆盖：v-model 契约（齐全组装 / 未齐 '' / 前导零原文 / parent→child 同步）、
//       键入交互（满段跳段 / 点号跳段 / 越界承载 / 非数字拦截 / 末段上限）、
//       退格回跳 / 方向键跨段 / 粘贴双格式分发与非法拒绝、
//       blur 半成品保留 / 初始非法段 error 展示 / FormContext 级联与显式覆盖 / focus 方法
import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, nextTick } from 'vue'
import TmInputIp from '../src/InputIp.vue'
import { FORM_KEY, type FormContext } from '../../form/src/composables/useFormContext'

/** 挂载辅助：attachTo 让 jsdom 焦点断言生效；返回段 input 列表 */
function mountIp(props: Record<string, unknown> = {}) {
  const wrapper = mount(TmInputIp, { props, attachTo: document.body })
  const segs = wrapper.findAll('input')
  return { wrapper, segs }
}

/** 模拟用户逐字符键入（keydown 放行 + 原生 value 更新 + input 兜底同步，与真实输入等价） */
async function type(wrapper: Awaited<ReturnType<typeof mountIp>['wrapper']>, segIdx: number, text: string) {
  const seg = wrapper.findAll('input')[segIdx]
  for (const ch of text) {
    await seg.trigger('keydown', { key: ch })
    seg.element.value += ch
    await seg.trigger('input')
  }
}

/** 在祖先 provide FormContext 的挂载（模拟 TmForm 级联） */
function mountWithForm(ctx: FormContext, props: Record<string, unknown> = {}) {
  return mount(TmInputIp, {
    props,
    attachTo: document.body,
    global: { provide: { [FORM_KEY as symbol]: computed(() => ctx) } },
  })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('TmInputIp · v-model 值契约', () => {
  it('四段齐全 emit 完整点分串', async () => {
    const { wrapper } = mountIp()
    await type(wrapper, 0, '192')
    await type(wrapper, 1, '168')
    await type(wrapper, 2, '1')
    await type(wrapper, 3, '1')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('192.168.1.1')
  })

  it('段未齐 emit 空串', async () => {
    const { wrapper } = mountIp()
    await type(wrapper, 0, '192')
    await type(wrapper, 1, '168')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
  })

  it('前导零按原文组装不归一', async () => {
    const { wrapper } = mountIp()
    await type(wrapper, 0, '192')
    await type(wrapper, 1, '01')
    await type(wrapper, 2, '1')
    await type(wrapper, 3, '1')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('192.01.1.1')
  })

  it('分段结构正确：恰 3 个分隔符夹在 4 段之间，开头无前导点', () => {
    const { wrapper } = mountIp()
    const shell = wrapper.find('.tm-input-ip').element
    // 开头不得是分隔符（回归：v-for 第一轮误渲染 sep 导致「开头多出 1 个点」）
    expect(shell.children[0].classList.contains('tm-input-ip-sep')).toBe(false)
    expect(shell.children[0].classList.contains('tm-input-ip-segment')).toBe(true)
    // 分隔符总数恰为 3，且都出现在段之间
    expect(wrapper.findAll('.tm-input-ip-sep').length).toBe(3)
  })

  it('父组件更新 modelValue 同步到段显示（parent→child）', async () => {
    const { wrapper } = mountIp({ modelValue: '' })
    await wrapper.setProps({ modelValue: '10.20.30.40' })
    const values = wrapper.findAll('input').map(i => i.element.value)
    expect(values).toEqual(['10', '20', '30', '40'])
  })
})

describe('TmInputIp · 键入交互', () => {
  it('段满 3 位自动跳下一段', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '192')
    expect(document.activeElement).toBe(segs[1].element)
  })

  it('键入点号跳段且不输入字符', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '192')
    await segs[0].trigger('keydown', { key: '.' })
    await nextTick()
    expect(segs[0].element.value).toBe('192')
    expect(document.activeElement).toBe(segs[1].element)
  })

  it('越界数字触发跳段并承载：25 后键入 6 → 25 与下一段 6', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '25')
    await segs[0].trigger('keydown', { key: '6' })
    await nextTick()
    expect(segs[0].element.value).toBe('25')
    expect(segs[1].element.value).toBe('6')
    expect(document.activeElement).toBe(segs[1].element)
  })

  it('非数字字符被拦截：值不变', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '19')
    await segs[0].trigger('keydown', { key: 'a' })
    await segs[0].trigger('keydown', { key: '!' })
    expect(segs[0].element.value).toBe('19')
  })

  it('末段打满后再键入被忽略（段长上限）', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 3, '255')
    await segs[3].trigger('keydown', { key: '7' })
    expect(segs[3].element.value).toBe('255')
  })
})

describe('TmInputIp · 退格回跳 / 方向键 / 粘贴', () => {
  it('段首退格回跳上一段并删除其末位', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '192')
    segs[1].element.focus()
    segs[1].element.setSelectionRange(0, 0)
    await segs[1].trigger('keydown', { key: 'Backspace' })
    await nextTick()
    expect(segs[0].element.value).toBe('19')
    expect(document.activeElement).toBe(segs[0].element)
  })

  it('← 在段首跨段移到上一段', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '192')
    segs[1].element.focus()
    segs[1].element.setSelectionRange(0, 0)
    await segs[1].trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(segs[0].element)
  })

  it('粘贴带点 IP 分发四段', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await segs[0].trigger('paste', {
      clipboardData: { getData: () => '192.168.1.1' },
    })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['192', '168', '1', '1'])
    expect(document.activeElement).toBe(segs[3].element)
  })

  it('粘贴纯数字分发四段（19216811 → 192.168.1.1）', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await segs[0].trigger('paste', {
      clipboardData: { getData: () => '19216811' },
    })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['192', '168', '1', '1'])
  })

  it('非法粘贴整串拒绝不改值', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '19')
    await segs[0].trigger('paste', {
      clipboardData: { getData: () => '999.1.1.1' },
    })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['19', '', '', ''])
  })
})

describe('TmInputIp · 半成品保留 / 非法值展示 / 级联', () => {
  it('blur 后半成品显示保留、modelValue 仍为空串', async () => {
    const { wrapper } = mountIp()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '192')
    await type(wrapper, 1, '168')
    segs[1].element.blur()
    await nextTick()
    expect(segs[0].element.value).toBe('192')
    expect(segs[1].element.value).toBe('168')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
  })

  it('初始非法值：越界段原文展示并标 error，不 clamp', async () => {
    const { wrapper } = mountIp({ modelValue: '999.1.1.1' })
    const segs = wrapper.findAll('input')
    expect(segs[0].element.value).toBe('999') // 原文落段
    expect(segs[0].attributes('aria-invalid')).toBe('true')
    // 外壳挂 error 状态类（组件自有状态类，ant 视觉自包含在 scoped 样式内）
    expect(wrapper.find('.tm-input-ip').classes()).toContain('tm-input-ip-error')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined() // 不回发改写值
  })

  it('FormContext 级联：未显式传 disabled 时级联 TmForm disabled', async () => {
    const wrapper = mountWithForm({ disabled: true })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).disabled)).toBe(true)
    expect(wrapper.find('.tm-input-ip').classes()).toContain('tm-input-ip-disabled')
  })

  it('业务显式传值覆盖级联：TmForm readonly 为真但显式 readonly=false 保持可编辑', async () => {
    const wrapper = mountWithForm({ readonly: true }, { readonly: false })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).readOnly)).toBe(false)
  })

  it('级联 readonly：段只读不可编辑且不置灰', async () => {
    const wrapper = mountWithForm({ readonly: true }, { modelValue: '1.2.3.4' })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).readOnly)).toBe(true)
    expect(wrapper.find('.tm-input-ip').classes()).not.toContain('tm-input-ip-disabled')
  })

  it('ref.focus() 定位第一个空段', async () => {
    const { wrapper } = mountIp({ modelValue: '192.168..' })
    const segs = wrapper.findAll('input')
    await (wrapper.vm as unknown as { focus: () => void }).focus()
    await nextTick()
    expect(document.activeElement).toBe(segs[2].element)
  })
})
