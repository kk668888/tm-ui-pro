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

  it('渲染补充控件（自动完成/复选框/评分/滑块/树）', () => {
    const wrapper = mountSection(FormSection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('同意协议');
    expect(text).toContain('3.5');
    expect(text).toContain('40');
    expect(text).toContain('内容一');
    expect(text).toContain('checked=0-0-1');
  });

  it('渲染 TmInputIp 四段式 IP 输入与回显（首个自研交互组件）', () => {
    const wrapper = mountSection(FormSection);
    expect(wrapper.findAll('.tm-input-ip input').length).toBe(4);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('hostIp=192.168.1.1');
  });
});
