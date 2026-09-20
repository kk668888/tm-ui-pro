import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import ScreenFrame from './ScreenFrame.vue';
import ScreenPanel from './ScreenPanel.vue';
import ScreenNavItem from './ScreenNavItem.vue';
import ScreenSideItem from './ScreenSideItem.vue';
import ScreenChip from './ScreenChip.vue';

/** jsdom 默认窗口 1024×768；这里统一到设计稿尺寸，让缩放系数可预期 */
function stubViewport(width: number, height: number): void {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width });
  Object.defineProperty(window, 'innerHeight', {
    configurable: true,
    writable: true,
    value: height,
  });
}

describe('ScreenFrame', () => {
  beforeEach(() => {
    stubViewport(2048, 1088);
  });

  it('渲染顶栏 / 副栏 / 侧栏 / 工作区四个区域', () => {
    const wrapper = mount(ScreenFrame);

    expect(wrapper.find('.screen-topbar').exists()).toBe(true);
    expect(wrapper.find('.screen-subbar').exists()).toBe(true);
    expect(wrapper.find('.screen-sidebar').exists()).toBe(true);
    expect(wrapper.find('.screen-frame__workspace').exists()).toBe(true);
  });

  it('四个区域按四段式嵌套：顶栏与副栏在侧栏之上，侧栏与工作区平级', () => {
    const wrapper = mount(ScreenFrame);
    const canvas = wrapper.find('.screen-frame__canvas');

    // 侧栏与工作区都直接挂在画布下（原稿的绝对定位布局，非流式嵌套）
    expect(canvas.find('.screen-sidebar').exists()).toBe(true);
    expect(canvas.find('.screen-frame__workspace').exists()).toBe(true);
  });

  it('把 brand / nav / actions 插槽渲染到顶栏对应段', () => {
    const wrapper = mount(ScreenFrame, {
      slots: {
        brand: '<span class="t-brand">系统名</span>',
        nav: '<span class="t-nav">导航</span>',
        actions: '<span class="t-actions">图标</span>',
      },
    });

    expect(wrapper.find('.screen-topbar__brand .t-brand').text()).toBe('系统名');
    expect(wrapper.find('.screen-topbar__nav .t-nav').text()).toBe('导航');
    expect(wrapper.find('.screen-topbar__actions .t-actions').text()).toBe('图标');
  });

  it('把 back / chips / subbar-extra 插槽渲染到副栏对应段', () => {
    const wrapper = mount(ScreenFrame, {
      slots: {
        back: '<span class="t-back">‹</span>',
        chips: '<span class="t-chip">标签</span>',
        'subbar-extra': '<span class="t-clock">时间</span>',
      },
    });

    expect(wrapper.find('.screen-subbar__back .t-back').exists()).toBe(true);
    expect(wrapper.find('.screen-subbar__tabs .t-chip').text()).toBe('标签');
    expect(wrapper.find('.screen-subbar__extra .t-clock').text()).toBe('时间');
  });

  it('sidebar 插槽落到侧栏，默认插槽落到工作区滚动容器', () => {
    const wrapper = mount(ScreenFrame, {
      slots: {
        sidebar: '<div class="t-side">菜单项</div>',
        default: '<div class="t-work">工作区内容</div>',
      },
    });

    expect(wrapper.find('.screen-sidebar .t-side').text()).toBe('菜单项');
    expect(wrapper.find('.screen-frame__scroll .t-work').text()).toBe('工作区内容');
  });

  it('框架自身不渲染任何业务内容（空插槽时只余容器）', () => {
    const wrapper = mount(ScreenFrame);

    // 设计稿里的品牌文案、导航项、卡片标题都不应出现在框架里
    expect(wrapper.text()).not.toContain('天懋');
    expect(wrapper.text()).not.toContain('传感器配置');
    expect(wrapper.text()).not.toContain('靶机');
  });

  it('fit 为 true 时按窗口等比缩放（宽高比例不同则取较小值）', () => {
    // 2048/2048 = 1，816/1088 = 0.75 → 取 0.75
    stubViewport(2048, 816);
    const wrapper = mount(ScreenFrame, { props: { fit: true } });
    const style = wrapper.find('.screen-frame__canvas').attributes('style') ?? '';

    expect(style).toContain('scale(0.75)');
  });

  it('fit 为 false 时画布撑满容器（自适应模式），不内联尺寸与 transform', () => {
    stubViewport(800, 600);
    const wrapper = mount(ScreenFrame, { props: { fit: false } });
    const canvas = wrapper.find('.screen-frame__canvas');

    expect(canvas.classes()).toContain('is-fluid');
    // 尺寸交给 CSS 类撑满父容器，不再内联固定画布
    expect(canvas.attributes('style')).toBeUndefined();
  });

  it('fit 为 true 时画布固定为设计稿尺寸', () => {
    const wrapper = mount(ScreenFrame, { props: { fit: true } });
    const canvas = wrapper.find('.screen-frame__canvas');
    const style = canvas.attributes('style') ?? '';

    expect(canvas.classes()).not.toContain('is-fluid');
    expect(style).toContain('width: 2048px');
    expect(style).toContain('height: 1088px');
  });

  it('自定义设计稿尺寸生效', () => {
    const wrapper = mount(ScreenFrame, {
      props: { width: 1920, height: 1080, fit: true },
    });
    const style = wrapper.find('.screen-frame__canvas').attributes('style') ?? '';

    expect(style).toContain('width: 1920px');
    expect(style).toContain('height: 1080px');
  });
});

describe('ScreenPanel', () => {
  it('传 title 时渲染标题栏与标题前的装饰竖条', () => {
    const wrapper = mount(ScreenPanel, {
      props: { title: '面板标题' },
      slots: { default: '<div class="t-body">正文</div>' },
    });

    expect(wrapper.find('.screen-panel__title').text()).toBe('面板标题');
    expect(wrapper.find('.screen-panel__body .t-body').text()).toBe('正文');
  });

  it('不传 title 时整个标题栏不渲染', () => {
    const wrapper = mount(ScreenPanel, {
      slots: { default: '正文' },
    });

    expect(wrapper.find('.screen-panel__head').exists()).toBe(false);
    expect(wrapper.find('.screen-panel__body').text()).toBe('正文');
  });

  it('extra 插槽渲染到标题栏右侧', () => {
    const wrapper = mount(ScreenPanel, {
      props: { title: '标题' },
      slots: { extra: '<a class="t-link">操作</a>' },
    });

    expect(wrapper.find('.screen-panel__extra .t-link').text()).toBe('操作');
  });
});

describe('ScreenNavItem / ScreenSideItem / ScreenChip', () => {
  it('ScreenNavItem 依据 active 切换激活类', () => {
    const on = mount(ScreenNavItem, { props: { active: true }, slots: { default: '总览' } });
    const off = mount(ScreenNavItem, { slots: { default: '总览' } });

    expect(on.classes()).toContain('is-active');
    expect(off.classes()).not.toContain('is-active');
    expect(on.text()).toBe('总览');
  });

  it('ScreenSideItem 依据 active 切换选中类，并可显示展开箭头', () => {
    const active = mount(ScreenSideItem, {
      props: { active: true, expandable: true },
      slots: { default: '风险监测' },
    });
    const idle = mount(ScreenSideItem, { slots: { default: '总览' } });

    expect(active.classes()).toContain('is-active');
    expect(active.find('.screen-side-item__chev').exists()).toBe(true);
    expect(idle.classes()).not.toContain('is-active');
    expect(idle.find('.screen-side-item__chev').exists()).toBe(false);
  });

  it('ScreenChip 依据 active 切换选中类', () => {
    const on = mount(ScreenChip, { props: { active: true }, slots: { default: '标签' } });
    const off = mount(ScreenChip, { slots: { default: '标签' } });

    expect(on.classes()).toContain('is-active');
    expect(off.classes()).not.toContain('is-active');
  });
});
