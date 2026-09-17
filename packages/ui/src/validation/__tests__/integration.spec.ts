// packages/ui/src/validation/__tests__/integration.spec.ts
// 集成冒烟：校验工具在真实组件链路中生效（spec「与 TmForm 的集成」「与 TmTable 单元格编辑的集成」）
//
// - TmForm：toAntRule 产出 → TmFormItem 的 rules → ant Form.validate 端到端校验
//   （jsdom 下 async-validator 真实运行，与 Form.spec.ts 的 validate 透传链路同一机制）
// - TmTable：toVxeRule 产出 → 列 rules → tableRef.fullValidate(true) 批量校验
//   （按 Table.spec.ts 的既有策略：vxe 在 jsdom 不渲染 body 单元格，但 props 下发与
//   useForwardRef 方法转发完全可用；校验引擎读的是行数据，不依赖单元格渲染。
//   validConfig.autoPos=false 关闭「滚动到错误单元格」，规避 jsdom 无 cell 元素的报错）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { TmForm, TmFormItem } from '../../components/form'
import TmTable from '../../components/table/src/Table.vue'
import { toAntRule } from '../adapters/ant'
import { toVxeRule } from '../adapters/vxe'
import { registerValidator } from '../registry'

/** 等待微任务 + Vue 重新渲染（同 Table.spec.ts 的 flush） */
const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

describe('TmForm 集成：toAntRule 产出直接驱动表单校验', () => {
  const mountPhoneForm = (initial: string) => {
    // reactive 让 ant Form 能监听 model 字段变化
    const formState = reactive<{ phone: string }>({ phone: initial })
    const wrapper = mount(TmForm, {
      props: { model: formState },
      slots: {
        default: () =>
          h(
            TmFormItem,
            {
              name: 'phone',
              rules: toAntRule({
                type: 'phone',
                required: true,
                requiredMessage: '手机号必填',
                message: '手机号格式不正确',
              }),
            },
            { default: () => h('input') },
          ),
      },
    })
    return { wrapper, formState }
  }

  const validate = async (wrapper: ReturnType<typeof mountPhoneForm>['wrapper']): Promise<{
    errorFields: Array<{ errors: string[] }>
  }> => {
    return (wrapper.vm as unknown as {
      validate: () => Promise<{ errorFields: Array<{ errors: string[] }> }>
    }).validate()
  }

  it('空值：必填文案拦截（而非格式文案）——D3 空值语义', async () => {
    const { wrapper } = mountPhoneForm('')
    await nextTick()
    await expect(validate(wrapper)).rejects.toMatchObject({
      errorFields: [{ errors: ['手机号必填'] }],
    })
  })

  it('合法手机号：校验通过', async () => {
    const { wrapper } = mountPhoneForm('13800138000')
    await nextTick()
    await expect(validate(wrapper)).resolves.toBeDefined()
  })

  it('格式错误：格式文案拦截', async () => {
    const { wrapper } = mountPhoneForm('123')
    await nextTick()
    await expect(validate(wrapper)).rejects.toMatchObject({
      errorFields: [{ errors: ['手机号格式不正确'] }],
    })
  })
})

describe('TmTable 集成：toVxeRule 产出挂列 rules + fullValidate 批量校验', () => {
  const COLUMNS = [
    { field: 'id', title: 'ID', width: 80 },
    {
      field: 'ip',
      title: 'IP',
      editRender: { name: 'VxeInput' },
      // 业务写法：列级 rules 挂适配器产出（vxe 原生能力，TmTable 零改动）
      rules: toVxeRule({ type: 'ipv4', required: true }),
    },
  ]

  const mountEditableTable = (rows: Array<{ id: number; ip: string }>) =>
    mount(TmTable, {
      props: {
        data: rows,
        columns: COLUMNS,
        editConfig: { trigger: 'click', mode: 'row' },
        // ⚠ vxe 的两道门禁（hook.js 实测）：
        // 1. validCellRules 以 `if (field && editRules)` 为总开关——editRules 必须为真值
        // 2. 行×列遍历时以 `XEUtils.has(editRules, field)` 过滤——网格级 editRules
        //    必须含该字段键（空数组即可），列级 rules 才会被读取（且优先于 editRules 同名字段）
        editRules: { ip: [] },
        // 关闭「滚动到错误单元格」：jsdom 无渲染单元格，规避空引用
        validConfig: { autoPos: false },
      },
    })

  const fullValidate = async (
    wrapper: ReturnType<typeof mountEditableTable>,
  ): Promise<Record<string, Array<unknown>> | undefined> => {
    return (wrapper.vm as unknown as {
      fullValidate: (rows: true) => Promise<Record<string, Array<unknown>> | undefined>
    }).fullValidate(true)
  }

  it('列 rules 真实下发到内部 VxeGrid', () => {
    const wrapper = mountEditableTable([{ id: 1, ip: '192.168.1.1' }])
    const inner = wrapper.findComponent({ name: 'VxeGrid' })
    const columns = inner.props('columns') as Array<{ field: string; rules?: unknown }>
    const ipColumn = columns.find((c) => c.field === 'ip')
    // 经 useColumns 归一化后 rules 保留（spread 业务字段在后）
    expect(Array.isArray(ipColumn?.rules)).toBe(true)
  })

  it('批量校验：非法 IP 返回错误信息（标识到字段）', async () => {
    const wrapper = mountEditableTable([{ id: 1, ip: '999.1.1.1' }])
    await flush()
    const errMap = await fullValidate(wrapper)
    expect(errMap).toBeDefined()
    expect(Object.keys(errMap ?? {})).toContain('ip')
  })

  it('批量校验：合法 IP 无错误（resolve undefined）', async () => {
    const wrapper = mountEditableTable([{ id: 1, ip: '192.168.1.1' }])
    await flush()
    await expect(fullValidate(wrapper)).resolves.toBeUndefined()
  })
})

describe('异步判据端到端：框架侧真实等待 Promise', () => {
  /** 模拟一次带延迟的远程唯一性查询（真实计时器，让框架的 await 链路完整跑一遍） */
  const requestUnique = (taken: string[]): ((value: unknown) => Promise<boolean>) => {
    return (value) =>
      new Promise((resolve) => {
        setTimeout(() => resolve(!taken.includes(String(value))), 10)
      })
  }

  it('TmForm：异步判据在 validate() 中被等待，不通过时给配置文案', async () => {
    registerValidator('e2e-form-unique', requestUnique(['DEV-0001']))
    const formState = reactive<{ deviceNo: string }>({ deviceNo: 'DEV-0001' })
    const wrapper = mount(TmForm, {
      props: { model: formState },
      slots: {
        default: () =>
          h(
            TmFormItem,
            {
              name: 'deviceNo',
              rules: toAntRule({
                type: 'e2e-form-unique',
                required: true,
                requiredMessage: '请输入设备编号',
                message: '该编号已被占用',
              }),
            },
            { default: () => h('input') },
          ),
      },
    })
    await nextTick()
    const validate = (): Promise<{ errorFields: Array<{ errors: string[] }> }> =>
      (wrapper.vm as unknown as {
        validate: () => Promise<{ errorFields: Array<{ errors: string[] }> }>
      }).validate()

    // validate() 内部 await 了异步判据，因此这里拿到的已是最终结论
    await expect(validate()).rejects.toMatchObject({
      errorFields: [{ errors: ['该编号已被占用'] }],
    })

    formState.deviceNo = 'DEV-9999'
    await nextTick()
    await expect(validate()).resolves.toBeDefined()
  })

  it('TmTable：异步判据在 fullValidate(true) 中被等待并标识未通过字段', async () => {
    registerValidator('e2e-table-unique', requestUnique(['10.0.0.1']))
    const columns = [
      { field: 'id', title: 'ID', width: 80 },
      {
        field: 'ip',
        title: 'IP',
        editRender: { name: 'VxeInput' },
        rules: toVxeRule({ type: 'e2e-table-unique', message: '该 IP 已被占用' }),
      },
    ]
    const wrapper = mount(TmTable, {
      props: {
        data: [{ id: 1, ip: '10.0.0.1' }],
        columns,
        editConfig: { trigger: 'click', mode: 'row' },
        editRules: { ip: [] },
        validConfig: { autoPos: false },
      },
    })
    await flush()
    const errMap = await (wrapper.vm as unknown as {
      fullValidate: (rows: true) => Promise<Record<string, Array<unknown>> | undefined>
    }).fullValidate(true)

    expect(errMap).toBeDefined()
    expect(Object.keys(errMap ?? {})).toContain('ip')
  })
})
