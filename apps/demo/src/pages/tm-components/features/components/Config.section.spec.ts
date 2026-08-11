import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import ConfigSection from './Config.section.vue';

describe('ConfigSection', () => {
  it('渲染 section 容器与主题切换 / 桥接表格 / TmApp', () => {
    const wrapper = mountSection(ConfigSection);
    expect(wrapper.find('.section-config').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('切换暗色');
    expect(text).toContain('在TmApp内触发消息');
  });
});
