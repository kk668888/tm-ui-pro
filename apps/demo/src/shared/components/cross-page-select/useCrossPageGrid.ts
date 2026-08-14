import { h, computed, watch, nextTick, onBeforeUnmount, type Ref } from 'vue';
import CrossPageCheckboxHeader from './CrossPageCheckboxHeader.vue';
import { useCrossPageSelect } from './useCrossPageSelect';
import type { UseCrossPageSelectOptions } from './types';

export interface VxeGridCheckboxController<T> {
  clearCheckboxRow(): void;
  setCheckboxRow(rows: T[], checked: boolean): void;
}

export interface VxeCheckboxEventParams<T> {
  row?: T;
  records?: T[];
  checked?: boolean;
  $event?: Event;
}

export interface UseCrossPageGridOptions<T = unknown> extends UseCrossPageSelectOptions<T> {
  // 这里只依赖 checkbox 同步需要的最小 grid 能力，避免绑定 vxe-table 内部类型路径。
  gridRef: Ref<VxeGridCheckboxController<T> | undefined>;
}

export function useCrossPageGrid<T = unknown>(options: UseCrossPageGridOptions<T>) {
  const { gridRef, ...selectOptions } = options;
  const composable = useCrossPageSelect<T>(selectOptions);

  let isSyncing = false;
  let syncTimer: ReturnType<typeof setTimeout> | undefined;

  function syncGridCheckbox() {
    const grid = gridRef.value;
    if (!grid) return;
    isSyncing = true;
    try {
      grid.clearCheckboxRow();
      const rows = selectOptions.data.value.filter(
        (row) => !selectOptions.isDisabled?.(row) && composable.isRowSelected(row),
      );
      if (rows.length > 0) {
        grid.setCheckboxRow(rows, true);
      }
    } finally {
      isSyncing = false;
    }
  }

  /**
   * 勾选视觉同步（审查 P1 #10 优化）：
   * - 选中态变化（最常见操作）：nextTick 后同步一次即可，避免每次勾选都做两次全量同步；
   * - 数据变化（翻页/查询，needsMacroTask=true）：vxe proxyConfig 在 ajax.query 返回后
   *   才把数据写回表格内部状态，可能晚于 currentData watcher，故额外延后一轮宏任务
   *   再同步一次，确保表格完成分页数据替换后恢复勾选视觉。
   */
  function scheduleGridCheckboxSync(needsMacroTask: boolean) {
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = undefined;
    }

    void nextTick(() => {
      syncGridCheckbox();
      if (needsMacroTask) {
        syncTimer = setTimeout(() => {
          syncTimer = undefined;
          syncGridCheckbox();
        }, 0);
      }
    });
  }

  watch(
    [composable.selectionState, selectOptions.data],
    ([sel, data], [oldSel, oldData]) => {
      // 仅数据引用变化（翻页/查询）需要双同步；选中态变化单次同步即可
      const dataChanged = data !== oldData;
      void sel;
      void oldSel;
      scheduleGridCheckboxSync(dataChanged);
    },
    { flush: 'post' },
  );

  // 卸载时清理未触发的宏任务定时器，避免组件销毁后回调执行
  onBeforeUnmount(() => {
    if (syncTimer) {
      clearTimeout(syncTimer);
      syncTimer = undefined;
    }
  });

  function handleCheckboxChange(params: VxeCheckboxEventParams<T>) {
    if (isSyncing) return;
    // vxe 事件参数字段可选（row/checked 可能 undefined），收窄后转发给状态层
    if (params.row !== undefined && params.checked !== undefined) {
      composable.onCheckboxChange({ row: params.row, checked: params.checked });
    }
  }

  function handleCheckboxAll(params: VxeCheckboxEventParams<T>) {
    if (isSyncing) return;
    if (params.checked !== undefined) {
      composable.onCheckboxAll({ checked: params.checked, records: params.records ?? [] });
    }
  }

  const checkboxColumn = computed(() => ({
    type: 'checkbox' as const,
    width: 60,
    slots: {
      header: () =>
        h(CrossPageCheckboxHeader, {
          selectionState: composable.selectionState.value,
          total: composable.checkableTotal.value,
          currentPageAllSelected: composable.currentPageAllSelected.value,
          currentPageSelectedCount: composable.currentPageSelectedCount.value,
          onSelectAllPages: composable.selectAllPages,
          onClearSelection: composable.clearSelection,
          onToggleCurrentPage: composable.toggleCurrentPage,
        }),
    },
  }));

  return {
    ...composable,
    checkboxColumn,
    handleCheckboxChange,
    handleCheckboxAll,
  };
}
