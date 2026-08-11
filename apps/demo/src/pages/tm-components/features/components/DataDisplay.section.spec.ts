import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import DataDisplaySection from './DataDisplay.section.vue';

describe('DataDisplaySection', () => {
  it('渲染 section 容器与标签 / 徽标 / 空态', () => {
    const wrapper = mountSection(DataDisplaySection);
    expect(wrapper.find('.section-data-display').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('自定义色');
    expect(text).toContain('运行中');
    expect(text).toContain('列表为空，请先创建');
  });
});
