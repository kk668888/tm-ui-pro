// packages/ui/src/components/table/__tests__/Table.spec.ts
// TmTable 集成测试：薄封装 vxe-grid + ant 分页/搜索（v2 table-ant-pagination-search）
// 按既有策略：vxe 在 jsdom 不渲染 body cells（容器尺寸 0），但 findComponent
// + props 断言 + $emit 事件触发完全可用，故聚焦「封装契约」与「真实行为链路」。
//
// 覆盖核心机制：
// 1. 可挂载（静态模式）
// 2. 公司默认值 border/stripe/showOverflow 真实下发到内部 VxeGrid
// 3. pagerConfig 不再下发 VxeGrid，改为驱动 ant Pagination（含默认页大小）
// 4. 静态模式：data 本地切片透传给 VxeGrid，ant Pagination total = data 长度
// 5. columns 透传且经归一化（补 align=left, showOverflow=true）
// 6. 扩展属性剥离：request / search / density / pagerConfig 不下发到 VxeGrid
// 7. 远程模式：mount 拉首页 + 数据透传 VxeGrid.data + total 写入 ant Pagination
// 8. 远程模式：ant Pagination change 事件 → request 再次调用（翻页链路）
// 9. search 表单：渲染 / 查询触发 request(query) / 重置清空并重拉
// 10. density → row-config.height 注入（业务显式 row-config 优先）
// 11. 方法透传：commit() 经 useForwardRef 真实转发到内部 VxeGrid.commit
// 12. $attrs / slots 全透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, nextTick } from 'vue'
import TmTable from '../src/Table.vue'

/**
 * 注：window.matchMedia / window.ResizeObserver 已由全局 setupFiles（src/test/setup.ts）stub。
 */

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
    // ant 分页器渲染
    expect(wrapper.findComponent({ name: 'APagination' }).exists()).toBe(true)
  })

  it('公司默认 border/stripe/showOverflow 真实下发到内部 VxeGrid', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect(inner.props('border')).toBe(true)
    expect(inner.props('stripe')).toBe(true)
    expect(inner.props('showOverflow')).toBe(true)
  })

  it('fit 默认 true 下发 VxeGrid（列宽铺满容器），业务 fit: false 可覆盖', () => {
    // 默认：vxe 的 fit prop 默认值在运行时被解析为 false（不铺满），
    // TmTable 通过 withDefaults 显式下发 true，保证未设 width 的列撑满容器
    const wrapper = mount(TmTable, { props: { data: [] } })
    expect(wrapper.findComponent({ name: 'VxeGrid' }).props('fit')).toBe(true)
    // 业务显式 fit: false：按列内容宽度渲染，覆盖公司默认
    const override = mount(TmTable, { props: { data: [], fit: false } })
    expect(override.findComponent({ name: 'VxeGrid' }).props('fit')).toBe(false)
  })

  it('pagerConfig 不下发 VxeGrid（改驱动 ant Pagination，默认页大小 10）', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect((inner.props() as { pagerConfig?: unknown }).pagerConfig).toBeUndefined()
    const pager = wrapper.findComponent({ name: 'APagination' })
    expect(pager.props('pageSize')).toBe(10)
  })

  it('静态模式：业务 data 本地切片透传到内部 VxeGrid', () => {
    const data = [{ id: 1, name: 'Tom' }]
    const wrapper = mount(TmTable, { props: { data } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const innerData = inner.props('data') as Array<{ id: number; name: string }>
    expect(innerData).toHaveLength(1)
    expect(innerData[0].id).toBe(1)
    expect(innerData[0].name).toBe('Tom')
  })

  it('静态模式：a-pagination total 等于 data 长度，data 按页切片', () => {
    const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const wrapper = mount(TmTable, { props: { data } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    // 仅当前页 10 条切片渲染
    expect(inner.props('data')).toHaveLength(10)
    const pager = wrapper.findComponent({ name: 'APagination' })
    expect(pager.props('total')).toBe(25)
  })

  it('columns 经归一化（补 align=left, showOverflow=true）下发到 VxeGrid', () => {
    const wrapper = mount(TmTable, {
      props: { data: [], columns: [{ field: 'a', title: 'A' }] },
    })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const cols = inner.props('columns') as Array<{ field: string; align: string; showOverflow: boolean }>
    expect(cols[0]).toMatchObject({ field: 'a', align: 'left', showOverflow: true })
  })

  it('扩展属性剥离：request / search / density / pagerConfig 均不下发到内部 VxeGrid', () => {
    const wrapper = mount(TmTable, {
      props: {
        data: [],
        request: vi.fn().mockResolvedValue({ data: [], total: 0 }),
        search: { fields: [{ field: 'name', label: '姓名' }] },
        density: 'compact',
      },
    })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const innerProps = inner.props() as Record<string, unknown>
    expect(innerProps.request).toBeUndefined()
    expect(innerProps.search).toBeUndefined()
    expect(innerProps.density).toBeUndefined()
    expect(innerProps.pagerConfig).toBeUndefined()
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

  it('远程模式：拉取数据透传给 VxeGrid.data + total 写入 a-pagination（而非 vxe pagerConfig）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: 9, name: 'X' }], total: 88 })
    const wrapper = mount(TmTable, { props: { request } })
    await flush()
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const innerData = inner.props('data') as Array<{ id: number }>
    expect(innerData).toHaveLength(1)
    expect(innerData[0].id).toBe(9)
    expect((inner.props() as { pagerConfig?: unknown }).pagerConfig).toBeUndefined()
    const pager = wrapper.findComponent({ name: 'APagination' })
    expect(pager.props('total')).toBe(88)
  })

  it('远程模式：a-pagination change 事件 → request 再次调用（翻页链路）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 })
    const wrapper = mount(TmTable, { props: { request } })
    await flush()
    // 首页已拉
    expect(request).toHaveBeenCalledTimes(1)
    // 模拟翻页：ant Pagination emit change(page, pageSize)
    const pager = wrapper.findComponent({ name: 'APagination' })
    ;(pager.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'change',
      2,
      10,
    )
    await flush()
    expect(request).toHaveBeenCalledTimes(2)
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ currentPage: 2, pageSize: 10 }),
    )
  })

  it('search 表单：配置后渲染搜索区，查询触发 request(query)', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const wrapper = mount(TmTable, {
      props: { request, search: { fields: [{ field: 'name', label: '姓名' }] } },
    })
    await flush()
    // 搜索区渲染
    expect(wrapper.find('.tm-table__search').exists()).toBe(true)
    // 输入姓名
    await wrapper.find('input').setValue('tom')
    // 触发查询：ant Form finish 事件
    const form = wrapper.findComponent({ name: 'AForm' })
    ;(form.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('finish')
    await flush()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: { name: 'tom' } }),
    )
  })

  it('search 表单：未配置时不渲染搜索区', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    expect(wrapper.find('.tm-table__search').exists()).toBe(false)
  })

  it('search 表单：重置清空字段并重拉（不带查询条件）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const wrapper = mount(TmTable, {
      props: { request, search: { fields: [{ field: 'name', label: '姓名' }] } },
    })
    await flush()
    // 先查询一次
    await wrapper.find('input').setValue('tom')
    const form = wrapper.findComponent({ name: 'AForm' })
    ;(form.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('finish')
    await flush()
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ query: { name: 'tom' } }))
    // 点击重置按钮（ant Button 对两字中文会插入空格如「重 置」，匹配时去除空白）
    const resetBtn = wrapper
      .findAll('button')
      .find((b) => b.text().replace(/\s/g, '') === '重置')
    expect(resetBtn).toBeTruthy()
    await resetBtn!.trigger('click')
    await flush()
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ query: undefined }),
    )
  })

  it('density → row-config.height 注入 VxeGrid（未配置时不下发）', () => {
    const wrapper = mount(TmTable, { props: { data: [], density: 'compact' } })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect(inner.props('rowConfig')).toMatchObject({ height: 36 })
    // 未配置 density：不注入 height（vxe 用自身默认）
    const plain = mount(TmTable, { props: { data: [] } })
    expect(plain.findComponent({ name: 'VxeGrid' }).props('rowConfig')).toBeUndefined()
  })

  it('业务显式 row-config.height 优先于 density', () => {
    const wrapper = mount(TmTable, {
      props: { data: [], density: 'compact', rowConfig: { height: 100 } },
    })
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    expect(inner.props('rowConfig')).toMatchObject({ height: 100 })
  })

  it('方法透传：commit() 经 useForwardRef 真实转发到内部 VxeGrid.commit', () => {
    const commitSpy = vi.fn()
    const VxeGridStub = defineComponent({
      name: 'VxeGrid',
      setup(_, { expose }) {
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
