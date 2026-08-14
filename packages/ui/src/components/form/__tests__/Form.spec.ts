// packages/ui/src/components/form/__tests__/Form.spec.ts
// TmForm / TmFormItem 范本组件单测：验证薄封装 + provide/inject 联动通道 + validate 透传
//
// 覆盖核心机制（按 brief Bug 4 真实行为标准，禁用 typeof 空断言）：
// 1. Form props 透传：layout / colon / hideRequiredMark 真实下发到内部 AForm
// 2. 公司默认 layout=horizontal 兜底真实下发
// 3. validate 方法透传：end-to-end 真实校验链路
//    - red path：model 字段违反 required 规则 → wrapper.vm.validate() rejects
//    - green path：model 字段满足规则 → wrapper.vm.validate() resolves 字段值对象
// 4. getFieldsValue 方法透传：经 Proxy 调用返回真实字段值（同步、无 DOM 依赖，覆盖「等方法」）
// 5. provide/inject 通道：TmForm 包裹 TmFormItem 不报 inject 错误（v1 占位通道可用）
// 6. 聚合 install：app.use(@kibus/tm-ui-plus) 同时全局注册 TmForm 与 TmFormItem（plan-bug #5）
// 7. FormItem props 透传：label / name / rules 真实下发到内部 AFormItem
// 8. FormItem 独立使用：无 TmForm 祖先时 useFormContext 返回 undefined 也不影响渲染
// 9. $attrs 与 slots 全透传（Form 与 FormItem 各覆盖）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createApp, h, nextTick, reactive } from 'vue'
import { TmForm, TmFormItem } from '../index'
// 聚合 install：验证 src/index.ts 的双组件注册（plan-bug #5 最易错点）
import plugin, { install } from '../../../index'
import TmInput from '../../input/src/Input.vue'

/**
 * 注：原 Task 10 在此文件局部 stub 的 window.matchMedia 已在 Task 12 提升为全局
 * setupFiles（packages/ui/src/test/setup.ts），所有 spec 共享，无需局部补丁。
 */

/**
 * 构造「TmForm + TmFormItem(name+rules) + TmInput」最小可校验表单。
 * 用于 end-to-end 验证 validate 透传：ant Form 的校验经 async-validator 在 jsdom 下可正常运行。
 *
 * @param initialValue 初始 formState.name 值（'' 触发 required 失败 / 'Tom' 通过）
 * @param rules        传给 TmFormItem 的 rules（默认 required）
 */
const mountValidatableForm = (
  initialValue: string,
  rules: Array<{ required: true; message: string }> = [{ required: true, message: '必填' }],
) => {
  // 使用 reactive 让 ant Form 能监听 model 字段变化（ant Form 依赖响应式 model）
  const formState = reactive<{ name: string }>({ name: initialValue })
  const wrapper = mount(TmForm, {
    props: { model: formState },
    slots: {
      // 默认插槽承载 TmFormItem → TmInput 真实表单结构
      default: () =>
        h(
          TmFormItem,
          { name: 'name', rules },
          {
            // TmInput 的 v-model 由业务侧手动桥接到 formState.name
            default: () =>
              h(TmInput, {
                modelValue: formState.name,
                'onUpdate:modelValue': (v: string | number) => {
                  formState.name = String(v)
                },
              }),
          },
        ),
    },
  })
  return { wrapper, formState }
}

describe('TmForm', () => {
  it('透传 ant Form 原生 props：layout / colon / hideRequiredMark 真实下发到内部 AForm', () => {
    // 锁定 forwardBindings 合并后 ant 原生 props 不丢失（plan-bug #1 单一 v-bind 修正）
    const wrapper = mount(TmForm, {
      props: { layout: 'inline', colon: false, hideRequiredMark: true },
    })
    const inner = wrapper.findComponent({ name: 'AForm' })
    expect(inner.exists()).toBe(true)
    // 真实断言：内部 AForm 收到了业务透传的 props（非 typeof 空断言）
    expect(inner.props('layout')).toBe('inline')
    expect(inner.props('colon')).toBe(false)
    expect(inner.props('hideRequiredMark')).toBe(true)
  })

  it('公司默认 layout=horizontal 真实下发到内部 AForm', () => {
    // 锁定 tmFormDefaults.layout 兜底；业务未传时落到 ant 的公司默认值
    const wrapper = mount(TmForm)
    expect(wrapper.findComponent({ name: 'AForm' }).props('layout')).toBe('horizontal')
  })

  it('validate 透传（red path）：违反 required 规则时 wrapper.vm.validate() rejects（end-to-end 真实链路）', async () => {
    // 真实校验链路：formState.name='' → ant Form.validate 经 async-validator 检测到违反 required → reject
    const { wrapper } = mountValidatableForm('')
    await nextTick()
    await expect(
      (wrapper.vm as unknown as { validate: () => Promise<Record<string, unknown>> }).validate(),
    ).rejects.toBeDefined()
  })

  it('validate 透传（green path）：满足规则时 wrapper.vm.validate() resolves 字段值对象（end-to-end 真实链路）', async () => {
    // 真实校验链路：formState.name='Tom' → 通过 required 校验 → resolve { name: 'Tom' }
    // 注：ant Form.validate 在校验通过时 resolve 出「校验通过字段的值」对象（非空对象），与 red path 的 reject 对照
    const { wrapper } = mountValidatableForm('Tom')
    await nextTick()
    await expect(
      (wrapper.vm as unknown as { validate: () => Promise<Record<string, unknown>> }).validate(),
    ).resolves.toEqual({ name: 'Tom' })
  })

  it('getFieldsValue 透传：调 wrapper.vm.getFieldsValue() 返回真实表单字段值（同步无 DOM 依赖）', async () => {
    // 真实行为断言：经 useForwardRef Proxy 调用 ant Form.getFieldsValue，
    // 返回值含业务字段当前值（证明透传链路真实生效，非 typeof 空断言）。
    // 选 getFieldsValue 而非 resetFields：getFieldsValue 同步返回可预测值，无 DOM/timing 依赖；
    // validate red/green path 已证明 Proxy 转发机制可端到端打通 ant Form，方法透传均匀生效。
    const { wrapper } = mountValidatableForm('Tom')
    await nextTick()
    const values = (
      wrapper.vm as unknown as { getFieldsValue: () => Record<string, unknown> }
    ).getFieldsValue()
    expect(values).toEqual({ name: 'Tom' })
  })

  it('provide/inject 通道：TmForm 包裹 TmFormItem 子节点不报 inject 错误（v1 占位通道可用）', () => {
    // 锁定 FORM_KEY 通道：Form provide 占位 context，FormItem inject 不报错
    // 内部 ant Form↔FormItem 的联动由 ant 自身的 provide/inject 维护，TmForm/TmFormItem 仅透传不干扰
    const wrapper = mount(TmForm, {
      slots: {
        default: () =>
          h(TmFormItem, { label: '名称' }, () => h('input', { type: 'text' })),
      },
    })
    expect(wrapper.findComponent({ name: 'AFormItem' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('名称')
  })

  it('透传 $attrs 到根元素（data-testid）', () => {
    const wrapper = mount(TmForm, { attrs: { 'data-testid': 'my-form' } })
    expect(wrapper.find('[data-testid="my-form"]').exists()).toBe(true)
  })

  it('插槽透传：default slot 渲染到 ant Form 内', () => {
    const wrapper = mount(TmForm, {
      slots: { default: '<div class="slot-content">x</div>' },
    })
    expect(wrapper.find('.slot-content').exists()).toBe(true)
  })

  it('聚合 install：app.use(@kibus/tm-ui-plus) 同时全局注册 TmForm 与 TmFormItem（plan-bug #5 双组件 install）', () => {
    // 锁定 src/index.ts 的聚合 install 必须同时注册两个组件：
    // form 模块含 TmForm + TmFormItem，遗漏任一会使业务侧 <TmFormItem> 报「未注册」错误。
    const app = createApp({})
    install(app)
    // app.component(name) 返回组件定义；未注册时返回 undefined
    expect(app.component('TmForm')).toBeDefined()
    expect(app.component('TmFormItem')).toBeDefined()
    // plugin default export 也应同时含两者的 install（防 build 时被 tree-shake 误删）
    expect(plugin).toBeDefined()
  })
})

describe('TmFormItem', () => {
  it('透传 ant FormItem 原生 props：label / name / rules 真实下发到内部 AFormItem', () => {
    // 锁定 FormItem forwardBindings 合并后 ant 原生 props 不丢失（plan-bug #1 单一 v-bind 修正）
    const rules = [{ required: true, message: '必填' }]
    const wrapper = mount(TmFormItem, {
      props: { label: '用户名', name: 'username', rules },
    })
    const inner = wrapper.findComponent({ name: 'AFormItem' })
    expect(inner.exists()).toBe(true)
    // 真实断言：内部 AFormItem 收到了业务透传的 props
    expect(inner.props('label')).toBe('用户名')
    expect(inner.props('name')).toBe('username')
    expect(inner.props('rules')).toEqual(rules)
  })

  it('渲染 label 文本到 ant FormItem（含 ant label 结构）', () => {
    const wrapper = mount(TmFormItem, {
      props: { label: '邮箱' },
      slots: { default: '<input type="text" />' },
    })
    expect(wrapper.text()).toContain('邮箱')
  })

  it('独立使用（无 TmForm 祖先）useFormContext 返回 undefined 也不影响渲染', () => {
    // 锁定 inject 容错：useFormContext 用 inject(FORM_KEY, undefined)，无祖先 provide 时返回 undefined
    // FormItem 不应因 inject 缺失报错或拒绝渲染（v1 占位通道设计容错）
    const wrapper = mount(TmFormItem, {
      props: { label: '独立' },
      slots: { default: '<input type="text" />' },
    })
    expect(wrapper.findComponent({ name: 'AFormItem' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('独立')
  })

  it('透传 $attrs 到根元素（data-testid）', () => {
    const wrapper = mount(TmFormItem, {
      props: { label: 'x' },
      attrs: { 'data-testid': 'my-item' },
    })
    expect(wrapper.find('[data-testid="my-item"]').exists()).toBe(true)
  })

  it('插槽透传：default slot 渲染到 ant FormItem 内', () => {
    const wrapper = mount(TmFormItem, {
      props: { label: 'x' },
      slots: { default: '<div class="item-content">field</div>' },
    })
    expect(wrapper.find('.item-content').exists()).toBe(true)
  })
})

// ============================================================
// v2 新增：FormContext 级联（readonly / disabled / submitting）+ 变更追踪
// ============================================================

describe('TmForm v2 扩展能力', () => {
  it('submitting prop 经 FormContext 下发到 TmFormItem slot props', async () => {
    // TmFormItem default slot 应能拿到 submitting 字段（经 slotScope 暴露）
    let capturedScope: unknown = null
    mount(TmForm, {
      props: { submitting: true },
      slots: {
        default: () =>
          h(TmFormItem, { label: '字段', name: 'f1' }, {
            default: (slotData: unknown) => {
              capturedScope = slotData
              return h('input')
            },
          }),
      },
    })
    await nextTick()
    expect(capturedScope).toBeDefined()
    expect((capturedScope as Record<string, unknown>)?.submitting).toBe(true)
  })

  it('readonly prop 经 FormContext 下发到 TmFormItem slot props', async () => {
    let capturedScope: unknown = null
    mount(TmForm, {
      props: { readonly: true },
      slots: {
        default: () =>
          h(TmFormItem, { label: '字段', name: 'f1' }, {
            default: (slotData: unknown) => {
              capturedScope = slotData
              return h('input')
            },
          }),
      },
    })
    await nextTick()
    expect((capturedScope as Record<string, unknown>)?.readonly).toBe(true)
  })

  it('disabled prop 经 FormContext 下发到 TmFormItem slot props', async () => {
    let capturedScope: unknown = null
    mount(TmForm, {
      props: { disabled: true },
      slots: {
        default: () =>
          h(TmFormItem, { label: '字段', name: 'f1' }, {
            default: (slotData: unknown) => {
              capturedScope = slotData
              return h('input')
            },
          }),
      },
    })
    await nextTick()
    expect((capturedScope as Record<string, unknown>)?.disabled).toBe(true)
  })

  it('isDirty()：model 与 onMounted 快照相同时返回 false', async () => {
    const formState = reactive({ name: 'Tom' })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    const vm = wrapper.vm as unknown as { isDirty: () => boolean }
    // onMounted 自动快照 → model 未变 → isDirty false
    expect(vm.isDirty()).toBe(false)
  })

  it('isDirty()：model 变更后返回 true', async () => {
    const formState = reactive({ name: 'Tom' })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    formState.name = 'Jerry'
    await nextTick()
    const vm = wrapper.vm as unknown as { isDirty: () => boolean }
    expect(vm.isDirty()).toBe(true)
  })

  it('getDirtyFields()：返回变更字段名列表', async () => {
    const formState = reactive({ name: 'Tom', age: 20 })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    formState.name = 'Jerry'
    await nextTick()
    const vm = wrapper.vm as unknown as { getDirtyFields: () => string[] }
    expect(vm.getDirtyFields()).toEqual(['name'])
  })

  it('resetToInitial()：恢复 model 到快照值 + 清除校验', async () => {
    const formState = reactive({ name: 'Tom' })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    formState.name = 'Jerry'
    await nextTick()
    const vm = wrapper.vm as unknown as {
      resetToInitial: () => void
      isDirty: () => boolean
    }
    vm.resetToInitial()
    await nextTick()
    expect(formState.name).toBe('Tom')
    expect(vm.isDirty()).toBe(false)
  })

  it('markInitial()：重新快照后 isDirty 回到 false', async () => {
    const formState = reactive({ name: 'Tom' })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    formState.name = 'Jerry'
    await nextTick()
    const vm = wrapper.vm as unknown as {
      markInitial: () => void
      isDirty: () => boolean
    }
    // 修改后 isDirty = true
    expect(vm.isDirty()).toBe(true)
    // 标记为新的初始值
    vm.markInitial()
    // isDirty 回到 false（新的快照 = 当前值）
    expect(vm.isDirty()).toBe(false)
  })

  it('嵌套对象字段：深比较判定 dirty（修复快照深克隆 vs 浅比较不一致）', async () => {
    // 回归背景：snapshot() 深克隆 initial，而 isDirty 原用 !== 浅比较，
    // 嵌套对象/数组字段的 initial 与 current 引用恒不同 → 永远 dirty、reset 无法复位。
    const formState = reactive<{ user: { address: { city: string } }; tags: string[] }>({
      user: { address: { city: '北京' } },
      tags: ['a'],
    })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    const vm = wrapper.vm as unknown as {
      isDirty: () => boolean
      getDirtyFields: () => string[]
      resetToInitial: () => void
    }

    // 初始快照后：嵌套内容未变 → 不 dirty（旧实现这里恒为 true）
    expect(vm.isDirty()).toBe(false)

    // 嵌套字段深层变更 → dirty，且只报变更字段
    formState.user.address.city = '上海'
    await nextTick()
    expect(vm.isDirty()).toBe(true)
    expect(vm.getDirtyFields()).toEqual(['user'])

    // resetToInitial 恢复深层值 → 回到 not dirty（旧实现无法复位）
    vm.resetToInitial()
    await nextTick()
    expect(formState.user.address.city).toBe('北京')
    expect(vm.isDirty()).toBe(false)

    // 数组字段同理
    formState.tags.push('b')
    await nextTick()
    expect(vm.isDirty()).toBe(true)
    vm.resetToInitial()
    await nextTick()
    expect(formState.tags).toEqual(['a'])
    expect(vm.isDirty()).toBe(false)
  })

  it('嵌套对象字段：getDirtyFields 不含未变更字段', async () => {
    const formState = reactive<{ user: { name: string }; note: string }>({
      user: { name: 'Tom' },
      note: 'keep',
    })
    const wrapper = mount(TmForm, { props: { model: formState } })
    await nextTick()
    formState.user.name = 'Jerry'
    await nextTick()
    const vm = wrapper.vm as unknown as { getDirtyFields: () => string[] }
    expect(vm.getDirtyFields()).toEqual(['user'])
  })

  it('公司扩展键透传边界：submitting/readonly 不误透传，disabled 走 ant 原生 prop', () => {
    const wrapper = mount(TmForm, {
      props: { submitting: true, readonly: true, disabled: true },
    })
    const inner = wrapper.findComponent({ name: 'AForm' })
    // submitting/readonly 是纯公司扩展键，ant Form 无对应 prop，不应透传
    expect(inner.props('submitting')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
    // disabled 是 ant Form 原生 prop（整表禁用），应透传保留原生能力
    expect(inner.props('disabled')).toBe(true)
  })
})

// ============================================================
// v2 新增：TmInput / TmSelect 适配 FormContext 级联
// ============================================================

describe('TmInput FormContext 级联', () => {
  it('TmForm readonly 级联到内部 TmInput 的 readonly', async () => {
    const formState = reactive({ name: '' })
    const wrapper = mount(TmForm, {
      props: { model: formState, readonly: true },
      slots: {
        default: () =>
          h(TmFormItem, { name: 'name' }, {
            default: () => h(TmInput, { modelValue: '' }),
          }),
      },
    })
    await nextTick()
    const input = wrapper.findComponent({ name: 'AInput' })
    expect(input.props('readonly')).toBe(true)
  })

  it('TmForm disabled 级联到内部 TmInput 的 disabled', async () => {
    const formState = reactive({ name: '' })
    const wrapper = mount(TmForm, {
      props: { model: formState, disabled: true },
      slots: {
        default: () =>
          h(TmFormItem, { name: 'name' }, {
            default: () => h(TmInput, { modelValue: '' }),
          }),
      },
    })
    await nextTick()
    const input = wrapper.findComponent({ name: 'AInput' })
    expect(input.props('disabled')).toBe(true)
  })

  it('TmInput 业务显式传 readonly 优先于 TmForm context', async () => {
    const formState = reactive({ name: '' })
    const wrapper = mount(TmForm, {
      props: { model: formState, readonly: true },
      slots: {
        default: () =>
          h(TmFormItem, { name: 'name' }, {
            // 业务显式传 false——应覆盖 Form context 的 true
            default: () => h(TmInput, { modelValue: '', readonly: false }),
          }),
      },
    })
    await nextTick()
    const input = wrapper.findComponent({ name: 'AInput' })
    expect(input.props('readonly')).toBe(false)
  })

  it('TmInput 无 TmForm 祖先时不受影响', () => {
    const wrapper = mount(TmInput, { props: { modelValue: '' } })
    const input = wrapper.findComponent({ name: 'AInput' })
    // 独立使用时 readonly/disabled 走 ant 默认（undefined）
    expect(input.props('readonly')).toBeUndefined()
    expect(input.props('disabled')).toBeUndefined()
  })
})
