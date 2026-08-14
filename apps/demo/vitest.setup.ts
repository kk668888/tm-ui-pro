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

// canvas 2D context stub：BaseChart（vue-echarts）等组件在 jsdom 下调用 getContext，
// jsdom 24 的原生实现存在但抛 "Not implemented"（需安装 canvas npm 包），污染测试 stderr。
// 测试环境必然运行在 jsdom（无真实 canvas 包），无条件覆盖为最小可用的 2D context。
HTMLCanvasElement.prototype.getContext = function getContextStub(
  this: HTMLCanvasElement,
  _contextId: string,
): CanvasRenderingContext2D | null {
  // 仅 stub 2d 上下文；其他类型（webgl 等）保持 null，避免掩盖真实依赖
  if (_contextId !== '2d') return null;
  return {
    canvas: this,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    measureText: (text: string) => ({ width: text.length * 8, actualBoundingBoxLeft: 0, actualBoundingBoxRight: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0, fontBoundingBoxAscent: 0, fontBoundingBoxDescent: 0, alphabeticBaseline: 0, ideographicBaseline: 0, emHeightAscent: 0, emHeightDescent: 0, hangingBaseline: 0 }),
    save: () => {},
    restore: () => {},
    scale: () => {},
    rotate: () => {},
    translate: () => {},
    transform: () => {},
    setTransform: () => {},
    resetTransform: () => {},
    clearRect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    bezierCurveTo: () => {},
    quadraticCurveTo: () => {},
    arc: () => {},
    arcTo: () => {},
    ellipse: () => {},
    rect: () => {},
    clip: () => {},
    fill: () => {},
    stroke: () => {},
    drawImage: () => {},
    createImageData: () => ({ width: 0, height: 0, data: new Uint8ClampedArray(0) }),
    getImageData: () => ({ width: 0, height: 0, data: new Uint8ClampedArray(0) }),
    putImageData: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createPattern: () => null,
    setLineDash: () => {},
    getLineDash: () => [],
    setLineCap: () => {},
    setLineJoin: () => {},
    setMiterLimit: () => {},
    setShadowBlur: () => {},
    setShadowColor: () => {},
    setShadowOffsetX: () => {},
    setShadowOffsetY: () => {},
    setGlobalAlpha: () => {},
    setGlobalCompositeOperation: () => {},
    setImageSmoothingEnabled: () => {},
    isPointInPath: () => false,
    isPointInStroke: () => false,
    fillText: () => {},
    strokeText: () => {},
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }),
  } as unknown as CanvasRenderingContext2D;
};
