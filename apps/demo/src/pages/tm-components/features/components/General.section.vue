<script setup lang="ts">
import { ref, onBeforeUnmount, h } from 'vue';
import {
  SearchOutlined,
  DownOutlined,
  UserOutlined,
  HomeOutlined,
  SettingOutlined,
  MailOutlined,
  AppstoreOutlined,
} from '@ant-design/icons-vue';
import {
  TmButton,
  TmMessage,
  TmBreadcrumb,
  TmDropdown,
  TmMenu,
  TmPagination,
  TmSteps,
  TmTabs,
  TmAffix,
  TmAnchor,
  TmPageHeader,
  TmDivider,
  TmFlex,
  TmSpace,
  TmLayout,
  TmSider,
  TmHeader,
  TmContent,
  TmFooter,
  TmRow,
  TmCol,
} from '@tm/ui';

defineOptions({ name: 'GeneralSection' });

const loading = ref(false);

// 异步定时器句柄：组件卸载时清理，避免卸载后仍触发状态更新 / 消息提示
let fakeAsyncTimer: ReturnType<typeof setTimeout>;

function fakeAsync() {
  loading.value = true;
  fakeAsyncTimer = setTimeout(() => {
    loading.value = false;
    TmMessage.success('异步操作完成');
  }, 800);
}

onBeforeUnmount(() => {
  clearTimeout(fakeAsyncTimer);
});

// ── 导航类交互状态 ─────────────────────────────
const pageCurrent = ref(1);
const stepsCurrent = ref(0);
const tabsKey = ref('tab1');
const menuSelected = ref<string[]>(['mail']);
const menuItems = [
  { key: 'mail', icon: () => h(MailOutlined), label: '导航一' },
  { key: 'app', icon: () => h(AppstoreOutlined), label: '导航二' },
  { key: 'sub', icon: () => h(SettingOutlined), label: '子菜单', children: [{ key: 'sub1', label: '选项1' }, { key: 'sub2', label: '选项2' }] },
];
</script>

<template>
  <a-card class="section-general" title="① 通用 General">
    <p class="mb-4 text-sm text-secondary">
      TmButton：继承 ant Button 全部 props / slots / events，另加 debounce 防抖与 confirm 二次确认。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <a-space wrap>
        <TmButton type="primary">主按钮</TmButton>
        <TmButton>默认按钮</TmButton>
        <TmButton type="dashed">虚线按钮</TmButton>
        <TmButton danger>危险按钮</TmButton>
        <TmButton type="link">链接按钮</TmButton>
        <TmButton type="text">文本按钮</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton size="large">大尺寸</TmButton>
        <TmButton>中尺寸</TmButton>
        <TmButton size="small">小尺寸</TmButton>
        <TmButton :loading="loading" @click="fakeAsync">加载态</TmButton>
        <TmButton disabled>禁用</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton :debounce="500" @click="TmMessage.success('防抖触发（500ms 内仅触发一次）')">
          防抖 500ms
        </TmButton>
        <TmButton confirm="确认删除这条数据？" danger @click="TmMessage.success('已确认删除')">
          二次确认删除
        </TmButton>
        <TmButton type="primary">
          <template #icon><SearchOutlined /></template>
          带图标
        </TmButton>
      </a-space>

      <a-divider orientation="left">导航类 Navigation</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmBreadcrumb：面包屑，透传 ant routes。</p>
        <TmBreadcrumb :routes="[{ breadcrumbName: '首页', path: '' }, { breadcrumbName: '应用中心', path: '' }, { breadcrumbName: '列表页', path: '' }]" />
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmDropdown：下拉菜单（ant items 配置）。</p>
        <TmDropdown :menu="{ items: [{ key: '1', label: '选项一' }, { key: '2', label: '选项二' }] }">
          <TmButton>下拉菜单 <DownOutlined /></TmButton>
        </TmDropdown>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmMenu：菜单（v-model:selectedKeys 受控选中）。</p>
        <TmMenu v-model:selectedKeys="menuSelected" :items="menuItems" mode="inline" style="width: 260px" />
        <span class="ml-2 text-secondary">selected={{ menuSelected.join('、') }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmPagination：分页（v-model:current 回显）。</p>
        <TmPagination v-model:current="pageCurrent" :total="85" show-size-changer />
        <span class="ml-2 text-secondary">current={{ pageCurrent }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmSteps：步骤条（current 受控，按钮切换）。</p>
        <TmSteps :current="stepsCurrent" :items="[{ title: '第一步' }, { title: '第二步' }, { title: '第三步' }]" />
        <TmButton size="small" @click="stepsCurrent = stepsCurrent >= 2 ? 0 : stepsCurrent + 1">
          {{ stepsCurrent >= 2 ? '重新开始' : '下一步' }}
        </TmButton>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmTabs：标签页（a-tab-pane 子元素 + v-model:activeKey）。</p>
        <TmTabs v-model:activeKey="tabsKey">
          <a-tab-pane key="tab1" tab="Tab 1">Tab 1 内容</a-tab-pane>
          <a-tab-pane key="tab2" tab="Tab 2">Tab 2 内容</a-tab-pane>
        </TmTabs>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmAffix：固钉（吸附于滚动容器顶部）。</p>
        <TmAffix :offset-top="0"><TmButton type="primary">吸附固定</TmButton></TmAffix>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmAnchor：锚点（跳转页面内定位）。</p>
        <TmAnchor
          :items="[
            { key: 'a1', href: '#anchor-demo-1', title: '锚点一' },
            { key: 'a2', href: '#anchor-demo-2', title: '锚点二' },
          ]"
        />
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmPageHeader：页头（含返回）。</p>
        <TmPageHeader title="页面标题" sub-title="这是副标题" @back="() => TmMessage.info('返回点击')" />
      </div>

      <a-divider orientation="left">布局与基础 Layout & Basic</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmDivider：分隔线。</p>
        <TmDivider orientation="left">分隔线标题</TmDivider>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmFlex：弹性布局容器。</p>
        <TmFlex gap="middle" wrap>
          <TmButton>块一</TmButton>
          <TmButton>块二</TmButton>
          <TmButton>块三</TmButton>
        </TmFlex>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmSpace：间距容器。</p>
        <TmSpace>
          <TmButton>Space 1</TmButton>
          <TmButton>Space 2</TmButton>
          <TmButton>Space 3</TmButton>
        </TmSpace>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmLayout + TmSider/TmHeader/TmContent/TmFooter：页面布局骨架。</p>
        <TmLayout style="border: 1px solid var(--color-border); border-radius: 6px; overflow: hidden">
          <TmHeader style="background: #1677ff; color: #fff; text-align: center; line-height: 64px">Header</TmHeader>
          <TmLayout>
            <TmSider style="background: #fafafa; padding: 12px; width: 140px">Sider</TmSider>
            <TmContent style="padding: 16px">Content</TmContent>
          </TmLayout>
          <TmFooter style="background: #f5f5f5; text-align: center">Footer</TmFooter>
        </TmLayout>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmRow / TmCol：24 栅格布局。</p>
        <TmRow :gutter="12">
          <TmCol :span="8"><div style="background: #e6f4ff; border-radius: 4px; padding: 8px">col-8</div></TmCol>
          <TmCol :span="8"><div style="background: #e6f4ff; border-radius: 4px; padding: 8px">col-8</div></TmCol>
          <TmCol :span="8"><div style="background: #e6f4ff; border-radius: 4px; padding: 8px">col-8</div></TmCol>
        </TmRow>
      </div>
    </a-space>
  </a-card>
</template>
