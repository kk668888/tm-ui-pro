// packages/ui/src/utils/__tests__/withInstall.spec.ts
// withInstall 工具的单测：验证 install 方法注入与原组件属性保留
import { describe, it, expect, vi } from 'vitest'
import { createApp, defineComponent } from 'vue'
import { withInstall } from '../withInstall'

describe('withInstall', () => {
  it('为组件附加 install 方法，app.use 时全局注册', () => {
    const Base = defineComponent({ name: 'XButton' })
    const TmButton = withInstall(Base, 'TmButton')

    const app = createApp({})
    const componentSpy = vi.spyOn(app, 'component')
    // withInstall 返回类型已含 install 方法（T & { install }），无需强转
    TmButton.install(app)

    expect(componentSpy).toHaveBeenCalledWith('TmButton', Base)
  })

  it('保留原组件的全部属性', () => {
    const Base = defineComponent({ name: 'XButton', props: { foo: {} } })
    const TmButton = withInstall(Base, 'TmButton')
    expect(TmButton.props).toEqual(Base.props)
  })
})
