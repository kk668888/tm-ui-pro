// packages/ui/src/composables/useSegmentedInput.ts
// 分段输入内核：N 段短文本输入框共享的段状态机（跳段/回跳/拦截/兜底/粘贴分发/受控回写）
//
// 设计背景（add-input-ip D3）：IP 地址这类「分隔符拼接的多段输入」在 antd 中没有对应物，
// TmInputIp 作为库内第一个自研交互组件，把与具体格式无关的段机制沉淀在本 composable，
// 未来 IPv6（segments:8 / 十六进制）、port-range 等分段组件换参数即可复用。
//
// 职责边界：
// - 本文件只管「段机制」：段值状态、焦点流转、键入拦截、粘贴分发、外部受控值回写
// - 「格式规则」由参数注入：maxLen / separator / acceptChar / sanitize / validate
//
// 分层防线（D4）：
// - keydown 层：拦截非法字符与越界键入（体验：字符根本不出现）
// - input 层：兜底 keydown 拦不住的路径（IME 组合输入、浏览器自动填充、拖放文本）
//   —— 兜底做同样的清理规则，最坏体验是输入被丢弃，不会产生脏值
import { computed, nextTick, reactive, ref, watch, type Ref } from 'vue'

/** 分段输入的格式规则与外部接线（由具体组件注入） */
export interface UseSegmentedInputOptions {
  /** 段数（IPv4=4，未来 IPv6=8） */
  segments: number
  /** 每段最大字符数（IPv4=3） */
  maxLen: number
  /** 段分隔符（IPv4='.'；组装与粘贴解析共用） */
  separator: string
  /** 单字符准入测试（keydown 拦截层用；IPv4：/^[0-9]$/） */
  acceptChar: RegExp
  /** 整串清理（input 兜底层用，剥离不合法字符；IPv4：剥除非数字） */
  sanitize: (s: string) => string
  /** 段级合法性（空串是否合法由调用方决定；IPv4：1-3 位数字且 ≤255） */
  validate: (seg: string) => boolean
  /**
   * 段值归一化后处理（可选；仅调用方显式触发时执行，不做自动时机判断）：
   * 对非空段做「完成期」格式统一（如 MAC 补前导 0 + 转大写）。
   * 与 validate 的关系：validate 是「输入期」接收校验（宽松，IM 接受 1-2 位），
   * isComplete 与 normalizeSegments() 使用「normalize 后再 validate」的完成期校验（严格，2 位）。
   * 不传时 normalizeSegments() 为 no-op、isComplete 语义与旧版本逐字节一致（IPv4 不传）。
   */
  normalize?: (seg: string) => string
  /** 外部受控值 getter（组件传 () => props.modelValue ?? ''） */
  modelValue: () => string
  /** 值变化回调（组件接 emit('update:modelValue', v)） */
  onUpdate: (v: string) => void
}

/**
 * 分段输入内核
 *
 * @example
 * ```ts
 * const si = useSegmentedInput({
 *   segments: 4, maxLen: 3, separator: '.',
 *   acceptChar: /^[0-9]$/, sanitize: s => s.replace(/\D/g, ''),
 *   validate: s => /^[0-9]{1,3}$/.test(s) && Number(s) <= 255,
 *   modelValue: () => props.modelValue ?? '',
 *   onUpdate: v => emit('update:modelValue', v),
 * })
 * ```
 */
export function useSegmentedInput(options: UseSegmentedInputOptions) {
  const { segments, maxLen, separator, acceptChar, sanitize, validate, normalize } = options

  // ── 段状态 ────────────────────────────────────────────────
  // reactive 数组：模板 :value="segValues[i]" 直接驱动四个 input 的受控显示
  const segValues = reactive<string[]>(Array.from({ length: segments }, () => ''))

  // 各段 DOM 引用：跳段/回跳需要真实 focus 与光标定位
  const segEls = ref<(HTMLInputElement | null)[]>([])

  // IME 组合输入标记：组合期间跳过兜底清理（避免打断输入法），compositionend 后补一次
  const isComposing = ref(false)

  // 受控回环防护（D5）：本组件刚 emit 出去的值会经父组件回传到 modelValue，
  // 记录最近一次 emit 值，watch 中跳过相同值的回写，避免打断用户连续输入
  let lastEmitted = ''

  // ── 派生状态 ──────────────────────────────────────────────
  /** 段齐且每段均已是「规范化形态」（emit 完整串的前提）。
   *  完成期判据（D_MAC1）：段值非空、normalize 后不回变（即已是规范形，如 MAC 的 2 位补零大写）、
   *  且 validate 通过。若某段仍是非规范形（MAC 输入期 1 位「A」，normalize 会改写成「0A」）→
   *  未达完成期，emit 保持 ''；normalizeSegments() 收敛后才翻转 isComplete。
   *  IPv4 不传 normalize → normalize(seg)===seg 恒真，判据退化为旧的「validate(原始段值)」，逐字节兼容。 */
  const isComplete = computed(
    () =>
      segValues.length === segments &&
      segValues.every(s => {
        if (s === '') return false
        return normalize ? normalize(s) === s && validate(s) : validate(s)
      }),
  )

  /** 当前段值组装出的展示串（与 emit 值同源；段未齐时也能看半成品） */
  const displayValue = computed(() => segValues.join(separator))

  /**
   * 段级错误标记：非空且不合法（validate 不过）
   * 用途：程序设值路径（如初始 modelValue="999.1.1.1"）按原文落段后，
   * 越界段靠它标 error 视觉态——不静默 clamp（spec「初始非法值展示」）
   */
  const segErrors = computed<boolean[]>(() => segValues.map(s => s !== '' && !validate(s)))

  // ── 值变更收敛 ────────────────────────────────────────────
  /**
   * 段值变化后的统一出口：计算「完整合法 → 组装串，否则 ''」并回调
   * v-model 契约（spec）：要么空串要么完整合法 IP，表单侧无脏数据
   */
  function commit(): void {
    const v = isComplete.value ? displayValue.value : ''
    lastEmitted = v
    options.onUpdate(v)
  }

  /**
   * 外部受控值 → 段值（程序设值路径）
   * 按 separator 切出 N 段则原文落段（不校验——非法段交给 segErrors 标红）；
   * 空值或切不出 N 段（无法展示）则清空全部段
   */
  function applyExternal(value: string): void {
    if (!value) {
      segValues.forEach((_, i) => (segValues[i] = ''))
      return
    }
    const parts = value.split(separator)
    if (parts.length === segments) {
      parts.forEach((p, i) => (segValues[i] = p))
    } else {
      segValues.forEach((_, i) => (segValues[i] = ''))
    }
  }

  /**
   * 段值归一化收敛（调用方在 blur 等时机显式触发）：
   * 对每个非空段执行「normalize 后校验」，若校验通过则把段值替换为归一化结果——
   * 归一化可能改变 isComplete（如 MAC 补零后从不完整变完整），变更后走 commit()
   * 重新计算 emit 值。空段不动（归一化不作用在半成品缺失上，缺段不补）。
   * 未配置 normalize 时静默 no-op（IPv4 回归护栏：行为与旧版本一致）。
   */
  function normalizeSegments(): void {
    if (!normalize) return
    let changed = false
    segValues.forEach((s, i) => {
      if (s === '') return
      const next = normalize(s)
      // 只有归一化结果合法才落段——若配置的 normalize 产出越界值，保留原值交由 segErrors 标红
      if (next !== s && validate(next)) {
        segValues[i] = next
        changed = true
      }
    })
    if (changed) commit()
  }

  // 受控回写监听：immediate 让初始值（含非法初始值）在挂载时即落段
  watch(
    () => options.modelValue(),
    v => {
      const normalized = v ?? ''
      // 回环防护：自己刚 emit 的值原样回传，跳过（applyExternal 会重置段值打断输入）
      if (normalized === lastEmitted) return
      applyExternal(normalized)
    },
    { immediate: true },
  )

  // ── 焦点工具 ──────────────────────────────────────────────
  /**
   * 聚焦第 i 段并定位光标
   * @param pos 'start' 段首 | 'end' 段尾（默认 'end'，回跳/跳段的常规落点）
   * nextTick 等待 :value 补丁落到 DOM 后再设光标，避免光标越界被浏览器收敛
   */
  async function focusSegment(i: number, pos: 'start' | 'end' = 'end'): Promise<void> {
    const el = segEls.value[i]
    if (!el) return
    await nextTick()
    el.focus()
    const p = pos === 'start' ? 0 : el.value.length
    el.setSelectionRange(p, p)
  }

  /** 对外 focus()：定位第一个空段（全满则末段）——spec「焦点方法」 */
  function focus(): void {
    const firstEmpty = segValues.findIndex(s => s === '')
    const target = firstEmpty === -1 ? segments - 1 : firstEmpty
    void focusSegment(target, 'start')
  }

  /** 对外 blur()：让当前聚焦段失焦 */
  function blur(): void {
    const active = document.activeElement
    if (active instanceof HTMLInputElement && segEls.value.includes(active)) {
      active.blur()
    }
  }

  // ── keydown 拦截层 ────────────────────────────────────────
  /**
   * 段键盘拦截：单字符准入 / 段满与越界的跳段承载 / 分隔符跳段 / 退格回跳 / 方向键跨段
   *
   * 拦截返回 true 表示事件已被组件消费（调用方需 preventDefault；
   * 本函数内部已调用 e.preventDefault，调用方无需重复）
   */
  function onSegmentKeydown(i: number, e: KeyboardEvent): void {
    // IME 组合期间不拦截（交给 compositionend 后的兜底清理）
    if (isComposing.value) return

    // 1) 分隔符键：跳下一段，不输入任何字符（「点可以省略」：打点是显式跳段）
    if (e.key === separator) {
      e.preventDefault()
      if (i < segments - 1) void focusSegment(i + 1, 'start')
      return
    }

    // 2) 退格：光标在段首（空段天然满足）→ 回跳上一段并删除其末位
    if (e.key === 'Backspace') {
      const el = segEls.value[i]
      if (!el) return
      const atStart = el.selectionStart === 0 && el.selectionEnd === 0
      if (atStart && i > 0) {
        e.preventDefault()
        segValues[i - 1] = segValues[i - 1].slice(0, -1)
        commit()
        void focusSegment(i - 1, 'end')
      }
      // 非段首退格：放行原生删除，随后 input 事件负责同步段值
      return
    }

    // 3) 方向键跨段：光标顶到段边界时把 ←/→ 翻译成焦点跨段移动
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      const el = segEls.value[i]
      if (!el) return
      const collapsed = el.selectionStart === el.selectionEnd
      const atStart = collapsed && el.selectionStart === 0
      const atEnd = collapsed && el.selectionStart === el.value.length
      if (e.key === 'ArrowLeft' && atStart && i > 0) {
        e.preventDefault()
        void focusSegment(i - 1, 'end')
      } else if (e.key === 'ArrowRight' && atEnd && i < segments - 1) {
        e.preventDefault()
        void focusSegment(i + 1, 'start')
      }
      return
    }

    // 4) 可打印字符：准入拦截 + 段满/越界的跳段承载
    if (e.key.length === 1) {
      // 带修饰键的组合键（Ctrl/Cmd/Alt + 字母）是浏览器快捷键（全选/复制/粘贴/剪切等），
      // 不作为输入字符处理，放行默认行为——否则 Ctrl+A/C/V/X 会被 acceptChar 拦截失效
      if (e.ctrlKey || e.metaKey || e.altKey) return
      // 非法字符（字母/符号/空格）：keydown 层直接拦截，字符根本不出现
      if (!acceptChar.test(e.key)) {
        e.preventDefault()
        return
      }
      const el = segEls.value[i]
      if (!el) return
      // 预演插入后的段值：考虑光标位置与选区（选中替换场景）。
      // 先过 sanitize 归一形态再校验——MAC 等 validate 只认规范化形式
      // （大写 hex）时，键入小写 a 预览 'a' 也能正确判定可承载，否则被误拦截
      const before = el.value.slice(0, el.selectionStart ?? 0)
      const after = el.value.slice(el.selectionEnd ?? 0)
      const hypothetical = sanitize(before + e.key + after)
      if (hypothetical.length <= maxLen && validate(hypothetical)) {
        return // 本段可承载：放行，input 事件负责同步段值与段满跳段
      }
      // 本段承载不下（段满或越界）：
      // 非末段 → 跳段承载（spec「越界数字触发跳段」：25 再打 6 → 25.6）
      if (i < segments - 1) {
        e.preventDefault()
        const nextVal = sanitize(segValues[i + 1] + e.key)
        // 承载后新段也必须合法（如下一段已有 25，再承载 6 会变 256）；
        // 不合法时只跳段不承载（罕见边界，丢弃该字符但焦点反馈到位）
        if (nextVal.length <= maxLen && validate(nextVal)) {
          segValues[i + 1] = nextVal
          commit()
        }
        void focusSegment(i + 1, 'end')
      } else {
        // 末段承载不下：忽略该次键入（spec「段长上限」）
        e.preventDefault()
      }
    }
    // 其余功能键（Tab/Home/End/剪贴板快捷键等）：放行原生行为
  }

  // ── input 兜底层 ──────────────────────────────────────────
  /**
   * 段 input 事件：段值同步的唯一出口（keydown 放行的输入也经由此同步）
   *
   * 兜底职责（D4）：清理 keydown 拦不住路径（IME/自动填充/拖放）产生的脏值——
   * sanitize 剥离非法字符 → 截断 maxLen → 尾部收缩直到合法 → 回写 el 与段状态
   */
  function onSegmentInput(i: number, e: Event): void {
    const el = e.target as HTMLInputElement
    if (!el) return
    // IME 组合期间不清理（见 onCompositionEnd）
    if (isComposing.value) return

    let next = sanitize(el.value)
    next = next.slice(0, maxLen)
    // 尾部收缩：极端路径（自动填充"999"）可能给出越界值，砍尾字符直到合法
    while (next !== '' && !validate(next)) {
      next = next.slice(0, -1)
    }
    if (next !== el.value) el.value = next
    segValues[i] = next
    commit()
    // 段满自动跳段（spec：第三位数字输入后焦点自动移至下一段）
    if (next.length === maxLen && i < segments - 1) {
      void focusSegment(i + 1, 'start')
    }
  }

  // ── IME 组合输入 ─────────────────────────────────────────
  /** compositionstart：组合开始，暂停兜底清理 */
  function onCompositionStart(): void {
    isComposing.value = true
  }

  /** compositionend：组合结束，对该段补一次兜底清理（走与 input 相同的收敛规则） */
  function onCompositionEnd(i: number, e: Event): void {
    isComposing.value = false
    onSegmentInput(i, e)
  }

  // ── 粘贴分发 ─────────────────────────────────────────────
  /**
   * 粘贴解析分发（spec「粘贴解析分发」）：
   * 1) 含分隔符：必须是完整合法 N 段 → 整体分发四段；任一段非法 → 整串拒绝不改值
   * 2) 纯准入字符且当前段插得下：按普通输入插入光标处
   * 3) 其余纯准入字符串：保底贪心分发——每段最多 maxLen，但给后续段各预留 1 字符
   *    （"19216811" → 192.168.1.1 而非 192.168.11），任一分配段非法 → 整串拒绝
   * 4) 含非法字符：拒绝
   */
  function onSegmentPaste(i: number, e: ClipboardEvent): void {
    e.preventDefault()
    const raw = e.clipboardData?.getData('text') ?? ''
    const text = raw.trim()
    if (!text) return

    // 1) 带分隔符：完整 IP 粘贴
    if (text.includes(separator)) {
      const parts = text.split(separator)
      const ok =
        parts.length === segments &&
        parts.every(p => p !== '' && p.length <= maxLen && validate(p))
      if (!ok) return // 整串拒绝：任何段非法都不改现有值
      parts.forEach((p, idx) => (segValues[idx] = p))
      commit()
      void focusSegment(segments - 1, 'end')
      return
    }

    // 含非法字符：拒绝
    if (sanitize(text) !== text) return

    // 2) 短串且当前段插得下：按普通输入处理（光标处插入）
    const el = segEls.value[i]
    const cur = el ? el.value : segValues[i]
    const cursor = el ? (el.selectionStart ?? cur.length) : cur.length
    const tail = el ? (el.selectionEnd ?? cursor) : cursor
    const inserted = cur.slice(0, cursor) + text + cur.slice(tail)
    if (text.length <= maxLen && inserted.length <= maxLen && validate(inserted)) {
      segValues[i] = inserted
      commit()
      void focusSegment(i, 'end')
      return
    }

    // 3) 保底贪心分发：前段尽量吃满，但给剩余段各留至少 1 字符
    const remainingSegs = segments - i
    if (text.length < remainingSegs || text.length > remainingSegs * maxLen) return
    const chunks: string[] = []
    let rest = text
    for (let k = i; k < segments; k++) {
      const after = segments - 1 - k // 本段之后还有几段
      const take = Math.min(maxLen, rest.length - after)
      chunks.push(rest.slice(0, take))
      rest = rest.slice(take)
    }
    if (rest !== '' || chunks.some(c => !validate(c))) return // 分配不出合法段：整串拒绝
    chunks.forEach((c, idx) => (segValues[i + idx] = c))
    commit()
    void focusSegment(segments - 1, 'end')
  }

  return {
    segValues,
    segErrors,
    isComplete,
    displayValue,
    setSegmentRef: (i: number, el: unknown) => {
      segEls.value[i] = (el as HTMLInputElement) ?? null
    },
    onSegmentKeydown,
    onSegmentInput,
    onCompositionStart,
    onCompositionEnd,
    onSegmentPaste,
    normalizeSegments,
    focus,
    blur,
    focusSegment,
  }
}

export type UseSegmentedInputReturn = ReturnType<typeof useSegmentedInput>
