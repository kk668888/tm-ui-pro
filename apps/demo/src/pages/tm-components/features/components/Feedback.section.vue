<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import {
  TmButton,
  TmMessage,
  TmModal,
  TmDrawer,
  TmNotification,
  TmAlert,
  TmSpin,
  TmPopconfirm,
  TmPopover,
  TmResult,
  TmProgress,
  TmSkeleton,
  TmTour,
} from '@kibus/tm-ui-plus';

defineOptions({ name: 'FeedbackSection' });

const modalOpen = ref(false);
const drawerOpen = ref(false);
const progressPercent = ref(66);
const skeletonLoading = ref(true);
const tourOpen = ref(false);
const tourSteps = [
  {
    title: '进度反馈',
    description: 'TmProgress 支持业务 status 语义映射与动态百分比。',
    target: () => document.querySelector('.tour-anchor-1') as HTMLElement,
  },
  {
    title: '骨架屏',
    description: 'TmSkeleton 在加载态展示占位，可点击按钮切换真实内容。',
    target: () => document.querySelector('.tour-anchor-2') as HTMLElement,
  },
];

// 加载态定时器句柄：组件卸载时清理，避免卸载后仍关闭已脱离的 message 实例
let loadingTimer: ReturnType<typeof setTimeout>;

// 无 TmApp 包裹时 TmMessage/TmNotification 自动降级 ant 全局实例，功能可用
function notify(type: 'success' | 'info' | 'warning' | 'error') {
  // 各类型语义互斥，用 switch 分支替代链式 if，行为不变
  switch (type) {
    case 'success':
      TmNotification.success({ message: '任务完成', description: '导出已就绪，可查看结果' });
      break;
    case 'info':
      TmNotification.info({ message: '系统升级', description: '今晚 02:00-04:00' });
      break;
    case 'warning':
      TmNotification.warning({ message: '磁盘不足', description: '已使用 90%' });
      break;
    case 'error':
      TmNotification.error({ message: '任务失败', description: '请重试' });
      break;
  }
}

function showLoading() {
  const close = TmMessage.loading('加载中...');
  loadingTimer = setTimeout(close, 2000);
}

onBeforeUnmount(() => {
  clearTimeout(loadingTimer);
});
</script>

<template>
  <a-card class="section-feedback" title="④ 反馈 Feedback">
    <p class="mb-4 text-sm text-secondary">
      TmMessage / TmNotification 命令式调用；TmModal / TmDrawer 组件式 v-model 开关。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmMessage</span>
        <a-space wrap>
          <TmButton type="primary" @click="TmMessage.success('保存成功')">成功</TmButton>
          <TmButton @click="TmMessage.info('这是一条信息提示')">信息</TmButton>
          <TmButton @click="TmMessage.warning('磁盘空间不足')">警告</TmButton>
          <TmButton danger @click="TmMessage.error('操作失败，请重试')">错误</TmButton>
          <TmButton @click="showLoading">加载</TmButton>
        </a-space>
      </a-space>

      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmModal / TmDrawer</span>
        <a-space wrap>
          <TmButton type="primary" @click="modalOpen = true">打开弹窗</TmButton>
          <TmButton @click="drawerOpen = true">打开抽屉</TmButton>
        </a-space>
      </a-space>

      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmNotification</span>
        <a-space wrap>
          <TmButton type="primary" @click="notify('success')">成功</TmButton>
          <TmButton @click="notify('info')">信息</TmButton>
          <TmButton @click="notify('warning')">警告</TmButton>
          <TmButton danger @click="notify('error')">错误</TmButton>
        </a-space>
      </a-space>

      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmAlert / TmSpin</span>
        <a-space direction="vertical">
          <TmAlert status="success" message="操作成功" description="数据已保存" />
          <TmAlert status="warning" message="磁盘空间不足" description="请及时清理" />
          <TmSpin :spinning="true" tip="加载中...">
            <div class="rounded border border-dashed border-secondary p-4">加载内容区域</div>
          </TmSpin>
        </a-space>
      </a-space>

      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmPopconfirm / TmPopover / TmResult</span>
        <a-space wrap>
          <TmPopconfirm title="确定删除该记录吗？" danger>
            <TmButton danger>危险确认</TmButton>
          </TmPopconfirm>
          <TmPopconfirm title="这是一条普通确认">
            <TmButton>普通确认</TmButton>
          </TmPopconfirm>
          <TmPopover title="气泡标题" content="气泡卡片内容">
            <TmButton>悬停气泡</TmButton>
          </TmPopover>
        </a-space>
        <TmResult status="success" title="提交成功" sub-title="等待审核，可在列表查看进度" />
      </a-space>

      <a-space direction="vertical" class="tour-anchor-1">
        <span class="text-sm text-secondary">TmProgress（业务 status 映射 + 动态百分比）</span>
        <a-space direction="vertical" class="w-full">
          <TmProgress :percent="progressPercent" status="success" />
          <TmProgress :percent="progressPercent" status="processing" />
          <TmProgress :percent="progressPercent" status="failed" />
          <TmProgress :percent="progressPercent" status="warning" />
          <TmProgress :percent="progressPercent" type="circle" status="success" style="width: 80px" />
        </a-space>
        <a-space>
          <TmButton size="small" :disabled="progressPercent <= 0" @click="progressPercent -= 10">-10%</TmButton>
          <TmButton size="small" :disabled="progressPercent >= 100" @click="progressPercent += 10">+10%</TmButton>
          <span class="text-secondary">{{ progressPercent }}%</span>
        </a-space>
      </a-space>

      <a-space direction="vertical" class="tour-anchor-2">
        <span class="text-sm text-secondary">TmSkeleton（加载态切换）</span>
        <TmSkeleton :loading="skeletonLoading" :avatar="true" :paragraph="{ rows: 3 }" style="max-width: 360px">
          <div>真实内容：这里是加载完成后展示的业务信息。</div>
        </TmSkeleton>
        <TmButton size="small" @click="skeletonLoading = !skeletonLoading">
          {{ skeletonLoading ? '加载完成' : '重新加载' }}
        </TmButton>
      </a-space>

      <a-space direction="vertical">
        <span class="text-sm text-secondary">TmTour（步骤引导，v-model:open 自闭合）</span>
        <TmButton type="primary" @click="tourOpen = true">开始引导</TmButton>
        <TmTour v-model:open="tourOpen" :steps="tourSteps" />
      </a-space>

      <TmModal v-model="modalOpen" title="基础弹窗" @ok="modalOpen = false" @cancel="modalOpen = false">
        <p>弹窗内容，支持任意插槽与 ant Modal 全部 props / events。</p>
      </TmModal>
      <TmDrawer v-model="drawerOpen" title="基础抽屉" placement="right" :width="400">
        <p>抽屉内容，支持任意插槽与 ant Drawer 全部 props / events。</p>
      </TmDrawer>
    </a-space>
  </a-card>
</template>
