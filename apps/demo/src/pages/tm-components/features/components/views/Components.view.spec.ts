import { describe, it, expect } from 'vitest';
import { mountSection } from '../../test-utils';
import ComponentsView from './Components.view.vue';

describe('ComponentsView', () => {
  it('渲染页头与全部 5 个分类 section', () => {
    const wrapper = mountSection(ComponentsView);
    expect(wrapper.find('.tm-components-page').exists()).toBe(true);
    for (const cls of [
      'section-general',
      'section-form',
      'section-data-display',
      'section-feedback',
      'section-config',
    ]) {
      expect(wrapper.find(`.${cls}`).exists(), `应渲染 ${cls}`).toBe(true);
    }
  });
});
