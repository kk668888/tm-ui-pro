#!/usr/bin/env node
// scripts/check-template-kebab.mjs
//
// 用途：检查（或修复）Vue 模板的命名写法，规则出自 prefer-tm-ui skill §3「模板写法约定」：
//   1. 组件标签用 kebab-case —— <tm-select> 而不是 <TmSelect>
//   2. 属性与事件用 kebab-case —— :value-format / @press-enter 而不是 :valueFormat / @pressEnter
//
// 用法：
//   node scripts/check-template-kebab.mjs                  # 检查默认识别范围（仓库模板源码）
//   node scripts/check-template-kebab.mjs --skill          # 只检查 prefer-tm-ui skill（应 0 违规）
//   node scripts/check-template-kebab.mjs --fix            # 就地修改
//   node scripts/check-template-kebab.mjs src/a.vue ...    # 指定文件或目录
// 退出码：0 = 通过；1 = 有违规（可直接用于 CI 门禁）
//
// ⚠️ 默认范围是本仓库的模板源码，而本仓库**刻意保持 PascalCase 组件标签**（该风格规则只落在
// prefer-tm-ui skill 内），所以默认跑会报出大量标签违规——这是预期结果，不要把它接进
// `pnpm check` / CI 当门禁。要验证 skill 用 `--skill`；要批量改写某个业务项目，传路径即可。
//
// 为什么值得单独写脚本，而不是一把梭正则替换——本次实测踩过四个坑，脚本里都做了防护：
//   · TS 泛型长得像标签：`ref<FormInstance>()`、`Array<NonNullable<T>>`。靠「`<` 前不能是标识符
//     字符」的开标签前缀守卫挡掉。
//   · 闭标签不能套用同一守卫：`>文字</TmButton>` 的 `<` 前面是文字，会被整体漏掉，产出
//     `<tm-button>…</TmButton>` 这种坏配对。
//   · 无前缀组件名转 kebab 会撞原生标签：`<Select>` → `<select>` 会被当原生元素、解析直接失效，
//     用原生标签黑名单拦住。
//   · 注释里的 "import" 一词会让贪婪匹配吞掉下一个真导入：解析 import 前先剥注释。
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const argv = process.argv.slice(2)
const FIX = argv.includes('--fix')
const SKILL_ONLY = argv.includes('--skill')
const targets = argv.filter((a) => !a.startsWith('--'))

// ── 默认识别范围：仓库的模板源码（历史归档/依赖目录不动） ──
const DEFAULT_TARGETS = ['packages/ui/src', 'apps/docs', 'apps/demo/src', 'README.md']
const SKILL_TARGETS = ['.claude/skills/prefer-tm-ui', '.agents/skills/prefer-tm-ui']
const SKIP_DIR = ['node_modules', 'dist', '.vitepress/cache', 'prefer-tm-ui-workspace', '.superpowers']

// ── Vue 内置组件：官方惯例就是 PascalCase，不参与检查 ──
const VUE_BUILTINS = new Set(['Transition', 'TransitionGroup', 'KeepAlive', 'Teleport', 'Suspense', 'Component'])
// ── 类型/泛型误报：出现形态像标签但其实是类型引用 ──
const TYPE_NOISE = /(Instance|Ref|Props|Density|Type)$/
const EXPLICIT_NOISE = new Set(['Cell', 'RowData', 'SelectionState', 'Dayjs', 'Event', 'Element', 'App', 'Y'])
// ── 原生标签黑名单：kebab 后同名会导致组件被当原生元素 ──
const NATIVE_TAGS = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo', 'blockquote',
  'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'data', 'datalist',
  'dd', 'del', 'details', 'dfn', 'dialog', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
  'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li', 'link', 'main', 'map',
  'mark', 'menu', 'meta', 'meter', 'nav', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output',
  'p', 'param', 'picture', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'search',
  'section', 'select', 'slot', 'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup',
  'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
  'track', 'u', 'ul', 'var', 'video', 'wbr', 'color-profile', 'font-face', 'font-face-src', 'missing-glyph',
])

/** PascalCase / camelCase → kebab-case */
const toKebab = (name) =>
  name.replace(/([a-z0-9])([A-Z])/g, '$1.$2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1.$2').toLowerCase().replace(/\./g, '-')
/** kebab-case → PascalCase（用于反查） */
const toPascal = (name) => name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase())

/** 读组件清单：tmComponents 数组 + 文档站注册的三个内部组件 */
function loadKnownComponents() {
  const src = fs.readFileSync(path.join(ROOT, 'packages/ui/src/components.ts'), 'utf8')
  const known = new Set(['DemoBlock', 'TmPropsTable', 'TmMethodsTable'])
  // 按行提取：`readonly Plugin[]` 里也有 `[`，用截取数组区间的写法会把首元素挤出匹配
  for (const m of src.slice(src.indexOf('export const tmComponents')).matchAll(/^\s*(Tm\w+),?\s*$/gm)) {
    known.add(m[1])
  }
  return known
}
const KNOWN = loadKnownComponents()

/** 收集文件（递归；入参为绝对路径） */
function collect(absPath, out = []) {
  if (SKIP_DIR.some((s) => absPath.includes(s))) return out
  const st = fs.statSync(absPath)
  if (st.isDirectory()) {
    for (const e of fs.readdirSync(absPath, { withFileTypes: true })) collect(path.join(absPath, e.name), out)
  } else if (/\.(vue|md)$/.test(absPath)) out.push(absPath)
  return out
}

/** 抽取「本文件真正绑定为组件」的名字：只有白名单命中的标签才会被当作组件标签检查 */
function componentBindings(text, file) {
  const raw = (text.match(/<script[\s\S]*?<\/script>/g) || []).join('\n')
  // 先剥注释：注释里出现 "import" 一词会让匹配从句首注释一路吞到第一个真导入
  const scripts = raw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^[ \t]*\/\/[^\n]*$/gm, '')
  const names = new Set()
  if (file.endsWith('.vue')) names.add(path.basename(file, '.vue')) // 组件自己文件里的用法示例
  for (const m of scripts.matchAll(/^[ \t]*import\s+([\s\S]*?)\s+from\s+['"][^'"]+['"]/gm)) {
    const clause = m[1]
    const def = clause.match(/^([A-Za-z_$][\w$]*)/)
    if (def && /^[A-Z]/.test(def[1])) names.add(def[1])
    const braced = clause.match(/\{([\s\S]*)\}/)
    if (braced) {
      for (const part of braced[1].split(',')) {
        const alias = part.trim().split(/\s+as\s+/).pop()
        if (alias && /^[A-Z][\w$]*$/.test(alias)) names.add(alias)
      }
    }
  }
  for (const m of scripts.matchAll(/components\s*:\s*\{([^}]*)\}/g)) {
    for (const part of m[1].split(',')) {
      const n = part.trim().split(':').pop().trim()
      if (/^[A-Z][\w$]*$/.test(n)) names.add(n)
    }
  }
  for (const m of scripts.matchAll(/const\s*\{([^}]*)\}\s*=/g)) {
    for (const part of m[1].split(',')) {
      const alias = part.trim().split(':').pop().trim()
      if (/^[A-Z][\w$]*$/.test(alias)) names.add(alias)
    }
  }
  for (const m of scripts.matchAll(/const\s+([A-Z][\w$]*)\s*=\s*(?:defineAsyncComponent|defineComponent)\(/g)) names.add(m[1])
  for (const m of scripts.matchAll(/const\s+([A-Z][\w$]*)\s*=\s*\(\)\s*=>\s*import\(/g)) names.add(m[1])
  return names
}

/** 该 PascalCase 标签名是否应当改成 kebab */
function shouldConvertTag(name, bindings) {
  if (name.length < 2) return false
  if (VUE_BUILTINS.has(name) || TYPE_NOISE.test(name) || EXPLICIT_NOISE.has(name)) return false
  const known = KNOWN.has(name) || /^A[A-Z]/.test(name) || bindings.has(name)
  if (!known) return false
  return !NATIVE_TAGS.has(toKebab(name))
}

/**
 * 计算「反例表」行号集合：文档里常有「✅ 正确 / ❌ 反例」对照表，反例列就是为了展示错误写法。
 * 表头含 ❌ 即认定该表是反例对照表（❌ 在表头、不在每个数据行，只按行判断会漏）。
 */
function computeSkipLines(lines) {
  const skip = new Set()
  let inBadTable = false
  lines.forEach((line, i) => {
    if (!/^\s*\|/.test(line)) {
      inBadTable = false
      if (line.includes('❌')) skip.add(i + 1)
      return
    }
    if (line.includes('❌')) inBadTable = true
    if (inBadTable) skip.add(i + 1)
  })
  return skip
}

/** 逐行修模板属性/事件（行内特征；script 区块与反例表不改），返回改动次数 */
function repairAttributes(lines, skipLines) {
  let changed = 0
  let inScript = false
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    if (/^\s*<script[\s>]/.test(line)) inScript = true
    if (inScript) {
      if (/^\s*<\/script>/.test(line)) inScript = false
      continue
    }
    if (skipLines.has(i + 1)) continue
    lines[i] = line
      .replace(/(^|[^\w$])([:@])([a-z]+[A-Z][A-Za-z]*)/g, (w, pre, sigil, name) => {
        changed += 1
        return `${pre}${sigil}${toKebab(name)}`
      })
      .replace(/v-model:([a-z]+[A-Z][A-Za-z]*)/g, (w, name) => {
        changed += 1
        return `v-model:${toKebab(name)}`
      })
  }
  return changed
}

/**
 * 检查一个文件，返回违规列表。
 * 标签检查走全文（注释与字符串里的用法示例也要一致）；
 * 属性检查逐行判定并跳过 <script> 区块——属性/事件是「行内特征」，逐行处理才有准确行号，
 * 也避免脚本里 `{ a: bC }` 这类 JS 被误判成模板属性。
 */
function inspect(file) {
  const text = fs.readFileSync(file, 'utf8')
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  const lines = text.split('\n')
  const lineOf = (index) => text.slice(0, index).split('\n').length
  const violations = []
  const skipLines = computeSkipLines(lines)
  const push = (lineNo, message) => {
    if (skipLines.has(lineNo)) return
    violations.push({ rel, line: lineNo, message })
  }
  const bindings = componentBindings(text, file)

  // 1) 组件标签：开标签带前缀守卫，闭标签不带（`>文字</Foo>` 的 `<` 前面是文字）
  for (const m of text.matchAll(/<\/([A-Z][\w]*)(?=[\s>])/g)) {
    if (shouldConvertTag(m[1], bindings)) push(lineOf(m.index), `组件标签应为 kebab-case：</${m[1]}> → </${toKebab(m[1])}>`)
  }
  for (const m of text.matchAll(/(^|[^\w$<])<([A-Z][\w]*)(?=[\s/>])/g)) {
    if (shouldConvertTag(m[2], bindings)) push(lineOf(m.index), `组件标签应为 kebab-case：<${m[2]}> → <${toKebab(m[2])}>`)
  }

  // 2) 模板属性 / 事件（行内特征，逐行扫描；script 区块内不检查）
  let inScript = false
  lines.forEach((line, i) => {
    if (/^\s*<script[\s>]/.test(line)) inScript = true
    if (inScript) {
      if (/^\s*<\/script>/.test(line)) inScript = false
      return
    }
    // `:` / `@` 前不能是标识符字符，否则会把 JS 侧的 `emit('update:modelValue')`、
    // `onUpdate:fileList` 这类 $attrs 键当成模板绑定（它们正是规则里声明的例外）。
    // `v-model:camelCase` 的 `:` 前面恰好是字母，故单独匹配一条。
    for (const m of line.matchAll(/(^|[^\w$])([:@])([a-z]+[A-Z][A-Za-z]*)/g)) {
      push(i + 1, `模板属性/事件应为 kebab-case：${m[2]}${m[3]} → ${m[2]}${toKebab(m[3])}`)
    }
    for (const m of line.matchAll(/v-model:([a-z]+[A-Z][A-Za-z]*)/g)) {
      push(i + 1, `v-model 参数应为 kebab-case：v-model:${m[1]} → v-model:${toKebab(m[1])}`)
    }
  })
  return violations
}

/** 修复一个文件（标签 + 属性/事件），返回改动计数 */
function repair(file) {
  const text = fs.readFileSync(file, 'utf8')
  const bindings = componentBindings(text, file)
  let changed = 0
  const next = text
    .replace(/<\/([A-Z][\w]*)(?=[\s>])/g, (whole, name) =>
      shouldConvertTag(name, bindings) ? (changed++, `</${toKebab(name)}`) : whole,
    )
    .replace(/(^|[^\w$<])<([A-Z][\w]*)(?=[\s/>])/g, (whole, pre, name) =>
      shouldConvertTag(name, bindings) ? (changed++, `${pre}<${toKebab(name)}`) : whole,
    )
  const lines = next.split('\n')
  changed += repairAttributes(lines, computeSkipLines(lines))
  const result = lines.join('\n')
  if (changed && result !== text) fs.writeFileSync(file, result)
  return changed
}

// ── 主流程 ──
// 入参是绝对路径时原样使用（path.join 会把 C:\… 拼成 E:\repo\C:\…，导致扫描 0 个文件）
const roots = (targets.length ? targets : SKILL_ONLY ? SKILL_TARGETS : DEFAULT_TARGETS).map((t) =>
  path.isAbsolute(t) ? t : path.join(ROOT, t),
)
const files = roots.flatMap((r) => (fs.existsSync(r) ? collect(r) : []))

let total = 0
const byFile = new Map()
for (const file of files) {
  if (FIX) {
    const n = repair(file)
    if (n) {
      total += n
      byFile.set(path.relative(ROOT, file).replace(/\\/g, '/'), n)
    }
    continue
  }
  for (const v of inspect(file)) {
    total += 1
    if (!byFile.has(v.rel)) byFile.set(v.rel, [])
    const list = byFile.get(v.rel)
    if (Array.isArray(list) && list.length < 5) list.push(`  ${v.line}: ${v.message}`)
  }
}

console.log(`扫描 ${files.length} 个文件（范围：${roots.map((r) => path.relative(ROOT, r) || '.').join(', ')}）`)
if (!total) {
  console.log('✓ 无违规')
  process.exit(0)
}
console.log(FIX ? `\n已修复 ${total} 处：` : `\n发现 ${total} 处违规：`)
for (const [file, info] of byFile) {
  console.log(`  ${file}`)
  if (Array.isArray(info)) console.log(info.join('\n'))
  else console.log(`    ${info} 处`)
}
// 退出码语义：检查模式有违规 → 1（可当 CI 门禁）；修复模式修完即成功 → 0，
// 否则 `--fix` 后面接 `&&` 的脚本会被误判为失败。
if (FIX) {
  console.log('\n提示：标签改名同时作用于开闭标签，改完请用编译或测试验证模板')
  process.exit(0)
}
console.log('\n提示：加 --fix 可自动修复（标签与属性一并处理）')
process.exit(1)
