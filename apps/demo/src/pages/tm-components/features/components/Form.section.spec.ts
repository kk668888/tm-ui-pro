import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import FormSection from './Form.section.vue';

describe('FormSection', () => {
  it('渲染 section 容器与基础控件回显', () => {
    const wrapper = mountSection(FormSection);
    expect(wrapper.find('.section-form').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('fruit=apple');
    expect(text).toContain('TmForm手动模式');
  });
});
