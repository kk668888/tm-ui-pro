// packages/ui/src/components/table/__tests__/Table.spec.ts
// TmTable 集成测试：薄封装 + request 远程扩展
// 按 brief Bug 7 策略：vxe 在 jsdom 不渲染 body cells（容器尺寸 0），但 findComponent
// + props 断言 + $emit 事件触发完全可用，故聚焦「封装契约」与「真实行为链路」。
//
// 覆盖核心机制：
// 1. 可挂载（静态模式）
// 2. 公司默认值 border/stripe/showOverflow 真实下发到内部 VxeGrid
// 3. 公司默认 pagerConfig（pageSize=10, pageSizes=[10,20,50]）下发
// 4. 静态模式：data 透传给 VxeGrid
// 5. columns 透传且经归一化（补 align=left, showOverflow=true）
// 6. 扩展属性剥离：request 不下发到 VxeGrid
// 7. 远程模式（Bug 3）：mount 拉首页 + 拉取数据透传给 VxeGrid.data + total 透传到 pagerConfig.total
// 8. 远程模式（Bug 4）：内部 VxeGrid emit page-change → onPageChange → request 再调
// 9. 方法透传：commit() 经 useForwardRef 真实转发到内部 VxeGrid.commit
// 10. $attrs / slots 全透传
import { beforeAll, describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import TmTable from '../src/Table.vue'

/**
 * jsdom 环境补丁：
 * - matchMedia：vxe 内部 ResponsiveObserve（与 ant Form 同款）依赖
 * - ResizeObserver：vxe 表格虚拟渲染依赖（jsdom 未实现）
 * 缺失则 vxe 挂载抛 TypeError。
 */
beforeAll(() => {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string): MediaQueryList =>
        ({
          matches: false,
          media: query,
          onchange: null,
          addListener: () => {},
          removeListener: () => {},
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => false,
        }) as unknown as MediaQueryList,
    })
  }
  if (!(window as { ResizeObserver?: unknown }).ResizeObserver) {
    ;(window as { ResizeObserver?: unknown }).ResizeObserver = class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  }
})

/**
 * 等待微任务 + Vue 重新渲染。
 * 远程 request 在 onMounted 中 void 调用，需 flush 让 Promise 解析后再断言最终状态。
 */
const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

describe('TmTable', () => {
  it('可挂载（静态模式）', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'VxeGrid' }).exists()).toBe(true)
  })

  it('公司默认 border/stripe/showOverflow 真实下发到内部 VxeGrid', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect(inner.props('border')).toBe(true)
    expect(inner.props('stripe')).toBe(true)
    expect(inner.props('showOverflow')).toBe(true)
  })

  it('公司默认 pagerConfig（pageSize=10, pageSizes=[10,20,50]）真实下发', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect(inner.props('pagerConfig')).toMatchObject({
      pageSize: 10,
      pageSizes: [10, 20, 50],
    })
  })

  it('静态模式：业务 data 透传到内部 VxeGrid', () => {
    const data = [{ id: 1, name: 'Tom' }]
    const wrapper = mount(TmTable, { props: { data } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    // vxe 会给每行注入 _X_ROW_KEY（vxe 内部行为），按字段值断言而非全等
    const innerData = inner.props('data') as Array<{ id: number; name: string }>
    expect(innerData).toHaveLength(1)
    expect(innerData[0].id).toBe(1)
    expect(innerData[0].name).toBe('Tom')
  })

  it('columns 经归一化（补 align=left, showOverflow=true）下发到 VxeGrid', () => {
    const wrapper = mount(TmTable, {
      props: { data: [], columns: [{ field: 'a', title: 'A' }] },
    })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const cols = inner.props('columns') as Array<{ field: string; align: string; showOverflow: boolean }>
    expect(cols[0]).toMatchObject({ field: 'a', align: 'left', showOverflow: true })
  })

  it('扩展属性剥离：request 不下发到内部 VxeGrid', () => {
    const wrapper = mount(TmTable, {
      props: { data: [], request: vi.fn().mockResolvedValue({ data: [], total: 0 }) },
    })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect((inner.props() as { request?: unknown }).request).toBeUndefined()
  })

  it('远程模式：mount 触发 onMounted → request 用首页参数调用', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: 1 }], total: 1 })
    mount(TmTable, { props: { request } })
    await flush()
    expect(request).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: undefined,
    })
  })

  it('远程模式（Bug 3 修复）：拉取数据透传给 VxeGrid.data + total 写入 pagerConfig.total', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: 9, name: 'X' }], total: 88 })
    const wrapper = mount(TmTable, { props: { request } })
    await flush()
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    // data 透传（Bug 3：plan 漏写会导致空表）
    const innerData = inner.props('data') as Array<{ id: number }>
    expect(innerData).toHaveLength(1)
    expect(innerData[0].id).toBe(9)
    // total 透传到 pagerConfig.total（vxe 标准）
    expect(inner.props('pagerConfig')).toMatchObject({ total: 88 })
  })

  it('远程模式（Bug 4 修复）：内部 VxeGrid emit page-change → request 再次调用（翻页链路）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const wrapper = mount(TmTable, { props: { request } })
    await flush()
    // 首页已拉
    expect(request).toHaveBeenCalledTimes(1)
    // 模拟翻页：vxe-grid emit page-change（事件参数结构 { type, currentPage, pageSize, $event }）
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'page-change',
      { type: 'current', currentPage: 2, pageSize: 10, $event: new Event('click') },
    )
    await flush()
    // 翻页触发 refetch + 携带新页码
    expect(request).toHaveBeenCalledTimes(2)
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ currentPage: 2, pageSize: 10 }),
    )
  })

  it('方法透传：commit() 经 useForwardRef 真实转发到内部 VxeGrid.commit', () => {
    // vxe-grid 在 jsdom 未 expose 实例方法（Pager/Tooltip 等子组件未注册），
    // 故用 stub 替换 VxeGrid 来精确验证「useForwardRef 方法透传链路」——
    // 与 Select 的 activeElement 测试同款「真实行为断言」思路，仅替换 inner 组件。
    const commitSpy = vi.fn()
    const VxeGridStub = defineComponent({
      name: 'VxeGrid',
      setup(_, { expose }) {
        // 模拟 vxe-grid expose commit 等实例方法（vxe 4.20 真实行为：defineExpose 方法表）
        expose({ commit: commitSpy })
        return () => h('div', { class: 'vxe-grid-stub' })
      },
    })
    const wrapper = mount(TmTable, {
      props: { data: [] },
      global: { stubs: { VxeGrid: VxeGridStub } },
    })
    ;(wrapper.vm as unknown as { commit: () => void }).commit()
    expect(commitSpy).toHaveBeenCalledTimes(1)
  })

  it('$attrs 透传（data-testid 下发到内部 VxeGrid 渲染根）', () => {
    const wrapper = mount(TmTable, {
      props: { data: [] },
      attrs: { 'data-testid': 'my-table' },
    })
    expect(wrapper.find('[data-testid="my-table"]').exists()).toBe(true)
  })

  it('slots 透传：empty 插槽内容渲染到 vxe 表格空数据区域', () => {
    const wrapper = mount(TmTable, {
      props: { data: [] },
      slots: { empty: () => h('div', { class: 'my-empty' }, 'EMPTY') },
    })
    expect(wrapper.find('.my-empty').exists()).toBe(true)
  })
})
