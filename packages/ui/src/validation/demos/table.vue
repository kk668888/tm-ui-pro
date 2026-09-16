<!-- packages/ui/src/validation/demos/table.vue -->
<!-- TmTable × toVxeRule 演示：列级规则 + fullValidate(true) 提交前批量校验 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmButton } from '../../components/button'
import { TmTable, type TmTableProps } from '../../components/table'
import { toVxeRule } from '../adapters/vxe'

const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 60 },
  {
    field: 'ip',
    title: '服务器 IP',
    editRender: { name: 'VxeInput' },
    // 规则本体挂列级 rules；同时 editRules 必须含该字段键（见页面「必读」说明）
    rules: toVxeRule({ type: 'ipv4', required: true }),
  },
  {
    field: 'port',
    title: '端口',
    editRender: { name: 'VxeInput' },
    rules: toVxeRule({ type: 'port', message: '端口需为 0-65535' }),
  },
]

// ⚠ vxe 门禁：网格级 editRules 必须含参与校验的字段键（空数组即可），列级 rules 才会被读取
const editRules = { ip: [], port: [] }

const rows = ref([
  { id: 1, ip: '192.168.1.10', port: '8080' },
  { id: 2, ip: '999.1.1.1', port: 'abc' },
])
const tableRef = ref()
const result = ref('')

// 提交前批量校验：通过 resolve undefined，失败 resolve 以字段名为 key 的 errMap
const onSubmit = async (): Promise<void> => {
  const errMap = await tableRef.value?.fullValidate(true)
  if (errMap) {
    result.value = `校验未通过，问题字段：${Object.keys(errMap).join('、')}`
    return
  }
  result.value = '全部校验通过 ✓'
}
</script>

<template>
  <div>
    <TmTable
      ref="tableRef"
      :data="rows"
      :columns="columns"
      :edit-config="{ trigger: 'click', mode: 'row' }"
      :edit-rules="editRules"
    />
    <div style="margin-top: 12px">
      <TmButton type="primary" @click="onSubmit">提交前批量校验</TmButton>
      <span
        v-if="result"
        :style="{ marginLeft: '12px', color: result.includes('✓') ? '#52c41a' : '#ff4d4f' }"
      >
        {{ result }}
      </span>
    </div>
  </div>
</template>
