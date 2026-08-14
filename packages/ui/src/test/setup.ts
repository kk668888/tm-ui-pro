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

/**
 * canvas 2D context stub：QRCode / Watermark 等组件在 jsdom 下调用 getContext，
 * jsdom 24 的原生实现存在但抛 "Not implemented"（需安装 canvas npm 包），污染测试 stderr。
 * 测试环境必然运行在 jsdom（无真实 canvas 包），无条件覆盖为最小可用的 2D context。
 */
HTMLCanvasElement.prototype.getContext = (function getContextStub(
  this: HTMLCanvasElement,
  _contextId: string,
): CanvasRenderingContext2D | null {
  // 仅 stub 2d 上下文；其他类型（webgl 等）保持 null，避免掩盖真实依赖
  if (_contextId !== '2d') return null
  return {
    canvas: this,
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'start',
    textBaseline: 'alphabetic',
    measureText: (text: string) => ({ width: text.length * 8 }),
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
  } as unknown as CanvasRenderingContext2D
// 断言为原生签名类型：覆盖 jsdom 的 getContext 多重重载（2d/webgl/bitmaprenderer），
// 仅 2d 返回 stub 对象，其余返回 null；重载参数与返回联合与本函数不完全重叠，需 unknown 中转
}) as typeof HTMLCanvasElement.prototype.getContext

/**
 * canvas toDataURL stub：QRCode 组件在 jsdom 下读取二维码画布数据，
 * jsdom 24 原生实现抛 "Not implemented"，污染测试 stderr。返回 1x1 透明 PNG 数据。
 */
HTMLCanvasElement.prototype.toDataURL = function toDataURLStub(): string {
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg=='
}
