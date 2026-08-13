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

  it('渲染导航类组件（面包屑/分页/页头/标签）', () => {
    const wrapper = mountSection(GeneralSection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('首页');
    expect(text).toContain('应用中心');
    expect(text).toContain('Tab1内容');
    expect(text).toContain('页面标题');
  });

  it('渲染布局类组件（布局骨架/栅格/弹性）', () => {
    const wrapper = mountSection(GeneralSection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('Header');
    expect(text).toContain('Content');
    expect(text).toContain('Sider');
    expect(text).toContain('col-8');
    expect(text).toContain('块一');
  });
});
