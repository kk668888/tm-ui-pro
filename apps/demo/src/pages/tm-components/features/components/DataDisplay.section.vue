<script setup lang="ts">
import { ref } from 'vue';
import {
  TmTable,
  TmTag,
  TmEmpty,
  TmBadge,
  TmMessage,
  TmButton,
  TmAvatar,
  TmCalendar,
  TmCard,
  TmCarousel,
  TmCollapse,
  TmCollapsePanel,
  TmComment,
  TmDescriptions,
  TmDescriptionsItem,
  TmImage,
  TmList,
  TmListItem,
  TmQRCode,
  TmSegmented,
  TmStatistic,
  TmTimeline,
  TmTooltip,
} from '@tm/ui';
import type { TmTableProps } from '@tm/ui';
import { request } from '@/core/http';

defineOptions({ name: 'DataDisplaySection' });

// 本地静态数据：TmTable 静态模式（:data + :columns）+ 本地切片分页
const rows = ref<TmTableProps['data']>([
  { id: 1, name: 'Tom', age: 28, status: 'success' },
  { id: 2, name: 'Jack', age: 34, status: 'processing' },
  { id: 3, name: 'Lucy', age: 22, status: 'warning' },
  { id: 4, name: 'Lily', age: 31, status: 'failed' },
  { id: 5, name: 'Bob', age: 25, status: 'success' },
  { id: 6, name: 'Amy', age: 29, status: 'processing' },
]);

const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'status', title: '状态', width: 120, slots: { default: 'status_default' } },
];

const pagerConfig = { pageSize: 5, pageSizes: [5, 10] };

function onRowClick(record: Record<string, unknown>) {
  TmMessage.info(`点击了行：${record.name}`);
}

// ── 补充组件状态 ─────────────────────────────
const segValue = ref('month');
const listData = ref([
  { title: 'Racing car sprays burning fuel into crowd.', time: '2026-08-01' },
  { title: 'Japanese princess to wed commoner.', time: '2026-08-03' },
  { title: 'Australian walks 100km after outback crash.', time: '2026-08-05' },
]);
const demoImage =
  'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';

// ── TmTable 远程模式：mock /api/users 分页 + 搜索 + 密度切换 ──
const remoteColumns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'role', title: '角色', width: 120 },
  { field: 'status', title: '状态', width: 100 },
];
const density = ref<'compact' | 'default' | 'loose'>('default');

/** 远程拉数：mock 接口被 msw 拦截；jsdom 测试下失败时返回空表，保证演示块稳定挂载 */
async function fetchRemote(params: { page: number; pageSize: number; query?: Record<string, unknown> }) {
  try {
    const res = await request.get<{ list: Record<string, unknown>[]; total: number }>('/api/users', {
      params: { page: params.page, pageSize: params.pageSize, ...params.query },
    });
    return { data: res.list, total: res.total };
  } catch {
    return { data: [], total: 0 };
  }
}
</script>

<template>
  <a-card class="section-data-display" title="③ 数据展示 DataDisplay">
    <p class="mb-4 text-sm text-secondary">
      TmTable（vxe 底座，本地切片分页 + 行点击）；Tag / Empty / Badge 状态展示。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <TmTable :data="rows" :columns="columns" :pager-config="pagerConfig" @row-click="onRowClick">
        <template #status_default="{ row }">
          <TmTag :status="row.status">{{ row.status }}</TmTag>
        </template>
      </TmTable>

      <a-divider orientation="left">TmTable 远程模式（mock /api/users 分页 + 搜索 + 密度）</a-divider>
      <TmTable
        :request="fetchRemote"
        :search="{ fields: [{ field: 'name', label: '姓名' }] }"
        :columns="remoteColumns"
        :density="density"
      />
      <a-space>
        <TmButton size="small" :type="density === 'compact' ? 'primary' : 'default'" @click="density = 'compact'">紧凑</TmButton>
        <TmButton size="small" :type="density === 'default' ? 'primary' : 'default'" @click="density = 'default'">默认</TmButton>
        <TmButton size="small" :type="density === 'loose' ? 'primary' : 'default'" @click="density = 'loose'">宽松</TmButton>
      </a-space>

      <a-space wrap>
        <TmTag status="success">成功</TmTag>
        <TmTag status="processing">进行中</TmTag>
        <TmTag status="failed">失败</TmTag>
        <TmTag status="warning">警告</TmTag>
        <TmTag color="purple">自定义色</TmTag>
      </a-space>

      <a-space :size="24">
        <TmBadge :count="5"><span>通知</span></TmBadge>
        <TmBadge :count="150" :overflow-count="99"><span>邮件</span></TmBadge>
        <TmBadge status="processing"><span>运行中</span></TmBadge>
      </a-space>

      <TmEmpty description="列表为空，请先创建" />

      <a-divider orientation="left">信息展示 Info</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmAvatar：头像（文字 / 图标 / 形状尺寸）。</p>
        <a-space>
          <TmAvatar size="large">张</TmAvatar>
          <TmAvatar>三</TmAvatar>
          <TmAvatar shape="square">4</TmAvatar>
        </a-space>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmCard：卡片容器。</p>
        <TmCard title="卡片标题" extra="更多" style="width: 320px">
          卡片内容，可放任意自定义节点。
        </TmCard>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmStatistic：统计数值。</p>
        <a-space :size="32">
          <TmStatistic title="总销售额" :value="112893" precision="2" />
          <TmStatistic title="今日活跃" :value="1128" suffix="人" />
        </a-space>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmImage：图片预览（hover 遮罩可预览大图）。</p>
        <TmImage :width="140" :src="demoImage" />
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmSegmented：分段控制器（v-model:value）。</p>
        <TmSegmented
          v-model:value="segValue"
          :options="[
            { label: '月', value: 'month' },
            { label: '年', value: 'year' },
          ]"
        />
        <span class="ml-2 text-secondary">value={{ segValue }}</span>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmQRCode：二维码。</p>
        <TmQRCode value="https://tm-ui.example.com" :size="120" />
      </div>

      <a-divider orientation="left">折叠 / 走马灯 / 时间轴</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmCollapse：折叠面板（TmCollapsePanel 子项）。</p>
        <TmCollapse style="max-width: 520px">
          <TmCollapsePanel key="1" header="面板一">
            <p>折叠面板内容一</p>
          </TmCollapsePanel>
          <TmCollapsePanel key="2" header="面板二">
            <p>折叠面板内容二</p>
          </TmCollapsePanel>
        </TmCollapse>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmCarousel：走马灯（自动播放）。</p>
        <TmCarousel autoplay style="max-width: 420px">
          <div style="height: 120px; line-height: 120px; text-align: center; background: #1677ff; color: #fff">1</div>
          <div style="height: 120px; line-height: 120px; text-align: center; background: #52c41a; color: #fff">2</div>
          <div style="height: 120px; line-height: 120px; text-align: center; background: #faad14; color: #fff">3</div>
        </TmCarousel>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmTimeline：时间轴（ant 子项）。</p>
        <a-timeline>
          <a-timeline-item>创建账号 2026-08-01</a-timeline-item>
          <a-timeline-item color="green">完成实名认证 2026-08-05</a-timeline-item>
          <a-timeline-item color="red">解绑手机 2026-08-09</a-timeline-item>
        </a-timeline>
      </div>

      <a-divider orientation="left">列表 / 描述 / 评论 / 提示</a-divider>

      <div>
        <p class="mb-2 text-xs text-secondary">TmList：列表（data-source + renderItem 插槽）。</p>
        <TmList :data-source="listData" :pagination="false" style="max-width: 560px">
          <template #renderItem="{ item }">
            <TmListItem>
              <a-list-item-meta>
                <template #title>
                  <span>{{ item.title }}</span>
                </template>
                <template #description>{{ item.time }}</template>
              </a-list-item-meta>
            </TmListItem>
          </template>
        </TmList>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmDescriptions：描述列表（TmDescriptionsItem 子项）。</p>
        <TmDescriptions title="用户信息" :column="2" bordered>
          <TmDescriptionsItem label="姓名">张三</TmDescriptionsItem>
          <TmDescriptionsItem label="部门">前端组</TmDescriptionsItem>
          <TmDescriptionsItem label="城市">杭州</TmDescriptionsItem>
          <TmDescriptionsItem label="邮箱">zhangsan@example.com</TmDescriptionsItem>
        </TmDescriptions>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmComment：评论（作者 + 内容 + 时间）。</p>
        <TmComment author="张三">
          <template #avatar><TmAvatar size="large">张</TmAvatar></template>
          <template #content>
            <p>这是一条评论内容，演示 TmComment 的插槽用法。</p>
          </template>
          <template #datetime>2026-08-13 10:30</template>
        </TmComment>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmTooltip：文字气泡提示。</p>
        <TmTooltip title="这是一个提示" placement="top">
          <TmButton>悬停显示提示</TmButton>
        </TmTooltip>
      </div>

      <div>
        <p class="mb-2 text-xs text-secondary">TmCalendar：日历（卡片模式）。</p>
        <TmCalendar :fullscreen="false" style="max-width: 400px" />
      </div>
    </a-space>
  </a-card>
</template>
