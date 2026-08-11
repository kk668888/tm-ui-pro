<script setup lang="ts">
import { ref } from 'vue';
import { TmTable, TmTag, TmEmpty, TmBadge, TmMessage } from '@tm/ui';
import type { TmTableProps } from '@tm/ui';

defineOptions({ name: 'DataDisplaySection' });

// 本地静态数据：TmTable 静态模式（:data + :columns）+ 本地切片分页
const rows = ref<TmTableProps['data']>([
  { id: 1, name: 'Tom', age: 28, status: 'success' },
  { id: 2, name: 'Jack', age: 34, status: 'processing' },
  { id: 3, name: 'Lucy', age: 22, status: 'warning' },
  { id: 4, name: 'Lily', age: 31, status: 'failed' },
  { id: 5, name: 'Bob', age: 25, status: 'success' },
  { id: 6, name: 'Amy', age: 29, status: 'processing' },
]);

const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'status', title: '状态', width: 120, slots: { default: 'status_default' } },
];

const pagerConfig = { pageSize: 5, pageSizes: [5, 10] };

function onRowClick(record: Record<string, unknown>) {
  TmMessage.info(`点击了行：${record.name}`);
}
</script>

<template>
  <a-card class="section-data-display" title="③ 数据展示 DataDisplay">
    <p class="mb-4 text-sm text-secondary">
      TmTable（vxe 底座，本地切片分页 + 行点击）；Tag / Empty / Badge 状态展示。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <TmTable :data="rows" :columns="columns" :pager-config="pagerConfig" @row-click="onRowClick">
        <template #status_default="{ row }">
          <TmTag :status="row.status">{{ row.status }}</TmTag>
        </template>
      </TmTable>

      <a-space wrap>
        <TmTag status="success">成功</TmTag>
        <TmTag status="processing">进行中</TmTag>
        <TmTag status="failed">失败</TmTag>
        <TmTag status="warning">警告</TmTag>
        <TmTag color="purple">自定义色</TmTag>
      </a-space>

      <a-space :size="24">
        <TmBadge :count="5"><span>通知</span></TmBadge>
        <TmBadge :count="150" :overflow-count="99"><span>邮件</span></TmBadge>
        <TmBadge status="processing"><span>运行中</span></TmBadge>
      </a-space>

      <TmEmpty description="列表为空，请先创建" />
    </a-space>
  </a-card>
</template>
