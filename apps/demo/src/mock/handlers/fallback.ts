import { http, HttpResponse } from 'msw';

/**
 * 兜底匹配模式：仅拦截 pathname 以 /api/ 开头（真实接口经 core/http 的 baseURL=/api 拼接）的请求。
 *
 * 必须锚定 /api/ 开头：未锚定的 /\/api\/.+/ 会误伤 Vite 模块请求——例如模块路径
 * /src/pages/.../api/user.api.ts 内含 /api/ 子串，会被 MSW 拦截并返回 404，
 * 导致页面动态 import 报 "Failed to fetch dynamically imported module"。
 * MSW 对 RegExp 按 pathname（cleanUrl）匹配，故用 ^\/api\/ 前缀锚定。
 */
export const API_FALLBACK_PATH = /^\/api\/.+/;

/**
 * 开发态 API mock 兜底。
 *
 * 目的：
 * - 已声明的业务 handler 仍然优先匹配，保持正常 mock 数据流。
 * - 未声明的 `/api/...` 请求不再被 MSW passthrough 到真实网络，避免在没有后端或 Vite proxy 时
 *   抛出 `mockServiceWorker.js: passthrough Failed to fetch` 这类难以定位的错误。
 * - 返回结构化 404，并在控制台打印缺失的 mock 路径，开发者能直接知道该补哪个 handler。
 */
export const fallbackHandlers = [
  http.all(API_FALLBACK_PATH, ({ request }) => {
    const url = new URL(request.url);
    const endpoint = `${request.method} ${url.pathname}${url.search}`;

    console.warn(`[mock] 未匹配的 API 请求: ${endpoint}`);

    return HttpResponse.json(
      {
        code: 404,
        message: `Mock 接口未实现: ${endpoint}`,
        data: null,
      },
      { status: 404 },
    );
  }),
];
