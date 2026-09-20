import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { Ref } from 'vue';

/** useScreenScale 的入参 */
export interface UseScreenScaleOptions {
  /** 设计稿宽度（px），默认取 CSS 变量 --screen-width 的约定值 2048 */
  designWidth?: number;
  /** 设计稿高度（px），默认取 CSS 变量 --screen-height 的约定值 1088 */
  designHeight?: number;
  /** 是否启用缩放；为 false 时 scale 恒为 1（框架自适应撑满父容器） */
  enabled?: Ref<boolean>;
  /** 缩放系数上限，防止超宽窗口把画布放得过大，默认不限制 */
  maxScale?: number;
}

/**
 * 大屏等比缩放。
 *
 * 【为什么需要】
 * 设计稿是固定画布（2048×1088），必须按窗口尺寸整体缩放才能铺满屏幕。
 *
 * 【为什么是等比而不是原稿的写法】
 * 原稿 index.html 用的是 `scale(innerWidth/2048, innerHeight/1088)` —— 宽高各自算系数，
 * 当窗口比例不等于画布比例（2048:1088 ≈ 1.88:1）时，元素会被横向或纵向**拉伸变形**：
 * 圆形变椭圆、文字被压扁。这里改为等比（取宽高比例的较小值），保证不变形，
 * 代价是画布比例与窗口不一致时四周留白。
 *
 * 【为什么用 JS 而不是纯 CSS】
 * `transform: scale()` 需要无量纲系数，而 CSS 的 `calc(100vw / 2048px)` 得到的是
 * 带单位的比值，无法直接用于 scale；`min()` 也不支持单位相除得到纯数字。
 * 因此缩放比例只能用 JS 计算——这与「结构固化」无关：结构仍然是静态模板，
 * 这里只承担「适配」这一件行为逻辑。
 *
 * @example
 * ```ts
 * const { scale } = useScreenScale({ enabled: isFullscreen });
 * ```
 */
export function useScreenScale(options: UseScreenScaleOptions = {}) {
  const {
    designWidth = 2048,
    designHeight = 1088,
    enabled,
    maxScale = Number.POSITIVE_INFINITY,
  } = options;

  /** 原始系数（未受 maxScale 约束），便于外部展示真实适配比例 */
  const rawScale = ref(1);

  /** 计算当前窗口下的等比缩放系数 */
  function update(): void {
    if (typeof window === 'undefined') return;

    const byWidth = window.innerWidth / designWidth;
    const byHeight = window.innerHeight / designHeight;
    rawScale.value = Math.min(byWidth, byHeight);
  }

  // setup 阶段就同步算一次：若只在 onMounted 里算，首帧会以 scale(1) 渲染、
  // 挂载后才跳到正确比例，肉眼可见一次「先大后小」的闪动。
  // 服务端渲染时 window 不存在，update 内部已做守卫。
  update();

  onMounted(() => {
    // 挂载时再确认一次：setup 与挂载之间窗口尺寸可能已变化（如父级异步布局）
    update();
    window.addEventListener('resize', update);
  });

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', update);
    }
  });

  /** 对外的实际系数：未启用缩放时恒为 1，并受 maxScale 约束 */
  const scale = computed(() => {
    if (enabled && !enabled.value) return 1;
    return Math.min(rawScale.value, maxScale);
  });

  return { scale, rawScale, update };
}
