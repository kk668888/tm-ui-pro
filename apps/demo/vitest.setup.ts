// apps/demo/vitest.setup.ts
// 与 packages/ui/src/test/setup.ts 一致：补齐 jsdom 缺失的 matchMedia / ResizeObserver。
// matchMedia 是 ant Form / vxe ResponsiveObserve 依赖；ResizeObserver 是 vxe 虚拟渲染依赖。
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
  });
}

if (!(window as { ResizeObserver?: unknown }).ResizeObserver) {
  (window as { ResizeObserver?: unknown }).ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
