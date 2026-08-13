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

  it('渲染信息展示组件（卡片/统计/二维码/分段）', () => {
    const wrapper = mountSection(DataDisplaySection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('卡片标题');
    expect(text).toContain('总销售额');
    expect(text).toContain('月');
    expect(text).toContain('二维码');
  });

  it('渲染折叠/时间轴/列表/描述/提示组件', () => {
    const wrapper = mountSection(DataDisplaySection);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('面板一');
    expect(text).toContain('创建账号');
    expect(text).toContain('Racingcarspraysburningfuelintocrowd');
    expect(text).toContain('用户信息');
    expect(text).toContain('悬停显示提示');
  });
});
