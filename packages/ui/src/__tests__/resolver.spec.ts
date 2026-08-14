// packages/ui/src/__tests__/resolver.spec.ts
// TmResolver（unplugin-vue-components 按需 Resolver）单测
//
// 测试风格对齐 src/utils/withInstall.spec.ts（纯函数 + describe/it/expect）。
// 覆盖 brief Bug 5 全部用例：
//   1. TmResolver() 工厂返回结构（{ type: 'component', resolve: <fn> }）
//   2. 各已实现组件名映射（TmButton/Input/Select/Form/FormItem/ConfigProvider → 主入口 @kibus/tm-ui-plus）
//   3. TmTable 走子入口 @kibus/tm-ui-plus/table（vxe 体积大需独立 chunk）
//   4. 非 Tm 前缀（ElButton / a-button / Button / AB）→ undefined
//   5. 边界（'' / 'Tm' slice(2) 后空 / 'TmXYZ' 未实现组件 fail-fast）
import { describe, it, expect } from 'vitest'
import { TmResolver } from '../resolver'

describe('TmResolver', () => {
  // ---------- 工厂返回结构 ----------
  it('返回 unplugin-vue-components 标准 ComponentResolver 结构', () => {
    const resolver = TmResolver()
    expect(resolver.type).toBe('component')
    expect(typeof resolver.resolve).toBe('function')
  })

  it('每次调用返回独立实例（工厂语义，不可变）', () => {
    const a = TmResolver()
    const b = TmResolver()
    // 不同实例：避免共享闭包状态带来的 mutation 风险
    expect(a).not.toBe(b)
    // 但行为一致
    expect(a.resolve('TmButton')).toEqual(b.resolve('TmButton'))
  })

  // ---------- 主入口组件（已实现范本）----------
  it('TmButton 解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmButton')).toEqual({
      name: 'TmButton',
      from: '@kibus/tm-ui-plus',
    })
  })

  it('TmInput 解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmInput')).toEqual({
      name: 'TmInput',
      from: '@kibus/tm-ui-plus',
    })
  })

  it('TmSelect 解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmSelect')).toEqual({
      name: 'TmSelect',
      from: '@kibus/tm-ui-plus',
    })
  })

  it('TmForm 解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmForm')).toEqual({
      name: 'TmForm',
      from: '@kibus/tm-ui-plus',
    })
  })

  it('TmFormItem（多词组件名）解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmFormItem')).toEqual({
      name: 'TmFormItem',
      from: '@kibus/tm-ui-plus',
    })
  })

  it('TmConfigProvider（多词组件名）解析为主入口 @kibus/tm-ui-plus', () => {
    expect(TmResolver().resolve('TmConfigProvider')).toEqual({
      name: 'TmConfigProvider',
      from: '@kibus/tm-ui-plus',
    })
  })

  // ---------- 子入口（vxe 重依赖按需）----------
  it('TmTable 解析为子入口 @kibus/tm-ui-plus/table（vxe 体积大需独立 chunk）', () => {
    expect(TmResolver().resolve('TmTable')).toEqual({
      name: 'TmTable',
      from: '@kibus/tm-ui-plus/table',
    })
  })

  // ---------- 非 Tm 前缀 ----------
  it('ElButton（非 Tm 前缀）返回 undefined', () => {
    expect(TmResolver().resolve('ElButton')).toBeUndefined()
  })

  it('a-button（kebab-case 非 Tm 前缀）返回 undefined', () => {
    expect(TmResolver().resolve('a-button')).toBeUndefined()
  })

  it('Button（无前缀）返回 undefined', () => {
    expect(TmResolver().resolve('Button')).toBeUndefined()
  })

  it('AB（仅 2 字符且非 Tm 前缀）返回 undefined', () => {
    expect(TmResolver().resolve('AB')).toBeUndefined()
  })

  // ---------- 边界 ----------
  it('空字符串返回 undefined', () => {
    expect(TmResolver().resolve('')).toBeUndefined()
  })

  it('仅前缀 "Tm"（slice(2) 后为空）返回 undefined', () => {
    // 'Tm'.slice(2) === ''，kebab 转换得空串，非 'table' ——
    // 若误返回 { from: '@kibus/tm-ui-plus' } 会污染业务方对 <Tm> 这一无意义标签的解析。
    // 设计：前缀无组件名时 undefined，避免误匹配。
    expect(TmResolver().resolve('Tm')).toBeUndefined()
  })

  it('未实现组件 TmXYZ 仍返回 @kibus/tm-ui-plus（fail-fast 设计）', () => {
    // brief Bug 5 边界决策：保留 plan 逻辑「非 table 都返回 @kibus/tm-ui-plus」。
    // 理由：resolver 在业务方编译期运行，未实现组件返回 @kibus/tm-ui-plus 会让业务侧
    // `import { TmXYZ } from '@kibus/tm-ui-plus'` 在 vite build 阶段因 named export 缺失立即报错
    // （fail-fast）；若加白名单返回 undefined，unplugin-vue-components 会静默不处理，
    // 业务方写错的组件名将渲染为未知元素，错误被掩盖。
    expect(TmResolver().resolve('TmXYZ')).toEqual({
      name: 'TmXYZ',
      from: '@kibus/tm-ui-plus',
    })
  })
})
