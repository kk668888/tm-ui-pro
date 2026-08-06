// packages/ui/src/test/setup.ts
// Vitest 全局 setup：所有 spec 运行前执行，补齐 jsdom 缺失的浏览器 API。
//
// 提升 Task 10 / Task 11 各 spec 内的局部 polyfill 到全局（brief Bug 5）：
// - matchMedia：ant Form / vxe 内部的 ResponsiveObserve（响应式断点监听）依赖。
//   缺失则 Form/FormItem 一旦带 label 布局就抛 TypeError。
// - ResizeObserver：vxe 表格虚拟渲染依赖。缺失则 vxe-grid 挂载抛 TypeError。
//
// 设计要点：
// - 守卫式补丁（if (!window.X)）：幂等，可重复执行；不影响业务真实环境（浏览器自带）。
// - 不使用 console.log：测试环境下不输出噪声日志。
// - 该文件本身位于 src/test/，被 vitest.config 的 coverage include 排除（不参与覆盖率统计）。

/**
 * matchMedia stub：返回 matches:false 的最小可用的 MediaQueryList。
 * ant Form 的 ResponsiveObserve 仅依赖 matchMedia(query).matches 判定断点，
 * 不需要真实的媒体查询能力，stub 即可让 Form/FormItem 在 jsdom 下完成挂载与校验链路。
 */
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
      }) as MediaQueryList,
  })
}

/**
 * ResizeObserver stub：vxe 表格虚拟渲染依赖。
 * 仅需提供空实现的 observe/unobserve/disconnect，jsdom 下不渲染真实布局。
 */
if (!(window as { ResizeObserver?: unknown }).ResizeObserver) {
  ;(window as { ResizeObserver?: unknown }).ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
}
