// packages/ui/src/components/input-mac/__tests__/InputMac.spec.ts
// TmInputMac 组件测试：挂载真实组件验证 spec 各场景
// 覆盖：v-model 契约（blur 归一后 emit 规范串 / 半成品 '' / parent→child 同步）、
//       十六进制键入（a-f 实时大写 / 非 hex 拦截 / 段满 2 位跳段）、
//       退格回跳 / 方向键跨段 / 粘贴双格式分发与非法拒绝、
//       separator 配置（'-' 生效 / '-' 粘贴至 ':' 整串拒绝）、
//       FormContext 级联与显式覆盖 / 初始非法段 error 展示 / ref.focus 定位空段
import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { computed, nextTick } from 'vue'
import TmInputMac from '../src/InputMac.vue'
import { FORM_KEY, type FormContext } from '../../form/src/composables/useFormContext'

/** 挂载辅助：attachTo 让 jsdom 焦点断言生效；返回段 input 列表 */
function mountMac(props: Record<string, unknown> = {}) {
  const wrapper = mount(TmInputMac, { props, attachTo: document.body })
  const segs = wrapper.findAll('input')
  return { wrapper, segs }
}

/** 模拟用户逐字符键入（keydown 放行 + 原生 value 更新 + input 兜底同步，与真实输入等价） */
async function type(wrapper: Awaited<ReturnType<typeof mountMac>['wrapper']>, segIdx: number, text: string) {
  const seg = wrapper.findAll('input')[segIdx]
  for (const ch of text) {
    await seg.trigger('keydown', { key: ch })
    seg.element.value += ch
    await seg.trigger('input')
  }
}

/** 触发「真正失焦」：relatedTarget 为 null 表示焦点离开整个组件 → 触发 blur 归一化 */
async function blurOut(wrapper: Awaited<ReturnType<typeof mountMac>['wrapper']>) {
  const last = wrapper.findAll('input').at(-1)!
  await last.trigger('blur', { relatedTarget: null })
  await nextTick()
}

/** 在祖先 provide FormContext 的挂载（模拟 TmForm 级联） */
function mountWithForm(ctx: FormContext, props: Record<string, unknown> = {}) {
  return mount(TmInputMac, {
    props,
    attachTo: document.body,
    global: { provide: { [FORM_KEY as symbol]: computed(() => ctx) } },
  })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('TmInputMac · 六段结构', () => {
  it('恰 5 个分隔符夹在 6 段之间，开头无前导分隔符', () => {
    const { wrapper } = mountMac()
    const shell = wrapper.find('.tm-input-mac').element
    expect(shell.children[0].classList.contains('tm-input-mac-sep')).toBe(false)
    expect(shell.children[0].classList.contains('tm-input-mac-segment')).toBe(true)
    expect(wrapper.findAll('.tm-input-mac-sep').length).toBe(5)
  })

  it('默认分隔符为冒号「:」', () => {
    const { wrapper } = mountMac()
    const seps = wrapper.findAll('.tm-input-mac-sep')
    expect(seps.map(s => s.text())).toEqual([':', ':', ':', ':', ':'])
  })

  it('separator="-" 时以隔行线分隔', () => {
    const { wrapper } = mountMac({ separator: '-' })
    expect(wrapper.findAll('.tm-input-mac-sep').map(s => s.text())).toEqual(['-', '-', '-', '-', '-'])
  })
})

describe('TmInputMac · 十六进制键入与实时大写', () => {
  it('键入小写 a-f 立即显示为大写', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, 'ab')
    expect(segs[0].element.value).toBe('AB')
  })

  it('键入非 hex 字符被拦截：值不变', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '0A')
    await segs[0].trigger('keydown', { key: 'g' })
    await segs[0].trigger('keydown', { key: '!' })
    expect(segs[0].element.value).toBe('0A')
  })

  it('段满 2 位自动跳下一段', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, 'AB')
    expect(segs[0].element.value).toBe('AB')
    expect(document.activeElement).toBe(segs[1].element)
  })

  it('键入小写字母实时大写且末段不越界', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 4, 'c')
    expect(segs[4].element.value).toBe('C')
    await type(wrapper, 4, 'd')
    expect(segs[4].element.value).toBe('CD')
  })
})

describe('TmInputMac · 退格回跳 / 方向键跨段 / 粘贴', () => {
  it('段首退格回跳上一段并删除其末位', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '0A')
    segs[1].element.focus()
    segs[1].element.setSelectionRange(0, 0)
    await segs[1].trigger('keydown', { key: 'Backspace' })
    await nextTick()
    expect(segs[0].element.value).toBe('0')
    expect(document.activeElement).toBe(segs[0].element)
  })

  it('← 在段首跨段移到上一段', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '0A')
    segs[1].element.focus()
    segs[1].element.setSelectionRange(0, 0)
    await segs[1].trigger('keydown', { key: 'ArrowLeft' })
    await nextTick()
    expect(document.activeElement).toBe(segs[0].element)
  })

  it('粘贴带冒号完整 MAC 分发六段，焦点落末段', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await segs[0].trigger('paste', {
      clipboardData: { getData: () => '1A:2B:3C:4D:5E:6F' },
    })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['1A', '2B', '3C', '4D', '5E', '6F'])
    expect(document.activeElement).toBe(segs[5].element)
  })

  it('粘贴纯 hex 贪心分发（AABBCCDDEEFF → 每段 2 位）', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await segs[0].trigger('paste', {
      clipboardData: { getData: () => 'AABBCCDDEEFF' },
    })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['AA', 'BB', 'CC', 'DD', 'EE', 'FF'])
  })

  it('非法粘贴整串拒绝不改值', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '0A')
    // 非 hex 段（GG）→ 整串拒绝
    await segs[0].trigger('paste', { clipboardData: { getData: () => 'GG:11:22:33:44:55' } })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['0A', '', '', '', '', ''])
    // 分隔符数量不对（5 段）→ 整串拒绝
    await segs[0].trigger('paste', { clipboardData: { getData: () => '1A:2B:3C:4D:5E' } })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['0A', '', '', '', '', ''])
  })

  it('separator="-" 模式下完整组装与粘贴按 '-' 解析', async () => {
    const { wrapper } = mountMac({ separator: '-' })
    const segs = wrapper.findAll('input')
    await segs[0].trigger('paste', { clipboardData: { getData: () => '0A-0B-0C-0D-0E-0F' } })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['0A', '0B', '0C', '0D', '0E', '0F'])
    await blurOut(wrapper)
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('0A-0B-0C-0D-0E-0F')
  })

  it('默认冒号模式：粘「-」连接串整串拒绝', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, '0A')
    await segs[0].trigger('paste', { clipboardData: { getData: () => '0A-0B-0C-0D-0E-0F' } })
    await nextTick()
    expect(segs.map(s => s.element.value)).toEqual(['0A', '', '', '', '', ''])
  })
})

describe('TmInputMac · v-model 契约与 blur 归一化', () => {
  it('六段各 1 位后 blur：补零归一化并 emit 规范大写串', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, 'a')
    await type(wrapper, 1, 'b')
    await type(wrapper, 2, 'c')
    await type(wrapper, 3, 'd')
    await type(wrapper, 4, 'e')
    await type(wrapper, 5, 'f')
    // 未 blur 前：段值实时大写但未补零，不 emit 完整串
    expect(segs.map(s => s.element.value)).toEqual(['A', 'B', 'C', 'D', 'E', 'F'])
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
    // blur：补零 → 六段全 2 位 → emit 规范串
    await blurOut(wrapper)
    expect(segs.map(s => s.element.value)).toEqual(['0A', '0B', '0C', '0D', '0E', '0F'])
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('0A:0B:0C:0D:0E:0F')
  })

  it('半成品 blur：已填段归一化，段未齐仍 emit 空串', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, 'a')
    await type(wrapper, 1, 'b')
    await blurOut(wrapper)
    expect(segs[0].element.value).toBe('0A')
    expect(segs[1].element.value).toBe('0B')
    expect(segs.slice(2).map(s => s.element.value)).toEqual(['', '', '', ''])
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
  })

  it('段间跳转不触发 blur 归一化（焦点仍在组件内）', async () => {
    const { wrapper } = mountMac()
    const segs = wrapper.findAll('input')
    await type(wrapper, 0, 'a')
    // 第 1 位输入后焦点仍在本段，后续补齐第 2 位时发生段间跳转
    await type(wrapper, 0, 'b')
    // 模拟浏览器触发的段间 blur（relatedTarget 指向组件内另一段）——不应归一化
    await segs[0].trigger('blur', { relatedTarget: segs[1].element })
    await nextTick()
    // 段值保持输入态（无补零）——归一化只在真正离开组件时发生
    expect(segs[0].element.value).toBe('AB')
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('')
  })

  it('父组件更新 modelValue 同步到段显示（parent→child）', async () => {
    const { wrapper } = mountMac({ modelValue: '' })
    await wrapper.setProps({ modelValue: '10:20:30:40:50:60' })
    const values = wrapper.findAll('input').map(i => i.element.value)
    expect(values).toEqual(['10', '20', '30', '40', '50', '60'])
  })
})

describe('TmInputMac · 初始非法值 / 级联 / 焦点方法', () => {
  it('初始非法值：非法段原文展示并标 error，不 clamp、不回发', async () => {
    const { wrapper } = mountMac({ modelValue: 'GG:12:34:56:78:9A' })
    const segs = wrapper.findAll('input')
    expect(segs[0].element.value).toBe('GG')
    expect(segs[0].attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('.tm-input-mac').classes()).toContain('tm-input-mac-error')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('FormContext 级联：未显式传 disabled 时继承 TmForm disabled', async () => {
    const wrapper = mountWithForm({ disabled: true })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).disabled)).toBe(true)
    expect(wrapper.find('.tm-input-mac').classes()).toContain('tm-input-mac-disabled')
  })

  it('业务显式传值覆盖级联：TmForm readonly 为真但显式 readonly=false 保持可编辑', async () => {
    const wrapper = mountWithForm({ readonly: true }, { readonly: false })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).readOnly)).toBe(false)
  })

  it('级联 readonly：段只读不可编辑且不置灰', async () => {
    const wrapper = mountWithForm({ readonly: true }, { modelValue: '0A:0B:0C:0D:0E:0F' })
    const segs = wrapper.findAll('input')
    expect(segs.every(s => (s.element as HTMLInputElement).readOnly)).toBe(true)
    expect(wrapper.find('.tm-input-mac').classes()).not.toContain('tm-input-mac-disabled')
  })

  it('ref.focus() 定位第一个空段', async () => {
    const { wrapper } = mountMac({ modelValue: '0A:0B::::' })
    const segs = wrapper.findAll('input')
    await (wrapper.vm as unknown as { focus: () => void }).focus()
    await nextTick()
    expect(document.activeElement).toBe(segs[2].element)
  })
})