// packages/ui/src/composables/__tests__/useForwardBindings.spec.ts
// useForwardBindings 单测：幻影 false 跳过、显式 props 转发、公司默认转发、computed 源适配
import { computed, defineComponent, h, type ComponentPublicInstance } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { useForwardBindings } from '../useForwardBindings'

// 简单宿主：直接传 withDefaults 的 props（reactive），结果渲染到 data-fwd 供断言
const Host = defineComponent({
  name: 'Host',
  inheritAttrs: false,
  props: {
    // 可选 Boolean 无默认：模拟类型化 defineProps，缺省被归一化为 false（幻影值）
    open: { type: Boolean },
    // 业务显式传的普通 prop
    action: { type: String },
    // 公司默认：withDefaults 兜底 true
    showUploadList: { type: Boolean, default: true },
  },
  setup(props) {
    const forward = useForwardBindings(props, ['showUploadList'])
    return () => h('div', { 'data-fwd': JSON.stringify(forward.value) })
  },
})

// 中间变换宿主：模拟 Popconfirm 的 antProps（computed 源 + 合成 okButtonProps）
const ComputedHost = defineComponent({
  name: 'ComputedHost',
  inheritAttrs: false,
  props: {
    open: { type: Boolean },
    danger: { type: Boolean },
  },
  setup(props) {
    const antProps = computed(() => {
      const { danger, ...rest } = props
      return {
        ...rest,
        okButtonProps: danger ? { danger: true } : undefined,
      }
    })
    const forward = useForwardBindings(antProps, ['okButtonProps'])
    return () => h('div', { 'data-fwd': JSON.stringify(forward.value) })
  },
})

// 排除监听器宿主：模拟 TmUpload——模板显式绑定 update 事件，须从透传中剔除同名监听器
const ExcludeHost = defineComponent({
  name: 'ExcludeHost',
  inheritAttrs: false,
  props: {
    fileList: { type: Array },
  },
  setup(props) {
    const forward = useForwardBindings(props, [], ['onUpdate:fileList'])
    return () => h('div', { 'data-fwd': String(typeof forward.value['onUpdate:fileList']) })
  },
})

// JSON 会丢弃值为 undefined 的 key，故「未转发」断言为该 key 不存在（值为 undefined）
function readForward(wrapper: VueWrapper<ComponentPublicInstance>): Record<string, unknown> {
  const raw = wrapper.find('div').attributes('data-fwd')
  return JSON.parse(raw ?? '{}')
}

describe('useForwardBindings', () => {
  it('缺省可选 Boolean（幻影 false）不转发，由内部组件默认兜底', () => {
    const fwd = readForward(mount(Host))
    expect(fwd.open).toBeUndefined()
  })

  it('业务显式传入的 props 转发（含显式 false）', () => {
    const fwd = readForward(mount(Host, { props: { open: false, action: '/api/upload' } }))
    expect(fwd.open).toBe(false)
    expect(fwd.action).toBe('/api/upload')
  })

  it('公司默认值（withDefaults 的 key）始终转发', () => {
    const fwd = readForward(mount(Host))
    expect(fwd.showUploadList).toBe(true)
  })

  it('业务显式传入会覆盖公司默认值', () => {
    const fwd = readForward(mount(Host, { props: { showUploadList: false } }))
    expect(fwd.showUploadList).toBe(false)
  })

  it('支持 computed 源（Popconfirm antProps）：幻影 false 跳过、合成 key 转发', () => {
    // 无 danger：open 幻影 false 跳过；okButtonProps 为 undefined（JSON 丢弃，key 不存在）
    const fwd = readForward(mount(ComputedHost))
    expect(fwd.open).toBeUndefined()

    // danger=true：okButtonProps 由中间变换合成，companyDefaults 保证转发
    const fwdDanger = readForward(mount(ComputedHost, { props: { danger: true } }))
    expect(fwdDanger.open).toBeUndefined()
    expect(fwdDanger.okButtonProps).toEqual({ danger: true })
  })

  it('excludedKeys：模板显式绑定的监听器从透传中剔除（避免数组监听器）', () => {
    // 监听器在 $attrs 中会被 {...$attrs} 透传；excludedKeys 剔除后 ant 不应再收到
    const wrapper = mount(ExcludeHost, { attrs: { 'onUpdate:fileList': () => {} } })
    expect(wrapper.find('div').attributes('data-fwd')).toBe('undefined')
  })

  it('同名 style 键（$attrs 与显式 props）合并：mergeProps 合并对象，两值都保留', () => {
    // 场景：组件 props 未声明 style（走 $attrs 透传），但中间变换/默认 source 也合成 style。
    // Vue mergeProps 对 style 是「合并对象」而非覆盖，两处样式都应保留。
    const StyleMergeHost = defineComponent({
      name: 'StyleMergeHost',
      inheritAttrs: false,
      setup() {
        const forward = useForwardBindings(
          { style: { color: 'red' } },
          ['style'],
        )
        return () => h('div', { 'data-fwd': JSON.stringify(forward.value) })
      },
    })
    const fwd = readForward(mount(StyleMergeHost, { attrs: { style: { width: '10px' } } }))
    expect(fwd.style).toEqual({ color: 'red', width: '10px' })
  })

  it('同名 class 键：$attrs 与显式 source 的 class 经 mergeProps 拼接（不覆盖丢弃）', () => {
    // Vue mergeProps 对 class 是「拼接字符串」；$attrs.class 与 source.class 都保留
    const ClassMergeHost = defineComponent({
      name: 'ClassMergeHost',
      inheritAttrs: false,
      setup() {
        const forward = useForwardBindings({ class: 'tm-base' }, ['class'])
        return () => h('div', { 'data-fwd': JSON.stringify(forward.value) })
      },
    })
    const fwd = readForward(mount(ClassMergeHost, { attrs: { class: 'outer-class' } }))
    // mergeProps 拼接顺序：$attrs 值在前、source 值在后
    expect(fwd.class).toBe('outer-class tm-base')
  })

  it('同名事件监听器：$attrs 与显式 props 的 onXxx 经 mergeProps 数组化（两者都被调用）', () => {
    // props 未声明 onClick（走 $attrs），companyDefaults 让显式 onClick 也转发 → 合并为数组
    const EventMergeHost = defineComponent({
      name: 'EventMergeHost',
      inheritAttrs: false,
      props: {},
      setup(_props) {
        const source = { onClick: () => 'from-props' }
        const forward = useForwardBindings(source, ['onClick'])
        return () => h('div', { 'data-fwd': String(typeof forward.value.onClick) })
      },
    })
    const wrapper = mount(EventMergeHost, { attrs: { onClick: () => {} } })
    // mergeProps 数组化后 typeof 为 object（Array）
    expect(wrapper.find('div').attributes('data-fwd')).toBe('object')
  })
})
