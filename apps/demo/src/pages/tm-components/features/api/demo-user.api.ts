// pages/tm-components/features/api/demo-user.api.ts
// tm-components 演示页的 mock 用户接口（架构分层：view → composable → api → request）。
// 演示页也需要遵守「View 不直接调 request」铁律，故请求下沉到 api 层。
import { request } from '@/core/http';

export interface DemoUserRow {
  id: number;
  name: string;
  role?: string;
  status?: string;
}

/** 用户列表分页查询（msw 拦截 /api/users） */
export function getDemoUsers(params: {
  page: number;
  pageSize: number;
  name?: string;
}) {
  return request.get<{ list: DemoUserRow[]; total: number }>('/users', {
    params: { page: params.page, pageSize: params.pageSize, name: params.name },
  });
}
