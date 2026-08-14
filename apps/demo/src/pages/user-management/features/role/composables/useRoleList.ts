import { ref, reactive } from 'vue';
import message from 'ant-design-vue/es/message';
import { getRoleList, deleteRole } from '../api/role.api';
import { COPY } from '@/shared/constants/copy';

/**
 * vxe proxy query 入参的结构兼容签名。
 * vxe 传入的 ProxyAjaxQueryParams 含 $table/$grid/sorts 等完整字段（未导出，跨包不可命名），
 * 这里声明业务消费的子集；sorts[].order 用 string 放宽（vxe 实际是 string），
 * 逆变检查下调用方类型可赋给本签名。字段多传无碍（结构类型）。
 */
interface ProxyQueryParams {
  page: { currentPage: number; pageSize: number; total?: number };
  sorts?: Array<{ field: string; order: string }>;
}

interface QueryableGrid {
  commitProxy(target: 'query'): Promise<unknown> | void;
}

export function useRoleList() {
  // 业务层只需触发表格重新查询，不依赖 VXE 内部实例完整类型（与 useUserList 一致）。
  const gridRef = ref<QueryableGrid | null>(null);

  // gridOptions 保持类型推断（与 useUserList 一致）：vxe-grid v-bind 时按结构匹配，
  // 显式标注 VxeGridProps 反而会让 proxyConfig.ajax.query 的 page 参数类型（含 total）
  // 与业务签名冲突。
  const gridOptions = reactive({
    columns: [
      { field: 'name', title: '名称', sortable: true },
      {
        field: 'status',
        title: '状态',
        slots: { default: 'status_default' },
      },
      { field: 'createdAt', title: '创建时间', sortable: true },
      {
        title: '操作',
        width: 200,
        slots: { default: 'actions_default' },
      },
    ],
    // 当前页面未使用 VXE 内置查询表单和工具栏；显式关闭可覆盖 vxe-table 4.20.x 的默认启用项，
    // 避免 grid 在按需渲染时查找空 renderer 并抛出 "Renderer 'undefined' is not imported"。
    formConfig: { enabled: false },
    toolbarConfig: { enabled: false },
    pagerConfig: { pageSize: 10 },
    // 远程排序：列表数据来自 proxyConfig 的 ajax，排序交给后端，
    // 点击表头时 vxe 自动触发 query 并在参数中带上 sorts。
    sortConfig: { remote: true },
    proxyConfig: {
      // vxe-table 4.20.x 已将 proxyConfig.props 重命名为 proxyConfig.response，
      // 沿用 props 会触发 delProp 废弃警告，且新版无法据此解析列表与总数字段。
      response: {
        result: 'list',
        total: 'total',
      },
      ajax: {
        query: async (params: ProxyQueryParams) => {
          const { page, sorts } = params;
          // 取首个带方向的排序列（模板按单列排序），转成后端约定的 sortBy/sortOrder 透传。
          // vxe sorts 元素类型含复杂元信息，此处显式收窄业务关心的字段。
          const activeSort = sorts?.find((s) => s.order === 'asc' || s.order === 'desc');
          // 封装后直接返回 ApiResponse<RoleListResult>，res.data 即列表数据
          const res = await getRoleList({
            page: page.currentPage,
            pageSize: page.pageSize,
            ...(activeSort
              ? {
                  sortBy: String(activeSort.field),
                  sortOrder: activeSort.order as 'asc' | 'desc',
                }
              : {}),
          });
          return res.data;
        },
      },
    },
  });

  function handleSearch() {
    gridRef.value?.commitProxy('query');
  }

  async function handleDelete(id: string) {
    try {
      await deleteRole(id);
      message.success(COPY.COMMON.SUCCESS);
      // 删除成功后刷新列表，与 useUserList 行为一致，避免「删除看似无效」。
      handleSearch();
    } catch {
      message.error(COPY.COMMON.FAILED);
    }
  }

  return { gridRef, gridOptions, handleSearch, handleDelete };
}
