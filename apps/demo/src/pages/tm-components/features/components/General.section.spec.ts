import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import GeneralSection from './General.section.vue';

describe('GeneralSection', () => {
  it('渲染 section 容器与按钮分组', () => {
    const wrapper = mountSection(GeneralSection);
    expect(wrapper.find('.section-general').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('主按钮');
    expect(text).toContain('二次确认删除');
    expect(text).toContain('防抖500ms');
  });
});
