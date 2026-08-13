import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import FeedbackSection from './Feedback.section.vue';

describe('FeedbackSection', () => {
  it('渲染 section 容器与全部触发按钮', () => {
    const wrapper = mountSection(FeedbackSection);
    expect(wrapper.find('.section-feedback').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('打开弹窗');
    expect(text).toContain('打开抽屉');
    expect(text).toContain('TmNotification');
  });

  it('渲染进度 / 骨架 / 引导组件', () => {
    const wrapper = mountSection(FeedbackSection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('TmProgress');
    expect(text).toContain('TmSkeleton');
    expect(text).toContain('开始引导');
    expect(text).toContain('66%');
  });
});
