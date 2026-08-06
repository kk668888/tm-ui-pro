// packages/ui/src/components/select/__tests__/useApiLoader.spec.ts
// useApiLoader composable 单测：覆盖 api 挂载加载的三种行为
// 1. 挂载加载：api 被调用一次、响应经映射填充 options、loading 复位
// 2. 失败复位：api reject → loading false、options 空、不抛出未捕获错误
// 3. 未配置 api：不调用任何请求、options 保持空
//
// 注：composable 依赖 onMounted 生命周期，用宿主组件 mount 触发。
import { describe, it, expect, vi } from 'vitest'
import { defineComponent, type PropType } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { useApiLoader } from '../src/composables/useApiLoader'
import type { TmSelectApi } from '../src/props'

/** 宿主组件：把 composable 状态暴露给测试断言 */
const Host = defineComponent({
  props: {
    api: { type: Function as PropType<TmSelectApi | undefined>, default: undefined },
    fieldNames: { type: Object as PropType<{ label: string; value: string }>, default: undefined },
    resultMap: { type: Function as PropType<(res: unknown) => { label: string; value: string | number }[]>, default: undefined },
  },
  setup(props) {
    const { options, loading } = useApiLoader(() => props.api, {
      fieldNames: props.fieldNames,
      resultMap: props.resultMap,
    })
    return { options, loading }
  },
  template: '<div />',
})

const flush = async () => {
  await flushPromises()
}

describe('useApiLoader', () => {
  it('挂载时调用 api 一次，响应映射后填充 options，loading 复位', async () => {
    const api = vi.fn().mockResolvedValue({ data: [{ label: '苹果', value: 'apple' }] })
    const wrapper = mount(Host, { props: { api } })
    await flush()

    // api 恰好被调用一次，参数为空对象（挂载加载无搜索词）
    expect(api).toHaveBeenCalledTimes(1)
    expect(api).toHaveBeenCalledWith({})
    // options 被映射填充
    expect(wrapper.vm.options).toEqual([{ label: '苹果', value: 'apple' }])
    // loading 复位为 false
    expect(wrapper.vm.loading).toBe(false)
  })

  it('fieldNames 透传生效：自定义字段名映射', async () => {
    const api = vi.fn().mockResolvedValue([{ name: '张三', id: 1 }])
    const wrapper = mount(Host, {
      props: { api, fieldNames: { label: 'name', value: 'id' } },
    })
    await flush()
    expect(wrapper.vm.options).toEqual([{ label: '张三', value: 1 }])
  })

  it('resultMap 透传生效：完全自定义映射优先', async () => {
    const api = vi.fn().mockResolvedValue({ biz: [{ n: 'X', v: 'x' }] })
    const resultMap = vi.fn((res: unknown) => {
      const arr = (res as { biz: { n: string; v: string }[] }).biz
      return arr.map((i) => ({ label: i.n, value: i.v }))
    })
    const wrapper = mount(Host, { props: { api, resultMap } })
    await flush()
    expect(resultMap).toHaveBeenCalledWith({ biz: [{ n: 'X', v: 'x' }] })
    expect(wrapper.vm.options).toEqual([{ label: 'X', value: 'x' }])
  })

  it('api 失败：loading 复位、options 保持空、不抛出未捕获错误', async () => {
    const api = vi.fn().mockRejectedValue(new Error('网络错误'))
    const wrapper = mount(Host, { props: { api } })
    await flush()

    expect(api).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.options).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })

  it('未配置 api：不发起请求、options 保持空', async () => {
    const api = vi.fn()
    // 不传 api prop（Host 默认 undefined）→ 挂载时不发起请求
    const wrapper = mount(Host)
    await flush()

    expect(api).not.toHaveBeenCalled()
    expect(wrapper.vm.options).toEqual([])
    expect(wrapper.vm.loading).toBe(false)
  })
})
