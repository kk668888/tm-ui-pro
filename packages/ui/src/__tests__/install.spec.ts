// packages/ui/src/__tests__/install.spec.ts
// install 全量注册的守护测试（审查 P1 #10 重构配套）：
// 新增组件若只加入 tmComponents 数组而未在 index.ts export（或反之），本测试无法覆盖后者，
// 但能锁定「数组内每个组件都真实可 app.use 注册、注册名符合 Tm 前缀规范」，
// 防止漏注册/注册名漂移在无编译错误的情况下悄悄发生。
import { describe, it, expect } from 'vitest'
import { createApp, type App } from 'vue'
import { tmComponents } from '../components'
import { install } from '../index'

describe('@kibus/tm-ui-plus install 全量注册', () => {
  it('tmComponents 数组非空且每个元素都是可 install 的插件', () => {
    expect(tmComponents.length).toBeGreaterThan(50)
    for (const comp of tmComponents) {
      expect(typeof comp).toBe('object')
      expect(typeof (comp as { install?: unknown }).install).toBe('function')
    }
  })

  it('install(app) 后每个组件都以 Tm 前缀全局注册', () => {
    const app: App = createApp({})
    // 拦截 app.component 记录注册名（不实际挂载 DOM）
    const registered = new Set<string>()
    const original = app.component.bind(app)
    app.component = ((name: string, comp?: unknown) => {
      if (comp !== undefined) registered.add(name)
      return original(name, comp as never)
    }) as typeof app.component

    install(app)

    // 数量对齐：数组内每个组件都应注册（withInstall 的 install 用 name 参数注册）
    expect(registered.size).toBe(tmComponents.length)
    // 全部注册名以 Tm 开头（全局命名空间规范），且无重复
    for (const name of registered) {
      expect(name.startsWith('Tm'), `注册名应以 Tm 开头：${name}`).toBe(true)
    }
    expect(registered.size).toBe(new Set([...registered]).size)
  })

  it('install 幂等：重复调用不抛错', () => {
    const app: App = createApp({})
    expect(() => install(app)).not.toThrow()
    expect(() => install(app)).not.toThrow()
  })
})
