import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, nextTick, ref } from 'vue';
import type { Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useScreenScale } from './useScreenScale';
import type { UseScreenScaleOptions } from './useScreenScale';

/** 改写 jsdom 视口尺寸 */
function stubViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  });
}

/**
 * composable 依赖 onMounted / onBeforeUnmount，必须挂进组件才能执行，
 * 因此用一个渲染为空的宿主组件承载它。
 */
function mountScale(options: UseScreenScaleOptions = {}) {
  const api = {
    scale: ref(0) as Ref<number>,
    rawScale: ref(0) as Ref<number>,
  };

  const Host = defineComponent({
    name: 'ScaleHost',
    setup() {
      const result = useScreenScale(options);
      api.scale = result.scale;
      api.rawScale = result.rawScale;
      return () => null;
    },
  });

  const wrapper = mount(Host);
  return { ...api, wrapper };
}

describe('useScreenScale', () => {
  beforeEach(() => {
    stubViewport(2048, 1088);
  });

  it('窗口与设计稿同尺寸时系数为 1', () => {
    const { scale } = mountScale();

    expect(scale.value).toBe(1);
  });

  it('窗口恰好一半时为 0.5', () => {
    stubViewport(1024, 544);
    const { scale } = mountScale();

    expect(scale.value).toBe(0.5);
  });

  it('宽高比例不一致时取较小值（等比，避免拉伸变形）', () => {
    // 宽 2048/2048 = 1；高 816/1088 = 0.75 → 应取 0.75 而非各自缩放
    stubViewport(2048, 816);
    const { scale } = mountScale();

    expect(scale.value).toBe(0.75);
  });

  it('enabled 为 false 时系数恒为 1', () => {
    stubViewport(512, 272);
    const enabled = ref(false);
    const { scale } = mountScale({ enabled });

    expect(scale.value).toBe(1);
  });

  it('enabled 由 false 变 true 后按窗口重新计算', async () => {
    stubViewport(1024, 544);
    const enabled = ref(false);
    const { scale } = mountScale({ enabled });

    expect(scale.value).toBe(1);

    enabled.value = true;
    await nextTick();

    expect(scale.value).toBe(0.5);
  });

  it('maxScale 限制放大倍数', () => {
    // 窗口远大于设计稿，原始系数 2；受 maxScale=1.5 约束
    stubViewport(4096, 2176);
    const { scale, rawScale } = mountScale({ maxScale: 1.5 });

    expect(rawScale.value).toBe(2);
    expect(scale.value).toBe(1.5);
  });

  it('窗口 resize 后自动更新', async () => {
    const { scale } = mountScale();
    expect(scale.value).toBe(1);

    stubViewport(1024, 544);
    window.dispatchEvent(new Event('resize'));
    await nextTick();

    expect(scale.value).toBe(0.5);
  });

  it('支持自定义设计稿尺寸', () => {
    stubViewport(960, 540);
    const { scale } = mountScale({ designWidth: 1920, designHeight: 1080 });

    expect(scale.value).toBe(0.5);
  });

  it('组件卸载时移除 resize 监听', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { wrapper } = mountScale();

    wrapper.unmount();

    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    removeSpy.mockRestore();
  });
});
