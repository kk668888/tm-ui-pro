import { mount } from '@vue/test-utils';
import type { Component } from 'vue';
import {
  Card as ACard,
  Space as ASpace,
  Tag as ATag,
  Divider as ADivider,
  TabPane as ATabPane,
  List as AList,
  Timeline as ATimeline,
} from 'ant-design-vue';

/** sections 依赖 unplugin-vue-components 解析 `a-xxx`；单测需手动注册 antd 标签 */
const antComponents = {
  ACard,
  ASpace,
  ATag,
  ADivider,
  ATabPane,
  AListItemMeta: AList.Item.Meta,
  ATimelineItem: ATimeline.Item,
};

export function mountSection(
  component: Component,
  options: Parameters<typeof mount>[1] = {},
) {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      components: { ...antComponents, ...options.global?.components },
    },
  });
}
