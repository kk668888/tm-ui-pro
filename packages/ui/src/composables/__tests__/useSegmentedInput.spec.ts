// packages/ui/src/composables/__tests__/useSegmentedInput.spec.ts
// useSegmentedInput 单测：脱离组件直打段状态机逻辑
// 覆盖：跳段（满段/点号/越界承载）、退格回跳、方向键跨段、粘贴分发（带点/纯数字/非法拒绝）、
//       keydown 拦截、input 兜底（脏值清理/溢出收缩/IME 组合）、受控回写（回环防护/初始非法值/程序设值）、
//       v-model 收敛契约（未齐 ''/齐全组装/前导零原文）、focus/blur 定位
import { describe, it, expect, vi, afterEach } from 'vitest'
import { nextTick, reactive } from 'vue'
import { useSegmentedInput, type UseSegmentedInputOptions } from '../useSegmentedInput'

/** IPv4 格式参数（组件层同款注入） */
const IPV4 = {
  segments: 4,
  maxLen: 3,
  separator: '.',
  acceptChar: /^[0-9]$/,
  sanitize: (s: string) => s.replace(/\D/g, ''),
  validate: (s: string) => /^[0-9]{1,3}$/.test(s) && Number(s) <= 255,
}

/** 模拟 v-model 宿主：reactive 保证 modelValue getter 的 watch 能追踪到变更
 *  override 可覆盖任一格式参数（含 normalize），供 MAC 等第二类分段场景复用同一 harness */
function setup(initial = '', override: Partial<UseSegmentedInputOptions> = {}) {
  const host = reactive({ value: initial, emitted: [] as string[] })
  const si = useSegmentedInput({
    ...IPV4,
    ...override,
    modelValue: () => host.value,
    onUpdate: v => {
      host.emitted.push(v)
      host.value = v // 模拟父组件 v-model 回写 prop
    },
  })
  // 真实 DOM input：jsdom 支持 focus/setSelectionRange，聚焦断言走 document.activeElement
  const segEls = Array.from({ length: override.segments ?? IPV4.segments }, () => {
    const el = document.createElement('input')
    document.body.appendChild(el)
    return el
  })
  segEls.forEach((el, i) => si.setSegmentRef(i, el))
  return { si, host, els: segEls }
}

/** 构造 keydown 事件（含 preventDefault spy，便于断言拦截与否） */
function keyEvent(k: string): KeyboardEvent & { prevented: boolean } {
  const spy = vi.fn()
  return { key: k, preventDefault: spy, get prevented() { return spy.mock.calls.length > 0 } } as never
}

/** 模拟 keydown 放行后的原生输入：el.value 更新 + 触发 input 兜底层 */
function typeInto(si: ReturnType<typeof useSegmentedInput>, els: HTMLInputElement[], i: number, text: string) {
  els[i].value += text
  els[i].setSelectionRange(els[i].value.length, els[i].value.length)
  si.onSegmentInput(i, { target: els[i] } as unknown as Event)
}

/** 粘贴事件：jsdom 无 ClipboardEvent 构造器，用最小形状模拟 */
function pasteEvent(text: string): ClipboardEvent {
  return {
    preventDefault: vi.fn(),
    clipboardData: { getData: () => text },
  } as unknown as ClipboardEvent
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('useSegmentedInput · 跳段机制', () => {
  it('段满 maxLen 自动跳下一段（第三位输入后焦点移至下一段）', async () => {
    const { si, els } = setup()
    si.onSegmentKeydown(0, keyEvent('1'))
    typeInto(si, els, 0, '1')
    si.onSegmentKeydown(0, keyEvent('9'))
    typeInto(si, els, 0, '9')
    si.onSegmentKeydown(0, keyEvent('2'))
    typeInto(si, els, 0, '2') // 段满 3 位
    await nextTick()
    expect(si.segValues[0]).toBe('192')
    expect(document.activeElement).toBe(els[1])
  })

  it('键入分隔符跳段：不输入任何字符，值不变', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '192')
    const ev = keyEvent('.')
    si.onSegmentKeydown(0, ev)
    await nextTick()
    expect(ev.prevented).toBe(true)
    expect(els[0].value).toBe('192') // 点号未进入
    expect(document.activeElement).toBe(els[1])
  })

  it('越界数字触发跳段并承载：段内 25 键入 6 → 25 与下一段 6', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '25')
    const ev = keyEvent('6')
    si.onSegmentKeydown(0, ev)
    await nextTick()
    expect(ev.prevented).toBe(true)
    expect(si.segValues[0]).toBe('25')
    expect(si.segValues[1]).toBe('6') // 6 被下一段承载
    expect(document.activeElement).toBe(els[1])
  })

  it('承载后新段非法则只跳段不承载（下一段已有 99，承载 6 变 996 非法）', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '25')
    typeInto(si, els, 1, '99')
    si.onSegmentKeydown(0, keyEvent('6'))
    await nextTick()
    expect(si.segValues[1]).toBe('99') // 未被改写
    expect(document.activeElement).toBe(els[1]) // 焦点仍反馈到位
  })

  it('末段承载不下时忽略该次键入（段长上限）', () => {
    const { si, els } = setup()
    typeInto(si, els, 3, '255')
    const ev = keyEvent('7')
    si.onSegmentKeydown(3, ev)
    expect(ev.prevented).toBe(true)
    expect(si.segValues[3]).toBe('255')
  })
})

describe('useSegmentedInput · 退格回跳与方向键', () => {
  it('段首退格：回跳上一段并删除其末位', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '192')
    els[1].focus()
    els[1].setSelectionRange(0, 0)
    si.onSegmentKeydown(1, keyEvent('Backspace'))
    await nextTick()
    expect(si.segValues[0]).toBe('19') // 末位被删
    expect(document.activeElement).toBe(els[0])
  })

  it('空段光标在 0 位：退格同样回跳上一段删末位', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '19')
    els[1].focus()
    si.onSegmentKeydown(1, keyEvent('Backspace'))
    await nextTick()
    expect(si.segValues[0]).toBe('1')
    expect(document.activeElement).toBe(els[0])
  })

  it('非段首退格放行原生删除（不 preventDefault）', () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '192')
    els[0].setSelectionRange(3, 3)
    const ev = keyEvent('Backspace')
    si.onSegmentKeydown(0, ev)
    expect(ev.prevented).toBe(false)
  })

  it('← 在段首跨段移到上一段末尾，→ 在段尾跨段移到下一段段首', async () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '192')
    els[1].focus()
    els[1].setSelectionRange(0, 0)
    si.onSegmentKeydown(1, keyEvent('ArrowLeft'))
    await nextTick()
    expect(document.activeElement).toBe(els[0])

    els[0].setSelectionRange(3, 3)
    si.onSegmentKeydown(0, keyEvent('ArrowRight'))
    await nextTick()
    expect(document.activeElement).toBe(els[1])
  })

  it('光标在段内中间时方向键放行（不跨段）', () => {
    const { si, els } = setup()
    typeInto(si, els, 0, '192')
    els[0].setSelectionRange(1, 1)
    const ev = keyEvent('ArrowLeft')
    si.onSegmentKeydown(0, ev)
    expect(ev.prevented).toBe(false)
  })
})

describe('useSegmentedInput · 键入拦截与 input 兜底', () => {
  it('组合键（Ctrl/Cmd+字母）不被拦截：放行浏览器默认行为（全选/复制/粘贴/剪切）', () => {
    const { si } = setup()
    const cases: Array<[string, boolean, string]> = [
      ['a', true, 'ctrl'], // Ctrl+A 全选
      ['c', true, 'ctrl'], // Ctrl+C 复制
      ['v', true, 'ctrl'], // Ctrl+V 粘贴
      ['x', true, 'meta'], // Cmd+X 剪切
      ['z', true, 'ctrl'], // Ctrl+Z 撤销
    ]
    for (const [k, should, label] of cases) {
      const spy = vi.fn()
      const ev = {
        key: k,
        ctrlKey: should && label === 'ctrl',
        metaKey: should && label === 'meta',
        altKey: false,
        preventDefault: spy,
      } as unknown as KeyboardEvent
      si.onSegmentKeydown(0, ev)
      expect(spy, `${label}+${k} 不应被 preventDefault（放行复制/全选等默认行为）`).not.toHaveBeenCalled()
    }
    expect(si.segValues[0]).toBe('')
  })

  it('keydown 层拦截非数字字符', () => {
    const { si, els } = setup()
    for (const k of ['a', 'A', ' ', '-', '！']) {
      const ev = keyEvent(k)
      si.onSegmentKeydown(0, ev)
      expect(ev.prevented, `字符 ${k} 应被拦截`).toBe(true)
    }
    expect(si.segValues[0]).toBe('')
  })

  it('input 兜底清理脏值：自动填充 "12a3" → "123" 并触发段满跳段', async () => {
    const { si, els } = setup()
    els[0].value = '12a3' // 模拟 keydown 拦不住的路径（自动填充/拖放）
    si.onSegmentInput(0, { target: els[0] } as unknown as Event)
    await nextTick()
    expect(els[0].value).toBe('123')
    expect(si.segValues[0]).toBe('123')
    expect(document.activeElement).toBe(els[1])
  })

  it('input 兜底溢出收缩：自动填充 "9999" → 砍到 "99"（999 非法）', () => {
    const { si, els } = setup()
    els[0].value = '9999'
    si.onSegmentInput(0, { target: els[0] } as unknown as Event)
    expect(els[0].value).toBe('99')
    expect(si.segValues[0]).toBe('99')
  })

  it('IME 组合期间 input 不清理，compositionend 后统一收敛', () => {
    const { si, els } = setup()
    si.onCompositionStart()
    els[0].value = '１２' // 全角数字（组合期脏值）
    si.onSegmentInput(0, { target: els[0] } as unknown as Event)
    expect(si.segValues[0]).toBe('') // 组合期未同步
    si.onCompositionEnd(0, { target: els[0] } as unknown as Event)
    expect(els[0].value).toBe('') // 收敛：sanitize 剥离全角后为空
    expect(si.segValues[0]).toBe('')
  })
})

describe('useSegmentedInput · 粘贴分发', () => {
  it('带分隔符完整 IP：四段分发，焦点落末段末尾', async () => {
    const { si, els, host } = setup()
    si.onSegmentPaste(0, pasteEvent('192.168.1.1'))
    await nextTick()
    expect(si.segValues).toEqual(['192', '168', '1', '1'])
    expect(document.activeElement).toBe(els[3])
    expect(host.emitted.at(-1)).toBe('192.168.1.1')
  })

  it('纯数字保底贪心分发：19216811 → 192.168.1.1（后段各预留 1 字符）', async () => {
    const { si } = setup()
    si.onSegmentPaste(0, pasteEvent('19216811'))
    await nextTick()
    expect(si.segValues).toEqual(['192', '168', '1', '1'])
  })

  it('带分隔符但含非法段：整串拒绝不改值', () => {
    const { si } = setup()
    si.onSegmentPaste(0, pasteEvent('999.1.1.1'))
    expect(si.segValues).toEqual(['', '', '', ''])
    si.onSegmentPaste(0, pasteEvent('192.168.1')) // 只有 3 段
    expect(si.segValues).toEqual(['', '', '', ''])
  })

  it('纯数字分配不出合法段：整串拒绝（999 开头）', () => {
    const { si } = setup()
    si.onSegmentPaste(0, pasteEvent('99916811'))
    expect(si.segValues).toEqual(['', '', '', ''])
  })

  it('含非法字符：拒绝', () => {
    const { si } = setup()
    si.onSegmentPaste(0, pasteEvent('abc'))
    expect(si.segValues).toEqual(['', '', '', ''])
  })

  it('短串且当前段插得下：按普通输入插入光标处', async () => {
    const { si, els } = setup()
    typeInto(si, els, 2, '1')
    si.onSegmentPaste(2, pasteEvent('5')) // 光标在段尾 → 插成 15
    await nextTick()
    expect(si.segValues[2]).toBe('15')
  })
})

describe('useSegmentedInput · v-model 收敛契约', () => {
  it('未填齐 emit 空串；填齐 emit 组装串', () => {
    const { si, els, host } = setup()
    typeInto(si, els, 0, '192')
    typeInto(si, els, 1, '168')
    typeInto(si, els, 2, '1')
    expect(host.emitted.at(-1)).toBe('') // 缺末段
    typeInto(si, els, 3, '1')
    expect(host.emitted.at(-1)).toBe('192.168.1.1')
  })

  it('前导零按原文组装（192.01.1.1 不归一）', () => {
    const { si, els, host } = setup()
    typeInto(si, els, 0, '192')
    typeInto(si, els, 1, '01')
    typeInto(si, els, 2, '1')
    typeInto(si, els, 3, '1')
    expect(host.emitted.at(-1)).toBe('192.01.1.1')
  })

  it('半成品回删后 emit 回落为空串', () => {
    const { si, els, host } = setup()
    for (let i = 0; i < 4; i++) typeInto(si, els, i, '1')
    expect(host.emitted.at(-1)).toBe('1.1.1.1')
    els[3].value = ''
    si.onSegmentInput(3, { target: els[3] } as unknown as Event)
    expect(host.emitted.at(-1)).toBe('')
  })
})

describe('useSegmentedInput · 受控回写', () => {
  it('回环防护：emit 出去的值经父组件回传不重置段（半成品输入不被打断）', async () => {
    const { si, els, host } = setup()
    typeInto(si, els, 0, '19')
    expect(host.emitted.at(-1)).toBe('')
    host.value = '' // 父组件把 '' 回写为 prop（与 lastEmitted 相同）
    await nextTick()
    expect(si.segValues[0]).toBe('19') // 未被 applyExternal 清空
  })

  it('程序设值：合法完整串按段落位', async () => {
    const { si, host } = setup()
    host.value = '10.20.30.40'
    await nextTick()
    expect(si.segValues).toEqual(['10', '20', '30', '40'])
  })

  it('初始非法值：immediate 落段原文展示 + 段级 error 标记，不 clamp', () => {
    const { si } = setup('999.1.1.1')
    expect(si.segValues).toEqual(['999', '1', '1', '1']) // 原文落段
    expect(si.segErrors.value).toEqual([true, false, false, false]) // 越界段标红
    expect(si.isComplete.value).toBe(false)
  })

  it('程序设值切不出 N 段：清空全部段', async () => {
    const { si, els, host } = setup()
    typeInto(si, els, 0, '19')
    host.value = 'abc' // 无分隔符，split 得 1 段 ≠ 4
    await nextTick()
    expect(si.segValues).toEqual(['', '', '', ''])
  })
})

describe('useSegmentedInput · 焦点方法', () => {
  it('focus() 定位第一个空段，光标在段首', async () => {
    const { si, els } = setup()
    si.segValues[0] = '192'
    si.segValues[1] = '168'
    si.focus()
    await nextTick()
    expect(document.activeElement).toBe(els[2])
    expect(els[2].selectionStart).toBe(0)
  })

  it('focus() 全满时定位末段；blur() 使聚焦段失焦', async () => {
    const { si, els } = setup()
    ;['1', '1', '1', '1'].forEach((v, i) => (si.segValues[i] = v))
    si.focus()
    await nextTick()
    expect(document.activeElement).toBe(els[3])
    si.blur()
    expect(document.activeElement).not.toBe(els[3])
  })
})

describe('useSegmentedInput · normalize 钩子（MAC 补零归一化）', () => {
  /** MAC 地址格式参数（组件层同款注入）：6 段 × 2 位十六进制 */
  const MAC = {
    segments: 6,
    maxLen: 2,
    separator: ':',
    acceptChar: /^[0-9a-fA-F]$/,
    sanitize: (s: string) => s.replace(/[^0-9a-fA-F]/g, '').toUpperCase(),
    validate: (s: string) => /^[0-9A-F]{1,2}$/.test(s),
    normalize: (s: string) => s.toUpperCase().padStart(2, '0'),
  }

  it('1 位段输入期合法但不完整；normalizeSegments() 补零后翻转 isComplete 并 emit 规范串', () => {
    const { si, host, els } = setup('', MAC)
    // 六段各输入 1 位（sanitize 实时转大写，为归一前形态）
    ;['a', 'b', 'c', 'd', 'e', 'f'].forEach((ch, i) => {
      els[i].value += ch
      si.onSegmentInput(i, { target: els[i] } as unknown as Event)
    })
    expect(si.segValues).toEqual(['A', 'B', 'C', 'D', 'E', 'F']) // 实时大写、未补零
    expect(si.isComplete.value).toBe(false) // 1 位可接收但未达完成期（2 位）
    expect(host.emitted.at(-1)).toBe('') // 未补齐：v-model 仍空串
    // 触发 blur 归一：补前导 0 → 六段全 2 位 → 完成期成立
    si.normalizeSegments()
    expect(si.segValues).toEqual(['0A', '0B', '0C', '0D', '0E', '0F'])
    expect(si.isComplete.value).toBe(true)
    expect(host.emitted.at(-1)).toBe('0A:0B:0C:0D:0E:0F')
  })

  it('已规范段值 normalizeSegments() 幂等：不重复 emit', () => {
    const { si, host, els } = setup('', MAC)
    ;['0A', '0B', '0C', '0D', '0E', '0F'].forEach((v, i) => (si.segValues[i] = v))
    const before = host.emitted.length
    si.normalizeSegments()
    expect(si.segValues).toEqual(['0A', '0B', '0C', '0D', '0E', '0F']) // 段值不变
    expect(host.emitted.length).toBe(before) // 无新 emit
  })

  it('不传 normalize：normalizeSegments() 为 no-op，isComplete 语义与旧版一致（IPv4 回归护栏）', () => {
    const { si, host, els } = setup()
    typeInto(si, els, 0, '192')
    typeInto(si, els, 1, '168')
    typeInto(si, els, 2, '1')
    expect(si.isComplete.value).toBe(false)
    const before = host.emitted.length
    si.normalizeSegments() // 未配置 → no-op
    expect(si.segValues[0]).toBe('192')
    expect(host.emitted.length).toBe(before)
  })
})
